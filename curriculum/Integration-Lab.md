# 📱⚡ 雙端實機硬體連動實驗總攬 (Mobile ↔ ESP32 Integration Lab)

本實驗指南提供 **Car Starter (手機 Web 遙控端)** 與 **Car Basic (ESP32 實體開發板)** 的全流程硬體實機聯調與測試步驟。**擺脫單純的 Native 模擬，能在真實手機與 ESP32 板子上進行實作驗證。**

> **Monorepo（`vibe-coding-car-monorepo` / ESP32-C3）現行規格（FW ≥ 1.3.0-curriculum）**
> - SoftAP：`ESP32-Car-AP` / 密碼 **`vibe123456`**（iPhone 無法穩定加入開放熱點），配網頁 `http://192.168.4.1`
> - 模式：AP ↔ STA **切換**（STA 健康時關閉 AP；斷線／失敗退回 SoftAP）
> - Factory reset：長按 **BOOT**（開機 3s／運行 5s）清 WiFi NVS。**RESET 只重開，不會恢復出廠**
> - BLE 名稱：`ESP32-Car`；封包：`[0xFF, v+128, w+128, checksum]`（另支援簡易 `0xAA` opcode）
> - 馬達腳位（C3）：PWM/DIR = GPIO **4/5/6/7**；LEDC **20 kHz**；FSM IDLE/RUNNING/FAULT
> - HTTP：`/api/*` + curriculum 別名 `/api/v1/*`、`/api/info`
> - OTA：只上傳根目錄 `firmware_esp32c3_vibe_car_slim.bin`；Mac 建議 `OTA_HOST=<STA_IP> npm run ota`
> - USB 救援：必須含 **`boot_app0 @ 0xe000`**
> - **完整手冊**：[docs/FIRMWARE-PLAYBOOK.md](../docs/FIRMWARE-PLAYBOOK.md)
> - **Clone 後手機怎麼連車／找 STA IP**：[apps/web-controller/README.md](../apps/web-controller/README.md)（連線入口）＋ 根目錄 [README.md](../README.md)「手機怎麼連到車」

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
   - SoftAP 192.168.4.1（開放熱點）   - Service UUID: 4fafc201...
   - HTTP 控制 + Web OTA               - Characteristic: beb5483e...
            │                                 │
            └────────────────┬────────────────┘
                             │
┌────────────────────────────▼─────────────────────────────┐
│            ESP32-C3 實體車 (vibe-coding-car-monorepo)      │
│      - AP↔STA 自癒切換 / BOOT Factory Reset               │
│      - analogWrite 馬達 (GPIO 4, 5, 6, 7)                 │
│      - 500ms Watchdog 斷線急停                             │
└────────────────────────────┬─────────────────────────────┘
                             │
                             ▼
              實體 L298N / TB6612 馬達驅動板 ➡️ 雙輪馬達
```

---

## 🛠️ 二、 手把手實機聯調作業 SOP

### 步驟 1：ESP32 韌體實機燒錄與硬體接線
1. 將 ESP32-C3 透過 USB（或 hub／借電腦）連接。
2. Monorepo 路徑：
   ```bash
   cd vibe-coding-car-monorepo/firmware/esp32c3-vehicle
   pio run -t upload
   # 或解壓 Vibe-Car-ESP32C3-USB-Flashing-Pack-1.0.0.zip 後執行 flash_mac.sh / flash_win.bat
   ```
3. 啟動串口監控：
   ```bash
   pio device monitor --baud 115200
   ```
   確認出現類似日誌：
   ```
   [ESP32-C3] Vehicle Firmware 1.2.0-curriculum
   [WiFi AP] SSID=ESP32-Car-AP (OPEN) IP=192.168.4.1
   [NimBLE] Advertising as ESP32-Car
   ```

### 步驟 2：手機端連線與控制頁面載入
- **Wi-Fi 模式**：
  1. 手機連接 `ESP32-Car-AP`（**免密碼**）。
  2. 瀏覽器開啟 `http://192.168.4.1`（應看到配網表單 + OTA）。
  3. （可選）填入家用 SSID／密碼切換 STA；之後用 `http://esp32-car.local`。
