# Car Basic 修課／聯調序（B 編號暫不重編）

> **B01–B30 Classroom 編號維持不變**（主題塊：環境→OTA→IO→PWM→BLE→HTTP→Wi‑Fi→運動學→時間→FSM）。  
> 本文件定義 **建議學習／聯調順序** 與 **驗收落點**（單元 sketch vs 艦隊韌體）。  
> Starter 新碼見 [STARTER-NUMBERING.md](./STARTER-NUMBERING.md)。

## 產品地圖

| 層級 | 是什麼 | 怎麼驗 |
|---|---|---|
| **Classroom 單元** | 獨立 PlatformIO sketch／觀念作業 | `pio run -t upload` + Serial／截圖（常會蓋掉艦隊映像） |
| **艦隊韌體**（monorepo） | 整合後產品車 | 車載頁、`/api/*`、OTA、BLE 選用 |
| **選用 Lab** | BLE、AsyncWebServer、OTA Auth 等 | 獨立 sketch 或相容瀏覽器；非日常開車前置 |

**日常開車：** 車載 Wi‑Fi HTTP（`/api/drive`）。BLE 為第二通道。

## 建議修課／聯調順序（≠ B 編號由小到大硬走）

| 階段 | 單元 | 角色 | 主要驗收落點 |
|--|--|--|--|
| **1 環境** | B01→B02→B03 | 工具鏈／架構／驅動埠 | 單元 sketch／講義（B02 雙核敘事在 **C3 單核**上需註明差異） |
| **2 IO／馬達** | B07→B08→B09→B10→B11→B12 | 腳位、ADC、防彈跳、PWM、H 橋 | 單元上板；艦隊對照腳位 **GPIO 4/5/6/7**、20 kHz |
| **3 產品通道（主）** | B16→B17→B18→B19→B21 | HTTP／fetch／CORS／AP·STA／lifecycle | 觀念課＋**艦隊車頁／API**；B19 優先 SoftAP |
| **4 OTA** | B04→B05→（B06 選用） | 雙槽、分區、（安全實驗） | 艦隊 OTA 實測；**B06 Basic Auth 等不進艦隊**，用獨立 sketch |
| **5 通訊（副）** | B13→B14→B15 | BLE GATT | 選用；Chrome＋相容環境；可對讀 Starter **S11–S13** |
| **6 WebServer 變體** | B20 | AsyncWebServer | **不進艦隊**；獨立 sketch |
| **7 運動學** | B22→B23→B24 | 映射／曲線／unicycle | 單元計算／模擬；觀念對應車頁 `v`/`w` |
| **8 時間／取樣** | B25→B26→B27 | timer／millis／sampling | 單元 sketch；對應非阻塞 loop／watchdog 精神 |
| **9 FSM／穩定** | B28→B29→B30 | FSM、狀態一致、UI | 單元＋艦隊 IDLE／RUNNING／FAULT、急停 |

一條線（聯調優先）：

```text
B01–B03 → B07–B12 → B16–B19、B21 → B04–B05 → (B06) → (B13–B15) → (B20) → B22–B30
```

**能開車節點：** 階段 2＋3 對上艦隊後，即可用車載頁驗證；不必先完成 BLE（階段 5）。

## 艦隊韌體可對照 vs 必須獨立 sketch

| 可對照艦隊（Integration／車頁） | 刻意不進艦隊／宜獨立 sketch |
|---|---|
| SoftAP／STA、HTTP `/api/drive`·status、車載頁 | `ESPAsyncWebServer` 完整範例（B20） |
| BLE 名稱／UUID／`0xFF` 封包（選用） | OTA Basic Auth／anti-downgrade 教室鎖死風險（B06 類） |
| PWM 腳位 C3、LEDC、watchdog／FSM | 經典 ESP32 GPIO 16–19／雙核 pin 任務（與 C3 衝突） |
| OTA 雙槽＋官方 slim bin | 與產品無關的純模擬／不同板型腳位 |

詳見 [docs/FIRMWARE-PLAYBOOK.md](../docs/FIRMWARE-PLAYBOOK.md) §「刻意不進艦隊映像」。

## 與 Starter 對讀

| Basic | Starter（新碼） |
|---|---|
| B13–B15 BLE | S11–S13 |
| B16–B21 HTTP／Wi‑Fi | 車頁產品通道；Starter 無對等「燒韌體」單元 |
| B22–B24 運動學 | S14–S15 為前端搖桿 Lab；Basic 為車端映射 |

## 未改動

- Classroom **B01–B30 編號與 repo slug**  
- 若日後要像 Starter 全面重編號，另開遷移表即可
