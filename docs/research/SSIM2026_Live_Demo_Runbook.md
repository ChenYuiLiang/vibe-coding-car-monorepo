# SSIM 2026 現場 Live Demo 逐步操作手冊 (Tutors' Demo Runbook)

> **會議名稱**：2026 International Conference on Social Science and Intelligent Management (SSIM 2026)  
> **展示主題**：Full-Stack Vibe Coding: Web BLE 遙控器與 ESP32-C3 實體自走車實機驗證（涵蓋 Paper 27 & Paper 28）  
> **展示時限**：**3 分鐘**（包含於 20 分鐘整體發表內）  
> **發表團隊分工**：
> * **講者與引導（Commentator）**：陳育冠（Rover）
> * **Tutor A（手機控制端操盤手）**：林瑞昱（Rui-Yu）
> * **Tutor B（硬體與串口監控操盤手）**：陳俞廷（Yu-Ting）
> * **總體技術指導**：陳育亮 教授（Prof. Yui-Liang Chen）

---

## 🧰 一、 展前 30 分鐘整備清單 (Pre-Flight Checklist)

### 1. 硬體載具整備（負責人：俞廷 Yu-Ting）
- [ ] **自走車主機（Car Alpha）**：
  * ESP32-C3 控制核心正常，天線無鬆脫。
  * TB6612 馬達驅動板接線牢固，馬達電源開關切換順暢。
  * 雙輪差速齒輪轉向滑順，無異物卡阻。
- [ ] **自走車備用機（Car Beta）**：
  * 與主機完全相同之備用車，已預先燒錄最新版 `firmware_esp32c3_vibe_car.bin`。
  * 放置於講台隨手可取處，以防突發狀況 5 秒內抽換。
- [ ] **18650 鋰電池組**：
  * 使用三用電表量測主機與備用電池電壓，確認 $\ge 7.8\text{V}$（兩串滿電約 8.2V~8.4V）。
  * 備妥至少 2 組充飽電之備用鋰電池與 Type-C 充電線。
- [ ] **筆電監控端（Serial Monitor）**：
  * 筆電連接 ESP32-C3 USB 埠（或透過第二組 ESP32 進行串口監聽）。
  * 開啟 VS Code / PlatformIO 或 Arduino IDE 序列埠監控視窗，設定波特率 **115200**。
  * 投屏或置於講台面向評審之副螢幕。

### 2. 軟體與手機端整備（負責人：瑞昱 Rui-Yu）
- [ ] **展示手機**：
  * 作業系統：iOS（Safari/Bluefy）或 Android（Chrome）。建議優先使用 **Android Chrome** 或支援 Web Bluetooth API 之專用瀏覽器。
  * 手機設定：
    - 開啟「永不休眠」（螢幕逾時設為 Never）。
    - 關閉自動旋轉（鎖定直向）。
    - 開啟「飛航模式切換快捷按鈕」（後續 Watchdog 演示關鍵！）。
- [ ] **Web Controller 載入**：
  * 本地或離線伺服器開啟 `http://localhost:3000` 或預先快取之 PWA 頁面。
  * 測試 Web Bluetooth 搜尋功能，確認能在清單中辨識 `Vibe-Car-C3`。
- [ ] **投屏輸出**：
  * 手機透過 Type-C to HDMI 轉接線（最穩！）或 AirPlay 投屏至會場主投影螢幕。

---

## ⏱️ 二、 現場 3 分鐘毫秒級操作時序表 (Step-by-Step Runbook)

當主講人 **Rover** 演講進行至第 10 頁投影片（約第 10:30），正式交棒給 Tutors：

