#include <Arduino.h>
#include <WiFi.h>
#include <WebServer.h>
#include <DNSServer.h>
#include <Update.h>
#include <NimBLEDevice.h>
#include <Preferences.h>
#include <ESPmDNS.h>
#include <esp_ota_ops.h>
#include <soc/soc.h>
#include <soc/rtc_cntl_reg.h>

// BLE Protocol Constants (Sync with packages/protocol)
#define SERVICE_UUID        "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
#define CHARACTERISTIC_UUID "beb5483e-36e1-4688-b7f5-ea07361b26a8"

#define FW_VERSION                "1.3.2-stopfix"
#define CURRICULUM_PROFILE        "integration-lab+wifi+ble+ota+http-v1"
#define ESP32_MAGIC_BYTE          0xE9
#define TARGET_CHIP_ESP32C3       0x05
#define MAX_FIRMWARE_SIZE_BYTES   1572864 // 1.5MB soft limit within 1.875MB OTA slot
#define WATCHDOG_TIMEOUT_MS       500
#define STA_CONNECT_TIMEOUT_MS    12000
#define STA_DISCONNECT_GRACE_MS   8000   // faster SoftAP recovery when STA drops
#define STA_REPROBE_INTERVAL_MS   60000  // keep SoftAP stable longer before STA re-probe
#define STA_FAIL_CLEAR_THRESHOLD  5
#define BOOT_FACTORY_HOLD_MS      3000   // hold BOOT at power-on
#define BOOT_RUNTIME_HOLD_MS      5000   // hold BOOT while running
#define OTA_MARK_VALID_AFTER_MS   20000  // defer rollback cancel so bad OTA can revert
#define MOTOR_PWM_FREQ_HZ         20000  // curriculum basic-04 / h-bridge target
#define MOTOR_PWM_RES_BITS        8
#define MOTOR_START_OFFSET        60     // curriculum friction / dead-zone compensation
#define LEDC_CH_LEFT              0
#define LEDC_CH_RIGHT             1
// BLE 0xAA opcode: factory clear WiFi (must pair with confirm byte)
#define BLE_OPCODE_FACTORY_WIFI   0xF1
#define BLE_FACTORY_CONFIRM       0xA5

#define AP_SSID                   "ESP32-Car-AP"
// iPhone frequently cannot join OPEN SoftAP; use WPA2 password (>= 8 chars).
#define AP_PASS                   "vibe123456"
#define BLE_DEVICE_NAME           "ESP32-Car"
#define MDNS_HOSTNAME             "esp32-car"

// GPIO Motor Pin Definitions (ESP32-C3)
#define MOTOR_LEFT_PWM   4
#define MOTOR_LEFT_DIR   5
#define MOTOR_RIGHT_PWM  6
#define MOTOR_RIGHT_DIR  7
#define LED_INDICATOR    8
// ESP32-C3 DevKit: BOOT button = GPIO9 (active LOW). RESET/EN only reboots silicon.
#define BOOT_BUTTON_PIN  9

enum WifiRole {
    WIFI_ROLE_AP = 0,
    WIFI_ROLE_STA = 1
};

// Curriculum FSM (basic-10 / state-consistency) — behavior mapped onto drive loop.
enum VehicleState {
    VEHICLE_IDLE = 0,
    VEHICLE_RUNNING = 1,
    VEHICLE_FAULT = 2
};

bool deviceConnected = false;
unsigned long lastPacketTime = 0;
bool emergencyStopTriggered = false;
int currentVelocity = 0;
int currentAngular = 0;
VehicleState vehicleState = VEHICLE_IDLE;

Preferences preferences;
String savedSsid = "";
String savedPass = "";
WifiRole wifiRole = WIFI_ROLE_AP;
String localIpStr = "";
unsigned long staDisconnectedSince = 0;
unsigned long lastStaProbeMs = 0;
unsigned long lastWatchdogBlinkMs = 0;
uint8_t staFailCount = 0;
unsigned long bootHeldSince = 0;
bool factoryResetArmed = false;
bool otaHeaderChecked = false;
bool otaRejected = false;
bool bleStarted = false;
unsigned long bleStartAtMs = 0;
unsigned long bootMs = 0;
bool otaAppValidated = false;

WebServer server(80);
DNSServer dnsServer;
bool dnsRunning = false;

void performFactoryReset(const char *reason);
void maybeMarkOtaAppValid();

struct OTAValidationStatus {
    bool passed;
    String errorReason;
    String chipTarget;
    size_t totalSize;
} otaValidationStatus;

void setMotorSpeeds(int leftSpeed, int rightSpeed) {
    leftSpeed = constrain(leftSpeed, -255, 255);
    rightSpeed = constrain(rightSpeed, -255, 255);

    // Curriculum dead-zone: small PWM often cannot overcome static friction.
    auto withOffset = [](int speed) -> int {
        if (speed == 0) return 0;
        int mag = abs(speed);
        if (mag < MOTOR_START_OFFSET) mag = MOTOR_START_OFFSET;
        return speed < 0 ? -mag : mag;
    };
    leftSpeed = withOffset(leftSpeed);
    rightSpeed = withOffset(rightSpeed);

    digitalWrite(MOTOR_LEFT_DIR, leftSpeed >= 0 ? HIGH : LOW);
    ledcWrite(LEDC_CH_LEFT, abs(leftSpeed));

    digitalWrite(MOTOR_RIGHT_DIR, rightSpeed >= 0 ? HIGH : LOW);
    ledcWrite(LEDC_CH_RIGHT, abs(rightSpeed));
}

void stopVehicle() {
    setMotorSpeeds(0, 0);
    digitalWrite(LED_INDICATOR, LOW);
    if (vehicleState != VEHICLE_FAULT) {
        vehicleState = VEHICLE_IDLE;
    }
    currentVelocity = 0;
    currentAngular = 0;
}

