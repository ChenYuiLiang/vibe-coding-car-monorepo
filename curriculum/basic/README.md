# ⚡ Car Basic 基礎系列：全套教材與實機測試指南 (Car Basic Curriculum Guide)

本教材指南包含 **Car Basic 基礎系列**（ESP32 嵌入式韌體與網絡通訊）全 30 個單元的核心知識點、PlatformIO C++ 程式碼解析、以及在 ESP32 實體開發板上的燒錄與串口實測 SOP。

---

## 📚 課程目錄與單元架構

```
Car Basic 基礎系列 (30 個單元)
├── 1. basic-01-master-environment (ESP32 架構與 PlatformIO 環境)
│   ├── car-basic-platformio-setup-kUUp1Pe8
│   ├── car-basic-esp32-architecture-kUUp1Pe8
│   └── car-basic-drivers-ports-kUUp1Pe8
├── 2. basic-02-master-ota-architecture (OTA 無線燒錄與 Flash 分區)
│   ├── car-basic-ota-principles-kUUp1Pe8
│   ├── car-basic-partition-table-kUUp1Pe8
│   └── car-basic-ota-security-kUUp1Pe8
├── 3. basic-03-master-io-mapping (GPIO / ADC 與按鍵防彈跳)
│   ├── car-basic-pinout-kUUp1Pe8
│   ├── car-basic-adc-resolution-kUUp1Pe8
│   └── car-basic-pullup-debounce-kUUp1Pe8
├── 4. basic-04-master-pwm-control (PWM 調變與 H 橋驅動)
│   ├── car-basic-pwm-basics-kUUp1Pe8
│   ├── car-basic-ledc-syntax-kUUp1Pe8
│   └── car-basic-h-bridge-kUUp1Pe8
├── 5. basic-05-master-ble-gatt (ESP32 BLE GATT 伺服器)
│   ├── car-basic-advertising-connection-kUUp1Pe8
│   ├── car-basic-gatt-structure-kUUp1Pe8
│   └── car-basic-ble-properties-kUUp1Pe8
├── 6. basic-06-master-http-web (HTTP 協定與 API 介面)
│   ├── car-basic-http-request-kUUp1Pe8
│   ├── car-basic-fetch-api-kUUp1Pe8
│   └── car-basic-cors-security-kUUp1Pe8
├── 7. basic-07-master-wifi-modes (Wi-Fi 模式與非同步 WebServer)
│   ├── car-basic-wifi-ap-sta-kUUp1Pe8
│   ├── car-basic-async-webserver-kUUp1Pe8
│   └── car-basic-http-lifecycle-kUUp1Pe8
├── 8. basic-08-master-joystick-math (運動學與雙輪差速控制)
│   ├── car-basic-joystick-mapping-kUUp1Pe8
│   ├── car-basic-response-curves-kUUp1Pe8
│   └── car-basic-unicycle-model-kUUp1Pe8
├── 9. basic-09-master-multitasking (多任務與時間管理)
│   ├── car-basic-hardware-timer-kUUp1Pe8
│   ├── car-basic-millis-kUUp1Pe8
│   └── car-basic-sampling-rate-kUUp1Pe8
└── 10. basic-10-master-fsm (有限狀態機與系統穩定度)
    ├── car-basic-fsm-kUUp1Pe8
    ├── car-basic-state-consistency-kUUp1Pe8
    └── car-basic-ui-design-kUUp1Pe8
```

---

## ⚡ 主題解析與硬體核心技術

### 1. 開發環境與架構 (basic-01)
- **`car-basic-platformio-setup`**：配置 `platformio.ini` (`board = esp32dev`, `framework = arduino`, `monitor_speed = 115200`)。
- **`car-basic-esp32-architecture`**：理解 PRO_CPU (Core 0) 與 APP_CPU (Core 1) 雙核架構與 FreeRTOS。

### 2. OTA 無線韌體更新 (basic-02)
- **`car-basic-ota-principles`**：雙 Boot 分區 (`ota_0`, `ota_1`) 實現不停機無線燒錄。
- **`car-basic-partition-table`**：自訂 `partitions.csv` 快閃記憶體分區表（配給 SPIFFS / NVS 空間）。

### 3. I/O 與類比控制 (basic-03)
- **`car-basic-pinout`**：排查 Strapping Pins (GPIO 0, 2, 12, 15) 防止開機失敗。
- **`car-basic-pwm-basics` / `h-bridge`**：使用 ESP32 LEDC 硬體通道輸出 20kHz PWM 驅動 L298N/TB6612 馬達控制板。

### 4. BLE 藍牙廣播與 GATT (basic-05)
- 設定 `BLEDevice::init("ESP32-Car")`，創建 `BLEService` 與 `BLECharacteristic` 接收寫入指令。

### 5. Wi-Fi AP/STA 與 Web Server (basic-07)
- **`car-basic-wifi-ap-sta`**：開啟 `WiFi.mode(WIFI_AP_STA)`，啟動獨立熱點 (`192.168.4.1`) 並支援斷線自動修復 (Self-healing)。

### 6. 運動學與雙輪差速 (basic-08)
- 將搖桿數值過濾死區後，依據 Unicycle 模型轉換為左右輪馬達轉速：
  $$V_{\text{left}} = v + \omega, \quad V_{\text{right}} = v - \omega$$

### 7. 多任務與定時器 (basic-09)
- 使用 `timerAttachInterrupt` 配置 1kHz 定時中斷；利用 `millis()` 建立非阻塞式控制 loop (50Hz)。

### 8. FSM 有限狀態機與 Watchdog (basic-10)
- 維護狀態機 `IDLE -> RUNNING -> FAULT`，當心跳包超過 500ms 超時未收到時自動進入急停狀態。

---

## 🔌 ESP32 實體硬體燒錄與串口測試 SOP

1. **實體板硬體連接**：
   - 使用 USB 線連接 ESP32 開發板與電腦。
   - 拍照記錄實體板與馬達驅動板接線，存至 `assets/hardware-setup.jpg`。
2. **PlatformIO 實機燒錄**：
   ```bash
   cd car-basic-wifi-ap-sta-kUUp1Pe8
   pio run -t upload
   ```
3. **串口 Serial Monitor 觀察與驗收**：
   ```bash
   pio device monitor --baud 115200
   ```
   - 確認輸出日誌顯示 `[ESP32] Wi-Fi AP Started (IP: 192.168.4.1)`。
   - 截取串口日誌畫面存至 `assets/serial-log.png`，填寫 `submission.md` 並 commit。