| 時間 (秒) | 講者口令 (Rover's Cue) | Tutor A 操作動作 (瑞昱 Rui-Yu) | Tutor B 操作動作 (俞廷 Yu-Ting) | 觀眾螢幕與舞台視覺效果 |
| :---: | :--- | :--- | :--- | :--- |
| **00:00 ~ 00:20** | *"Now, talk is cheap—show me the code, and show me the physical car! I'd like to invite our demo tutors, Rui-Yu and Yu-Ting, for a live demonstration."* | 1. 拿起展示手機，喚醒螢幕。<br>2. 大螢幕切換至手機 Web Controller 畫面。<br>3. 手指停在右上角藍色「Connect BLE」按鈕。 | 1. 將自走車（Car Alpha）置於講台中央平坦展示區。<br>2. 開啟車端電源開關。<br>3. 筆電串口視窗就定位。 | 螢幕顯示極具科技感之深色系 Web 控制介面；講台上自走車 LED 藍燈以 1Hz 頻率慢閃（等待配對）。 |
| **00:20 ~ 00:45** | *"First, observe instant Web BLE pairing with zero app installation."* | 1. 點擊 **「Connect BLE」**。<br>2. 彈出系統藍牙視窗，直接點選 `Vibe-Car-C3`。 | 1. 觀察自走車狀態指示燈。<br>2. 看到藍燈轉為**「恆亮」**，向講者點頭示意。 | **1 秒內配對成功！**<br>手機介面頂部狀態列瞬間亮起綠燈：`CONNECTED (UUID: 0xFFE0)`。<br>串口印出：`[BLE] Client Connected! MTU=23`。 |
| **00:45 ~ 01:30** | *"Notice how the Canvas virtual joystick converts polar coordinates into differential motor speeds live."* | 1. 大拇指按住虛擬搖桿中心。<br>2. 緩慢向前輕推 30% $\to$ 車輛平穩直行。<br>3. 向左側滑動 $\to$ 車輛差速順暢左轉。<br>4. 搖桿拉到底 $\to$ 車輛原地 360 度旋轉。 | 1. 雙手在自走車行進範圍外 20 公分處呈守護姿勢，防範車輛衝出講台邊緣。<br>2. 指向車輪順暢差速動作，引導評審目光。 | 自走車在講台上展現極高之響應精度，無任何延遲或頓挫；大螢幕即時顯示 $(r, \theta) \to (V_L, V_R)$ 二進位封包串流。 |
| **01:30 ~ 02:15** | *"Now, the ultimate test: What happens if the network jams or the phone dies? Watch the 500ms Watchdog fail-safe!"* | **【全場高潮核心動作】**：<br>1. 保持自走車在低速直行狀態。<br>2. **右手滑下手機控制中心，果斷按下「飛航模式」（或直接關閉藍牙）！** | 1. 全神貫注盯緊自走車。<br>2. 特寫指向筆電串口螢幕。 | **自走車在前進中瞬間「急停鎖死」！**<br>反應時間不到 0.5 秒！<br>筆電串口大字噴出：<br>`[FATAL] Heartbeat Timeout (>500ms)!`<br>`[SAFETY] WATCHDOG EMERGENCY STOP ACTIVATED!`<br>全場感受到震撼之工程安全性！ |
| **02:15 ~ 02:45** | *"And with our dual-mode Wi-Fi self-healing, the vehicle recovers and enters safe SoftAP mode."* | 1. 關閉飛航模式，點擊重連。<br>2. 展示手機連入車端自癒熱點 `vibe123456`。 | 1. 輕按自走車 Reset 鍵進行重啟。<br>2. 雙手平舉自走車，向評審席與會眾展示精巧之硬體走線與雙 H 橋機構。 | 串口顯示韌體開機鏈完整、分區表自檢通過；手機透過 Wi-Fi 重新獲得遠端遙測數據。 |
| **02:45 ~ 03:00** | *"Thank you Rui-Yu and Yu-Ting! Back to our slides."* | 1. 切換大螢幕信號回 Rover 的簡報第 12 頁。<br>2. 將手機平放於桌上。 | 1. 將自走車關閉電源，整齊放置於展示架。<br>2. 回到後方待命席，準備協助後續 Q&A。 | 簡報切換至實證量化數據頁，全場給予熱烈掌聲。 |

---

## 🚨 三、 現場突發狀況應變手冊 (Emergency Contingency SOP)

| 突發故障情境 (Failure Mode) | 故障根本原因 (Root Cause) | 第一時間處置 SOP (Action within 5 Seconds) | 講者口述化解話術 (Rover's Cover Line) |
| :--- | :--- | :--- | :--- |
| **1. 藍牙搜尋不到自走車** | 會場 2.4GHz 射頻嚴重干擾，或快取鎖死。 | **俞廷** 立即開啟備用車（Car Beta）；**瑞昱** 關閉 Chrome 重新開啟，或直接改連車端熱點 `vibe123456`。 | *"As you can see in dense RF environments, embedded systems face high interference—which is why our Monorepo architecture incorporates automatic Wi-Fi self-healing as a dual-fallback."* |
| **2. 自走車原地不動或單輪不轉** | 馬達電源開關未開，或馬達線路接觸不良。 | **俞廷** 立即檢查電池盒開關，確認 TB6612 電源指示燈亮起；若仍未轉，立刻抽換 Car Beta。 | *"Hardware in the loop means dealing with physical realities—loose wires or battery sags are prime learning moments in our 45-unit curriculum."* |
| **3. 手機投屏畫面黑屏或斷訊** | HDMI 轉接頭鬆脫或 Wi-Fi 投屏延遲。 | **瑞昱** 迅速重新插拔轉接線；**俞廷** 將自走車往前推進至講台前緣，讓評審直接目視實體車輪動作。 | *"Let's focus on the physical vehicle right here on the table—the real test is always physical motion, not the projector screen!"* |
| **4. 鋰電池電量過低觸發重啟** | 大電流抽載造成 ESP32 欠壓重置（Brownout）。 | **俞廷** 立即換上充飽電之備用鋰電池組（5 秒快拆）。 | *"Our ESP32-C3 firmware has built-in Brownout detection to prevent EEPROM corruption during low-voltage conditions."* |

---

## 💡 四、 Tutors 現場加分小技巧
1. **動作要大、自信穩健**：在操作「飛航模式斷開藍牙」時，瑞昱可將手機稍微舉高向評審示意，讓大家看清楚「斷開連線」與「自走車急停」是毫秒級聯動的。
2. **串口螢幕調大字體**：俞廷將 VS Code 串口監控字體設為 **18pt 以上**，使前排評審能清晰看見 `[WATCHDOG CUTOFF MOTORS!]` 的大寫紅字/警告輸出。
3. **服裝一致**：建議發表當天三人均著商務休閒裝（如深色襯衫或系服），展現團隊專業度與默契！
