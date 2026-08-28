# Car Starter / Car Basic 重測計畫（含 GitHub 連結）

> 依 README 逐單元測；有問題再改程式。  
> 連結為本機 `origin` 對應的 Classroom repo（後綴 `kUUp1Pe8`）。  
> 實測後把「結果」改成 `PASS` / `FAIL` / `BLOCKED`。  
> **Starter 編號已改為修課序**（見 [STARTER-NUMBERING.md](./STARTER-NUMBERING.md)）；表內「舊碼」僅遷移用。

**測法摘要**
- **Starter：** 開 repo → 讀 README → `python3 -m http.server … --bind 0.0.0.0` → 手機同網預覽 → 截圖／submission  
- **Basic：** 開 repo → 讀 README → `pio run -t upload` + Serial → 截圖／submission  
- **修課／聯調：** 依下方 **新碼 S01→S15**；產品主線 A–C 後即可車頁 Wi‑Fi；BLE／Canvas 為 Lab。見 [starter/README.md](./starter/README.md)。

---

## 建議修課／重測順序（Starter＝新碼）

| 階段 | 新碼 | 角色 | 結果 |
|--|--|--|--|
| A 殼 | S01→S02→S03 | 產品主線（車頁 UI／HUD） | PASS |
| B 手感 | S04→S05→S06→S07 | 產品主線（觸控／按住送停） | PASS |
| C 狀態 | S08→S09 | 產品主線（ENGINE／flow／failsafe） | PASS |
| D 對照 | S10 | JSON 對照（車頁 `?v=&w=`） | PASS |
| E BLE Lab | S11→S12→S13 | 選用通道 | PASS |
| F 搖桿 Lab | S14→S15 | 延伸（車頁無 Canvas 搖桿） | PASS |

**聯調驗收（能開車）：** SoftAP `http://192.168.4.1` 或 STA `http://<車IP>/` → ENGINE START → D-pad。BLE 不列入日常必測。

---

## Car Starter（15）— 依新碼順序

| 新碼 | 舊碼 | 作業 | 階段 | GitHub | 結果 |
|--|--|--|--|--|--|
| S01 | S01 | html5-basics | A | https://github.com/vibe-coding-classroom/car-starter-html5-basics-kUUp1Pe8 | PASS |
| S02 | S02 | flexbox-layout | A | https://github.com/vibe-coding-classroom/car-starter-flexbox-layout-kUUp1Pe8 | PASS |
| S03 | S03 | ui-ux-standards | A | https://github.com/vibe-coding-classroom/car-starter-ui-ux-standards-kUUp1Pe8 | PASS |
| S04 | S10 | touch-basics | B | https://github.com/vibe-coding-classroom/car-starter-touch-basics-kUUp1Pe8 | PASS |
| S05 | S11 | touch-vs-mouse | B | https://github.com/vibe-coding-classroom/car-starter-touch-vs-mouse-kUUp1Pe8 | PASS |
| S06 | S12 | prevent-default | B | https://github.com/vibe-coding-classroom/car-starter-prevent-default-kUUp1Pe8 | PASS |
| S07 | S13 | long-press | B | https://github.com/vibe-coding-classroom/car-starter-long-press-kUUp1Pe8 | PASS |
| S08 | S07 | control-panel | C | https://github.com/vibe-coding-classroom/car-starter-control-panel-kUUp1Pe8 | PASS |
| S09 | S09 | flow-logic | C | https://github.com/vibe-coding-classroom/car-starter-flow-logic-kUUp1Pe8 | PASS |
| S10 | S08 | data-json | D | https://github.com/vibe-coding-classroom/car-starter-data-json-kUUp1Pe8 | PASS |
| S11 | S04 | ble-async | E | https://github.com/vibe-coding-classroom/car-starter-ble-async-kUUp1Pe8 | PASS |
| S12 | S05 | ble-security | E | https://github.com/vibe-coding-classroom/car-starter-ble-security-kUUp1Pe8 | PASS |
| S13 | S06 | typed-arrays | E | https://github.com/vibe-coding-classroom/car-starter-typed-arrays-kUUp1Pe8 | PASS |
| S14 | S14 | canvas-joystick | F | https://github.com/vibe-coding-classroom/car-starter-canvas-joystick-kUUp1Pe8 | PASS |
| S15 | S15 | joystick-math | F | https://github.com/vibe-coding-classroom/car-starter-joystick-math-kUUp1Pe8 | PASS |

