# 全棧 Vibe Coding 如何支撐手機遙控器與 ESP32 韌體之實作與測試：Monorepo、共享協定與 Hardware-in-the-Loop 閉環研究

## How Full-Stack Vibe Coding Enables Implementation and Testing of Mobile Controllers and ESP32 Firmware: A Monorepo, Shared-Protocol, and Hardware-in-the-Loop Closed-Loop Study

**陳育冠 (Rover Yu-Kuan Chen)**  
Taiwan Vibe Coding Co., Taiwan  
rover.k.chen@gmail.com  

**陳育亮 (Yui-Liang Chen)**  
世新大學資訊管理學系  
ychen@mail.shu.edu.tw  

**林瑞昱 (Rui-Yu Lin) (通訊作者)**  
世新大學資訊管理學系  
linroy1202a@gmail.com  

**陳俞廷 (Yu-Ting Chen)**  
朝陽科技大學幼兒保育系  
abc100308@gmail.com  

*2026 年 8 月*

---

## 摘要

大型語言模型（LLM）驅動的 **Vibe Coding** 使學習者得以用自然語言產生與修改程式碼，但在物聯網（IoT）課程中，僅「產生看起來正確的程式」並不足以達成教學目標。手機遙控器（Web／Web Bluetooth／Wi-Fi HTTP）與 ESP32 韌體（PlatformIO／C++）分屬異構技術棧，若缺少共享約束與實機閉環，AI 產出常出現協定不一致、可編譯卻無法上板、或上板後無法遙測與遙控等問題，導致「實作完成」與「測試通過」脫節。

本研究以 Taiwan Vibe Coding Co. 推動之 **無人車入門課程**（前端遙控與人機互動）與 **無人車基礎課程**（ESP32 韌體、網路與驅動）之教學實務為主要來源，論證 Vibe Coding 若要有效服務於「產生／修改手機遙控器與 ESP32 韌體，並達成實作與測試目的」，必須同時具備三層結構：（一）以 **Monorepo** 組織雙端程式，並以 **共享協定套件** 將 BLE UUID、二進位封包與 OTA 標頭規則固定為單一真相來源，降低雙端幻覺；（二）**可驗證的執行路徑**——Web 端以本機開發伺服器與單元測試即時回饋，韌體端以 PlatformIO 建置、USB 首次燒錄與後續 **OTA** 形成「改碼→部署→觀察」循環；（三）**Hardware-in-the-Loop（HIL）雙端驗收**，以手機畫面、車端 HTTP／BLE 狀態、串口或狀態 API、以及實體動作共同判定是否達成學習目標，而非僅依賴模擬器或靜態程式碼審查。

研究進一步整理兩條課程在實機場域反覆出現的工程約束（如 SoftAP／STA 自癒、OTA 雙槽與延遲確認、Watchdog 急停、USB 救援時開機載入必要映像），說明這些約束如何被寫入課程操作手冊，使學員與 AI 代理在「改遙控器／改韌體」時仍能對齊可測試的完成定義。結論指出：Vibe Coding 在全棧 IoT 中的教育價值，不在於省略工程，而在於把提示、審計、部署與實機證據串成閉環；缺任一環，則「產生程式」無法穩定轉化為「實作與測試成功」。

**關鍵詞**：Vibe Coding；無人車入門課程；無人車基礎課程；手機遙控器；ESP32 韌體；OTA；Monorepo；共享協定；Hardware-in-the-Loop；PACE 框架

---

## Abstract

Vibe Coding—natural-language–driven code generation with large language models (LLMs)—lowers syntax barriers, yet in Internet of Things (IoT) education, producing plausible code is insufficient for learning goals. Mobile controllers (Web / Web Bluetooth / Wi-Fi HTTP) and ESP32 firmware (PlatformIO / C++) inhabit heterogeneous stacks. Without shared constraints and a hardware-backed closed loop, AI outputs frequently exhibit protocol drift, “builds but does not run,” or “runs but cannot be remotely tested,” decoupling *implementation* from *verification*.

