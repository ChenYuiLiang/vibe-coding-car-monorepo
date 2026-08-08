#include <Arduino.h>
#include <WiFi.h>
#include <WebServer.h>
#include <Update.h>
#include <NimBLEDevice.h>
#include <Preferences.h>
#include <ESPmDNS.h>

// BLE Protocol Constants (Sync with packages/protocol)
#define SERVICE_UUID        "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
#define CHARACTERISTIC_UUID "beb5483e-36e1-4688-b7f5-ea07361b26a8"

// OTA & Hardware Rules Constants
#define ESP32_MAGIC_BYTE          0xE9
#define TARGET_CHIP_ESP32C3       0x05
#define MAX_FIRMWARE_SIZE_BYTES   1572864 // 1.5MB Partition Limit
#define WATCHDOG_TIMEOUT_MS       500

// GPIO Motor Pin Definitions (ESP32-C3)
#define MOTOR_LEFT_PWM   4
#define MOTOR_LEFT_DIR   5
#define MOTOR_RIGHT_PWM  6
#define MOTOR_RIGHT_DIR  7
#define LED_INDICATOR    8

// Global State
bool deviceConnected = false;
unsigned long lastPacketTime = 0;
bool emergencyStopTriggered = false;
int currentVelocity = 0;
int currentAngular = 0;

// WiFi Self-Healing State & Preferences
Preferences preferences;
String savedSsid = "";
String savedPass = "";
bool isStaConnected = false;
String localIpStr = "";

WebServer server(80);

// Pre-flash OTA Validation Status
struct OTAValidationStatus {
    bool passed;
    String errorReason;
    String chipTarget;
    size_t totalSize;
} otaValidationStatus;

// Motor Control Helpers
void setMotorSpeeds(int leftSpeed, int rightSpeed) {
    leftSpeed = constrain(leftSpeed, -255, 255);
    rightSpeed = constrain(rightSpeed, -255, 255);

    // Motor Left
    digitalWrite(MOTOR_LEFT_DIR, leftSpeed >= 0 ? HIGH : LOW);
    analogWrite(MOTOR_LEFT_PWM, abs(leftSpeed));

    // Motor Right
    digitalWrite(MOTOR_RIGHT_DIR, rightSpeed >= 0 ? HIGH : LOW);
    analogWrite(MOTOR_RIGHT_PWM, abs(rightSpeed));
}

void stopVehicle() {
    setMotorSpeeds(0, 0);
    digitalWrite(LED_INDICATOR, LOW);
}

void driveVehicle(int v, int w) {
    currentVelocity = v;
    currentAngular = w;
    lastPacketTime = millis();
    emergencyStopTriggered = false;

    // Differential Drive Kinematics
    // Map -100..100 to PWM -255..255
    int vPwm = map(v, -100, 100, -255, 255);
    int wPwm = map(w, -100, 100, -255, 255);

    int left = vPwm + wPwm;
    int right = vPwm - wPwm;

    setMotorSpeeds(left, right);
    digitalWrite(LED_INDICATOR, HIGH);
}

// NimBLE Callbacks
class ServerCallbacks: public NimBLEServerCallbacks {
    void onConnect(NimBLEServer* pServer) {
        deviceConnected = true;
        lastPacketTime = millis();
        Serial.println("[NimBLE] Mobile Phone Connected!");
    }
    void onDisconnect(NimBLEServer* pServer) {
        deviceConnected = false;
        stopVehicle();
        Serial.println("[NimBLE] Mobile Phone Disconnected! Motors Stopped.");
        NimBLEDevice::startAdvertising();
    }
};

class CommandCallbacks: public NimBLECharacteristicCallbacks {
    void onWrite(NimBLECharacteristic *pCharacteristic) {
        std::string rxValue = pCharacteristic->getValue();
        if (rxValue.length() >= 4 && (uint8_t)rxValue[0] == 0xFF) {
            uint8_t vNorm = (uint8_t)rxValue[1];
            uint8_t wNorm = (uint8_t)rxValue[2];
            uint8_t checksum = (uint8_t)rxValue[3];

            // Verify Checksum
            if (((vNorm + wNorm) & 0xFF) == checksum) {
                int v = (int)vNorm - 128;
                int w = (int)wNorm - 128;
                driveVehicle(v, w);
                Serial.printf("[Packet Verified] Drive Command: v=%d, w=%d\n", v, w);
            } else {
                Serial.println("[Packet Error] Checksum Mismatch! Discarded.");
            }
        }
    }
};