void driveVehicle(int v, int w) {
    currentVelocity = v;
    currentAngular = w;
    lastPacketTime = millis();
    emergencyStopTriggered = false;
    vehicleState = VEHICLE_RUNNING;

    int vPwm = map(v, -100, 100, -255, 255);
    int wPwm = map(w, -100, 100, -255, 255);
    setMotorSpeeds(vPwm + wPwm, vPwm - wPwm);
    digitalWrite(LED_INDICATOR, HIGH);
}

const char *vehicleStateName() {
    switch (vehicleState) {
        case VEHICLE_RUNNING: return "RUNNING";
        case VEHICLE_FAULT: return "FAULT";
        default: return "IDLE";
    }
}

void applyDriveCommandLetter(char cmd) {
    switch (cmd) {
        case 'F': case 'f': driveVehicle(100, 0); break;
        case 'B': case 'b': driveVehicle(-100, 0); break;
        case 'L': case 'l': driveVehicle(0, -100); break;
        case 'R': case 'r': driveVehicle(0, 100); break;
        case 'S': case 's':
        default:
            stopVehicle();
            break;
    }
}

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
        if (rxValue.length() < 4) {
            return;
        }
        uint8_t hdr = (uint8_t)rxValue[0];
        // Monorepo / Integration Lab: [0xFF, v+128, w+128, checksum]
        if (hdr == 0xFF) {
            uint8_t vNorm = (uint8_t)rxValue[1];
            uint8_t wNorm = (uint8_t)rxValue[2];
            uint8_t checksum = (uint8_t)rxValue[3];
            if (((vNorm + wNorm) & 0xFF) == checksum) {
                driveVehicle((int)vNorm - 128, (int)wNorm - 128);
            } else {
                Serial.println("[Packet Error] Checksum Mismatch! Discarded.");
            }
            return;
        }
        // Curriculum gatt-structure lite: [0xAA, opcode, speed, checksum]
        // opcode: 1=F 2=B 3=L 4=R 0=S ; 0xF1+0xA5 = factory clear WiFi
        if (hdr == 0xAA) {
            uint8_t opcode = (uint8_t)rxValue[1];
            uint8_t speed = (uint8_t)rxValue[2];
            uint8_t checksum = (uint8_t)rxValue[3];
            if (((opcode + speed) & 0xFF) != checksum) {
                Serial.println("[Packet Error] 0xAA checksum mismatch");
                return;
            }
            if (opcode == BLE_OPCODE_FACTORY_WIFI) {
                if (speed == BLE_FACTORY_CONFIRM) {
                    performFactoryReset("BLE 0xAA factory opcode");
                } else {
                    Serial.println("[FACTORY] BLE factory opcode without confirm byte — ignored");
                }
                return;
            }
            int s = constrain((int)speed, 0, 100);
            if (opcode == 1) driveVehicle(s, 0);
            else if (opcode == 2) driveVehicle(-s, 0);
            else if (opcode == 3) driveVehicle(0, -s);
            else if (opcode == 4) driveVehicle(0, s);
            else stopVehicle();
        }
    }
};

bool validateFirmwareHeader(const uint8_t* headerData, size_t len, String &errorMsg, String &chipName) {
    if (len < 13) {
        errorMsg = "標頭無效 (Header length < 13 bytes; need chip_id at offset 12)";
        return false;
    }
    if (headerData[0] != ESP32_MAGIC_BYTE) {
        errorMsg = "非法的 ESP32 韌體 Magic Byte: 0x" + String(headerData[0], HEX) + " (預期 0xE9)";
        return false;
    }
    uint8_t chipId = headerData[12];
    if (chipId != TARGET_CHIP_ESP32C3) {
        errorMsg = "Chip ID 不符: 0x" + String(chipId, HEX) + " (本車僅接受 ESP32-C3 = 0x05)";
        return false;
    }
    chipName = "ESP32-C3";
    return true;
}

void applyCorsHeaders() {
    server.sendHeader("Access-Control-Allow-Origin", "*");
    server.sendHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    server.sendHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Car-Token");
    server.sendHeader("Access-Control-Allow-Private-Network", "true");
    server.sendHeader("Access-Control-Max-Age", "86400");
}

void sendText(int code, const char *contentType, const String &body) {
    applyCorsHeaders();
    server.send(code, contentType, body);
}

void loadWifiCredentials() {
    preferences.begin("vibe_wifi", false);
    savedSsid = preferences.getString("ssid", "");
    savedPass = preferences.getString("pass", "");
    staFailCount = preferences.getUChar("sta_fail", 0);
}

void saveWifiCredentials(const String &ssid, const String &pass) {
    preferences.putString("ssid", ssid);
    preferences.putString("pass", pass);
    preferences.putUChar("sta_fail", 0);
    savedSsid = ssid;
    savedPass = pass;
    staFailCount = 0;
}

void clearWifiCredentials() {
    preferences.begin("vibe_wifi", false);
    preferences.clear();
    preferences.end();
    preferences.begin("vibe_wifi", false);
    savedSsid = "";
    savedPass = "";
    staFailCount = 0;
}

// Hardware RESET (EN) only reboots. Factory restore = clear NVS via BOOT button / web / fail-count.
void performFactoryReset(const char *reason) {
    Serial.printf("[FACTORY] %s — clearing WiFi NVS and rebooting to open AP\n", reason);
    clearWifiCredentials();
    for (int i = 0; i < 6; i++) {
        digitalWrite(LED_INDICATOR, i % 2 == 0 ? HIGH : LOW);
        delay(120);
    }
    ESP.restart();
}

bool bootButtonPressed() {
    return digitalRead(BOOT_BUTTON_PIN) == LOW;
}