Drawing primarily on Taiwan Vibe Coding Co.’s **Entry-level Autonomous Car Course** (mobile remote control and human–computer interaction) and **Basic Autonomous Car Course** (ESP32 firmware, networking, and actuation), this paper argues that Vibe Coding can reliably support *generating and modifying* both the mobile controller and ESP32 firmware for implementation-and-testing purposes only when three layers coexist: (1) a **monorepo** organizing both ends with a **shared protocol package** as the single source of truth for BLE UUIDs, binary packets, and OTA header rules; (2) **verifiable execution paths**—instant Web feedback via a local development server and unit tests, plus firmware build, first-time USB flashing, and subsequent **OTA** for a change–deploy–observe cycle; and (3) **Hardware-in-the-Loop (HIL) dual-end acceptance**, judging success by mobile UI evidence, vehicle HTTP/BLE status, serial or status APIs, and physical motion—not simulation alone.

We further document recurring engineering constraints from classroom practice (SoftAP↔STA self-healing, OTA dual slots with deferred validation, watchdog failsafes, and USB rescue requiring the correct bootloader chain) and show how course handbooks operationalize a testable definition of done for learners and AI agents. We conclude that the educational value of Vibe Coding in full-stack IoT is not the elimination of engineering rigor, but the coupling of prompting, auditing, deployment, and hardware evidence into a closed loop.

**Keywords**: Vibe Coding; Entry-level Autonomous Car Course; Basic Autonomous Car Course; Mobile Controller; ESP32 Firmware; OTA; Monorepo; Shared Protocol; Hardware-in-the-Loop; PACE Framework

---

## 一、緒論

### （一）研究背景

自 Andrej Karpathy（2025）提出並經 Collins Dictionary（2025）列為年度詞彙以來，**Vibe Coding** 已成為 AI 輔助軟體開發的主流敘事：開發者以自然語言描述意圖，由 LLM 產生、修改並迭代程式碼。對資訊教育而言，此典範轉移使「從零寫出語法正確的程式」不再是唯一門檻，學習重心移向意圖表達、輸出批判與迭代精鍊（Chen & Chen, 2026a）。

Taiwan Vibe Coding Co. 之無人車系列課程，將此典範延伸到 **物聯網軟硬體整合** 現場，並以兩條主軸分工：

1. **無人車入門課程**：培養手機端遙控能力——瀏覽器 Web App、觸控 UI、Web Bluetooth、Wi-Fi HTTP 遙控與人機互動；  
2. **無人車基礎課程**：培養車端韌體能力——ESP32 GPIO／PWM、BLE GATT、SoftAP／STA、OTA、安全急停與驅動整合。  

「能產生程式」與「能完成實作並通過測試」之間仍常出現結構性落差。瀏覽器可即時預覽 UI，但無法完整模擬射頻、供電不穩、分區表或實體馬達行為；韌體可在工具鏈中編譯，卻仍可能在實機上無熱點、無藍牙、或 OTA 後無法再連線。若課程僅鼓勵學員「對 AI 說出需求並貼上程式」，容易形成假性完成：作業倉庫有碼、截圖有 UI，但雙端無法互通，或無法在真實硬體上重複驗證。

### （二）問題陳述

本研究聚焦一個實務且可教學操作的問題：

> **在無人車入門與基礎課程的脈絡下，Vibe Coding 如何組織提示、程式產物、部署路徑與驗收證據，使學習者能夠穩定地「產生／修改手機遙控器與 ESP32 韌體」，並真正達成實作與測試目的？**

此問題可拆為三個子問題：

- **RQ1（產生與修改）**：在雙端異構下，如何讓 AI 輔助修改遙控器與韌體時，仍維持可互通的通訊語意？  
- **RQ2（實作）**：如何讓修改後的程式進入可執行狀態（本機 Web、實機韌體、無線 OTA），而非停留在編輯器中的文字？  
- **RQ3（測試）**：如何定義並收集足以證明「遙控與韌體協作成功」的實機證據，使測試不被模擬器或單端單元測試取代？