**車頁對齊筆記**  
Classroom 與車頁分開驗收。現行車頁（FW `1.4.3-s10lock`）：A／B／C 精神（UI、觸控鎖、ENGINE、連發、失焦 failsafe）；開車 `GET /api/drive?v=&w=`。**S10／S11–S13／S14–S15** 不要求作業 UI＝車頁。

---

## Car Basic（30）

> **B 編號不重編。** 建議修課／聯調序與「單元 sketch vs 艦隊」見 [BASIC-NUMBERING.md](./BASIC-NUMBERING.md)、[basic/README.md](./basic/README.md)。

**建議聯調一條線：** `B01–B03 → B07–B12 → B16–B19、B21 → B04–B05 → (B06) → (B13–B15) → (B20) → B22–B30`  
**通道：** 日常開車＝Wi‑Fi HTTP（B16–21 主）；BLE（B13–15）選用。  
**注意：** 多數單元 `pio upload` 會蓋艦隊韌體；測完需 OTA／USB 燒回產品映像才能繼續開車頁。

**艦隊韌體可測項（2026-08-25，FW `1.4.3-s10lock` @ `192.168.1.178`）：** 自動探針 **22/22 PASS** — status/info、腳位 4–7、PWM 20 kHz、BLE 名稱／UUID、CORS OPTIONS、車頁 HTML、`/api/drive` FSM IDLE⇄RUNNING、`/api/v1/*` 別名、OTA `otaAppValidated`、STA 健康時 AP 關閉（設計行為）。`GET /update` 404 屬正常（僅 POST；表單在車頁）。**未改韌體**（無缺口）。下列單元仍須獨立 sketch／無法單靠艦隊：B01–B03 觀念、B05 分區實驗、B06 Auth、B08–B09 ADC／debounce 專練、B20 Async、B22–B27 計算／timer 專練、B29–B30 部分。