// Call early in setup(): hold BOOT >= 3s during boot → factory reset.
bool checkBootFactoryResetOnStartup() {
    pinMode(BOOT_BUTTON_PIN, INPUT_PULLUP);
    if (!bootButtonPressed()) {
        return false;
    }
    Serial.println("[FACTORY] BOOT held at startup — keep holding 3s for factory reset...");
    unsigned long start = millis();
    while (bootButtonPressed()) {
        digitalWrite(LED_INDICATOR, ((millis() / 150) % 2) == 0 ? HIGH : LOW);
        if (millis() - start >= BOOT_FACTORY_HOLD_MS) {
            performFactoryReset("BOOT held at power-on");
            return true; // unreachable after restart
        }
        delay(20);
    }
    digitalWrite(LED_INDICATOR, LOW);
    Serial.println("[FACTORY] BOOT released early — skip factory reset");
    return false;
}

// Runtime: hold BOOT >= 5s → factory reset (works even when stuck in bad STA).
void pollBootFactoryReset() {
    if (bootButtonPressed()) {
        if (bootHeldSince == 0) {
            bootHeldSince = millis();
        } else if (!factoryResetArmed && millis() - bootHeldSince >= BOOT_RUNTIME_HOLD_MS) {
            factoryResetArmed = true;
            performFactoryReset("BOOT long-press while running");
        }
    } else {
        bootHeldSince = 0;
        factoryResetArmed = false;
    }
}

void bumpStaFailCount() {
    if (staFailCount < 255) {
        staFailCount++;
    }
    preferences.putUChar("sta_fail", staFailCount);
    Serial.printf("[WiFi] STA fail count = %u\n", staFailCount);
    if (staFailCount >= STA_FAIL_CLEAR_THRESHOLD) {
        Serial.println("[WiFi] Too many STA failures. Clearing saved credentials.");
        clearWifiCredentials();
    }
}

void stopDnsPortal() {
    if (dnsRunning) {
        dnsServer.stop();
        dnsRunning = false;
    }
}

void startDnsPortal() {
    stopDnsPortal();
    dnsServer.setErrorReplyCode(DNSReplyCode::NoError);
    dnsServer.start(53, "*", WiFi.softAPIP());
    dnsRunning = true;
}

void startMdns() {
    MDNS.end();
    if (MDNS.begin(MDNS_HOSTNAME)) {
        MDNS.addService("http", "tcp", 80);
        Serial.println("[mDNS] http://esp32-car.local");
    } else {
        Serial.println("[mDNS] Failed to start");
    }
}

// AP mode: WPA2 SoftAP + captive portal (iOS needs password; open AP often fails to join).
void enterApMode(const char *reason) {
    Serial.printf("[WiFi] Enter AP mode (%s)\n", reason);
    Serial.flush();
    stopDnsPortal();
    MDNS.end();

    WiFi.persistent(false);
    WiFi.disconnect(true, true);
    delay(100);
    // Match WiFi-Join-Test that iPhone could see + join (default channel, WPA2 password).
    WiFi.mode(WIFI_AP);
    delay(200);
    WiFi.setSleep(false);

    bool ok = WiFi.softAP(AP_SSID, AP_PASS);
    delay(500);
    WiFi.setTxPower(WIFI_POWER_8_5dBm);

    if (!ok) {
        Serial.println("[WiFi AP] WPA SoftAP failed — fallback OPEN");
        ok = WiFi.softAP(AP_SSID);
        delay(500);
    }

    localIpStr = WiFi.softAPIP().toString();
    wifiRole = WIFI_ROLE_AP;
    staDisconnectedSince = 0;
    lastStaProbeMs = millis();

    startDnsPortal();
    startMdns();

    Serial.printf("[WiFi AP] SSID=%s PASS=%s IP=%s softAP=%s\n",
                  AP_SSID, AP_PASS, localIpStr.c_str(), ok ? "ok" : "FAIL");
    Serial.printf("[WiFi AP] Stations connected: %u\n", WiFi.softAPgetStationNum());
    Serial.flush();
}

// STA mode: home WiFi only. AP is intentionally off while STA is healthy.
bool enterStaMode(bool countFailures = true) {
    if (savedSsid.length() == 0) {
        return false;
    }

    Serial.printf("[WiFi] Enter STA mode, SSID='%s'\n", savedSsid.c_str());
    stopDnsPortal();
    MDNS.end();

    WiFi.softAPdisconnect(true);
    WiFi.mode(WIFI_STA);
    WiFi.begin(savedSsid.c_str(), savedPass.c_str());

    unsigned long start = millis();
    while (WiFi.status() != WL_CONNECTED && millis() - start < STA_CONNECT_TIMEOUT_MS) {
        delay(250);
        Serial.print(".");
    }
    Serial.println();

    if (WiFi.status() != WL_CONNECTED) {
        Serial.println("[WiFi STA] Connect timeout");
        if (countFailures) {
            bumpStaFailCount();
        }
        return false;
    }

    preferences.putUChar("sta_fail", 0);
    staFailCount = 0;
    wifiRole = WIFI_ROLE_STA;
    localIpStr = WiFi.localIP().toString();
    staDisconnectedSince = 0;
    lastStaProbeMs = millis();
    startMdns();

    Serial.printf("[WiFi STA] Connected. IP=%s\n", localIpStr.c_str());
    return true;
}

void initWifiApStaSwitching() {
    loadWifiCredentials();

    if (savedSsid.length() > 0) {
        if (enterStaMode()) {
            return;
        }
        // Fail → fall back to open AP for re-provisioning / OTA recovery.
        enterApMode("STA connect failed");
        return;
    }

    enterApMode("no saved credentials");
}