### （三）研究目的與貢獻

本研究目的不在提出新的 LLM 模型，而在提出一套可複製的 **全棧 Vibe Coding 實作—測試閉環**，貢獻如下：

1. 以無人車入門／基礎課程為本，將 Vibe Coding 的教育目標明確對齊「手機遙控器 ⇄ ESP32 韌體」的雙端實作與 HIL 測試。  
2. 說明 Monorepo、共享協定、OTA／USB 部署與課程操作手冊如何共同降低 AI 幻覺與部署失敗。  
3. 以課程實務中的失敗模式（協定漂移、USB 開機鏈不完整、STA 幽靈裝置、OTA 過早確認有效等）反向論證「測試閉環」之必要性。  
4. 調適既有 **PACE**（Prompt–Audit–Commit–Evaluate）框架（Chen & Chen, 2026a），使其適用於全棧 IoT 的部署與實機證據評量。

### （四）論文結構

第二節回顧相關文獻與理論定位；第三節說明研究方法與個案對象；第四節描述課程與系統架構；第五節展開「產生／修改→實作→測試」閉環；第六節討論發現與意涵；第七節結論與建議。

---

## 二、文獻回顧與理論定位

### （一）Vibe Coding 與程式教育重心轉移

Vibe Coding 強調以自然語言驅動程式生成（Karpathy, 2025）。既有教學研究指出，此典範並未取消程式能力，而是將能力重配置於提示設計、AI 輸出審計與迭代（Chen & Chen, 2026a）。對初學者，Tutor 鷹架與結構化作業（如 GitHub Classroom／Vibe Classroom）仍是必要條件，避免「無引導的自由 vibe」導致淺層複製貼上。

### （二）全棧 IoT 的雙重複雜度

IoT 教學同時涉及人機介面與嵌入式即時控制。Web 端關注觸控、非同步 BLE／HTTP 與瀏覽器安全限制（例如 Web Bluetooth 對 HTTPS／localhost 的要求）；韌體端關注腳位、電源、無線共存、分區與 OTA 可靠性（Espressif, 2025）。LLM 若分別在兩端「各自成功生成」，仍可能因 UUID、封包端序、校驗或狀態機不一致而整體失敗——此即跨領域 **protocol hallucination／協定幻覺**。

### （三）Hardware-in-the-Loop 作為教學驗收隱喻

工程上的 Hardware-in-the-Loop（HIL）指控制軟體與真實或半真實硬體閉環測試。本研究採其教育隱喻：遠端 UI 與 ESP32 實體板必須同時進入評量視野；手機截圖、狀態 API、串口日誌與實體運動構成互補證據。單有前端預覽或單有韌體編譯成功，皆不足稱為測試通過。

### （四）本研究定位

本文以 Taiwan Vibe Coding Co. 無人車入門課程與無人車基礎課程之教學設計與實機場域為主要來源，論證：**Vibe Coding 服務於「遙控器＋韌體」的實作與測試目的時，必須具備的閉環條件**；Monorepo 僅作為承載雙端程式與共享協定的組織形式，而非研究對象本身。

---

## 三、研究方法與個案對象

### （一）方法

採 **設計導向的個案研究（design-based case study）** 與 **課程工件分析**：

1. 分析無人車入門課程（遙控 Web 應用、觸控與 BLE／HTTP 連線）與無人車基礎課程（ESP32 韌體、Wi-Fi／BLE、OTA、驅動）之單元目標、作業規範與實機驗收要求；  
2. 歸納兩條課程在整合階段共同依賴的「產生／修改→部署→實機驗證」標準作業程序（SOP）；  
3. 以課堂與實驗室反覆出現的失效模式作為反例，檢驗閉環設計是否對症。