- **BLE 藍牙模式**：
  1. 桌面／Android Chrome 開啟 monorepo `npm run dev` → `http://127.0.0.1:5173`。
  2. 選藍牙模式，勾「廣域搜尋」，連線至 `ESP32-Car`。

### 步驟 3：雙端實機連動操控與邏輯驗證
1. 在遙控盤按住方向鍵：
   - 前進 ➡️ BLE 送出 `[0xFF, 0xE4, 0x80, …]`（v=100,w=0）或 WiFi `/api/drive?v=100&w=0`。
2. **鬆開按鍵**應送出停止（v=0,w=0）；超過 500ms 無指令則 Watchdog 急停。

### 步驟 4：斷線防護與 Watchdog 安全急停測試
1. 手機主動關閉 Wi-Fi / 藍牙（模擬通訊訊號中斷）。
2. ESP32 端心跳定時器超過 500ms 未收到指令。
3. 串口應出現：
   ```
   [EMERGENCY] Watchdog Timeout (>500ms)! Entering SAFETY_STOP.
   [Motor] All PWM channels set to 0. Status LED FAST_BLINK.
   ```

### 步驟 5：Factory Reset（勿與 RESET 搞混）
| 按鍵 | 作用 |
|------|------|
| **RESET** | 只重開，**保留** WiFi NVS |
| **BOOT 開機按住 3 秒** | 清除 WiFi → 開放 AP |
| **BOOT 運行中長按 5 秒** | 同上 |
| 網頁 Clear WiFi | 同上 |

---

## 📸 三、 實機驗收與報告截圖對照表

學員需將真實測試照片與截圖放入對應作業的 `assets/` 目錄中：

| 截圖檔案名稱 | 截圖內容要求 | 說明 |
| :--- | :--- | :--- |
| `assets/mobile-preview.png` | 真實手機畫面截圖 | 包含手機狀態列、瀏覽器網址 (`192.168.4.1` 或 STA IP)、搖桿／方向鍵 UI |
| `assets/hardware-setup.jpg` | 實體板接線照片 | ESP32 開發板、USB 線、馬達驅動板與電池實體拍攝照片 |
| `assets/serial-log.png` | 串口 Serial Monitor 畫面 | 顯示 ESP32 收到手機指令時的 PWM 與 Watchdog 日誌 |

**艦隊參考圖（助教／驗收對照，非學員繳交檔）：** 見 [`docs/FIRMWARE-PLAYBOOK.md` §7.0](../docs/FIRMWARE-PLAYBOOK.md) 與 `docs/assets/verify-*.png`（Web Controller WiFi／BLE、車端 `1.3.1-recovery` Drive 頁）。

**多台車 OTA 步驟：** 見 [`docs/OTA-FLEET-GUIDE.md`](../docs/OTA-FLEET-GUIDE.md)（選哪個 bin、如何找 IP、網頁／CLI、失敗處理）。

---

## 💡 四、 常見實機踩坑與排查指引 (Troubleshooting)

1. **手機造訪 `192.168.4.1` 網頁顯示無法連線**：
   - **原因**：部分手機連上無網際網路的 Wi-Fi 時會自動切回行動數據。
   - **解法**：在手機 Wi-Fi 設定中，將「自動切換至行動數據」關閉。
2. **連 AP 一直要密碼／連得上但沒有配網頁**：
   - **原因**：舊文件寫 `vibe123456`／`12345678`；現行 SoftAP 為**開放熱點**。或韌體過舊／損壞。
   - **解法**：選「無密碼」加入；Chrome 手動開 `http://192.168.4.1`。仍無 AP → USB 救援包 `erase-flash`。
3. **按 RESET 無法恢復出廠／AP 消失**：
   - **原因**：RESET 不清 NVS；壞 STA 密碼會讓舊韌體關 AP。
   - **解法**：FW ≥ 1.2.0 用 **BOOT 長按** factory reset；完全離線只能 USB。
4. **Web Bluetooth 搜尋不到 ESP32**：
   - **原因**：需 HTTPS 或 `localhost`；iPhone Safari 不支援 Web Bluetooth。
   - **解法**：桌面／Android Chrome + `http://127.0.0.1:5173`。
5. **ESP32 燒錄時出現 `Failed to connect`**：
   - **解法**：按住 **BOOT** 再開始燒錄；確認為資料線。