// While SoftAP is up, try home WiFi without tearing down AP first.
bool probeStaFromAp() {
    if (savedSsid.length() == 0 || wifiRole != WIFI_ROLE_AP) {
        return false;
    }

    Serial.printf("[WiFi] SoftAP kept up; probing STA '%s'\n", savedSsid.c_str());
    WiFi.mode(WIFI_AP_STA);
    WiFi.begin(savedSsid.c_str(), savedPass.c_str());

    unsigned long start = millis();
    while (WiFi.status() != WL_CONNECTED && millis() - start < STA_CONNECT_TIMEOUT_MS) {
        delay(250);
        Serial.print(".");
        if (dnsRunning) {
            dnsServer.processNextRequest();
        }
        server.handleClient();
    }
    Serial.println();

    if (WiFi.status() != WL_CONNECTED) {
        Serial.println("[WiFi] STA probe miss — stay on open AP");
        WiFi.disconnect(false);
        WiFi.mode(WIFI_AP);
        return false;
    }

    // STA healthy → exclusive STA (AP off), matching AP↔STA switching design.
    Serial.println("[WiFi] STA probe hit — switching AP → STA");
    stopDnsPortal();
    WiFi.softAPdisconnect(true);
    WiFi.mode(WIFI_STA);
    preferences.putUChar("sta_fail", 0);
    staFailCount = 0;
    wifiRole = WIFI_ROLE_STA;
    localIpStr = WiFi.localIP().toString();
    staDisconnectedSince = 0;
    lastStaProbeMs = millis();
    startMdns();
    return true;
}

// Runtime self-heal:
// - STA drop → open AP after grace
// - AP with saved creds → periodic STA re-probe WITHOUT killing SoftAP clients
void maintainWifiRole() {
    if (wifiRole == WIFI_ROLE_STA) {
        if (WiFi.status() == WL_CONNECTED) {
            staDisconnectedSince = 0;
            return;
        }
        if (staDisconnectedSince == 0) {
            staDisconnectedSince = millis();
            Serial.println("[WiFi] STA link lost, starting grace timer...");
            return;
        }
        if (millis() - staDisconnectedSince >= STA_DISCONNECT_GRACE_MS) {
            bumpStaFailCount();
            enterApMode("STA disconnected");
        }
        return;
    }

    wifi_mode_t mode = WiFi.getMode();
    if (mode != WIFI_AP && mode != WIFI_AP_STA) {
        enterApMode("AP mode lost, restarting SoftAP");
    }

    if (savedSsid.length() == 0) {
        return;
    }
    if (millis() - lastStaProbeMs < STA_REPROBE_INTERVAL_MS) {
        return;
    }
    lastStaProbeMs = millis();
    probeStaFromAp();
}

String htmlEscape(const String &in) {
    String out;
    out.reserve(in.length());
    for (size_t i = 0; i < in.length(); i++) {
        char c = in[i];
        if (c == '&') out += "&amp;";
        else if (c == '<') out += "&lt;";
        else if (c == '>') out += "&gt;";
        else if (c == '"') out += "&quot;";
        else out += c;
    }
    return out;
}

