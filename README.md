# Vibe Coding Car Monorepo

課程用 **手機遙控器（Web）** + **ESP32-C3 車端韌體** + **共享通訊協定** + Integration Lab 說明。  
其他人可直接 clone，改遙控器或韌體後用 OTA／USB 燒到實車。

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

# 遙控器
npm run dev
# 瀏覽器開 http://127.0.0.1:5173 （若埠被佔會換號，看終端輸出）

# 單元測試
npm run test
```

### 韌體建置與 OTA

```bash
cd firmware/esp32c3-vehicle
pio run -e esp32c3
cp -f .pio/build/esp32c3/firmware.bin ../../firmware_esp32c3_vibe_car_slim.bin
cd ../..

# 車需已在同一 WiFi（或 SoftAP）；用 STA IP，不要依賴 .local
OTA_HOST=192.168.1.178 npm run ota
```

網頁 OTA：開 `http://<車IP>/` → Choose File → **只選**根目錄 `firmware_esp32c3_vibe_car_slim.bin`。

多台車步驟：[`docs/OTA-FLEET-GUIDE.md`](docs/OTA-FLEET-GUIDE.md)  
救援／踩坑：[`docs/FIRMWARE-PLAYBOOK.md`](docs/FIRMWARE-PLAYBOOK.md)

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
| 遙控 UI／連線邏輯 | `apps/web-controller/src/` |
| BLE 封包／OTA 標頭規則 | `packages/protocol/src/index.ts` |
| 車端 WiFi／BLE／馬達／HTTP | `firmware/esp32c3-vehicle/src/main.cpp` |
| 課程驗收說明 | `curriculum/Integration-Lab.md` |

改完韌體記得 `pio run` 並更新根目錄 slim bin，再 OTA。

## 注意

- 正式 OTA **不要**選 `bootloader.bin`／`boot_app0.bin`；USB 救援才需要整包四檔。  
- OTA-0／OTA-1 是板子內部雙槽，網頁上不用選。  
- 本 repo **不含** Classroom 各單元獨立作業 repo；單元索引見 `curriculum/basic`、`curriculum/starter`。