本研究不宣稱隨機對照實驗的因果估計；重點在提出可操作、可複製的教學—工程框架，供後續量化評量使用。

### （二）個案對象：無人車入門與無人車基礎課程

| 課程 | 主要學習產出 | 技術焦點 |
|------|----------------|----------|
| **無人車入門課程** | 可在真實手機操作的遙控介面 | HTML／CSS／TypeScript、觸控、Web Bluetooth、HTTP 遙控、UI／UX |
| **無人車基礎課程** | 可在 ESP32 實車上運行的韌體 | PlatformIO／C++、GPIO／PWM、BLE GATT、Wi-Fi AP／STA、OTA、安全狀態機 |
| **整合驗收（Integration Lab）** | 雙端互通並完成 HIL 證據 | 共享協定、實機聯測、截圖與日誌 |

為降低雙端協定漂移，課程實務上以 **Monorepo** 同時容納：

- 手機／桌面遙控應用；  
- 共享通訊協定套件；  
- ESP32 車端韌體專案；  
- 操作手冊（配網、OTA、USB 救援、驗收規範）。  

學習者可在同一工作區修改入門課程側的遙控器，或基礎課程側的韌體，再依板子狀態選擇 OTA 或 USB 完成部署。

---

## 四、系統與課程架構：讓 Vibe Coding「改得動、對得齊」

### （一）為何需要 Monorepo（作為課程載體，而非品牌）

若入門課程的遙控器與基礎課程的韌體分屬無共享約束的兩個倉庫，學員（與 AI）極易各自演化 API。Monorepo 的教學功能不是「倉庫名稱」，而是：

1. **單一工作區即可同時改雙端**，降低工具鏈切換成本；  
2. **共享協定套件**強制遙控器與韌體語意對齊；  
3. **統一腳本與手冊**把「改完下一步做什麼」寫成可執行步驟（開發伺服器、測試、OTA）。

### （二）共享協定：實作互通的最小真相來源

共享協定套件在概念上固定：

- BLE Service／Characteristic UUID 與裝置廣播名稱慣例；  
- 遙控封包格式（含校驗）；  
- 課程用簡易 opcode 指令（前進／後退／轉向／停止，以及必要時的清 Wi-Fi 等維運指令）；  
- OTA 映像基本檢查（合法映像標頭、目標晶片、大小上限）。

當學員在 **入門課程** 用 Vibe Coding 修改遙控器送包方式時，Audit 必須對照此協定；在 **基礎課程** 修改韌體解析邏輯時亦然。少了這層，AI 很常「兩邊都改對自己的想像」，實機上卻無車可動。

### （三）無人車入門：手機遙控器作為可即時測試的前端

入門課程之遙控應用典型提供：

- **Web BLE** 模式：掃描／連線車端 GATT，送二進位指令；  
- **Wi-Fi HTTP** 模式：對車端狀態與駕駛 API 握手與遙控；  
- **OTA 上傳前檢查**（若課程開放學員升級車端）：先驗證映像標頭再傳輸，減少誤刷。

前端的「實作」對應本機開發與預覽；「測試」至少包含單元測試（協定／連線邏輯）與實機連線證據。課程文件須寫明瀏覽器限制（例如部分行動瀏覽器對 Web Bluetooth 支援不足），並允許以專業 BLE 掃描工具作為裝置存活之輔助證明。

### （四）無人車基礎：ESP32 韌體作為必須上板才算數的後端

基礎課程之車端韌體將能力收斂為可實車部署的映像，常見包括：

- SoftAP 配網與 STA 自癒；  
- BLE 廣播與指令執行；  
- HTTP 狀態／駕駛 API；  
- OTA 與延遲確認（降低壞映像鎖死）；  
- 馬達 PWM、狀態機與 Watchdog 急停。

韌體的「實作」意味著：建置成功 **且** 部署到板子 **且** 無線或有線介面可達。「測試」意味著：狀態可讀、指令有效、安全機制可觀察（例如逾時無指令後進入安全停止）。