void handleRoot() {
    String html = "<!DOCTYPE html><html><head><meta charset='utf-8'>";
    html += "<meta name='viewport' content='width=device-width,initial-scale=1,user-scalable=no'>";
    html += "<title>ESP32-C3 Vibe Car</title>";
    html += "<style>body{font-family:-apple-system,BlinkMacSystemFont,sans-serif;background:#0f172a;color:#f8fafc;padding:1.25rem;margin:0;}";
    html += ".card{background:#1e293b;border-radius:1rem;padding:1.25rem;max-width:520px;margin:0 auto 1rem;}";
    html += "label{display:block;margin-top:.75rem;font-size:.9rem;color:#cbd5e1;}";
    html += "input[type=text],input[type=password],input[type=file]{width:100%;box-sizing:border-box;margin:.4rem 0 0;padding:.75rem;background:#090d16;border:1px solid #334155;border-radius:.5rem;color:#38bdf8;}";
    html += "input[type=submit],button{background:#0284c7;color:#fff;border:none;padding:.75rem 1rem;border-radius:.5rem;font-weight:700;cursor:pointer;width:100%;margin-top:.9rem;}";
    html += "button.danger{background:#e11d48;} .ok{color:#4ade80;} .warn{color:#fbbf24;} .muted{color:#94a3b8;font-size:.85rem;}";
    html += ".pad{display:grid;grid-template-columns:1fr 1fr 1fr;gap:.5rem;max-width:240px;margin:1rem auto 0;}";
    html += ".pad button{margin:0;padding:1rem 0;font-size:1.1rem;touch-action:manipulation;}";
    html += ".pad .ghost{visibility:hidden;} .stop{background:#e11d48;}</style></head><body>";

    html += "<div class='card'><h2>ESP32-C3 Vibe Car</h2>";
    html += "<p class='muted'>Firmware " + String(FW_VERSION) + " · profile " + String(CURRICULUM_PROFILE) + "</p>";
    html += "<p>BLE: <strong>" + String(deviceConnected ? "Connected" : (bleStarted ? "Advertising" : "Starting")) + "</strong> (" + String(BLE_DEVICE_NAME) + ")</p>";
    html += "<p>FSM: <strong>" + String(vehicleStateName()) + "</strong></p>";

    if (wifiRole == WIFI_ROLE_STA) {
        html += "<p class='ok'>Mode: <strong>STA</strong> — connected to '" + htmlEscape(savedSsid) + "' (" + localIpStr + ")</p>";
        html += "<p class='muted'>AP hotspot is off while STA is healthy. Use Clear WiFi to return to AP.</p>";
    } else {
        html += "<p class='warn'>Mode: <strong>AP</strong> — join WiFi <strong>" + String(AP_SSID) + "</strong> / password <strong>" + String(AP_PASS) + "</strong></p>";
        html += "<p class='muted'>Config page: http://192.168.4.1 &nbsp;|&nbsp; mDNS: http://esp32-car.local</p>";
    }

    html += "<h3>Drive</h3>";
    html += "<div class='pad'>";
    html += "<button class='ghost' type='button'>&nbsp;</button>";
    html += "<button type='button' ontouchstart=\"hold(100,0);return false\" onmousedown=\"hold(100,0)\" ontouchend=\"release();return false\" onmouseup=\"release()\" onmouseleave=\"release()\">▲</button>";
    html += "<button class='ghost' type='button'>&nbsp;</button>";
    html += "<button type='button' ontouchstart=\"hold(0,-100);return false\" onmousedown=\"hold(0,-100)\" ontouchend=\"release();return false\" onmouseup=\"release()\" onmouseleave=\"release()\">◀</button>";
    html += "<button class='stop' type='button' ontouchstart=\"release();return false\" onmousedown=\"release();return false\" onclick=\"release();return false\">■</button>";
    html += "<button type='button' ontouchstart=\"hold(0,100);return false\" onmousedown=\"hold(0,100)\" ontouchend=\"release();return false\" onmouseup=\"release()\" onmouseleave=\"release()\">▶</button>";
    html += "<button class='ghost' type='button'>&nbsp;</button>";
    html += "<button type='button' ontouchstart=\"hold(-100,0);return false\" onmousedown=\"hold(-100,0)\" ontouchend=\"release();return false\" onmouseup=\"release()\" onmouseleave=\"release()\">▼</button>";
    html += "<button class='ghost' type='button'>&nbsp;</button>";
    html += "</div>";
    html += "<p class='muted' id='drvMsg'>Hold a direction to drive. Tap ■ for immediate stop.</p>";
    html += "<script>var t=null,gen=0;"
            "function go(v,w){fetch('/api/drive?v='+v+'&w='+w).catch(function(){});"
            "var m=document.getElementById('drvMsg');if(m)m.textContent='v='+v+' w='+w;}"
            "function stopNow(){fetch('/api/drive?cmd=S').catch(function(){});"
            "var m=document.getElementById('drvMsg');if(m)m.textContent='STOP';}"
            "function hold(v,w){var g=++gen;function tick(){if(g!==gen)return;go(v,w);}"
            "tick();if(t)clearInterval(t);t=setInterval(tick,200);}"
            "function release(){gen++;if(t){clearInterval(t);t=null;}stopNow();stopNow();}</script>";

    html += "<hr style='border:0;border-top:1px solid #334155;margin:1.25rem 0;'>";
    html += "<h3>OTA Update</h3>";
    html += "<form method='POST' action='/update' enctype='multipart/form-data'>";
    html += "<label>Firmware .bin</label><input type='file' name='update' accept='.bin' required>";
    html += "<input type='submit' value='Upload OTA'>";
    html += "</form></div>";

    html += "<div class='card'><h3>WiFi Provisioning</h3>";
    html += "<form method='POST' action='/api/wifi/config'>";
    html += "<label>Home WiFi SSID</label><input type='text' name='ssid' value='" + htmlEscape(savedSsid) + "' placeholder='e.g. chen' required>";
    html += "<label>Home WiFi Password</label><input type='password' name='pass' value='" + htmlEscape(savedPass) + "' placeholder='password'>";
    html += "<input type='submit' value='Save & Switch to STA'>";
    html += "</form>";

    if (savedSsid.length() > 0) {
        html += "<form method='POST' action='/api/wifi/clear'>";
        html += "<button type='submit' class='danger'>Clear WiFi (back to SoftAP " + String(AP_SSID) + ")</button>";
        html += "</form>";
    }
    html += "<p class='muted'>Factory reset: hold <strong>BOOT</strong> 3s at power-on / 5s while running, or BLE <code>[0xAA,0xF1,0xA5,cs]</code>, or Clear WiFi above. RESET only reboots.</p>";
    html += "<p class='muted'>Curriculum profile: AP↔STA · BLE 0xFF/0xAA · HTTP /api + /api/v1 · LEDC 20kHz · FSM IDLE/RUNNING/FAULT</p>";
    html += "</div></body></html>";

    sendText(200, "text/html", html);
}

void handleCaptiveProbe() {
    // Force phones/laptops to open the config page when on SoftAP.
    server.sendHeader("Location", "http://192.168.4.1/", true);
    server.send(302, "text/plain", "");
}

void handleStatus() {
    String json = "{";
    json += "\"fw\":\"" + String(FW_VERSION) + "\",";
    json += "\"profile\":\"" + String(CURRICULUM_PROFILE) + "\",";
    json += "\"state\":\"" + String(vehicleStateName()) + "\",";
    json += "\"connected\":" + String(deviceConnected ? "true" : "false") + ",";
    json += "\"watchdogTimeout\":" + String(WATCHDOG_TIMEOUT_MS) + ",";
    json += "\"emergencyStop\":" + String(emergencyStopTriggered ? "true" : "false") + ",";
    json += "\"v\":" + String(currentVelocity) + ",";
    json += "\"w\":" + String(currentAngular) + ",";
    json += "\"pwmHz\":" + String(MOTOR_PWM_FREQ_HZ) + ",";
    json += "\"pins\":{\"leftPwm\":" + String(MOTOR_LEFT_PWM) + ",\"leftDir\":" + String(MOTOR_LEFT_DIR) +
            ",\"rightPwm\":" + String(MOTOR_RIGHT_PWM) + ",\"rightDir\":" + String(MOTOR_RIGHT_DIR) +
            ",\"led\":" + String(LED_INDICATOR) + ",\"boot\":" + String(BOOT_BUTTON_PIN) + "},";
    json += "\"wifiRole\":\"" + String(wifiRole == WIFI_ROLE_STA ? "STA" : "AP") + "\",";
    json += "\"isStaConnected\":" + String(wifiRole == WIFI_ROLE_STA && WiFi.status() == WL_CONNECTED ? "true" : "false") + ",";
    json += "\"staSsid\":\"" + savedSsid + "\",";
    json += "\"localIp\":\"" + localIpStr + "\",";
    json += "\"apSsid\":\"" + String(AP_SSID) + "\",";
    json += "\"apOpen\":false,";
    json += "\"apPass\":\"" + String(AP_PASS) + "\",";
    json += "\"apIp\":\"192.168.4.1\",";
    json += "\"mdnsUrl\":\"http://esp32-car.local\",";
    json += "\"staFailCount\":" + String(staFailCount) + ",";
    json += "\"bleStarted\":" + String(bleStarted ? "true" : "false") + ",";
    json += "\"bleName\":\"" + String(BLE_DEVICE_NAME) + "\",";
    json += "\"uptimeMs\":" + String(millis()) + ",";
    json += "\"otaAppValidated\":" + String(otaAppValidated ? "true" : "false");
    json += "}";
    sendText(200, "application/json", json);
}