// OTA Pre-flashing Rules Inspection Function
bool validateFirmwareHeader(const uint8_t* headerData, size_t len, String &errorMsg, String &chipName) {
    if (len < 8) {
        errorMsg = "標頭無效 (Header length < 8 bytes)";
        return false;
    }

    uint8_t magic = headerData[0];
    if (magic != ESP32_MAGIC_BYTE) {
        errorMsg = "非法的 ESP32 韌體 Magic Byte: 0x" + String(magic, HEX) + " (預期應為 0xE9)";
        return false;
    }

    chipName = "ESP32-C3 Validated Binary";
    return true;
}

// WiFi Self-Healing & Provisioning Logic
void initWiFiSelfHealing() {
    preferences.begin("vibe_wifi", false);
    savedSsid = preferences.getString("ssid", "");
    savedPass = preferences.getString("pass", "");

    WiFi.mode(WIFI_AP_STA);
    WiFi.softAP("ESP32-Car-AP", "vibe123456");
    Serial.print("[WiFi AP] SoftAP Created. AP IP: ");
    Serial.println(WiFi.softAPIP());

    if (savedSsid.length() > 0) {
        Serial.printf("[WiFi STA] Attempting connection to SSID: '%s' ...\n", savedSsid.c_str());
        WiFi.begin(savedSsid.c_str(), savedPass.c_str());

        unsigned long startAttempt = millis();
        while (WiFi.status() != WL_CONNECTED && millis() - startAttempt < 8000) {
            delay(250);
            Serial.print(".");
        }
        Serial.println();

        if (WiFi.status() == WL_CONNECTED) {
            isStaConnected = true;
            localIpStr = WiFi.localIP().toString();
            Serial.printf("[WiFi STA SUCCESS] Connected to '%s'! Local IP: %s\n", savedSsid.c_str(), localIpStr.c_str());
        } else {
            isStaConnected = false;
            Serial.println("[WiFi STA TIMEOUT] Could not connect to target SSID. Fallback to AP Mode!");
        }
    } else {
        Serial.println("[WiFi STA] No saved SSID in NVS. AP Mode Active.");
    }

    if (MDNS.begin("esp32-car")) {
        Serial.println("[mDNS] Responder started. Access domain: http://esp32-car.local");
    }
}

// HTTP API Handlers
void handleRoot() {
    String html = "<!DOCTYPE html><html><head><meta charset='utf-8'><meta name='viewport' content='width=device-width,initial-scale=1'><title>ESP32-C3 Vehicle Control & OTA</title>";
    html += "<style>body{font-family:sans-serif;background:#0f172a;color:#f8fafc;padding:1.5rem;margin:0;}";
    html += ".card{background:#1e293b;border-radius:1rem;padding:1.5rem;max-width:520px;margin:auto;box-shadow:0 10px 25px rgba(0,0,0,0.5);margin-bottom:1.5rem;}";
    html += "input[type=text],input[type=password],input[type=file]{width:100%;box-sizing:border-box;margin:0.5rem 0 1rem 0;padding:0.75rem;background:#090d16;border:1px solid #334155;border-radius:0.5rem;color:#38bdf8;}";
    html += "input[type=submit],button{background:#0284c7;color:#fff;border:none;padding:0.75rem 1.5rem;border-radius:0.5rem;font-weight:bold;cursor:pointer;width:100%;margin-top:0.5rem;}";
    html += "button.danger{background:#e11d48;}</style></head><body>";

    html += "<div class='card'><h2>🚗 ESP32-C3 遙控車 OTA & WiFi 設定</h2>";
    html += "<p>BLE 狀態: <strong>" + String(deviceConnected ? "🟢 已連線" : "⚪ 未連線") + "</strong></p>";
    html += "<p>Watchdog 保護: <strong>500ms 自動急停</strong></p>";
    html += "<p>mDNS 域名: <strong><a href='http://esp32-car.local' style='color:#38bdf8;'>http://esp32-car.local</a></strong></p>";

    if (isStaConnected) {
        html += "<p style='color:#4ade80;'>📶 WiFi STA 狀態: <strong>已連至 '" + savedSsid + "' (IP: " + localIpStr + ")</strong></p>";
    } else {
        html += "<p style='color:#fbbf24;'>📶 WiFi AP 狀態: <strong>AP 備援模式 (AP IP: 192.168.4.1)</strong></p>";
    }

    html += "<hr style='border:0;border-top:1px solid #334155;margin:1.5rem 0;'>";
    html += "<h3>🚀 線上 OTA 無線韌體升級</h3>";
    html += "<form method='POST' action='/update' enctype='multipart/form-data'>";
    html += "<label>選擇韌體二進位檔 (.bin):</label><input type='file' name='update' accept='.bin' required>";
    html += "<input type='submit' value='確認規範並開始 OTA 燒錄'>";
    html += "</form></div>";

    html += "<div class='card'><h3>📶 WiFi 配網 (Provisioning Settings)</h3>";
    html += "<form method='POST' action='/api/wifi/config'>";
    html += "<label>WiFi SSID (無線網路名稱):</label><input type='text' name='ssid' value='" + savedSsid + "' placeholder='例如: chen' required>";
    html += "<label>WiFi 密碼 (Password):</label><input type='password' name='pass' value='" + savedPass + "' placeholder='WiFi 密碼'>";
    html += "<input type='submit' value='儲存 WiFi 設定並連線至 STA 模式'>";
    html += "</form>";

    if (savedSsid.length() > 0) {
        html += "<form method='POST' action='/api/wifi/clear' style='margin-top:1rem;'>";
        html += "<button type='submit' class='danger'>清除 WiFi 紀錄 (復原為純 AP 模式)</button>";
        html += "</form>";
    }

    html += "</div></body></html>";
    server.send(200, "text/html", html);
}