| 序 | 作業 | 建議階段 | 驗收落點 | GitHub | 結果 |
|--|--|--|--|--|--|
| B01 | platformio-setup | ①環境 | 單元 | https://github.com/vibe-coding-classroom/car-basic-platformio-setup-kUUp1Pe8 | |
| B02 | esp32-architecture | ①環境 | 單元（C3≠雙核） | https://github.com/vibe-coding-classroom/car-basic-esp32-architecture-kUUp1Pe8 | |
| B03 | drivers-ports | ①環境 | 單元 | https://github.com/vibe-coding-classroom/car-basic-drivers-ports-kUUp1Pe8 | |
| B04 | ota-principles | ④OTA | 單元＋艦隊 OTA | https://github.com/vibe-coding-classroom/car-basic-ota-principles-kUUp1Pe8 | PASS* |
| B05 | partition-table | ④OTA | 單元 | https://github.com/vibe-coding-classroom/car-basic-partition-table-kUUp1Pe8 | |
| B06 | ota-security | ④選用 | 獨立 sketch | https://github.com/vibe-coding-classroom/car-basic-ota-security-kUUp1Pe8 | N/A fleet |
| B07 | pinout | ②IO | 單元；艦隊腳 4–7 | https://github.com/vibe-coding-classroom/car-basic-pinout-kUUp1Pe8 | PASS* |
| B08 | adc-resolution | ②IO | 單元 | https://github.com/vibe-coding-classroom/car-basic-adc-resolution-kUUp1Pe8 | |
| B09 | pullup-debounce | ②IO | 單元 | https://github.com/vibe-coding-classroom/car-basic-pullup-debounce-kUUp1Pe8 | |
| B10 | pwm-basics | ②馬達 | 單元／艦隊對照 | https://github.com/vibe-coding-classroom/car-basic-pwm-basics-kUUp1Pe8 | PASS* |
| B11 | ledc-syntax | ②馬達 | 單元／艦隊對照 | https://github.com/vibe-coding-classroom/car-basic-ledc-syntax-kUUp1Pe8 | PASS* |
| B12 | h-bridge | ②馬達 | 單元（先開馬達電） | https://github.com/vibe-coding-classroom/car-basic-h-bridge-kUUp1Pe8 | PASS* |
| B13 | advertising-connection | ⑤BLE 選用 | 單元／艦隊選用 | https://github.com/vibe-coding-classroom/car-basic-advertising-connection-kUUp1Pe8 | PASS* |
| B14 | gatt-structure | ⑤BLE 選用 | 單元／艦隊選用 | https://github.com/vibe-coding-classroom/car-basic-gatt-structure-kUUp1Pe8 | PASS* |
| B15 | ble-properties | ⑤BLE 選用 | 單元／艦隊選用 | https://github.com/vibe-coding-classroom/car-basic-ble-properties-kUUp1Pe8 | PASS* |
| B16 | http-request | ③Wi‑Fi 主 | 單元＋艦隊 API | https://github.com/vibe-coding-classroom/car-basic-http-request-kUUp1Pe8 | PASS* |
| B17 | fetch-api | ③Wi‑Fi 主 | 單元＋車頁 fetch | https://github.com/vibe-coding-classroom/car-basic-fetch-api-kUUp1Pe8 | PASS* |
| B18 | cors-security | ③Wi‑Fi 主 | 單元 | https://github.com/vibe-coding-classroom/car-basic-cors-security-kUUp1Pe8 | PASS* |
| B19 | wifi-ap-sta | ③Wi‑Fi 主 | 單元＋艦隊 SoftAP | https://github.com/vibe-coding-classroom/car-basic-wifi-ap-sta-kUUp1Pe8 | PASS* |
| B20 | async-webserver | ⑥變體 | 獨立 sketch | https://github.com/vibe-coding-classroom/car-basic-async-webserver-kUUp1Pe8 | N/A fleet |
| B21 | http-lifecycle | ③Wi‑Fi 主 | 單元 | https://github.com/vibe-coding-classroom/car-basic-http-lifecycle-kUUp1Pe8 | PASS* |
| B22 | joystick-mapping | ⑦運動學 | 單元 | https://github.com/vibe-coding-classroom/car-basic-joystick-mapping-kUUp1Pe8 | |
| B23 | response-curves | ⑦運動學 | 單元 | https://github.com/vibe-coding-classroom/car-basic-response-curves-kUUp1Pe8 | |
| B24 | unicycle-model | ⑦運動學 | 單元；對照 v/w | https://github.com/vibe-coding-classroom/car-basic-unicycle-model-kUUp1Pe8 | PASS* |
| B25 | hardware-timer | ⑧時間 | 單元 | https://github.com/vibe-coding-classroom/car-basic-hardware-timer-kUUp1Pe8 | |
| B26 | millis | ⑧時間 | 單元 | https://github.com/vibe-coding-classroom/car-basic-millis-kUUp1Pe8 | |
| B27 | sampling-rate | ⑧時間 | 單元 | https://github.com/vibe-coding-classroom/car-basic-sampling-rate-kUUp1Pe8 | |
| B28 | fsm | ⑨FSM | 單元＋艦隊 | https://github.com/vibe-coding-classroom/car-basic-fsm-kUUp1Pe8 | PASS* |
| B29 | state-consistency | ⑨FSM | 單元 | https://github.com/vibe-coding-classroom/car-basic-state-consistency-kUUp1Pe8 | |
| B30 | ui-design | ⑨UI | 單元＋車頁 | https://github.com/vibe-coding-classroom/car-basic-ui-design-kUUp1Pe8 | PASS* |

\* = 艦隊 API／狀態／車頁對照通過（非整份 Classroom README 重做）。B24 僅確認 drive 使用 `v`/`w` 語意。B12 為腳位／PWM 對照，未做長時間實車拖載。

---

## 使用方式

1. **Starter：** 依 **新碼 S01→S15**（修課序）。查舊碼用 [STARTER-NUMBERING.md](./STARTER-NUMBERING.md)。  
2. **Basic：** 依 [BASIC-NUMBERING.md](./BASIC-NUMBERING.md) 建議序（B 編號不重編）。  
3. 開 GitHub 或本機 `~/Documents/Vibe-Coding-Classroom/<repo名>` → 照 README 測。  
4. 有問題就改碼 → 再測 → 結果欄更新。  
5. Classroom push 若需避 CI，commit message 加 `[skip ci]`。

**高風險提醒**
- **B12 h-bridge：** 先開馬達電池／開關  
- **B19 wifi-ap-sta：** 優先測 SoftAP  
- **S11–S13／B13–B15 BLE：** Chrome + localhost／HTTPS；非日常開車必測  
- **單元 upload 後：** 記得燒回艦隊映像再測車頁  

本機路徑對照：`/Users/yui-liangchen/Documents/Vibe-Coding-Classroom/<上表 repo 資料夾名>`
