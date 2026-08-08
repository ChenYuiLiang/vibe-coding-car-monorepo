# 艦隊 OTA 操作指南（多台 ESP32-C3）

給助教／同學／其他開發者：**如何把正確韌體無線升級到每一台車**。  
技術細節與踩坑見 [`FIRMWARE-PLAYBOOK.md`](./FIRMWARE-PLAYBOOK.md)。

**現行正式版本字串：** `1.3.1-recovery`  
**唯一建議上傳檔：** 專案根目錄 `firmware_esp32c3_vibe_car_slim.bin`

---

## 0. 先搞清楚：你不用選 OTA-0 / OTA-1

| 你會聽到的名詞 | 實際意思 | 你要做什麼 |
|---|---|---|
| **OTA-0 / OTA-1**（`app0` / `app1`） | 板子 flash 裡兩個 App 槽 | **不用選**。系統自動寫「目前沒在跑」的那一槽 |
| **`firmware.bin`**（PlatformIO 建置輸出） | `firmware/esp32c3-vehicle/.pio/build/esp32c3/firmware.bin` | 開發建置用；正式 OTA 請用下方 slim 檔 |
| **`firmware_esp32c3_vibe_car_slim.bin`** | 根目錄正式艦隊映像（與剛建置的 `firmware.bin` 應為同一份複本） | **網頁 Choose File / CLI 都選這個** |

網頁上 **Choose File 只選一個 `.bin`**，不要找兩個槽、也不要選 USB 包裡的 `bootloader.bin` / `boot_app0.bin`（那些是 USB 救援用）。

---

## 1. 升級前檢查清單（每一台都要）

1. 車有電，且與操作電腦／手機在**同一 WiFi**（家用 SSID，例如 `chen`），或暫時連車的 SoftAP。  
2. 能打開車的網頁之一：
   - STA：`http://<車的IP>/`（例：`http://192.168.1.178/`）  
   - SoftAP：連 `ESP32-Car-AP`（密碼 `vibe123456`）→ `http://192.168.4.1/`  
3. 確認上傳檔存在且正確：

```bash
cd ~/Documents/Vibe-Coding-Classroom/vibe-coding-car-monorepo   # 依你的 clone 路徑調整
ls -lh firmware_esp32c3_vibe_car_slim.bin
python3 - <<'PY'
from pathlib import Path
b = Path('firmware_esp32c3_vibe_car_slim.bin').read_bytes()
assert b[0] == 0xE9, 'Magic 必須是 0xE9'
assert b[12] == 0x05, 'Chip ID 必須是 ESP32-C3 (0x05)'
assert len(b) < 1_572_864, '超過 1.5MB soft limit'
print('OK', len(b), 'bytes — 可 OTA')
PY
```

4. **不要**上傳：Join-Test、AP-DIAG、殘缺檔、別專案的 ESP32（非 C3）bin。

---

## 2. 怎麼找到每一台車的 IP

多台車常共用同一個 BLE／熱點名稱，**不能靠名稱區分**，要用 IP：

1. 路由器後台 → 已連線裝置／DHCP 列表 → 找新出現或不認識的裝置。  
2. 或開車網頁看 `Mode: STA — ... (192.168.x.x)`。  
3. 探測（把網段改成你家的）：

```bash
# 例：掃 192.168.1.100–190，找有 /api/status 的
for i in $(seq 100 190); do
  out=$(curl -sS -m 1 "http://192.168.1.$i/api/status" 2>/dev/null || true)
  if [ -n "$out" ]; then echo "192.168.1.$i  $out"; fi
done
```

4. Mac 上 `esp32-car.local` **常常失敗** → 一律用數字 IP。  
5. STA 正常時 **看不到** SoftAP `ESP32-Car-AP`（正常）。連不到家用網時才會再出現熱點。

建議做一張表：

| 車號／座位 | STA IP | OTA 前 fw | OTA 後 fw | 備註 |
|---|---|---|---|---|
| 1 | 192.168.1.178 | 1.3.0-curriculum | 1.3.1-recovery | |
| 2 | | | | |

---

## 3. 方式 A — 網頁 OTA（適合單台／現場手機）