void handleInfo() {
    String json = "{";
    json += "\"fw\":\"" + String(FW_VERSION) + "\",";
    json += "\"profile\":\"" + String(CURRICULUM_PROFILE) + "\",";
    json += "\"chip\":\"ESP32-C3\",";
    json += "\"bleName\":\"" + String(BLE_DEVICE_NAME) + "\",";
    json += "\"bleService\":\"" + String(SERVICE_UUID) + "\",";
    json += "\"bleChar\":\"" + String(CHARACTERISTIC_UUID) + "\",";
    json += "\"packet\":\"[0xFF,v+128,w+128,cs] or [0xAA,opcode,speed,cs]\",";
    json += "\"bleFactory\":\"[0xAA,0xF1,0xA5,cs] clears WiFi NVS\",";
    json += "\"softAp\":\"" + String(AP_SSID) + "\",";
    json += "\"bleStarted\":" + String(bleStarted ? "true" : "false") + ",";
    json += "\"note\":\"Classic ESP32 GPIO16-19 labs use C3 pins 4-7 on this fleet image\"";
    json += "}";
    sendText(200, "application/json", json);
}

void handleDriveRequest() {
    if (server.hasArg("cmd") && server.arg("cmd").length() > 0) {
        applyDriveCommandLetter(server.arg("cmd").charAt(0));
    } else {
        int v = server.hasArg("v") ? server.arg("v").toInt() : 0;
        int w = server.hasArg("w") ? server.arg("w").toInt() : 0;
        if (v == 0 && w == 0) {
            // Explicit stop (UI release / ■). Prefer stopVehicle over driveVehicle(0,0)
            // so FSM returns IDLE and LED clears instead of staying RUNNING.
            if (server.hasArg("command") && server.arg("command").length() > 0) {
                applyDriveCommandLetter(server.arg("command").charAt(0));
            } else {
                stopVehicle();
                lastPacketTime = millis();
                emergencyStopTriggered = false;
            }
        } else {
            driveVehicle(v, w);
        }
    }
    String json = "{\"status\":\"ok\",\"state\":\"";
    json += vehicleStateName();
    json += "\",\"v\":" + String(currentVelocity) + ",\"w\":" + String(currentAngular) + "}";
    sendText(200, "application/json", json);
}