---

## 五、閉環：產生／修改 → 實作 → 測試

本章回答核心提問：在入門與基礎課程中，Vibe Coding 如何在流程上對齊實作與測試目的。

### （一）整體閉環模型

```text
┌──────────────┐    Prompt     ┌──────────────┐
│ 學習者意圖    │ ───────────► │ LLM / Agent  │
│ (遙控或韌體)  │              │ 產生／修改碼  │
└──────────────┘              └──────┬───────┘
                                     │ Audit（對照共享協定／課程手冊）
                                     ▼
                          ┌─────────────────────┐
                          │ 寫入 Monorepo 對應模組 │
                          │ （入門：遙控／基礎：韌體）│
                          └──────────┬──────────┘
             ┌───────────────────────┼───────────────────────┐
             ▼                       ▼                       ▼
      Web 開發與測試            韌體建置                   手冊／SOP
             │                       │
             │                       ├─ 首次／全滅：USB 救援
             │                       └─ 已有 HTTP：OTA
             ▼                       ▼
      手機遙控 UI  ◄──── BLE / Wi-Fi ────► ESP32 實機行為
             │                       │
             └──────── HIL 證據 ◄────┘
        (畫面、狀態 API、BLE、運動、日誌)
```

若任一箭頭斷裂——例如只改碼不部署、只部署不取證、或兩端不對照協定——則 Vibe Coding 停留在「文字產出」，無法宣稱達成實作與測試。

### （二）在無人車入門課程中產生／修改手機遙控器

**典型提示目標（Prompt）**：新增連線模式、修正封包編碼、改善觸控與心跳、對接狀態欄位。

**Audit 清單（教學上應強制）**：

1. 是否遵循共享協定的 UUID 與封包編碼？  
2. Wi-Fi 模式是否指向真實可達的車端位址（而非在已連上家用網路時仍假設熱點位址）？  
3. 是否理解系統藍牙清單不一定顯示 BLE 週邊，需使用支援 Web Bluetooth 的瀏覽器或掃描工具？  

**實作**：安裝依賴 → 啟動開發伺服器 → 以瀏覽器／手機操作。  
**測試證據**：單元測試通過；實機顯示已連線；指令後車端狀態或運動變化。

此階段優勢是 **回饋週期短**；風險是學員誤以為「前端測完＝全系統測完」。

### （三）在無人車基礎課程中產生／修改 ESP32 韌體

**典型提示目標**：調整 Wi-Fi 自癒、加強 OTA 檢查、暴露診斷欄位、修改腳位或 PWM、增加維運指令。

**Audit 清單**：

1. 是否破壞與入門課程遙控器之間的雙端協定？  
2. OTA 是否仍驗證映像合法性？是否避免過早宣告新韌體有效？  
3. SoftAP 策略是否考慮常見行動裝置加入限制（例如需要密碼的熱點）？  
4. Watchdog／急停是否仍在？  

**實作路徑**：

| 板子狀態 | 部署方式 | 說明 |
|----------|----------|------|
| 已有 HTTP（熱點或家用網路） | OTA 上傳課程指定之正式韌體映像 | 網頁或 CLI 上傳後重開驗證 |
| 空板／三無（無熱點、無 STA、無 BLE） | USB 救援燒錄 | 必須寫入完整開機鏈與應用映像 |

**測試證據**：狀態 API 之版本與連線角色；BLE 廣播；駕駛回應；必要時串口日誌。

此階段回饋週期較長、失敗代價較高。因此配網／OTA／USB 手冊應視為 **基礎課程教材的一部分**，而非選讀附錄。

### （四）整合驗收：把「測試目的」寫成繳交物

當入門與基礎能力匯流，HIL 驗收要求學員提交可審查的證據組合，例如：

