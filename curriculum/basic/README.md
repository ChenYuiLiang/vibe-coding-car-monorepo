# ⚡ Car Basic 基礎系列：全套教材與實機測試指南 (Car Basic Curriculum Guide)

本教材指南包含 **Car Basic 基礎系列**（ESP32 嵌入式韌體與網絡通訊）全 30 個單元的核心知識點、PlatformIO C++ 程式碼解析、以及在 ESP32 實體開發板上的燒錄與串口實測 SOP。

> **命名說明：** 下方資料夾後綴 `<github-username>` 代表你的 GitHub 使用者名稱。GitHub Classroom accept 作業後，本機／遠端 repo 會變成 `單元名-你的帳號`（每人不同），不是固定字串。  
> **編號說明：** **B01–B30 維持 Classroom 主題編號**（暫不重編）。**建議修課／聯調順序 ≠ 由小到大硬走**，見下方與 [BASIC-NUMBERING.md](../BASIC-NUMBERING.md)。

### 產品地圖與驗收落點

| 層級 | 說明 |
|---|---|
| **Classroom 單元** | 多為獨立 sketch；`pio upload` 常會蓋掉艦隊韌體 |
| **艦隊韌體**（monorepo） | 產品整合：車載頁、HTTP drive、OTA、選用 BLE |
| **日常開車** | **Wi‑Fi HTTP**（`/api/drive`）— 對應建議序階段 3（B16–B19、B21）最直接 |
| **BLE** | 第二通道（B13–B15）；可對讀 Starter **S11–S13**；非預設遙控 |

**建議聯調一條線（產品優先）：**  
`B01–B03 → B07–B12 → B16–B19、B21 → B04–B05 → (B06) → (B13–B15) → (B20) → B22–B30`  
能開車：IO／PWM＋HTTP／Wi‑Fi 對上艦隊後即可；**不必先 BLE**。

---

## 📚 課程目錄與單元架構（Classroom 主題編號）

```
Car Basic 基礎系列 (30 個單元)
├── 1. basic-01-master-environment (ESP32 架構與 PlatformIO 環境)     ← 建議序①
│   ├── car-basic-platformio-setup-<github-username>
│   ├── car-basic-esp32-architecture-<github-username>
│   └── car-basic-drivers-ports-<github-username>
├── 2. basic-02-master-ota-architecture (OTA 無線燒錄與 Flash 分區) ← 建議序④（HTTP 可達後實測）
│   ├── car-basic-ota-principles-<github-username>
│   ├── car-basic-partition-table-<github-username>
│   └── car-basic-ota-security-<github-username>          ← 艦隊不納入 Auth 類；獨立 sketch
├── 3. basic-03-master-io-mapping (GPIO / ADC 與按鍵防彈跳)       ← 建議序②
│   ├── car-basic-pinout-<github-username>
│   ├── car-basic-adc-resolution-<github-username>
│   └── car-basic-pullup-debounce-<github-username>
├── 4. basic-04-master-pwm-control (PWM 調變與 H 橋驅動)          ← 建議序②
│   ├── car-basic-pwm-basics-<github-username>
│   ├── car-basic-ledc-syntax-<github-username>
│   └── car-basic-h-bridge-<github-username>
├── 5. basic-05-master-ble-gatt (ESP32 BLE GATT 伺服器)           ← 建議序⑤ 選用
│   ├── car-basic-advertising-connection-<github-username>
│   ├── car-basic-gatt-structure-<github-username>
│   └── car-basic-ble-properties-<github-username>
├── 6. basic-06-master-http-web (HTTP 協定與 API 介面)            ← 建議序③ 主通道
│   ├── car-basic-http-request-<github-username>
│   ├── car-basic-fetch-api-<github-username>
│   └── car-basic-cors-security-<github-username>
├── 7. basic-07-master-wifi-modes (Wi-Fi 模式與非同步 WebServer)  ← 建議序③；B20 獨立
│   ├── car-basic-wifi-ap-sta-<github-username>
│   ├── car-basic-async-webserver-<github-username>       ← 不進艦隊
│   └── car-basic-http-lifecycle-<github-username>
├── 8. basic-08-master-joystick-math (運動學與雙輪差速控制)       ← 建議序⑦
│   ├── car-basic-joystick-mapping-<github-username>
│   ├── car-basic-response-curves-<github-username>
│   └── car-basic-unicycle-model-<github-username>
├── 9. basic-09-master-multitasking (多任務與時間管理)            ← 建議序⑧
│   ├── car-basic-hardware-timer-<github-username>
│   ├── car-basic-millis-<github-username>
│   └── car-basic-sampling-rate-<github-username>
└── 10. basic-10-master-fsm (有限狀態機與系統穩定度)              ← 建議序⑨
    ├── car-basic-fsm-<github-username>
    ├── car-basic-state-consistency-<github-username>
    └── car-basic-ui-design-<github-username>
```