void setupWebServer() {
    auto handleOptions = []() {
        applyCorsHeaders();
        server.send(204);
    };

    server.on("/", HTTP_GET, handleRoot);
    server.on("/api/status", HTTP_GET, handleStatus);
    server.on("/api/status", HTTP_OPTIONS, handleOptions);
    server.on("/api/info", HTTP_GET, handleInfo);
    server.on("/api/info", HTTP_OPTIONS, handleOptions);
    server.on("/api/drive", HTTP_GET, handleDriveRequest);
    server.on("/api/drive", HTTP_OPTIONS, handleOptions);
    // Curriculum HTTP labs (http-lifecycle / cors / fetch) — aliases
    server.on("/api/v1/status", HTTP_GET, handleStatus);
    server.on("/api/v1/status", HTTP_OPTIONS, handleOptions);
    server.on("/api/v1/command", HTTP_GET, handleDriveRequest);
    server.on("/api/v1/command", HTTP_POST, handleDriveRequest);
    server.on("/api/v1/command", HTTP_OPTIONS, handleOptions);
    server.on("/api/v1/car/status", HTTP_GET, handleStatus);
    server.on("/api/v1/car/drive", HTTP_GET, handleDriveRequest);
    server.on("/api/v1/car/drive", HTTP_OPTIONS, handleOptions);
    server.on("/update", HTTP_OPTIONS, handleOptions);
    server.on("/api/wifi/config", HTTP_OPTIONS, handleOptions);
    server.on("/api/wifi/clear", HTTP_OPTIONS, handleOptions);

    // Captive portal probes
    server.on("/generate_204", HTTP_GET, handleCaptiveProbe);
    server.on("/gen_204", HTTP_GET, handleCaptiveProbe);
    server.on("/hotspot-detect.html", HTTP_GET, handleCaptiveProbe);
    server.on("/library/test/success.html", HTTP_GET, handleCaptiveProbe);
    server.on("/ncsi.txt", HTTP_GET, handleCaptiveProbe);
    server.on("/connecttest.txt", HTTP_GET, handleCaptiveProbe);
    server.on("/redirect", HTTP_GET, handleCaptiveProbe);
    server.on("/canonical.html", HTTP_GET, handleCaptiveProbe);

    server.on("/api/wifi/config", HTTP_POST, []() {
        String ssid = server.arg("ssid");
        String pass = server.arg("pass");
        if (ssid.length() == 0) {
            sendText(400, "text/plain", "SSID required");
            return;
        }
        saveWifiCredentials(ssid, pass);
        String body = "<!DOCTYPE html><html><body style='font-family:sans-serif;background:#0f172a;color:#f8fafc;padding:2rem;'>";
        body += "<h2>WiFi saved</h2><p>Rebooting and switching to STA for <strong>" + htmlEscape(ssid) + "</strong>.</p>";
        body += "<p>1) Reconnect your phone/PC to your home WiFi.</p>";
        body += "<p>2) Open <a href='http://esp32-car.local' style='color:#38bdf8;'>http://esp32-car.local</a></p>";
        body += "<p>If STA fails, join SoftAP <strong>ESP32-Car-AP</strong> / <strong>vibe123456</strong> again.</p>";
        body += "</body></html>";
        sendText(200, "text/html", body);
        server.client().flush();
        delay(800);
        ESP.restart();
    });

    server.on("/api/wifi/clear", HTTP_POST, []() {
        clearWifiCredentials();
        String body = "<!DOCTYPE html><html><body style='font-family:sans-serif;background:#0f172a;color:#f8fafc;padding:2rem;'>";
        body += "<h2>WiFi cleared</h2><p>Rebooting into SoftAP <strong>ESP32-Car-AP</strong> / <strong>vibe123456</strong>.</p>";
        body += "<p>Then open <a href='http://192.168.4.1' style='color:#38bdf8;'>http://192.168.4.1</a></p>";
        body += "</body></html>";
        sendText(200, "text/html", body);
        server.client().flush();
        delay(800);
        ESP.restart();
    });

    server.on("/update", HTTP_POST, []() {
        applyCorsHeaders();
        server.sendHeader("Connection", "close");
        if (otaRejected || Update.hasError()) {
            String reason = otaValidationStatus.errorReason.length()
                ? otaValidationStatus.errorReason
                : String(Update.getError());
            sendText(500, "text/plain", "OTA Failed: " + reason);
        } else {
            sendText(200, "text/plain", "OTA OK. Restarting...");
            server.client().flush();
            delay(1200);
            ESP.restart();
        }
    }, []() {
        HTTPUpload& upload = server.upload();
        if (upload.status == UPLOAD_FILE_START) {
            Serial.printf("[OTA] Start: %s\n", upload.filename.c_str());
            otaValidationStatus.passed = false;
            otaValidationStatus.errorReason = "";
            otaValidationStatus.totalSize = 0;
            otaHeaderChecked = false;
            otaRejected = false;

            if (!Update.begin(UPDATE_SIZE_UNKNOWN)) {
                otaRejected = true;
                otaValidationStatus.errorReason = "Update.begin failed / partition unavailable";
                Serial.println("[OTA] Update.begin failed");
                return;
            }
        } else if (upload.status == UPLOAD_FILE_WRITE) {
            if (otaRejected) {
                return;
            }
            otaValidationStatus.totalSize += upload.currentSize;

            // First chunk always starts the image — validate magic + chip_id here.
            if (!otaHeaderChecked) {
                if (upload.currentSize < 13) {
                    otaRejected = true;
                    otaValidationStatus.errorReason = "First OTA chunk too small for header (<13 bytes)";
                    Update.abort();
                    return;
                }
                String errorMsg, chipName;
                if (!validateFirmwareHeader(upload.buf, upload.currentSize, errorMsg, chipName)) {
                    otaRejected = true;
                    otaValidationStatus.errorReason = errorMsg;
                    Serial.printf("[OTA] Header reject: %s\n", errorMsg.c_str());
                    Update.abort();
                    return;
                }
                otaHeaderChecked = true;
                otaValidationStatus.passed = true;
                otaValidationStatus.chipTarget = chipName;
                Serial.printf("[OTA] Header OK: %s\n", chipName.c_str());
            }

            if (otaValidationStatus.totalSize > MAX_FIRMWARE_SIZE_BYTES) {
                otaRejected = true;
                otaValidationStatus.errorReason = "Firmware exceeds 1.5MB soft limit";
                Serial.println("[OTA] Size reject");
                Update.abort();
                return;
            }

            if (Update.write(upload.buf, upload.currentSize) != upload.currentSize) {
                otaRejected = true;
                otaValidationStatus.errorReason = "Flash write failed";
                Serial.println("[OTA] Flash write failed");
            }
        } else if (upload.status == UPLOAD_FILE_END) {
            if (otaRejected) {
                Update.abort();
                return;
            }
            if (!otaHeaderChecked) {
                otaRejected = true;
                otaValidationStatus.errorReason = "OTA ended before header validation";
                Update.abort();
                return;
            }
            if (Update.end(true)) {
                Serial.printf("[OTA] Success, bytes=%u\n", upload.totalSize);
            } else {
                otaRejected = true;
                otaValidationStatus.errorReason = String("Finalize failed: ") + Update.getError();
                Serial.printf("[OTA] Finalize failed: %s\n", Update.getError());
            }
        }
    });

    server.onNotFound([]() {
        if (wifiRole == WIFI_ROLE_AP) {
            handleCaptiveProbe();
            return;
        }
        sendText(404, "text/plain", "Not found");
    });

    server.begin();
    Serial.println("[HTTP] Server on :80 (CORS enabled)");
}

void setupHardwarePins() {
    pinMode(MOTOR_LEFT_DIR, OUTPUT);
    pinMode(MOTOR_RIGHT_DIR, OUTPUT);
    pinMode(LED_INDICATOR, OUTPUT);
    pinMode(BOOT_BUTTON_PIN, INPUT_PULLUP);

    // Curriculum: explicit LEDC @ 20 kHz (not default analogWrite freq).
    ledcSetup(LEDC_CH_LEFT, MOTOR_PWM_FREQ_HZ, MOTOR_PWM_RES_BITS);
    ledcSetup(LEDC_CH_RIGHT, MOTOR_PWM_FREQ_HZ, MOTOR_PWM_RES_BITS);
    ledcAttachPin(MOTOR_LEFT_PWM, LEDC_CH_LEFT);
    ledcAttachPin(MOTOR_RIGHT_PWM, LEDC_CH_RIGHT);
    ledcWrite(LEDC_CH_LEFT, 0);
    ledcWrite(LEDC_CH_RIGHT, 0);
    stopVehicle();
}