| 證據 | 對應測試問題 |
|------|----------------|
| 手機遙控畫面截圖 | 遙控 UI 是否在真實手機可用？ |
| 連線成功畫面或狀態列 | HTTP 或 BLE 是否真正握手？ |
| 串口日誌或狀態 API 輸出 | 韌體是否在跑？版本是否正確？ |
| 硬體接線照片 | 是否依課程腳位完成實車組裝？ |
| 實體運動觀察 | 封包是否驅動馬達（而不只是 UI 動畫）？ |

評量若只看自動單元測試，會漏掉射頻、供電與人機操作問題；若只看照片不看協定測試，則可能放過「畫面有、車不動」。雙軌評量才對齊「實作與測試」雙目標。

### （五）PACE 框架在全棧 IoT 的調適

| PACE 階段 | 在遙控器＋韌體情境的內涵 |
|-----------|---------------------------|
| **Prompt** | 同時聲明 UI 行為、封包語意、硬體安全約束與驗收方式 |
| **Audit** | 對照共享協定、課程手冊絕對規則、腳位與 OTA 選檔 |
| **Commit** | 微提交；若改韌體則更新正式映像並記錄版本／位址 |
| **Evaluate** | 單元測試 + HIL 證據；失敗則區分「前端／協定／部署／硬體」 |

Tutor 的角色從「幫寫語法」轉為「幫守閉環」：確保學員在入門或基礎任一側 vibe 之後，都能走到可觀察的實機結果。

---

## 六、發現與討論

### （一）Vibe Coding 能達成實作與測試，但條件是閉環而非模型本身

在無人車入門與基礎課程中，學員可在 Agent／Chat 協助下快速修改遙控器與韌體；成功案例幾乎都具備共享協定、可達部署通道，以及明確的 HIL 證據要求。失敗案例多可歸類為閉環斷裂，而非「模型不夠強」。

### （二）共享協定是對抗雙端幻覺的低成本高槓桿設計

相較於要求學員在入門與基礎兩份講義中手動同步 UUID，將協定放入共享套件並納入測試，能把「說得通的錯誤」變成「測試失敗的錯誤」。對 Vibe Coding 尤其關鍵：AI 擅長局部自洽，不擅長跨模組全域一致。

### （三）OTA 是測試節奏的加速器，USB 是可測性的地板

OTA 使基礎課程的韌體迭代符合 Vibe Coding 的快速節奏。但可測性地板是：板子必須仍有 HTTP（或可 USB 救援）。課程若隱瞞這點，學員會在全滅後誤以為「Vibe Coding 失敗」，實則是部署拓撲失敗。

### （四）模擬加速學習，HIL 定義完成

入門課程的本機預覽與單元測試提供快速迴圈；最終通關仍須真實手機與 ESP32。教學敘事應明確區分兩者，避免以模擬器截圖替代實車驗證。

### （五）文件即課程基礎設施

選錯 OTA 檔、USB 開機鏈不完整、把「已連家用網路故熱點消失」誤判為壞機——皆可文件化。將操作手冊納入課程材料，等於把「給人與給 AI 的系統提示」外部化，使入門／基礎課程在多人、多車場域可複製。

### （六）限制

1. 本文以 Taiwan Vibe Coding Co. 無人車系列課程為個案，外部效度有待跨機構複製驗證。  
2. 所述效益多為工程觀察與教學設計推論，尚未附大規模前後測統計。  
3. 硬體與瀏覽器差異會調節成功率，需在未來研究中控制變因。

---

## 七、結論與建議

### （一）結論

回到研究問題：在 **無人車入門課程** 與 **無人車基礎課程** 的教學脈絡下，Vibe Coding **可以**支撐學習者產生與修改手機遙控器與 ESP32 韌體，並達成實作與測試目的，但必須被鑲嵌在：

1. **Monorepo + 共享協定**——保證改入門側或基礎側任一端都不破壞互通語意；  
2. **可執行的部署路徑**——Web 即時執行、韌體 USB／OTA 上板；  
3. **HIL 雙端驗收**——以實機證據定義「測試通過」。

