# SSIM 2026 現場 Live Demo 逐步操作手冊 (Tutors' Demo Runbook)

> **會議名稱**：2026 International Conference on Social Science and Intelligent Management (SSIM 2026)  
> **展示主題**：Full-Stack Vibe Coding — 車載 Wi-Fi HTTP 遙控與 ESP32-C3 實體自走車 HIL 閉環驗證（涵蓋 Papers 27 & 28）  
> **會議時間地點**：2026 年 12 月 17–19 日 ｜ 朝陽科技大學 (CYUT)  
> **整體發表總時限**：**25 分鐘以內**（口頭報告 12.5 分鐘 ＋ 現場 Demo 與觀眾互動 8 分鐘 ＋ Q&A 4.5 分鐘）  
> **Live Demo 進入點**：約於發表第 **08:30** 切入，時長 **8 分鐘**（08:30–16:30）  
> **發表團隊分工**：  
> * **講者與引導 (Commentator)**：陳育冠 (Rover)  
> * **Tutor A (手機控制端與觀眾互動)**：林瑞昱 (Rui-Yu)  
> * **Tutor B (硬體架高台與串口監控)**：陳俞廷 (Yu-Ting)  
> * **指導教授**：陳育亮 博士（世新大學資管系）  

> **架構對齊原則（Product-Path Clarity）**：依論文規範，本展示以「**車載 Wi-Fi HTTP 網頁（192.168.4.1）**」作為唯一產品主通道進行實車驅動與安全急停驗證；Web Bluetooth 與 Canvas 搖桿僅作為選修實驗室（Optional Labs）口頭補充說明，確保跨手機平台零門檻運作。

---

## 一、 展前 30 分鐘整備清單 (Pre-Flight Checklist)

### 1. 硬體與安全架高測試台整備（負責人：陳俞廷 Yu-Ting）
- [ ] **自走車主機 (Car Alpha)**：確認 ESP32-C3 核心板天線穩固、H-Bridge 馬達驅動接線無鬆脫，且已燒錄最新官方 Monorepo 整合映像檔（執行 `GET /api/status` 確認韌體版本與 FSM 狀態正常）。
- [ ] **安全測試底座（Constrained Wheels Setup）**：依論文 HIL 安全規範，備妥透明壓克力架高底座置於講台中央，使車輪離地懸空但清晰可見正反轉與煞停，杜絕車輛衝出講台邊緣風險。
- [ ] **自走車備用機 (Car Beta) 與電池組**：備妥完全相同之備用車於講台隨手可取處（5 秒內可抽換）；以三用電表確認主機與備用 18650 鋰電池組電壓皆 $\ge 7.8\text{V}$，另備 Type-C 供電線以防電池欠壓。
- [ ] **筆電串口監控端 (Serial Monitor)**：連接 USB 序列埠（波特率 `115200`），將 VS Code / PlatformIO 終端機字體放大至 **18pt 以上**，置於面向評審之副螢幕或準備畫面切換。

### 2. 手機 Wi-Fi 主通道、互動手機與投屏整備（負責人：林瑞昱 Rui-Yu）
- [ ] **展示主手機（Tutor 操盤）**：任選 iOS Safari 或 Android Chrome；關閉螢幕自動休眠（設為永不）並鎖定直向顯示；確認控制中心「飛航模式」快捷鍵位置順手。
- [ ] **【觀眾互動專用機】備妥**：準備第二支已連上車載 SoftAP（`192.168.4.1`）並載入控制頁面之手機或 iPad，於觀眾互動環節可直接雙手遞交評審/觀眾體驗，免現場配對打密碼！
- [ ] **車載 Wi-Fi 熱點與網頁預檢**：兩支手機連上車端加密熱點（WPA2 SoftAP），於瀏覽器開啟車載主頁 `http://192.168.4.1/`，測試點亮 ENGINE 啟用開關與 D-pad 方向鍵（`GET /api/drive?v=&w=`）反應正常。
- [ ] **有線投屏輸出**：優先使用 Type-C / Lightning to HDMI 有線轉接器連接會場主投影機，確保畫面零延遲且不會因切換飛航模式而中斷投影。

---

## 二、 現場 8 分鐘操作時序與觀眾互動表 (8-Minute Live Demo & Audience Protocol)

當主講人 Rover 進行至第 10 頁投影片（約第 08:30），正式啟動 **8 分鐘 Live Demo 與觀眾互動**：