void setupBle() {
    Serial.println("[NimBLE] Starting (deferred after SoftAP)...");
    Serial.flush();
    NimBLEDevice::init(BLE_DEVICE_NAME);
    NimBLEDevice::setPower(ESP_PWR_LVL_P9);

    NimBLEServer *pServer = NimBLEDevice::createServer();
    pServer->setCallbacks(new ServerCallbacks());

    NimBLEService *pService = pServer->createService(SERVICE_UUID);
    NimBLECharacteristic *pCharacteristic = pService->createCharacteristic(
        CHARACTERISTIC_UUID,
        NIMBLE_PROPERTY::READ | NIMBLE_PROPERTY::WRITE | NIMBLE_PROPERTY::NOTIFY
    );
    pCharacteristic->setCallbacks(new CommandCallbacks());
    pService->start();

    NimBLEService *pNordicService = pServer->createService("6e400001-b5a3-f393-e0a9-e50e24dcca9e");
    NimBLECharacteristic *pNordicRxChar = pNordicService->createCharacteristic(
        "6e400002-b5a3-f393-e0a9-e50e24dcca9e",
        NIMBLE_PROPERTY::WRITE | NIMBLE_PROPERTY::WRITE_NR
    );
    pNordicRxChar->setCallbacks(new CommandCallbacks());
    pNordicService->start();

    // Put Complete Local Name in ADV; keep only one 128-bit UUID so the name fits.
    // Nordic UUID goes in scan response so phones still filter/discover services.
    NimBLEAdvertising *pAdvertising = NimBLEDevice::getAdvertising();
    NimBLEAdvertisementData advData;
    advData.setFlags(ESP_BLE_ADV_FLAG_GEN_DISC | ESP_BLE_ADV_FLAG_BREDR_NOT_SPT);
    advData.setName(BLE_DEVICE_NAME);
    advData.setCompleteServices(NimBLEUUID(SERVICE_UUID));
    pAdvertising->setAdvertisementData(advData);

    NimBLEAdvertisementData scanData;
    scanData.setCompleteServices(NimBLEUUID("6e400001-b5a3-f393-e0a9-e50e24dcca9e"));
    pAdvertising->setScanResponseData(scanData);
    pAdvertising->setScanResponse(true);

    NimBLEDevice::startAdvertising();
    bleStarted = true;
    Serial.printf("[NimBLE] Advertising as %s\n", BLE_DEVICE_NAME);
    Serial.flush();
}

void maybeMarkOtaAppValid() {
    if (otaAppValidated) {
        return;
    }
    if (bootMs == 0 || millis() - bootMs < OTA_MARK_VALID_AFTER_MS) {
        return;
    }
    // Require HTTP surface up (AP or STA) before cancelling rollback.
    if (localIpStr.length() == 0 && wifiRole != WIFI_ROLE_AP) {
        return;
    }
    esp_ota_mark_app_valid_cancel_rollback();
    otaAppValidated = true;
    Serial.println("[OTA] App marked valid after stable boot — rollback cancelled");
    Serial.flush();
}

void setup() {
    // ESP32-C3 brownout threshold is high; WiFi start + motor/USB power often reboot-loops.
    WRITE_PERI_REG(RTC_CNTL_BROWN_OUT_REG, 0);

    Serial.begin(115200);
    delay(800);
    bootMs = millis();
    Serial.println("\n===========================================");
    Serial.printf("[ESP32-C3] Vehicle Firmware %s\n", FW_VERSION);
    Serial.println("===========================================");
    Serial.println("[HINT] SoftAP ESP32-Car-AP / vibe123456 (WPA2) on channel 6");
    Serial.println("[HINT] BLE starts 5s after WiFi so AP can be discovered first");
    Serial.println("[HINT] OTA rollback stays armed until ~20s stable boot");
    Serial.flush();

    // Do NOT mark OTA valid here — bad images that crash early must be allowed to roll back.

    setupHardwarePins();
    // Prevent instant watchdog fire (lastPacketTime was 0).
    lastPacketTime = millis();
    emergencyStopTriggered = false;

    checkBootFactoryResetOnStartup();
    initWifiApStaSwitching();
    setupWebServer();

    // Defer BLE: NimBLE+WiFi together at boot has crashed some C3 boards.
    bleStartAtMs = millis() + 5000;
    bleStarted = false;

    Serial.println("[BOOT] WiFi/HTTP ready. Waiting 5s before BLE...");
    Serial.flush();
}

void loop() {
    // Slow heartbeat in AP mode = firmware alive even if phone WiFi list is slow.
    if (wifiRole == WIFI_ROLE_AP && !emergencyStopTriggered) {
        if (millis() - lastWatchdogBlinkMs >= 500) {
            lastWatchdogBlinkMs = millis();
            digitalWrite(LED_INDICATOR, !digitalRead(LED_INDICATOR));
        }
    }

    if (!bleStarted && bleStartAtMs != 0 && (long)(millis() - bleStartAtMs) >= 0) {
        setupBle();
    }

    maybeMarkOtaAppValid();

    if (!emergencyStopTriggered && (millis() - lastPacketTime > WATCHDOG_TIMEOUT_MS)) {
        stopVehicle();
        emergencyStopTriggered = true;
        vehicleState = VEHICLE_FAULT;
        Serial.println("[EMERGENCY] Watchdog Timeout (>500ms)! Entering SAFETY_STOP.");
        Serial.println("[Motor] All PWM channels set to 0. Status LED FAST_BLINK.");
    }

    if (emergencyStopTriggered) {
        if (millis() - lastWatchdogBlinkMs >= 100) {
            lastWatchdogBlinkMs = millis();
            digitalWrite(LED_INDICATOR, !digitalRead(LED_INDICATOR));
        }
    }

    pollBootFactoryReset();
    maintainWifiRole();
    if (dnsRunning) {
        dnsServer.processNextRequest();
    }
    server.handleClient();
    delay(5);
}
