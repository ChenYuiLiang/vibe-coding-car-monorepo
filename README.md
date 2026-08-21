# Vibe Coding Car Monorepo

課程用 **手機遙控器（Web）** + **ESP32-C3 車端韌體** + **共享通訊協定** + Integration Lab 說明。  
其他人可直接 clone，改遙控器或韌體後用 OTA／USB 燒到實車。

## 你能做什麼？

| 情境 | 可不可以只靠 clone + OTA？ |
|------|---------------------------|
| 車已能開網頁（STA IP 或 SoftAP `192.168.4.1`） | **可以** — 改遙控器／韌體後 OTA |
| 全新空板、或無 AP／無 STA／無 BLE | **不行** — 先用 USB 救援包燒一次，之後才能 OTA |

詳細多台 OTA：[`docs/OTA-FLEET-GUIDE.md`](docs/OTA-FLEET-GUIDE.md)  
USB／踩坑：[`docs/FIRMWARE-PLAYBOOK.md`](docs/FIRMWARE-PLAYBOOK.md)

## 先決條件

- **Node.js + npm**（遙控器、`npm run ota`）
- **PlatformIO CLI**（`pio`，只有改／建置韌體才需要）
- 電腦與車在**同一 WiFi**，或暫時連 `ESP32-Car-AP`（密碼 `vibe123456`）
- OTA 時用**數字 IP**；Mac 上 `esp32-car.local` 常失敗

## 目錄

```text
apps/web-controller/     # 手機／桌面遙控 UI（Web BLE + WiFi HTTP + OTA 上傳）
packages/protocol/       # 雙端共享 BLE／OTA 協定與封包編碼
firmware/esp32c3-vehicle/# ESP32-C3 PlatformIO 韌體（現行 1.3.1-recovery）
curriculum/              # Integration Lab、Car Starter／Basic 教材索引
docs/                    # Playbook、多台 OTA 指南、驗收截圖
scripts/ota_upload.mjs   # CLI OTA：OTA_HOST=<ip> npm run ota
firmware_esp32c3_vibe_car_slim.bin          # 正式 OTA 映像（勿改名亂傳別的 bin）
Vibe-Car-ESP32C3-USB-Flashing-Pack-1.0.0.zip # USB 救援包（含 boot_app0）
```

## 快速開始

```bash
git clone https://github.com/ChenYuiLiang/vibe-coding-car-monorepo.git
cd vibe-coding-car-monorepo
npm install

# 連線入口（開發機上的精簡頁：找車 IP → 跳轉車載遙控）
npm run dev
# 終端會印 Local / Network 網址；埠預設 5173（被佔會換號）
```

### 手機怎麼連到車？（clone 後照做）

**產品遙控頁在車上**，不是一直停在開發機 Vite 頁。

| 角色 | 說明 |
|------|------|
| 車載遙控／配網頁 | `http://<車IP>/`（韌體內建）← **日常用這個** |
| 開發機連線入口 | `npm run dev` 開的頁（例如 `http://<電腦區網IP>:5173/`）← **只負責找車、跳轉、進階 BLE／OTA** |

**IP 怎麼來（重要）**

| 模式 | 何時 | 網址 |
|------|------|------|
| SoftAP | 車開熱點 `ESP32-Car-AP` / `vibe123456` | 固定 **http://192.168.4.1** |
| STA | 車已加入某人家用／教室 Wi‑Fi | **DHCP 分配，每人／每台路由器都不同** |

STA 時查 IP 的方式：

1. 連線入口按 **「自動尋找車輛 IP」**（記憶上次成功 → SoftAP → `esp32-car.local` → 同網段掃描）  
2. 試 **http://esp32-car.local**（Mac 上常失敗，可改用數字 IP）  
3. 路由器後台「已連線裝置」  
4. 暫時連回 SoftAP，在配網頁看狀態／清 WiFi 後重配  

步驟細節：[`apps/web-controller/README.md`](apps/web-controller/README.md)  
整車聯調：[`curriculum/Integration-Lab.md`](curriculum/Integration-Lab.md)

### 韌體建置與 OTA（車必須已能開 HTTP）

```bash
cd firmware/esp32c3-vehicle
pio run -e esp32c3
cp -f .pio/build/esp32c3/firmware.bin ../../firmware_esp32c3_vibe_car_slim.bin
cd ../..

# 車需已在同一 WiFi（或 SoftAP）；用 STA IP，不要依賴 .local
OTA_HOST=192.168.1.178 npm run ota
```

網頁 OTA：開 `http://<車IP>/` → Choose File → **只選**根目錄 `firmware_esp32c3_vibe_car_slim.bin`。  
（不要選 OTA-0／OTA-1，也不要選 bootloader／`boot_app0`——那些是 USB 用。）

若板上還沒有任何可連的網頁：解壓 `Vibe-Car-ESP32C3-USB-Flashing-Pack-1.0.0.zip`，依包內說明／Playbook §2 燒錄（**必須含 `boot_app0 @ 0xe000`**）。

### SoftAP（未配網或 STA 失敗時）

| 項目 | 值 |
|------|-----|
| SSID | `ESP32-Car-AP` |
| 密碼 | `vibe123456` |
| 配網／OTA | http://192.168.4.1 |

STA 連上家用 WiFi 後熱點會關閉（正常）。

## 建議你改哪裡

| 目標 | 路徑 |
|------|------|
| 車載遙控頁（產品 UI） | `firmware/esp32c3-vehicle/src/main.cpp`（內嵌 HTML） |
| 連線入口／自動尋車／進階 BLE·OTA | `apps/web-controller/src/` |
| BLE 封包／OTA 標頭規則 | `packages/protocol/src/index.ts` |
| 車端 WiFi／BLE／馬達／HTTP API | `firmware/esp32c3-vehicle/src/main.cpp` |
| 課程驗收說明 | `curriculum/Integration-Lab.md` |

改完韌體記得 `pio run` 並更新根目錄 slim bin，再 OTA。

## 注意

- 正式 OTA **不要**選 `bootloader.bin`／`boot_app0.bin`；USB 救援才需要整包四檔。  
- OTA-0／OTA-1 是板子內部雙槽，網頁上不用選。  
- 本 repo **不含** Classroom 各單元獨立作業 repo；單元索引見 `curriculum/basic`、`curriculum/starter`。