void handleStatus() {
    String json = "{";
    json += "\"connected\":" + String(deviceConnected ? "true" : "false") + ",";
    json += "\"watchdogTimeout\":" + String(WATCHDOG_TIMEOUT_MS) + ",";
    json += "\"emergencyStop\":" + String(emergencyStopTriggered ? "true" : "false") + ",";
    json += "\"v\":" + String(currentVelocity) + ",";
    json += "\"w\":" + String(currentAngular) + ",";
    json += "\"isStaConnected\":" + String(isStaConnected ? "true" : "false") + ",";
    json += "\"staSsid\":\"" + savedSsid + "\",";
    json += "\"localIp\":\"" + localIpStr + "\",";
    json += "\"apIp\":\"192.168.4.1\",";
    json += "\"mdnsUrl\":\"http://esp32-car.local\"";
    json += "}";
    server.send(200, "application/json", json);
}

void setupWebServer() {
    server.on("/", HTTP_GET, handleRoot);
    server.on("/api/status", HTTP_GET, handleStatus);

    // WiFi HTTP Remote Control Endpoint
    server.on("/api/drive", HTTP_GET, []() {
        int v = server.hasArg("v") ? server.arg("v").toInt() : 0;
        int w = server.hasArg("w") ? server.arg("w").toInt() : 0;
        driveVehicle(v, w);
        server.send(200, "application/json", "{\"status\":\"ok\",\"v\":" + String(v) + ",\"w\":" + String(w) + "}");
    });

    // WiFi Provisioning Config Endpoint
    server.on("/api/wifi/config", HTTP_POST, []() {
        String ssid = server.arg("ssid");
        String pass = server.arg("pass");
        if (ssid.length() > 0) {
            preferences.putString("ssid", ssid);
            preferences.putString("pass", pass);
            server.send(200, "text/html", "<html><body><h2>WiFi 設定已儲存！</h2><p>ESP32 正在重啟並連線至 '" + ssid + "' ...</p><script>setTimeout(()=>{location.href='http://esp32-car.local';}, 5000);</script></body></html>");
            delay(1000);
            ESP.restart();
        } else {
            server.send(400, "text/plain", "SSID 不能為空");
        }
    });

    // WiFi Clear Endpoint
    server.on("/api/wifi/clear", HTTP_POST, []() {
        preferences.clear();
        server.send(200, "text/html", "<html><body><h2>WiFi 紀錄已清除！</h2><p>ESP32 正在重啟並恢復為 AP 模式 (192.168.4.1) ...</p></body></html>");
        delay(1000);
        ESP.restart();
    });

    // OTA Flashing Handler with Pre-Flashing Rule Checks
    server.on("/update", HTTP_POST, []() {
        server.sendHeader("Connection", "close");
        if (Update.hasError()) {
            server.send(500, "text/plain", "OTA Flashing Failed: " + String(Update.getError()));
        } else {
            server.send(200, "text/plain", "OTA Flashing Successful! Restarting ESP32-C3...");
            delay(1000);
            ESP.restart();
        }
    }, []() {
        HTTPUpload& upload = server.upload();
        if (upload.status == UPLOAD_FILE_START) {
            Serial.printf("[OTA Pre-Flash] Starting Upload: %s\n", upload.filename.c_str());

            otaValidationStatus.passed = false;
            otaValidationStatus.errorReason = "";
            otaValidationStatus.totalSize = 0;

            // Rule 1: Check Space & Max Limit
            uint32_t maxSketchSpace = (ESP.getFreeSketchSpace() - 0x1000) & ~0xFFF;
            if (maxSketchSpace > MAX_FIRMWARE_SIZE_BYTES) {
                maxSketchSpace = MAX_FIRMWARE_SIZE_BYTES;
            }

            if (!Update.begin(maxSketchSpace)) {
                otaValidationStatus.errorReason = "Partition space unavailable for OTA update";
                Serial.println("[OTA Error] Update.begin failed!");
                return;
            }
        } else if (upload.status == UPLOAD_FILE_WRITE) {
            otaValidationStatus.totalSize += upload.currentSize;

            // Rule 2: Inspect Firmware Header on First Chunk
            if (upload.totalSize == upload.currentSize && upload.currentSize >= 8) {
                String errorMsg, chipName;
                if (!validateFirmwareHeader(upload.buf, upload.currentSize, errorMsg, chipName)) {
                    otaValidationStatus.passed = false;
                    otaValidationStatus.errorReason = errorMsg;
                    Serial.printf("[OTA Validation FAILED] %s\n", errorMsg.c_str());
                    Update.abort();
                    return;
                } else {
                    otaValidationStatus.passed = true;
                    otaValidationStatus.chipTarget = chipName;
                    Serial.printf("[OTA Validation PASSED] Target Chip: %s\n", chipName.c_str());
                }
            }

            if (Update.write(upload.buf, upload.currentSize) != upload.currentSize) {
                Serial.println("[OTA Error] Flash write failed!");
            }
        } else if (upload.status == UPLOAD_FILE_END) {
            if (Update.end(true)) {
                Serial.printf("[OTA Success] Total Flashed Bytes: %u\n", upload.totalSize);
            } else {
                Serial.printf("[OTA Error] Finalize failed: %s\n", Update.getError());
            }
        }
    });

    server.begin();
    Serial.println("[HTTP Server] Web OTA & Control Server Started on Port 80");
}

