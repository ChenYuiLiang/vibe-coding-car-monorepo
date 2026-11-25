# SSIM 2026 現場 Live Demo 逐步操作手冊 (Tutors' Demo Runbook)

> **會議名稱**：2026 International Conference on Social Science and Intelligent Management (SSIM 2026)  
> **展示主題**：Full-Stack Vibe Coding — 車載 Wi-Fi HTTP 遙控與 ESP32-C3 實體自走車 HIL 閉環驗證（涵蓋 Papers 27 & 28）  
> **會議時間地點**：2026 年 12 月 17–19 日 ｜ 朝陽科技大學 (CYUT)  
> **展示時限**：**3 分鐘**（於整體發表第 10:30 切入）  
> **發表團隊分工**：  
> * **講者與引導 (Commentator)**：陳育冠 (Rover)  
> * **Tutor A (手機控制端)**：林瑞昱 (Rui-Yu)  
> * **Tutor B (硬體與串口端)**：陳俞廷 (Yu-Ting)  
> * **指導教授**：陳育亮 博士（世新大學資管系）  

> **架構對齊原則（Product-Path Clarity）**：依論文規範，本展示以「**車載 Wi-Fi HTTP 網頁（192.168.4.1）**」作為唯一產品主通道進行實車驅動與安全急停驗證；Web Bluetooth 與 Canvas 搖桿僅作為選修實驗室（Optional Labs）口頭補充說明，確保跨手機平台零門檻運作。

---

## 一、 展前 30 分鐘整備清單 (Pre-Flight Checklist)

### 1. 硬體與安全架高測試台整備（負責人：陳俞廷 Yu-Ting）
- [ ] **自走車主機 (Car Alpha)**：確認 ESP32-C3 核心板天線穩固、H-Bridge 馬達驅動接線無鬆脫，且已燒錄最新官方 Monorepo 整合映像檔（執行 `GET /api/status` 確認韌體版本與 FSM 狀態正常）。
- [ ] **安全測試底座（Constrained Wheels Setup）**：依論文 HIL 安全規範，備妥透明壓克力架高底座置於講台中央，使車輪離地懸空但清晰可見正反轉與煞停，杜絕車輛衝出講台邊緣風險。
- [ ] **自走車備用機 (Car Beta) 與電池組**：備妥完全相同之備用車於講台隨手可取處（5 秒內可抽換）；以三用電表確認主機與備用 18650 鋰電池組電壓皆 $\ge 7.8\text{V}$，另備 Type-C 供電線以防電池欠壓。
- [ ] **筆電串口監控端 (Serial Monitor)**：連接 USB 序列埠（波特率 `115200`），將 VS Code / PlatformIO 終端機字體放大至 **18pt 以上**，置於面向評審之副螢幕或準備畫面切換。

### 2. 手機 Wi-Fi 主通道與投屏整備（負責人：林瑞昱 Rui-Yu）
- [ ] **手機系統設定**：任選 iOS Safari 或 Android Chrome（無需安裝任何第三方 App）；關閉螢幕自動休眠（設為永不）並鎖定直向顯示；確認控制中心「飛航模式」快捷鍵位置順手。
- [ ] **車載 Wi-Fi 熱點與網頁預檢**：手機連上車端加密熱點（WPA2 SoftAP），於瀏覽器開啟車載主頁 `http://192.168.4.1/`，測試點亮 ENGINE 啟用開關與 D-pad 方向鍵（`GET /api/drive?v=&w=`）反應正常。
- [ ] **有線投屏輸出**：優先使用 Type-C / Lightning to HDMI 有線轉接器連接會場主投影機，確保畫面零延遲且不會因切換飛航模式而中斷投影。

---

## 二、 現場 3 分鐘毫秒級操作時序表 (Step-by-Step Runbook)

當主講人 Rover 進行至 Live Demo 過場投影片（約第 10:30）時，正式交棒給兩位 Tutors：