| 時間 (分:秒) | 階段主題 | 講者口令 (Rover's Cue) | Tutor A 動作 (瑞昱 Rui-Yu) | Tutor B 動作 (俞廷 Yu-Ting) | 舞台與觀眾互動效果 |
| :---: | :--- | :--- | :--- | :--- | :--- |
| **00:00–01:30**<br>(1.5分鐘) | **階段一：車載 Wi-Fi 秒連與主通道驗證** | *"Talk is cheap—let's verify the primary Wi-Fi HTTP product path with zero app installation."* | 1. 喚醒手機，大螢幕切至手機畫面。<br>2. 連上車載 SoftAP，開啟 `http://192.168.4.1/`。<br>3. 點擊開啟 ENGINE 鎖定開關。 | 1. 將 Car Alpha 穩固置於透明架高底座上。<br>2. 開啟電源開關並確認 LED 指示燈就緒。 | 投影螢幕秒開車載網頁；狀態列亮起綠燈 `ENGINE: ON`。全場評審看見架高台上雙輪就緒。 |
| **01:30–03:00**<br>(1.5分鐘) | **階段二：D-pad 驅動與 Pointercancel 防呆** | *"Notice the D-pad control and release-to-stop safety: sliding a finger off the button halts the wheels immediately."* | 1. 按住「前進鍵」2 秒讓雙輪旋轉。<br>2. **故意將手指滑出按鈕邊界再放開（觸發 `pointercancel`）**。<br>3. 演示差速轉向與原地打轉。 | 1. 手指向架高旋轉之雙輪。<br>2. 確認手指滑開瞬間輪胎立刻煞停，向講者點頭示意。 | 大螢幕即時顯示 `/api/drive` 指令；手指滑離按鈕邊界瞬間馬達立刻斷電，展現極高的人機觸控安全性。 |
| **03:00–05:30**<br>(2.5分鐘) | **階段三：【全場焦點】邀請座長或觀眾親自試駕** | *"Now, we would love to invite our session chair or an audience member to test our release-to-stop safety firsthand!"* | 1. **雙手將「觀眾互動專用手機」遞交給第一排評審或志願觀眾**。<br>2. 禮貌引導：「請長官/老師按住前進鍵 2 秒，然後手指隨意滑開螢幕。」 | 1. 全程雙手護在自走車兩側防護。<br>2. 眼神引導評審目視車輪反應。 | **觀眾親自觸控操控自走車！**<br>觀眾親手滑離按鈕，親眼看見車輪瞬間鎖死停轉！現場氣氛極度熱烈，論文說服力瞬間拉滿！ |
| **05:30–07:00**<br>(1.5分鐘) | **階段四：【全場高潮】500ms Watchdog 急停鎖死** | *"Now for the ultimate stress test: What happens if Wi-Fi drops completely? Let's have the audience countdown with us: 3, 2, 1—Airplane Mode!"* | 1. 取回專用手機，主手機持續按住前進鍵。<br>2. **帶領全場倒數，右手果斷拉下控制中心按下「飛航模式」！** | 1. 全神貫注盯緊車輪。<br>2. 立即特寫指向副螢幕 18pt 串口紅字警報。 | **切斷 Wi-Fi 後不到 0.5 秒，高速運轉中的車輪瞬間「急停鎖死」！**<br>副螢幕串口大字噴出：<br>`[FATAL] Heartbeat Timeout (>500ms)!`<br>`[SAFETY] WATCHDOG EMERGENCY STOP ACTIVATED!` |
| **07:00–08:00**<br>(1.0分鐘) | **階段五：免重啟系統自癒與平舉展示** | *"Without rebooting the board, disabling Airplane Mode restores telemetry via /api/status. BLE and Canvas remain optional labs."* | 1. 關閉飛航模式，手機自動連回 SoftAP。<br>2. 重新整理網頁，展示 `/api/status` 遙測數據恢復（不按 Reset）。 | 1. 雙手平舉自走車（保持電源開啟），向評審展示整潔之 ESP32-C3 與 H-Bridge 走線機構。 | 無需手動重置硬體，車載狀態 API 即時恢復回報，證明系統具備極高自癒韌性；簡報切回 Rover 接續演講。 |

---

## 三、 現場突發狀況應變手冊 (Emergency Contingency SOP)

| 突發故障情境 (Failure Mode) | 根本原因 (Root Cause) | 5 秒內第一時間處置 SOP | 講者口述化解話術 (Rover's Cover Line) |
| :--- | :--- | :--- | :--- |
| **1. 觀眾手機連不上或無人自願試駕** | 觀眾害羞或會場干擾。 | **備案 A**：若無人接手機，Rover 邀請第一排評審：「請老師隨機喊 'STOP'，由瑞昱執行指令」；若連線逾時，立即改用主手機演示。 | *"Even if a guest prefers not to touch the screen, let's treat the entire room as the Human-in-the-Loop auditor—shout STOP anytime!"* |
| **2. 網頁按鈕有反應但車輪不轉** | 馬達驅動板獨立電源開關未開啟，或接線鬆脫。 | 俞廷立即檢查 TB6612 電源開關與指示燈；若仍未轉動，立刻切換至預熱完畢之 **Car Beta**。 | *"Our layered HIL diagnostic separates HTTP command reachability from motor driver power—let's switch to our hot-standby unit."* |
| **3. 投屏畫面黑屏或訊號中斷** | HDMI 轉接線接觸不良或投影機重新抓取解析度。 | 瑞昱迅速重新插拔轉接頭；俞廷將架高自走車向前移至講台前緣，讓評審直接目視輪胎與串口螢幕。 | *"As we emphasize in Paper 27, a screen is never a substitute for physical reality—focus right here on the physical wheel actuation."* |
| **4. 馬達啟動瞬間板子重啟 (Brownout)** | 鋰電池組電量低於門檻，大電流抽載引發欠壓重置。 | 俞廷立即抽換滿電備用電池組（5 秒快拆），或直接改接講台 Type-C 穩定電源線繼續演示。 | *"What you just witnessed is ESP32-C3 hardware brownout protection preventing flash corruption under transient motor load."* |

---

## 四、 舞台執行加分細節 (Tutors Pro-Tips)

1. **觀眾互動要熱情、低門檻**：瑞昱遞手機給觀眾時面帶微笑，螢幕已預先開啟且點亮 ENGINE，觀眾只需用一根手指按住與放開，保證 100% 成功。
2. **倒數計時帶動全場氣氛**：在執行飛航模式前，Rover 邀請全場：「Let's count down together: Three, Two, One, Cut!」，讓評審完全沉浸在實驗情境中。
3. **串口螢幕調大字體**：俞廷預先將串口監控字體設為 **18pt 以上**並清空雜訊，讓前排評審能清晰讀出 `/api/drive` 參數變化與 `WATCHDOG EMERGENCY STOP` 警告。
4. **全隊儀態與口頭留白**：三人統一穿著深色商務休閒裝；操作時動作俐落、不搶話，讓 Rover 的英文解說與雙手操作節奏精準卡點。