缺一則容易得到「有程式、無閉環」的假性學習成果。Monorepo 是載體；課程主體仍是 Taiwan Vibe Coding Co. 的無人車入門與基礎能力培養。

### （二）給課程設計者的建議

1. 入門與基礎作業皆應同時給定：要改的模組、要跑的步驟、要交的 HIL 證據。  
2. 將 OTA／USB 失敗模式寫入必讀手冊，並允許 AI 代理引用。  
3. 評量規準區分前端、協定、部署、硬體四類缺陷，避免學員只優化截圖。  
4. 明確教導「STA 健康時熱點關閉」為設計行為，減少錯誤排障。

### （三）給學習者與 Vibe Coding 實踐者的建議

1. 先問「如何測？」，再問「如何讓 AI 寫？」。  
2. 改封包必同步入門遙控器與基礎韌體，並跑協議測試。  
3. 韌體迭代優先維持 HTTP 可達；全滅時接受 USB，不要假裝純無線永遠足夠。  

### （四）未來研究

可進一步：（1）量化閉環教學對除錯時間與首次實機成功率的影響；（2）探索在 Agent 工具鏈中自動執行測試、OTA 探測與狀態斷言；（3）延伸至感測與 Edge AI，同時保持 HIL 證據倫理與安全規範。

---

## 參考文獻

- Andrej Karpathy. (2025). *Vibe Coding*（概念提出與典範討論）. X (formerly Twitter).  
- Collins English Dictionary. (2025). *Word of the Year 2025: Vibe Coding*.  
- Rover Chen & Yui-Liang Chen. (2026a). *Vibe Coding Pedagogy: A Teaching Framework Design Study Based on an IoT Front-End Development Course*. Taiwan Vibe Coding Co.  
- Rover Chen & Yui-Liang Chen. (2026b). *Full-Stack Vibe Coding Pedagogy for IoT Hardware-Software Integration*（前版架構草稿）. Taiwan Vibe Coding Co.  
- Espressif Systems. (2025). *ESP32-C3 Technical Reference Manual*.  
- Taiwan Vibe Coding Co. (2026). 無人車入門課程、無人車基礎課程教材與實機操作手冊（配網、OTA、USB 救援、整合驗收規範）.  

---

## 附錄 A：實作與測試對照表（給教學者）

| 學習目標 | 課程側 | Vibe Coding 焦點 | 實作動作 | 最低測試證據 |
|----------|--------|------------------|----------|--------------|
| 遙控 UI／連線 | 無人車入門 | 遙控應用原始碼 | 啟動開發伺服器並實機連線 | 畫面操作＋連線狀態 |
| 封包語意 | 入門＋基礎 | 共享協定與雙端呼叫點 | 執行協定相關測試 | 測試通過＋實車回應 |
| 韌體行為 | 無人車基礎 | 車端韌體原始碼 | 建置後 OTA 或 USB | 狀態 API、BLE、運動 |
| 無線升級 | 基礎（整合） | 正式韌體映像 | OTA 上傳並重開 | 版本更新且仍可連 |
| 整合通關 | 入門×基礎 | 雙端聯測 | Integration／HIL | 證據組合＋實體動作 |

## 附錄 B：給 AI Agent 的最短系統約束（可貼入課程）

1. 正式 OTA 只使用課程指定的正式韌體映像，勿上傳開機載入器等 USB 專用檔。  
2. USB 全擦後必須寫入完整開機鏈（含應用啟動必要映像），否則可能顯示燒錄成功卻無 App。  
3. 熱點配網與家用網路模式切換屬設計行為；已連上家用網路時熱點關閉可視為正常。  
4. 新韌體勿在開機極早期即宣告 OTA 成功有效，以免壞映像無法回滾。  
5. 驗收以實機 HTTP／BLE／運動為準，不以「程式看起來正確」為準。  
6. 不要承諾「保證永遠不再需要 USB」。  

---

*（全文完）*