1. 瀏覽器開該車：`http://<IP>/`（或 SoftAP 時的 `http://192.168.4.1/`）。  
2. 確認頁面有版本字串（例：`Firmware 1.3.1-recovery`）與 **OTA Update**。  
3. **Choose File** → 選根目錄  
   `firmware_esp32c3_vibe_car_slim.bin`  
4. 按 **Upload OTA**，等待完成（可能顯示成功後裝置重開；連線短暫中斷正常）。  
5. 等約 **15–20 秒**，重新整理同一 IP（若 IP 變了，回路由器重查）。  
6. 驗收：
   - 頁面／`http://<IP>/api/status` 的 `"fw"` 為目標版本  
   - `"bleStarted": true`（約開機 5 秒後）  
   - 可選：nRF Connect 掃到 `ESP32-Car`

---

## 4. 方式 B — 電腦 CLI（適合一次升級多台）

在 monorepo 根目錄：

```bash
cd ~/Documents/Vibe-Coding-Classroom/vibe-coding-car-monorepo

# 一台一台指定 IP（強烈建議）
OTA_HOST=192.168.1.178 npm run ota
OTA_HOST=192.168.1.183 npm run ota
# …
```

腳本會上傳根目錄 `firmware_esp32c3_vibe_car_slim.bin` 到 `http://<OTA_HOST>/update`。

每台成功後：

```bash
curl -sS "http://192.168.1.178/api/status"
# 應看到 "fw":"1.3.1-recovery" （或你剛建置的版本）
```

可選：把多台 IP 寫成迴圈：

```bash
for ip in 192.168.1.178 192.168.1.183 192.168.1.190; do
  echo "==== OTA $ip ===="
  OTA_HOST=$ip npm run ota || echo "FAILED $ip"
  sleep 15
  curl -sS -m 5 "http://$ip/api/status" || echo "probe failed $ip"
  echo
done
```

---

## 5. 開發者：改過程式後如何更新 slim 檔

其他人若只負責「燒到車上」，用現成的 `firmware_esp32c3_vibe_car_slim.bin` 即可。  
若你改了韌體源碼，必須先重建再 OTA：

```bash
cd firmware/esp32c3-vehicle
pio run -e esp32c3
cp -f .pio/build/esp32c3/firmware.bin ../../firmware_esp32c3_vibe_car_slim.bin
cd ../..
# 再對各車 OTA_HOST=... npm run ota
```

此時根目錄 slim 與 `.pio/.../firmware.bin` 應為同一內容；**對外仍請統一叫人選 slim 檔名**，避免路徑搞混。

---

## 6. 失敗時怎麼辦（簡表）

| 現象 | 處理 |
|---|---|
| 網頁／CLI 連不上 IP | 確認同一 WiFi；路由器找新 IP；或掃 SoftAP `ESP32-Car-AP` / `vibe123456` → `192.168.4.1` |
| Choose File 後失敗／無反應 | 確認選的是 slim bin、Magic `0xE9`、Chip `0x05`；檔案別太大 |
| OTA 後完全無 AP／無 STA／無 BLE | 等 20s；仍無 → USB 救援包（須含 `boot_app0 @ 0xe000`），見 Playbook §2 |
| 誤 OTA 錯檔把車弄掛 | `1.3.1-recovery` 起：開機約 20s 內反覆 crash 才較可能自動 rollback；否則 USB |
| 只想清 WiFi 回熱點 | 網頁 **Clear WiFi**；或 BOOT 長按；或 BLE `[0xAA,0xF1,0xA5,cs]`（不必拆殼若 BLE 還在） |

**不要承諾「永遠不用 USB」**——只有板子還有 HTTP（AP 或 STA）時，才能繼續純 OTA。

---

## 7. 單台最短口訣（可貼牆上）

1. 找到車的 **STA IP**（或連 SoftAP → `192.168.4.1`）  
2. 上傳 **`firmware_esp32c3_vibe_car_slim.bin`**（不要選 bootloader／boot_app0）  
3. 等重開 → 查 `"fw"` 版本  
4. STA 正常時 **看不到 SoftAP** 是正常的  
5. 下一台換下一個 IP，重複

完整救援與硬體規則：[`FIRMWARE-PLAYBOOK.md`](./FIRMWARE-PLAYBOOK.md)。  
實機畫面參考：[`FIRMWARE-PLAYBOOK.md` §7.0](./FIRMWARE-PLAYBOOK.md) 與 `docs/assets/verify-*.png`。