| 時間 (秒) | 講者口令 (Rover's Cue) | Tutor A 動作 (瑞昱 Rui-Yu) | Tutor B 動作 (俞廷 Yu-Ting) | 舞台與螢幕視覺效果 |
| :---: | :--- | :--- | :--- | :--- |
| **00:00–00:45**<br>(45秒) | *"Talk is cheap—let's verify the primary Wi-Fi HTTP product path with zero app installation."* | 1. 喚醒手機，大螢幕切至手機畫面。<br>2. 連上車載 SoftAP，開啟 `http://192.168.4.1/`。<br>3. 點擊開啟 ENGINE 鎖定開關。 | 1. 將 Car Alpha 穩固置於講台架高底座上。<br>2. 開啟電源開關並確認 LED 指示燈就緒。 | 任何手機瀏覽器秒開車載網頁；狀態列顯示連線就緒與 `ENGINE: ON`。 |
| **00:45–01:30**<br>(45秒) | *"Notice the D-pad control and release-to-stop safety: sliding a finger off the button halts the wheels immediately."* | 1. 按住「前進鍵」2 秒讓車輪全速順轉。<br>2. 故意將手指滑出按鈕邊界再放開（觸發 `pointercancel`）。 | 1. 手指向架高旋轉的雙輪。<br>2. 確認放開瞬間輪胎立刻煞停，向講者點頭示意。 | 網頁即時送出 `/api/drive`；手指滑離按鈕瞬間送出停止指令，車輪零延遲停轉。 |
| **01:30–02:15**<br>(45秒) | *"Now, the ultimate HIL test: What happens if Wi-Fi drops completely? Watch the 500ms firmware Watchdog fail-safe!"* | **【全場高潮動作】**<br>1. 持續按住前進鍵讓車輪運轉。<br>2. 高舉手機拉下控制中心，果斷開啟「飛航模式」！ | 1. 全神貫注盯緊架高車輪。<br>2. 立即指向副螢幕 18pt 串口紅字警告輸出。 | **切斷 Wi-Fi 後不到 0.5 秒，車輪在運轉中瞬間鎖死急停！**<br>串口噴出 `WATCHDOG EMERGENCY STOP！` |
| **02:15–02:45**<br>(30秒) | *"Without rebooting the board, disabling Airplane Mode restores telemetry via /api/status. BLE and Canvas remain optional labs."* | 1. 關閉飛航模式，手機自動連回車端 SoftAP。<br>2. 重新整理網頁，展示 `/api/status` 遙測數據恢復（不按 Reset）。 | 1. 雙手平舉自走車（保持電源開啟），向評審展示整潔的 ESP32-C3 與 H-Bridge 走線。<br> | 無需重啟硬體，車載狀態 API 即時回報運作時間、FSM 狀態與固件版本，證明系統自癒韌性。 |
| **02:45–03:00**<br>(15秒) | *"Thank you Rui-Yu and Yu-Ting! Let's map what we just saw to our 5-layer HIL Rubric."* | 1. 大螢幕投影切換回 Rover 簡報（HIL 五層驗收量表頁）。<br>2. 手機平放桌面。 | 1. 關閉自走車電源，整齊放回展示架。<br>2. 退回後方待命席準備協助 Q&A。 | 簡報無縫銜接「HIL 五層驗收量表」，將剛才的實體畫面與評分標準一一對應。 |

---

## 三、 現場突發狀況應變手冊 (Emergency Contingency SOP)

| 突發故障情境 (Failure Mode) | 根本原因 (Root Cause) | 5 秒內第一時間處置 SOP | 講者口述化解話術 (Rover's Cover Line) |
| :--- | :--- | :--- | :--- |
| **1. 手機連不上車載 Wi-Fi 或網頁轉圈** | 會場 2.4GHz 頻道擁塞，或手機自動切換至行動數據網路。 | 瑞昱確認已開啟飛航模式後僅單獨開啟 Wi-Fi；若仍逾時，俞廷 5 秒內抽換開啟備用車 **Car Beta**。 | *"In dense conference RF environments, phones often prefer cellular data—which is why our playbook enforces explicit IP and airplane-mode isolation."* |
| **2. 網頁按鈕有反應但車輪不轉** | 馬達驅動板獨立電源開關未開啟，或接線鬆脫。 | 俞廷立即檢查 TB6612 電源開關與指示燈；若仍未轉動，立刻切換至預熱完畢之 **Car Beta**。 | *"Our layered HIL diagnostic separates HTTP command reachability from motor driver power—let's switch to our hot-standby unit."* |
| **3. 投屏畫面黑屏或訊號中斷** | HDMI 轉接線接觸不良或投影機重新抓取解析度。 | 瑞昱迅速重新插拔轉接頭；俞廷將架高自走車向前移至講台前緣，讓評審直接目視輪胎與串口螢幕。 | *"As we emphasize in Paper 27, a screen is never a substitute for physical reality—focus right here on the physical wheel actuation."* |
| **4. 馬達啟動瞬間板子重啟 (Brownout)** | 鋰電池組電量低於門檻，大電流抽載引發欠壓重置。 | 俞廷立即抽換滿電備用電池組（5 秒快拆），或直接改接講台 Type-C 穩定電源線繼續演示。 | *"What you just witnessed is ESP32-C3 hardware brownout protection preventing flash corruption under transient motor load."* |

---

## 四、 舞台執行加分細節 (Tutors Pro-Tips)

1. **高舉手機製造視覺連動**：在執行 01:30 「開啟飛航模式」動作時，瑞昱可將手機稍微舉高面向評審席，讓全場清楚看見「手指按下飛航鍵」與「架高車輪瞬間鎖死」在 500 毫秒內同步發生。
2. **大字體串口輔助佐證**：俞廷預先將串口監控字體設為 **18pt 以上**並清空雜訊，讓前排評審能直接讀出 `/api/drive` 參數變化與 `WATCHDOG EMERGENCY STOP` 警告。
3. **全隊儀態與口頭留白**：三人統一穿著深色商務休閒裝；操作時動作俐落、不搶話，讓 Rover 的英文解說與雙手操作節奏精準卡點。