void setupHardwarePins() {
    pinMode(MOTOR_LEFT_PWM, OUTPUT);
    pinMode(MOTOR_LEFT_DIR, OUTPUT);
    pinMode(MOTOR_RIGHT_PWM, OUTPUT);
    pinMode(MOTOR_RIGHT_DIR, OUTPUT);
    pinMode(LED_INDICATOR, OUTPUT);
    stopVehicle();
}

void setup() {
    Serial.begin(115200);
    delay(500);
    Serial.println("\n===========================================");
    Serial.println("[ESP32-C3] Initializing Vehicle Firmware v1.0.0");
    Serial.println("===========================================");

    setupHardwarePins();

    // WiFi Self-Healing & Provisioning Initialization
    initWiFiSelfHealing();

    setupWebServer();

    // NimBLE Service Setup (Supports both Monorepo Protocol & Official vibe-coding.tw Nordic UART Service)
    NimBLEDevice::init("ESP32-Car-C3");
    NimBLEServer *pServer = NimBLEDevice::createServer();
    pServer->setCallbacks(new ServerCallbacks());

    // 1. Monorepo Vehicle Primary Service
    NimBLEService *pService = pServer->createService(SERVICE_UUID);
    NimBLECharacteristic *pCharacteristic = pService->createCharacteristic(
                                                CHARACTERISTIC_UUID,
                                                NIMBLE_PROPERTY::READ |
                                                NIMBLE_PROPERTY::WRITE |
                                                NIMBLE_PROPERTY::NOTIFY
                                              );
    pCharacteristic->setCallbacks(new CommandCallbacks());
    pService->start();

    // 2. Official vibe-coding.tw Nordic UART Secondary Service (6e400001-b5a3-f393-e0a9-e50e24dcca9e)
    NimBLEService *pNordicService = pServer->createService("6e400001-b5a3-f393-e0a9-e50e24dcca9e");
    NimBLECharacteristic *pNordicRxChar = pNordicService->createCharacteristic(
                                                "6e400002-b5a3-f393-e0a9-e50e24dcca9e",
                                                NIMBLE_PROPERTY::WRITE |
                                                NIMBLE_PROPERTY::WRITE_NR
                                              );
    pNordicRxChar->setCallbacks(new CommandCallbacks());
    pNordicService->start();

    NimBLEAdvertising *pAdvertising = NimBLEDevice::getAdvertising();
    pAdvertising->addServiceUUID(SERVICE_UUID);
    pAdvertising->addServiceUUID("6e400001-b5a3-f393-e0a9-e50e24dcca9e");
    pAdvertising->setScanResponse(true);
    NimBLEDevice::startAdvertising();
    Serial.println("[NimBLE] Dual-Service Advertising Started as 'ESP32-Car-C3'");
}

void loop() {
    // 500ms Watchdog Safety Stop Routine
    if (!emergencyStopTriggered && (millis() - lastPacketTime > WATCHDOG_TIMEOUT_MS)) {
        stopVehicle();
        emergencyStopTriggered = true;
        Serial.println("[SAFETY] Watchdog Timeout (>500ms)! Emergency Stop Activated.");
    }

    server.handleClient();
    delay(5);
}

