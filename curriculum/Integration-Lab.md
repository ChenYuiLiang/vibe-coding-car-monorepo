# 📱⚡ 雙端實機硬體連動實驗總攬 (Mobile ↔ ESP32 Integration Lab)

本實驗指南提供 **Car Starter (手機 Web 遙控端)** 與 **Car Basic (ESP32 實體開發板)** 的全流程硬體實機聯調與測試步驟。**擺脫單純的 Native 模擬，能在真實手機與 ESP32 板子上進行實作驗證。**

---

## 📡 一、 系統連線拓樸架構

系統支援兩大雙向實時通訊管道：

```
┌──────────────────────────────────────────────────────────┐
│                   手機 (Mobile Web UI)                    │
│      - HTML5 Canvas 搖桿 / Flexbox 十字鍵                 │
│      - Web Bluetooth API / Fetch API                     │
└────────────────────────────┬─────────────────────────────┘
                             │
            ┌────────────────┴────────────────┐
            ▼                                 ▼
   【管道 A】Wi-Fi AP/STA 模式          【管道 B】BLE GATT 服務
   - ESP32 建立熱點 (192.168.4.1)      - Service UUID: 4fafc201...
   - HTTP / AsyncWebSocket 控制         - Characteristic: beb5483e...
            │                                 │
            └────────────────┬────────────────┘
                             │
┌────────────────────────────▼─────────────────────────────┐
│                 ESP32 實體開發板 (Hardware)               │
│      - FreeRTOS 雙核任務處理 / FSM 狀態機                 │
│      - LEDC PWM 輸出 (GPIO 16, 17, 18, 19)              │
│      - 500ms 超時 Watchdog 斷線急停                        │
└────────────────────────────┬─────────────────────────────┘
                             │
                             ▼
              實體 L298N / TB6612 馬達驅動板 ➡️ 雙輪馬達
```

---

## 🛠️ 二、 手把手實機聯調作業 SOP

### 步驟 1：ESP32 韌體實機燒錄與硬體接線
1. 將 ESP32 板子透過 USB 線連接電腦。
2. 進入整合韌體目錄並執行 PlatformIO 燒錄：
   ```bash
   cd car-basic-wifi-ap-sta-kUUp1Pe8
   pio run -t upload
   ```
3. 啟動串口監控：
   ```bash
   pio device monitor --baud 115200
   ```
   確認出現以下日誌：
   ```
   [ESP32] System Booting...
   [ESP32] Wi-Fi AP Started: ESP32-Car-AP (IP: 192.168.4.1)
   [ESP32] BLE Advertising Started (Name: ESP32-Car)
   ```

### 步驟 2：手機端連線與控制頁面載入
- **Wi-Fi 模式**：
  1. 手機開啟 Wi-Fi，連接至 `ESP32-Car-AP`（預設密碼 `12345678`）。
  2. 手機瀏覽器開啟 `http://192.168.4.1`。
- **BLE 藍牙模式**：
  1. 手機開啟藍牙與 Chrome / Safari 瀏覽器。
  2. 開啟 `car-starter-ble-async-kUUp1Pe8` 頁面，點擊 **「藍牙搜尋並配對 ESP32」**。

### 步驟 3：雙端實機連動操控與邏輯驗證
1. 在手機螢幕上拖拉 **Canvas 虛擬搖桿**：
   - 搖桿往前推 ➡️ 手機發送 `v=100, w=0` ➡️ ESP32 串口顯示 `[Motor] Forward PWM: 255` ➡️ 雙輪馬達正轉。
   - 搖桿向右推 ➡️ 手機發送 `v=50, w=50` ➡️ ESP32 轉換為差速 $V_L=100, V_R=0$ ➡️ 車體右轉。
2. 放開手機搖桿：
   - 手機發送 `v=0, w=0` ➡️ 馬達立即煞車停止。

### 步驟 4：斷線防護與 Watchdog 安全急停測試
1. 手機主動關閉 Wi-Fi / 藍牙（模擬通訊訊號中斷）。
2. ESP32 端心跳定時器超過 500ms 未收到指令。
3. ESP32 串口監控器輸出急停日誌：
   ```
   [EMERGENCY] Watchdog Timeout (>500ms)! Entering SAFETY_STOP.
   [Motor] All PWM channels set to 0. Status LED FAST_BLINK.
   ```

---

## 📸 三、 實機驗收與報告截圖對照表

學員需將真實測試照片與截圖放入對應作業的 `assets/` 目錄中：

| 截圖檔案名稱 | 截圖內容要求 | 說明 |
| :--- | :--- | :--- |
| `assets/mobile-preview.png` | 真實手機畫面截圖 | 包含手機狀態列、瀏覽器網址 (`192.168.4.1`)、搖桿與按鈕 UI |
| `assets/hardware-setup.jpg` | 實體板接線照片 | ESP32 開發板、USB 線、馬達驅動板與電池實體拍攝照片 |
| `assets/serial-log.png` | 串口 Serial Monitor 畫面 | 顯示 ESP32 收到手機指令時的 PWM 與 Watchdog 日誌 |

---

## 💡 四、 常見實機踩坑與排查指引 (Troubleshooting)

1. **手機造訪 `192.168.4.1` 網頁顯示無法連線**：
   - **原因**：部分手機連上無網際網路的 Wi-Fi 時會自動切回行動數據。
   - **解法**：在手機 Wi-Fi 設定中，將「自動切換至行動數據」關閉。
2. **Web Bluetooth 搜尋不到 ESP32**：
   - **原因**：Web Bluetooth 規範強制要求 HTTPS 網站或 `localhost` / `127.0.0.1` 域名。
   - **解法**：實機測試時使用 Chrome 瀏覽器，並於 `chrome://flags/#enable-experimental-web-platform-features` 開啟實驗功能。
3. **ESP32 燒錄時出現 `A fatal error occurred: Failed to connect to ESP32`**：
   - **原因**：GPIO 0 (Strapping Pin) 被外接電路拉低，或未進 Boot 模式。
   - **解法**：燒錄時按住 ESP32 板上的 **BOOT** 按鈕直至開始寫入 Flash。
