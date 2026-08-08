#include <Arduino.h>
#include <WiFi.h>
#include <WebServer.h>
#include <Update.h>
#include <NimBLEDevice.h>

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

    chipName = "ESP32 Standard / Generic";
    if (len >= 13) {
        uint8_t chipId = headerData[12];
        if (chipId == TARGET_CHIP_ESP32C3) {
            chipName = "ESP32-C3 (Matched Target)";
        } else {
            chipName = "Target Mismatch (Chip ID: 0x" + String(chipId, HEX) + ")";
            errorMsg = "韌體晶片目標不符合！本硬體為 ESP32-C3，但上傳檔為: " + chipName;
            return false;
        }
    }

    return true;
}

// HTTP API Handlers
void handleRoot() {
    String html = "<!DOCTYPE html><html><head><meta charset='utf-8'><title>ESP32-C3 Vehicle OTA Management</title>";
    html += "<style>body{font-family:sans-serif;background:#0f172a;color:#f8fafc;padding:2rem;}";
    html += ".card{background:#1e293b;border-radius:1rem;padding:2rem;max-width:500px;margin:auto;box-shadow:0 10px 25px rgba(0,0,0,0.5);}";
    html += "input[type=file]{margin:1rem 0;display:block;color:#94a3b8;}";
    html += "input[type=submit]{background:#0284c7;color:#fff;border:none;padding:0.75rem 1.5rem;border-radius:0.5rem;font-weight:bold;cursor:pointer;width:100%;}</style></head><body>";
    html += "<div class='card'><h2>🚗 ESP32-C3 Vibe Car OTA Web Portal</h2>";
    html += "<p>Status: <strong>" + String(deviceConnected ? "BLE Connected" : "Ready") + "</strong></p>";
    html += "<p>Watchdog Safety: 500ms Active</p>";
    html += "<form method='POST' action='/update' enctype='multipart/form-data'>";
    html += "<label>選擇二進位韌體 (.bin):</label><input type='file' name='update' accept='.bin' required>";
    html += "<input type='submit' value='確認並開始 OTA 無線升級'>";
    html += "</form></div></body></html>";
    server.send(200, "text/html", html);
}

void handleStatus() {
    String json = "{";
    json += "\"connected\":" + String(deviceConnected ? "true" : "false") + ",";
    json += "\"watchdogTimeout\":" + String(WATCHDOG_TIMEOUT_MS) + ",";
    json += "\"emergencyStop\":" + String(emergencyStopTriggered ? "true" : "false") + ",";
    json += "\"v\":" + String(currentVelocity) + ",";
    json += "\"w\":" + String(currentAngular);
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

    // WiFi AP Initialization
    WiFi.softAP("ESP32-Car-AP", "vibe123456");
    Serial.print("[WiFi AP] SoftAP Created. IP: ");
    Serial.println(WiFi.softAPIP());

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