---

## ⚡ 主題解析與硬體核心技術

### 1. 開發環境與架構 (basic-01)
- **`car-basic-platformio-setup`**：配置 `platformio.ini` (`board = esp32dev`, `framework = arduino`, `monitor_speed = 115200`)。艦隊實車為 **ESP32-C3** 時以 monorepo `platformio.ini` 為準。
- **`car-basic-esp32-architecture`**：經典雙核／FreeRTOS 觀念；**C3 為單核**，勿假設艦隊映像有 `xTaskCreatePinnedToCore` 課內範例。

### 2. OTA 無線韌體更新 (basic-02)
- **`car-basic-ota-principles`**：雙 Boot 分區 (`ota_0`, `ota_1`) 實現不停機無線燒錄。
- **`car-basic-partition-table`**：自訂 `partitions.csv` 快閃記憶體分區表（配給 SPIFFS / NVS 空間）。
- **`car-basic-ota-security`**：安全實驗宜用**獨立 sketch**；艦隊為求教室可救回，不納入易鎖死的 Basic Auth／anti-downgrade 教學鎖。

### 3. I/O 與類比控制 (basic-03／04)
- **`car-basic-pinout`**：排查 Strapping Pins；艦隊馬達腳為 **GPIO 4/5/6/7**（非經典 16–19）。
- **`car-basic-pwm-basics` / `h-bridge`**：LEDC **20 kHz** PWM 驅動 L298N/TB6612。

### 4. BLE 藍牙廣播與 GATT (basic-05) — 選用
- 設定廣播名稱（艦隊為 `ESP32-Car`），GATT 接收寫入；對應 Starter **S11–S13**。日常開車不依賴本主題。

### 5. HTTP／Wi‑Fi（basic-06／07）— 產品主通道
- **`car-basic-http-request` / `fetch-api` / `cors-security`**：與車載 API／瀏覽器呼叫對讀。
- **`car-basic-wifi-ap-sta`**：SoftAP（如 `192.168.4.1`）與 STA 自癒；聯調優先測 SoftAP。
- **`car-basic-async-webserver`**：**不進艦隊**；同步 `WebServer` 已支撐車載頁。
- **`car-basic-http-lifecycle`**：請求生命週期與狀態碼觀念。

### 6. 運動學與雙輪差速 (basic-08)
- 將搖桿／指令過濾死區後，依據 Unicycle 模型轉換為左右輪速度：
  $$V_{\text{left}} = v + \omega, \quad V_{\text{right}} = v - \omega$$
- 觀念對應車頁 `v`／`w`；單元本身多為計算／獨立 sketch。

### 7. 多任務與定時器 (basic-09)
- `timerAttachInterrupt`、`millis()` 非阻塞 loop；對應艦隊 watchdog／取樣精神。

### 8. FSM 有限狀態機與 Watchdog (basic-10)
- 狀態機 `IDLE -> RUNNING -> FAULT`；心跳逾時急停（艦隊有對應實作）。

---

## 🔌 ESP32 實體硬體燒錄與串口測試 SOP

1. **實體板硬體連接**：
   - 使用 USB 線連接 ESP32 開發板與電腦。
   - 拍照記錄實體板與馬達驅動板接線，存至 `assets/hardware-setup.jpg`。
2. **PlatformIO 實機燒錄（單元作業）**：
   ```bash
   cd car-basic-wifi-ap-sta-<github-username>
   pio run -t upload
   ```
   > 上傳單元 sketch 後，若要回到產品車，需再 **OTA／USB 燒回** monorepo 艦隊映像。
3. **串口 Serial Monitor 觀察與驗收**：
   ```bash
   pio device monitor --baud 115200
   ```
   - 確認輸出日誌顯示例如 `[ESP32] Wi-Fi AP Started (IP: 192.168.4.1)`（依該單元而定）。
   - 截取串口日誌畫面存至 `assets/serial-log.png`，填寫 `submission.md` 並 commit。
4. **艦隊／產品聯調**（建議序階段 3 之後）：
   - SoftAP `http://192.168.4.1` 或 STA `http://<車IP>/` → 車載頁 ENGINE＋D-pad。  
   - 細節：[Integration-Lab.md](../Integration-Lab.md)、[FIRMWARE-PLAYBOOK.md](../../docs/FIRMWARE-PLAYBOOK.md)。
