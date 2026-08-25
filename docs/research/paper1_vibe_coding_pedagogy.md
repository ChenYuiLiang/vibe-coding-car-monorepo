**Vibe Coding 教學法：**

**以 Vibe Classroom 為核心之教學架構設計研究**

*Vibe Coding Pedagogy: A Teaching Framework Design Study Centered on Vibe Classroom*

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

2026 年 8 月

**摘　要**

本研究探討「Vibe Coding
教學法」針對國小五六年級至國中階段（對程式設計完全陌生）學員的課程設計與實踐。Vibe
Coding 由 Andrej Karpathy 於 2025 年 2
月提出，描述一種以自然語言提示驅動大型語言模型（LLM）生成程式碼的開發典範，並於
2025 年底獲 Collins 英語詞典選為年度詞彙。課程由 Taiwan Vibe Coding Co.
設計推動，採翻轉教室模式------學員平日透過 vibe-coding.tw
自主學習，每週以三小時讀書會在 Vibe Classroom（GitHub
Classroom）完成作業並分享心得。課程引入 Tutor
輔助制度，讓輔導者陪伴學員完成作業；目前讀書會透過 Teams 針對 Tutor
舉辦，Tutor 再以各種方式引導學員在 Vibe Classroom
中學習，並已在陽明山苗圃童軍營地舉辦過針對童軍（國中生）的實體 Vibe
Classroom。

研究基於課程設計文件分析，提出「PACE 教學框架」（Prompt
Design--Audit--Commit--Evaluate），涵蓋提示設計、AI
程式碼審計、微提交策略與多層評量等四個核心面向，並以 GitHub Classroom 與
GitHub Actions 自動評分作為評量平台。研究發現：（一）Vibe Coding
並未消除程式設計能力的需求，而是將其重新分配於意圖表達、AI
輸出批判評估與迭代精鍊三個向度，且對程式設計陌生的年輕學員同樣可以在
Tutor 鷹架支持下有效參與；（二）有效的 Vibe Coding
課程需要明確的結構性支撐與雙層輔導制度（Tutor→學員），而非放任學習者在無引導的情境下「自由
vibe」；（三）建構主義、鷹架理論與專題導向學習等既有教育理論仍能有效為
Vibe Coding 教學框架提供理論依據，且雙層 Tutor
制與線上自學平台的組合特別有助於跨齡學習社群的形成。本研究的貢獻在於提出一個適用於
K-9 零基礎學員的 Vibe Coding 課程設計框架。

**關鍵詞：**Vibe Coding；AI 輔助程式教學；提示工程；課程設計；Vibe
Classroom；GitHub Classroom；童軍教育；Tutor 輔導制度；翻轉教室

**Abstract**

This study examines the design and implementation of \"Vibe Coding
Pedagogy\" for K-9 learners (5th grade through junior high school) with
no prior programming experience. Vibe Coding, coined by Andrej Karpathy
in February 2025, describes a paradigm in which developers use natural
language prompts to guide large language models (LLMs) in generating
code; the term was named Collins Dictionary Word of the Year 2025.
Designed and operated by Taiwan Vibe Coding Co., the course adopts a
Flipped Classroom model: learners study independently via vibe-coding.tw
and complete weekly three-hour study-group sessions through Vibe
Classroom (built on GitHub Classroom). A two-tier Tutor system is
central to the course design---weekly study groups are currently
conducted on Microsoft Teams for Tutors, who then facilitate student
learning in Vibe Classroom through various formats including an
in-person Vibe Classroom session held at the Yangmingshan Nursery Scout
Camp for Boy Scouts (junior high students).

Through document analysis of course design artifacts, the study proposes
the \"PACE Teaching Framework\" (Prompt
Design--Audit--Commit--Evaluate), encompassing four core dimensions:
prompt engineering, AI code auditing, micro-commit strategy, and
multilayered assessment---implemented via GitHub Classroom and GitHub
Actions autograding. Key findings are: (1) Vibe Coding redistributes
rather than eliminates programming competency demands, and
zero-experience young learners can participate effectively under Tutor
scaffolding; (2) effective Vibe Coding courses for young learners
require explicit structural scaffolding and a two-tier Tutor--student
facilitation model; and (3) constructivism, scaffolding theory, and
Project-Based Learning remain effective theoretical foundations, with
the two-tier Tutor model and online self-study platform particularly
conducive to cross-age learning communities. The contribution of this
study is a theoretically grounded and practically actionable curriculum
design framework for Vibe Coding instruction in K-9 zero-background
learner contexts.

**Keywords:** Vibe Coding; AI-Assisted Programming Education; Prompt
Engineering; Curriculum Design; Vibe Classroom; GitHub Classroom; Scout
Education; Tutor Model; Flipped Classroom

**一、緒　論**

**（一）研究背景**

2025 年 2 月，前 OpenAI 共同創辦人、Tesla AI 前負責人 Andrej Karpathy 在
X（前
Twitter）發文描述了一種嶄新的程式開發方式：「完全沉浸在氛圍中，擁抱指數成長，甚至忘記程式碼的存在（fully
give in to the vibes, embrace exponentials, and forget that the code
even exists）」（Karpathy,
2025）。他將這種以自然語言提示大型語言模型生成程式碼的開發方式稱為「Vibe
Coding」。這個概念迅速引發業界與教育界的廣泛討論，並於 2025 年底被
Collins 英語詞典選為年度詞彙（Collins English Dictionary, 2025）。

Vibe Coding
的興起，對程式設計教育帶來根本性的挑戰。傳統程式設計教育以語法學習為核心，強調邏輯推導與演算法設計；而在
Vibe Coding 的脈絡下，程式碼本身退居為 AI
生成的產物，學習者的核心能力轉移至「如何清楚表達意圖」、「如何批判評估
AI 輸出」以及「如何在人機協作中維持方向感」。Sarkar 與
Drosos（2025）將此稱為程式設計能力的「重新分配（redistribution）」，這種能力的重組催生了對新教學法的迫切需求。

**（二）研究動機**

現有的 AI 輔助程式設計教育研究（Computers, 2025; Springer Nature,
2025a）多聚焦於大學生或有程式設計背景者，較少深入探討如何為完全沒有程式設計經驗的兒童與青少年（K-9）設計
Vibe Coding 課程。Munoz 與 Rook（2026）在管理教育情境中展示了 Vibe
Coding
的課程應用，但其對象為研究所學生，且研究重心在於教育工作者的教材開發，而非學習者的能力培育框架。

對國小五六年級或國中生而言，Vibe Coding
具有特殊的教育潛力：「用自然語言描述想要的功能，讓 AI
生成程式碼」的模式，理論上能大幅降低程式設計的入門門檻，使程式設計不再以語法記憶為前提。然而，這種潛力能否在無程式基礎的年輕學員身上實現，高度依賴課程設計與輔導機制的品質。本研究以
Taiwan Vibe Coding Co. 實際運行的課程為例，探討在 Tutor
輔導制度與翻轉教室模式的支持下，如何為 K-9 零基礎學員設計有效的 Vibe
Coding 學習歷程。

**（三）研究目的與問題**

本研究的目的在於：（一）梳理 Vibe Coding
的學術定義與能力需求；（二）描述一個以 Vibe Coding
為核心的課程設計框架；（三）分析該框架如何呼應相關教育理論。

研究問題如下：

RQ1：Vibe Coding 如何重新定義程式設計能力的核心要素？

RQ2：一個有效的 Vibe Coding 課程應包含哪些設計要素？

RQ3：現有教育理論如何為 Vibe Coding 教學提供理論依據？

**二、文獻探討**

**（一）Vibe Coding 的起源、定義與演化**

Karpathy（2025）在其原始貼文中描述 Vibe Coding
的特徵包括：使用自然語言（甚至語音輸入）與 AI
對話、接受生成的程式碼而不進行逐行審查、以測試執行結果而非程式碼理解作為驗收標準，以及在出現問題時直接向
AI 求助而非手動除錯。這種「讓 AI
處理一切」的描述迅速成為流行文化的一部分，但也引發了教育界對其真正內涵的深入探討。

Sarkar 與 Drosos（2025）對真實的 Vibe Coding
工作階段進行質性分析，蒐集了 8 小時 27 分鐘的專業 Vibe Coder
螢幕錄製影片，並採用主題分析法（thematic
analysis）加以解讀。研究發現實際的 Vibe Coding 遠比 Karpathy
的描述更具結構性。研究者識別出一個循環式的八階段目標達成流程：形成目標→撰寫提示→審查生成程式碼→接受或拒絕→測試→識別錯誤→精鍊或手動除錯→重複。這個流程並非被動接受，而是主動導演。

Sarkar 與 Drosos（2025）並提出三項核心論述，對 Vibe Coding
教學設計具有直接的意涵：

> 第一，「能力重新分配」論述：Vibe Coding
> 並非去除程式設計能力的需求，而是將其形式重新分配。程式設計者的角色從「編寫程式碼」轉為「導演、審核與精鍊
> AI 的輸出」。所需能力分為三個向度：傳統程式設計知識（用於評估 AI
> 輸出的正確性）、AI
> 協作能力（提示撰寫、模型選擇、情境管理）以及產品管理能力（需求定義、優先順序判斷）。
>
> 第二，「有效提示的複合性」論述：有效的提示並非模糊的意圖表達，而是如作者所引述的「模糊的高層指令與精確的技術規格的混合體（blend
> of vague, high-level directives with detailed technical
> specifications）」，包含編號清單、程式碼片段、錯誤訊息、文件連結以及範疇限制語句（如「只做第一階段」）。
>
> 第三，「動態信任」論述：Vibe Coding
> 中的信任是「細粒度的、動態的、有條件的，依賴於警覺性的審查（granular,
> dynamic, contingent on vigilant
> review）」。研究中的受訪者明確表示：「我不相信盲目跟隨 AI」以及「AI
> 只是一個工具」。這種動態信任判斷力是 Vibe Coding 的核心能力之一。

在教育應用面，Munoz 與
Rook（2026）以澳洲一所大學的管理學研究所課程為案例，展示 Vibe Coding
如何使資源有限、缺乏程式設計背景的教育工作者能夠建立互動式
HTML/JavaScript 模擬教材。他們提出 SRVE
框架（Specify--Refine--Verify--Embed），強調結構化的提示流程對教育應用的必要性。作者強調，SRVE
框架的有效性「依賴教育工作者準確規格化學科模型、依據已知標準評估輸出，並在教學意圖的引導下診斷渲染或邏輯失敗的能力」------這一發現與
Sarkar 和 Drosos 的能力重新分配論述高度吻合：領域專業知識是有效 Vibe
Coding 的前提，而非可以繞過的障礙。

在更廣泛的語境中，arxiv 論文 arXiv:2603.14133（2026）以 CHI
會議論文的形式提出，計算機科學背景的學習成就（CS
Achievement）與寫作技能（Writing Skills）是預測 Vibe Coding
熟練度的顯著變數，這再度印證了「領域知識先行」的論點。另外，arXiv:2509.08854（2025）則展示了
Vibe Coding
學習設計在英語外語教學（EFL）情境中的應用，顯示這一典範的跨學科潛力。

**（二）AI 輔助程式設計教育研究**

過去數年，AI 輔助程式設計教育研究快速增長。Computers
期刊（2025）發表的統合分析涵蓋 35 項對照研究，結果顯示使用 AI
工具的學生在任務完成時間與表現分數上均優於未使用者（p \<
0.05）。然而，研究也指出，AI
工具的教育效益高度依賴系統化的教學設計與明確的倫理指引；在缺乏完整教學適應的情況下導入
AI 工具，可能無效甚至加劇學術誠信問題。

關於批判性思維的影響，研究結果呈現分歧：部分研究認為 AI
工具降低了批判性思維的發展機會，但 Springer
Nature（2025a）以專題導向學習整合 AI 的研究則顯示，在適當設計下，AI
輔助可以促進程式設計能力與批判思維的雙重發展。Springer
Nature（2025b）則聚焦於 AI
輔助配對程式設計對學習動機與程式設計焦慮的影響，發現 AI
協作顯著降低了程式設計焦慮感，但需要配合明確的學習鷹架設計。

在程式設計教育的評量平台方面，GitHub Classroom
是過去數年最具代表性的解決方案，其機制值得詳細介紹，因為 Vibe
Classroom------本課程所採用的自建評量平台------正是以 GitHub Classroom
的設計理念為藍本加以延伸開發而成。

**GitHub Classroom 的機制與功能**

GitHub Classroom（以下簡稱 GHC）是 GitHub 於 2018
年推出的免費教育平台，旨在整合 GitHub
的版本控制基礎設施與程式設計課程的作業管理流程，其核心運作機制可分為以下四個面向：

> 第一，作業派發（Assignment Distribution）：教師在 GitHub Organization
> 中建立作業範本儲存庫（starter
> repository），學員透過接受作業邀請連結（invitation
> link）觸發自動流程，GHC 在同一 Organization
> 下為每位學員自動複製一份獨立的私有儲存庫，命名格式為
> assignment-name-student-username，學員對該儲存庫擁有寫入權限，教師與助教則擁有讀取與管理權限。這一機制使作業派發從人工複製範本的繁瑣流程轉化為一鍵自動化。
>
> 第二，自動評分（Autograding）：GHC
> 內建三種評分模式------（a）輸入輸出測試（I/O
> Test）：給定固定輸入，比對程式標準輸出；（b）執行指令測試（Run Command
> Test）：執行自訂 shell 指令，以回傳碼（exit
> code）判斷成功與否；（c）語言框架測試：整合 Jest、JUnit、pytest
> 等測試框架。學員每次 git push 後，GitHub Actions 自動觸發 CI
> 工作流，在 Linux
> 容器中執行測試腳本，結果以綠色勾（✓）或紅色叉（✗）顯示於 GitHub
> Actions 頁面，並同步回傳至 GHC
> 教師儀表板。教師可在儀表板一覽班級所有學員的測試通過狀況，實現「大規模即時評量的可視化管理」。
>
> 第三，課堂管理（Classroom Management）：GHC
> 支援學員名單管理（Roster）、LTI 整合（與 Canvas、Moodle 等 LMS
> 連接以自動同步學員資料）、截止日期設定，以及群組作業（Group
> Assignment）模式，使合作開發也能納入評量。
>
> 第四，版本歷程的教育價值：由於每位學員的作業均儲存於完整的 Git
> 儲存庫，教師可查閱學員的 commit
> 歷史，觀察其開發歷程------何時開始、修改了幾次、是否在截止日前一刻大量提交------這些歷程數據是傳統批改所無法獲得的學習行為洞察。

然而，GitHub 於 2026 年 5 月宣告 GHC 停止接受新用戶，並定於 2026 年 8 月
28 日完全關閉平台，相關學員資料將於 2026 年 9 月 4 日依 GitHub
的資料保留政策永久刪除（GitHub Changelog, 2026）。GitHub 官方說明，GHC
在過去 18 個月已進入「維護模式（maintenance
mode）」，未再積極開發新功能，官方建議教育者轉移至 Codio
等合作夥伴平台。

GHC
的停辦使全球依賴此平台的程式設計課程面臨評量系統遷移的迫切需求，也突顯了對第三方教育服務過度依賴的風險。正是在此背景下，Taiwan
Vibe Coding Co. 選擇自行開發 Vibe
Classroom，以確保平台的長期可控性，並得以針對 Vibe Coding
的教學需求進行深度客製化------這是採用 GHC 或其他現成平台所無法實現的。

Autograder+（2025）在 GHC 停辦前提出了一個多面向的 AI
框架，將自動評分從「總結性評量工具（summative evaluation
tool）」轉型為「形成性學習平台（formative learning
platform）」，透過微調 LLM 生成細粒度的教學回饋，其設計理念亦為 Vibe
Classroom 的評量功能開發提供了重要參考。Automated Assessment in Mobile
Programming Courses（2025）的研究亦顯示，GHC
模式的自動評分在行動程式設計課程中能有效提升學習成效。

**（三）理論基礎**

本研究的課程設計框架植根於三個互補的教育理論：

**1. 建構主義（Constructivism）**

Vygotsky（1978）的社會建構主義（Social
Constructivism）強調學習發生於社會互動與主動建構知識的過程中，並提出近側發展區（Zone
of Proximal Development, ZPD）的概念------學習者在「更有能力的他者（More
Knowledgeable Other, MKO）」的協助下，能夠完成超出其獨立能力的任務。在
Vibe Coding 的教學情境中，AI 系統扮演了 MKO
的角色，提供即時的程式碼示範與解決方案，使學習者能夠在其 ZPD
內持續延伸能力邊界。Piaget（1964）的認知建構主義則強調知識透過主動的「同化（assimilation）」與「調適（accommodation）」過程建構，這與
Vibe Coding 中「提示→審查→精鍊」的迭代循環具有高度的理論對應性。

**2. 鷹架理論（Scaffolding Theory）**

Wood、Bruner 與
Ross（1976）提出的鷹架概念，描述能力較強者如何為學習者提供臨時但有針對性的支撐，使其能完成超出當前獨立能力的任務，並在能力增長後逐步移除支撐。在
Vibe Coding 教學中，AI
工具扮演動態鷹架的角色------根據學習者的提示品質與問題描述的精確程度，提供不同深度的程式碼支援。鷹架理論的關鍵在於「退出（fading）」機制：隨著學習者對特定概念掌握程度提升，AI
協助的比例應逐漸降低，讓學習者承擔更多的認知責任。本研究課程的分階段設計（從基礎環境設置到完整
Vibe Coding 工作流整合）即體現了這種漸進式鷹架退出的設計思維。

**3. 專題導向學習（Project-Based Learning, PBL）**

Blumenfeld 等人（1991）的 PBL 理論強調真實情境（authentic
context）、驅動性問題（driving question）、跨學科整合（interdisciplinary
integration）與知識展示（artifact creation）等核心要素。本課程以可在
Vibe Classroom
中派發、提交與自動評分的專題式 Web
應用為驅動性問題：學習者必須整合版面、觸控互動、非同步邏輯與（視單元而定的）裝置通訊概念，並以可展示的成品與通過測試的儲存庫作為驗收。這種以真實任務與平台回饋作為標準的設計，使學習者的學習動機與問題解決的真實性大幅提升，也使
Vibe Coding 不再是為了練習而練習，而是為了完成可被看見、可被評量的作品。

**三、課程設計框架**

**（一）課程背景**

本研究所分析的課程（以下稱「本課程」）由 Taiwan Vibe Coding Co.
設計與推動，以「Vibe Coding
教學實驗室」為名，主要服務對象為國小五六年級至國中階段的學員------這個年齡層對程式設計普遍是完全陌生的，甚至對
AI
輔助開發工具也缺乏既有認識。課程的核心設計挑戰因此是：如何讓零基礎的年輕學員也能透過
Vibe Coding 模式有效地學習與創作，而不被程式語法的高門檻所阻擋。

**1. 翻轉教室架構**

課程採用翻轉教室（Flipped Classroom）作為核心教學模式：學員平日透過 Vibe
Coding
專屬教學網站（vibe-coding.tw）進行自主學習，網站涵蓋概念介紹、工具使用教學與範例程式說明；每週固定安排三小時的讀書會，透過
Vibe Classroom（Taiwan Vibe Coding Co.
自行開發的教學評量平台，詳見下節）完成作業，並分享做作業的過程、成果與心得。這種設計呼應
Bloom
教育目標分類法的翻轉精神：較低階的記憶與理解交由線上平台在課前完成，較高階的應用、分析與評估則在讀書會的社群學習環境中發生。

**2. Vibe Classroom：自行開發的評量平台**

有別於使用現成的第三方服務，Taiwan Vibe Coding Co. 參考 GitHub Classroom
的核心設計理念，自行開發了「Vibe
Classroom」作為課程的評量與作業管理平台。這個選擇源自兩個現實考量：其一，GitHub
Classroom 已於 2026 年 5 月停止新用戶申請，並宣告同年 8 月 28
日完全關閉，仰賴現成平台的課程面臨系統遷移風險；其二，Vibe Coding
的教學情境具有獨特需求------VIBE.md、AUDIT.md 等文件評量機制、AI
來源標籤的 commit 分析、Tutor
層級的班級管理介面------這些功能均超出通用平台的設計範疇，需要深度客製化。

Vibe Classroom 保留了 GitHub Classroom 最核心的教育價值：以 GitHub
Organization 為基礎的作業儲存庫自動派發（每位學員獲得獨立的 Git
儲存庫）、GitHub Actions 驅動的自動評分（每次 git push
觸發測試、以紅燈/綠燈即時回饋）、教師儀表板一覽所有學員測試進度。在此之上，Vibe
Classroom 進一步整合了：PACE
框架的文件評量入口（VIBE.md、SPEC.md、AUDIT.md
的提交與查閱介面）、commit 標籤的統計分析（\[AI-Generated\] /
\[Human-Modified\] 分布視覺化），以及針對 Tutor 角色的班級管理功能。

**3. 雙層 Tutor 輔導制度**

針對 K-9 零基礎學員，課程引入 Tutor
輔助制度作為關鍵的人力鷹架。目前的讀書會透過 Microsoft Teams
舉辦，對象主要為 Tutor（輔導者）；Tutor
在讀書會中掌握課程內容、作業流程與 Vibe Coding
工具的使用方式後，再以各種自行設計的方式，引導其所負責的學員在 Vibe
Classroom 中完成學習任務。這種「培訓 Tutor，再由 Tutor
帶領學員」的雙層架構，在師資資源有限的情況下實現了個別化輔導的可及性，也使課程能夠靈活地擴展至不同的實施情境。

Tutor 在此模式中扮演的角色，與
Vygotsky（1978）所描述的「更有能力的他者（MKO）」高度吻合------Tutor
本身已掌握 Vibe Coding 工作流，能夠在學員面對 AI
輸出無從判斷時，以提問（「這段程式碼在做什麼？」）、示範或共同除錯的方式，協助學員在近側發展區內推進。這種人際鷹架（interpersonal
scaffolding）是 AI 工具無法單獨提供的：AI 提供的是技術生成的鷹架，Tutor
提供的是情緒支持與認知引導的鷹架，兩者的組合對零基礎年輕學員尤其關鍵。

**4. 陽明山苗圃童軍營地實體 Vibe Classroom**

課程已在正式讀書會之外，進行了一次具指標意義的實體 Vibe
Classroom------於台北市陽明山苗圃童軍營地，針對童軍（國中生）舉辦實地教學活動。這次實體
Vibe Classroom 展示了課程超越線上格式的彈性：Tutor
在戶外環境中引導童軍以平板或筆電連上 Vibe Classroom，在 AI
輔助下完成程式設計任務，並進行成果分享。這種將 Vibe Coding
學習帶入非典型學習場域（童軍活動、戶外營地）的嘗試，對台灣青少年程式教育的推廣具有重要的示範意義------程式設計學習不必然發生在教室裡，只需有網路、有裝置、有
Tutor 陪伴，Vibe Classroom 即可在任何地方展開。

**5. 課程技術情境與 Vibe Classroom 的角色**

課程以 Web 技術（HTML5、CSS Flexbox/Grid、JavaScript／TypeScript）為主要技術情境，引導學習者完成可在瀏覽器運行的互動式專題。**Vibe
Classroom** 是整條學習路徑的主軸：作業由平台派發至學員獨立 Git
儲存庫，學員在本地以 AI
輔助完成修改後推送，GitHub Actions
自動評分以紅燈／綠燈回饋功能正確性；Tutor
則透過平台掌握進度並介入輔導。課程共設計多個獨立模組，涵蓋從基礎開發環境設置（編輯器、GitHub
身分設定）到進階互動（觸控事件、Canvas、非同步流程，以及視單元需要的
Web API）的完整學習路徑——評量與社群學習始終發生在 Vibe Classroom
所串起的作業—提交—回饋循環之中。

課程的技術棧包含：HTML5 Canvas
圖形渲染（requestAnimationFrame、座標系統、三角函數）、CSS Grid 3×3
十字鍵佈局（grid-template-areas、aspect-ratio）、JavaScript
觸控事件（touchstart/touchmove/touchend、preventDefault、Ghost Click
防禦）、setInterval 指令流管理、Dead Man\'s Switch 失效安全機制、JSON
封包設計（Packet Slimming）、TypedArray 與 DataView 二進制資料封裝，以及
Web Bluetooth API GATT 通訊（BLE 裝置搜尋、授權、狀態機）。對於 K-9
零基礎學員而言，這些技術本身並非學習的終點，而是在 Vibe Coding
模式下體驗「描述需求→AI 生成→測試驗證→迭代修正」的完整創作循環的載體。

**（二）PACE 教學框架**

基於對課程設計文件的系統分析，本研究歸納出一個四階段的 Vibe Coding
教學框架，稱為 PACE 框架（見圖 1）。PACE 框架嘗試在
Karpathy（2025）的「完全沉浸在氛圍中」的哲學宣言，與教育場景需要的結構性與問責性之間，找到一個可操作的平衡點。

  ---------------------------------------------------------------------------------------------------------------------------------------------
  **階段**   **PACE 要素**             **課程實作**
  ---------- ------------------------- --------------------------------------------------------------------------------------------------------
  P          Prompt Design（提示設計） 撰寫 docs/VIBE.md，記錄作業願景、Prompt 設計邏輯與預期 AI 輸出

  A          Audit（AI 程式碼審計）    撰寫 docs/AUDIT.md，系統記錄對 AI 生成程式碼的審查、問題識別、修正方式與安全審計

  C          Commit（微提交策略）      每個開發階段進行微提交，並以語義標籤標記程式碼來源：\[AI-Generated\]、\[Human-Modified\]、\[AI-Fixed\]

  E          Evaluate（多層評量）      第一層：GitHub Actions 自動化功能測試（紅燈轉綠燈）；第二層：VIBE.md、SPEC.md、AUDIT.md 文件質性評核
  ---------------------------------------------------------------------------------------------------------------------------------------------

*表 1：PACE 教學框架概覽*

**1. P --- Prompt Design（提示設計）**

Vibe Coding 的入口是有效的 Prompt 撰寫。本課程要求學習者在 docs/VIBE.md
中記錄其作業願景與 Prompt 設計邏輯，包含預期 AI
生成的功能與介面描述、學習目標對應關係，以及對可能挑戰的預判。這一步驟強迫學習者在動筆前先釐清需求，呼應
Munoz 與 Rook（2026）SRVE 框架中「Specify」階段的重要性。

VIBE.md 的設計也對應 Sarkar 與
Drosos（2025）所觀察到的「高層指令與技術規格混合」的有效提示特徵------學習者必須先能以文字清楚表達「我想要什麼」（高層意圖）以及「應有的輸入輸出規格是什麼」（技術約束），才能撰寫出有效的提示。這種「先書寫、再提示」的設計，實質上是將提示工程（Prompt
Engineering）納入學習活動本身，而非視之為輔助工具的使用技巧。

**2. A --- Audit（AI 程式碼審計）**

本課程最具特色的設計在於 docs/AUDIT.md，要求學習者系統化地記錄對 AI
生成程式碼的審查過程，包含：（a）使用的 Prompt
與生成程式碼的概述；（b）識別的問題清單（功能性問題、安全性問題、效能問題）；（c）各問題的修正方式與修正後的程式碼片段；（d）安全審計結果（尤其是識別並移除硬編碼的敏感資訊，如
API 金鑰）。

這一設計直接回應了 Sarkar 與
Drosos（2025）的「動態信任」論述與「印象派掃描」觀察。課程並非教導學習者盲目信任
AI，而是培育其建立基於警覺性審查的動態信任判斷力------能夠識別 AI
輸出何時可以直接採用，何時需要進一步驗證，何時需要完全重寫。AUDIT.md
將這種判斷過程外顯化，使其成為可評量的學習成果，而非內隱的認知技能。

**3. C --- Commit（微提交策略）**

本課程要求學習者在每個開發階段進行微提交（Micro-commit），並以語義化標籤標記程式碼來源：\[AI-Generated\]
表示 AI 直接生成且未經修改的程式碼；\[Human-Modified\] 表示在 AI
輸出基礎上人工修改的版本；\[AI-Fixed\] 表示人工識別問題後再次請求 AI
修正的版本。

這一設計的核心目的有三：第一，強制學習者維持對開發歷程的持續意識，避免
Karpathy
原始描述中「忘記程式碼的存在」的認知陷阱；第二，為學習者建立可查閱的開發軌跡，支持反思性學習（reflective
learning）；第三，培育學習者對 AI
協作的問責意識（accountability），使其理解每一行程式碼的來源與責任歸屬。從
git commit 歷史中，教學者可以分析學習者的 AI
依賴程度、人工介入的時機與深度，以及問題修正的迭代次數，這些都是傳統教學難以蒐集的學習歷程數據。

**4. E --- Evaluate（多層評量）**

本課程採用兩層互補的評量設計，以彌補單一評量方式的不足：

> 第一層為自動化功能評量：透過 GitHub Actions 在每次 git push 後自動執行
> Jest
> 測試腳本，使學習者能即時得知程式碼的功能正確性。這一設計借鑒了測試驅動開發（TDD）的精神------學習者在開發過程中持續面對客觀的「紅燈」與「綠燈」回饋，而非等待教學者人工批改。「紅燈轉綠燈」的過程本身就是一個完整的問題解決學習循環，且每次
> push 都是一次有記錄的學習嘗試。
>
> 第二層為文件質性評量：VIBE.md（提示設計邏輯）、SPEC.md（完整規格說明書，包含功能描述、介面定義與驗收標準）、AUDIT.md（AI
> 審計與修正記錄）以及
> automation-proposal.md（自動化工作流提案）的評核，要求學習者展示其對
> AI
> 協作過程的理解與反思，而非僅以程式碼正確性作為唯一評量依據。這一設計回應了
> Munoz 與 Rook（2026）所強調的「領域專業知識是有效 Vibe Coding
> 的前提」------能夠撰寫高質量 SPEC.md
> 的學習者，必然對問題域有深入理解；能夠撰寫有洞見的 AUDIT.md
> 的學習者，必然對程式品質有明確的判斷標準。

**（三）課程模組與任務序列**

本課程的學習路徑採漸進複雜度（progressive
complexity）設計，可分為四個學習階段，每個階段在前一階段的知識基礎上引入新的能力挑戰。

**1. 第一階段：開發環境與開發者身份建立**

學習者從建立 GitHub 帳號、啟用雙步驟驗證、設定 VS Code
開始，逐步熟悉雲端開發環境（GitHub
Codespaces）與跨裝置同步開發的工作流程。這一階段的核心在於建立開發者身份認同（developer
identity）------學習者開始以「具備 GitHub
帳號的開發者」而非「學生」的角色定位自身。這種身份轉換在心理層面上為後續的
Vibe Coding 協作學習奠定基礎。

**2. 第二階段：Web 前端基礎與行動端設計**

涵蓋 HTML5 語義化標籤、CSS Flexbox 與 Grid
排版、觸控事件生命週期（touchstart、touchmove、touchend）與行動端防禦性程式設計（preventDefault、Ghost
Click 防禦、Dead Man\'s Switch
失效安全機制）。這一階段以行動端**互動控制面板**為情境，使學習者在真實的
UX
問題（如 iOS 300ms 點擊延遲、touchstart 與 mousedown 的衝突、Fitts\' Law
觸控熱區設計）中學習技術概念，而非在脫離情境的語法練習中。成品需在
Vibe Classroom 通過自動測試，並能以截圖或示範證明於手機瀏覽器可用。

CSS Grid 3×3
十字鍵控制面板是這一階段的代表性設計。學習者需實作一個在手機直向（Portrait）與橫向（Landscape）模式下均不變形的面板，具備啟用／停用的動態狀態、物理按壓下沉感（translateY +
inset shadow）以及多層次 z-index
疊加效果。這些設計挑戰在工業界的行動端 Web 開發中具有高度的真實性。

**3. 第三階段：資料處理與進階互動**

涵蓋 JSON 資料設計與精簡、TypedArray／DataView
等二進位資料概念、HTML5 Canvas
圖形渲染（虛擬搖桿的座標系統、Math.atan2 方向計算、requestAnimationFrame
動畫循環），以及視單元需要而引入的瀏覽器進階 API（例如裝置連線相關
Web API）之搜尋、授權與資料讀寫概念。

這一階段涉及較廣的跨模組整合，也最能體現 Vibe Coding
的教育優勢------學習者可以透過 AI
快速建立對陌生 API 與資料格式的初步理解，再將精力集中在關鍵細節與
Vibe Classroom
測試回饋上的深度學習。跨瀏覽器支援差異（部分 API 僅在特定瀏覽器可用）亦迫使學習者理解平台限制，這是真實前端工程每天面對的問題。

**4. 第四階段：Vibe Coding 工作流整合**

這一階段以模組 03-unit-github-classroom 為核心，要求學習者進行完整的
Vibe Coding 工作流演練：撰寫需求規格（SPEC.md）、使用 AI
生成初版程式碼、識別並修正 AI
引入的問題（包括硬編碼敏感資訊的安全審計）、記錄於
AUDIT.md、實施帶有來源標籤的微提交策略、觀察 GitHub Actions
自動評分從紅燈到綠燈的轉換，最終提出自動化工作流提案（automation-proposal.md）。

這一階段的核心學習目標不在於特定技術的掌握，而在於完整 Vibe Coding
工作流的體驗與反思------學習者在此階段能夠整合前三個階段的技術能力，並在一個完整的
AI 協作開發流程中，體驗「人機協作中的決策責任」。

**四、觀察與反思**

**（一）PACE 框架的教育效果觀察**

從課程設計文件與任務結構的分析中，可以觀察到若干值得注意的教育現象：

第一，以真實問題為驅動、並在 Vibe Classroom
中完成提交與回饋的學習設計，顯著提升了任務的意義感。學習者在完成互動式
Web
專題時，需要整合版面、觸控事件、非同步流程與狀態管理等多個知識領域；這種複雜度在傳統課程中可能造成認知超載，但在
Vibe Coding 輔助與平台即時評量下，學習者可以先透過 AI
快速搭建骨架，再逐步深入理解各個環節。這與 Vygotsky（1978）ZPD 理論中
MKO 協助學習者突破認知邊界的描述高度一致。

第二，微提交策略（PACE 框架的 C 面向）似乎對學習者的 AI
使用習慣產生了結構化效果。要求學習者明確標記
\[AI-Generated\]、\[Human-Modified\] 的設計，使其無法完全依賴
AI「直通車」完成作業，而必須主動介入、修改並為修改負責。這種設計迫使學習者在每次
AI 互動後停下來思考：「這段程式碼是我理解的嗎？我需要修改什麼？」這呼應
Sarkar 與 Drosos（2025）的核心發現：有效的 Vibe Coding
從來不是被動接受，而是主動導演。

第三，SPEC.md 與 AUDIT.md
的文件要求，實質上扮演了後設認知（metacognition）鷹架的角色。學習者透過書寫這些文件，被迫對自己的
AI
協作過程進行外顯化的反思。Flavell（1979）將後設認知定義為個體對自身認知過程的知識與調控，而
SPEC.md 與 AUDIT.md 正是這種後設認知的文字化載體。這一設計使「反思 AI
協作過程」從一個抽象的教學目標，轉化為可量化評量的具體學習成果。

**（二）挑戰與限制**

**1. 技術多樣性帶來的認知負荷**

課程涵蓋的技術棧廣度------例如版面配置、觸控事件、Canvas、非同步流程，以及部分單元涉及的
Web API------對學習者和教學者均構成相當的認知負荷。AUDIT.md
與 Vibe Classroom
上的失敗提交顯示，學習者常在瀏覽器差異、權限對話或非同步狀態上投入大量調試時間；這雖然接近真實開發情境，但對初學者可能造成挫折感，進而降低學習動機。如何在真實複雜度與學習可行性之間取得平衡，並善用
Tutor 與平台回饋分擔負荷，是這類課程持續面對的核心挑戰。

**2. AI 依賴與深度理解的張力**

Munoz 與 Rook（2026）指出，LLM 的快速能力演進使得手動完成過去需要 5--50
小時的工作，在早期 2026 年的模型（如 Gemini 2.5 Pro）下可能只需不到 10
分鐘。當 AI
能夠幾乎一鍵完成所有任務時，如何確認學習者真正理解了底層原理，而非僅是有效的「Prompt
操作員」，是評量設計的根本挑戰。本課程的 SPEC.md 與 AUDIT.md
嘗試透過文件品質來間接評估理解深度，但仍缺乏更直接的理解驗證機制（如口頭問答或即時修改測試）。

**3. 先備知識差異的放大效應**

Sarkar 與 Drosos（2025）的分析與
arXiv:2603.14133（2026）的研究均顯示，有效的 Vibe Coding
高度依賴既有的程式設計基礎知識。這意味著 Vibe Coding
工具可能對已有基礎的學習者如虎添翼，對完全初學者卻可能造成「表面上能產出程式碼，但不理解為什麼」的學習假象（illusion
of
understanding）。本課程透過第一至三階段的漸進式設計試圖緩解這個問題，但此張力在課程設計層面仍未完全解決，且隨著
AI 工具能力的持續提升，這一問題將愈加突出。

**五、討　論**

**（一）PACE 框架的理論定位**

本研究提出的 PACE 框架，在現有的 Vibe Coding
教育研究中具有以下幾點理論定位：

與 Munoz 與 Rook（2026）的 SRVE 框架相比，PACE
框架更明確地聚焦於學習者的能力發展，而非教育工作者的教材開發。SRVE
的「Verify」步驟對應 PACE 的「Audit」，但 PACE
更進一步，要求學習者以書面形式記錄審計過程，並以 Git
提交紀錄建立可追溯的問責鏈。此外，PACE 的「Commit」面向是 SRVE
框架所未觸及的------微提交策略與語義標籤系統不僅是技術工具，更是學習歷程的文件化機制。

與 Sarkar 與 Drosos（2025）的學術研究相比，PACE
框架將「印象派掃描」、「動態信任」等觀察性發現轉化為明確的教學目標與評量標準。「培育學習者的動態信任判斷力（calibrated
trust）」從一個研究性概念，轉化為 AUDIT.md
的評量設計；「微提交迭代節律」從工作流觀察，轉化為課程要求的 C 面向。

與既有的 PBL 研究相比，PACE 框架的獨特之處在於引入了「AI
協作的問責性（AI collaboration
accountability）」這一新的課程設計元素。傳統 PBL
的問責機制主要透過成果展示（presentation）實現；PACE 框架則透過 Git
提交歷史、VIBE.md 與 AUDIT.md
的組合，建立了一個具有時序性的人機協作問責系統。

**（二）Vibe Coding 作為程式設計素養的構成要素**

Collins 詞典將 Vibe Coding 選為 2025
年度詞彙，標誌著這一概念已超越技術社群，進入更廣泛的文化討論。Built
In（2025）認為 Vibe Coding 正在成為一種關鍵的數位素養（digital
literacy），使更多非程式設計背景的人能夠參與軟體創建。

然而，本研究的課程設計與 Sarkar 及
Drosos（2025）的研究均指向同一個反直覺的結論：真正有效的 Vibe Coding
需要更高、而非更低的技術素養。能夠撰寫有效 Prompt
的人，必須對問題域、程式架構與可能的失敗模式有深刻理解；能夠進行有意義的
Audit 的人，必須具備基本的程式碼閱讀能力與安全意識；能夠選擇何時使用
AI、何時手動撰寫的人，必須對整體架構有清晰的掌握。

這一發現對課程設計有深遠的意涵：Vibe Coding
教學不應取代傳統的程式設計基礎教育，而應建立於其上------以 Vibe Coding
工具作為強化學習效率的媒介，而非繞過基礎知識的捷徑。本課程四階段的漸進設計正是這一理念的具體實踐：在學習者具備基本的
Web 前端技術能力後，才引入完整的 Vibe Coding 工作流整合。

**（三）對台灣資訊教育與青少年社群的啟示**

台灣的資訊教育正面臨一個關鍵的轉折點。108
課綱已將運算思維（Computational
Thinking）納入高中必修，但在年齡層向下延伸至國小與國中的實踐上，AI
工具的教學角色尚未形成清晰的教學共識。部分教育工作者傾向禁止學生使用
AI，以維護學術誠信；另一部分則傾向全面開放，但缺乏系統性的引導框架。

本研究的 PACE 框架提供了一條中間道路：不禁止 AI，但通過 AUDIT.md
的問責設計和微提交的來源標記，使 AI 的使用過程「透明化」。對 K-9
學員而言，這種透明化策略尤為重要------年輕學員更容易不加思辨地接受 AI
的輸出，而明確的 \[AI-Generated\] 與 \[Human-Modified\]
標記要求，能夠在認知層面建立「AI
生成的程式碼需要人的判斷才算完成」的觀念，這是數位素養教育中至關重要的批判性思維養成。

在推廣路徑上，本課程在陽明山苗圃童軍營地舉辦的實體 Vibe Classroom
提供了一個值得關注的模型：童軍運動在台灣擁有廣泛的青少年基礎，其「做中學（Learning
by Doing）」的教育哲學與 Vibe Coding 的實作導向高度契合。將 Vibe Coding
課程引入童軍活動體系，可借助童軍的組織網絡（大隊、師長、活動制度）快速觸及廣大的國中生群體，形成低成本、高覆蓋率的推廣路徑，且童軍中的「學長帶學弟」精神與本課程的雙層
Tutor 制度亦有天然的結構吻合。

在評量工具的可及性方面，Vibe Classroom
的自行開發模式對台灣資訊教育社群具有重要示範意義：當 GitHub Classroom 於
2026 年關閉後，依賴該平台的課程必須緊急遷移；而 Vibe Classroom
的存在說明，以 GitHub Organization 與 GitHub Actions
為技術底層、自建教學評量前台，是一條兼具技術可行性與教育適切性的路徑。GitHub
Actions 本身為免費開源工具，GitHub Free 方案即包含每月一定額度的 CI
執行時間，使自動評分的基礎設施成本對非營利教育機構而言幾乎可降至零。這對資源有限的國中小學校、社區讀書會或童軍活動等非正規教育場域，具有高度的可及性優勢。

**六、結　論**

本研究以 Taiwan Vibe Coding Co. 透過 **Vibe Classroom**
運行的課程實踐為案例，提出 PACE 教學框架（Prompt
Design--Audit--Commit--Evaluate），嘗試回應 Vibe Coding
帶來的程式設計教育典範轉移。研究的主要發現如下：

第一，回應 RQ1（Vibe Coding 如何重新定義程式設計能力）：Vibe Coding
並非去除程式設計能力的需求，而是將其重新分配於提示設計（P）、AI
輸出批判評估（A）與迭代精鍊（C）三個向度。這呼應 Sarkar 與
Drosos（2025）的能力重新分配論述，也對應 Munoz 與
Rook（2026）對領域專業知識不可或缺性的強調。新增的能力要素（如提示工程、AI
審計、動態信任判斷）並未取代，而是補充了傳統的演算法設計與語法能力。

第二，回應 RQ2（有效 Vibe Coding 課程的設計要素）：PACE
框架識別出四個核心設計要素：結構化的提示設計培育（VIBE.md）、系統化的 AI
程式碼審計機制（AUDIT.md）、帶有問責標記的微提交策略，以及兼顧功能正確性與過程理解的多層評量設計。此外，漸進複雜度的任務序列、以
**Vibe Classroom** 為主軸的作業派發／自動評分／Tutor
輔導循環，以及可展示的專題成品，也是有效課程設計的重要元素。

第三，回應 RQ3（相關教育理論的適用性）：建構主義（AI 與 Tutor 作為
MKO）、鷹架理論（漸進式支援退出）與
PBL（真實專題與平台驗收作為驅動性問題）三個理論框架，均能有效為 PACE
框架提供理論依據，且三者之間具有良好的互補性。

本研究的理論與實踐貢獻在於：以 **Vibe Classroom**
為課程運行與評量的核心載體，提出兼具理論根據（建構主義、鷹架理論、PBL）與實踐操作性（PACE
四要素）的 Vibe Coding 教學框架，填補了現有研究中以教育工作者為中心（Munoz &
Rook, 2026）或以工作流分析為主（Sarkar & Drosos,
2025）的研究之間，缺乏以學習者能力培育與課堂平台機制為核心的課程設計框架這一空白。

本研究的限制在於分析對象僅為單一課程的設計文件，缺乏系統性的學習成效量化數據。未來研究可進一步蒐集學習者的作業提交紀錄（如
commit 標籤分布的量化分析、AUDIT.md
的質性內容編碼、測試通過率的縱向追蹤）進行更嚴謹的實證研究，並探索 PACE
框架在不同教育層次（高中、大學、職業技術培訓）與不同學科情境（非資工系的程式設計必修、跨領域
STEM 課程）中的適用性。

**參考文獻**

Automated Assessment in Mobile Programming Courses. (2025). Automated
assessment in mobile programming courses: Leveraging GitHub Classroom
and Flutter for enhanced student outcomes. arXiv:2504.04230.

Autograder+. (2025). Autograder+: A multi-faceted AI framework for rich
pedagogical feedback in programming education. arXiv:2510.26402.

Blumenfeld, P. C., Soloway, E., Marx, R. W., Krajcik, J. S., Guzdial,
M., & Palincsar, A. (1991). Motivating project-based learning:
Sustaining the doing, supporting the learning. Educational Psychologist,
26(3--4), 369--398.

Built In. (2025). Why you should consider vibe coding a vital literacy
skill. Retrieved from
https://builtin.com/articles/vibe-coding-literacy-skill

Collins English Dictionary. (2025). Word of the Year 2025.
HarperCollins.

GitHub Changelog. (2026, May 26). GitHub Classroom sign-ups are no
longer available. Retrieved from
https://github.blog/changelog/2026-05-26-github-classroom-sign-ups-are-no-longer-available/

GitHub Community Discussions. (2026). Important announcement for
educators: GitHub Classroom functionality will be transitioning to
partners. Retrieved from
https://github.com/orgs/community/discussions/196615

Computers. (2025). The influence of artificial intelligence tools on
learning outcomes in computer programming: A systematic review and
meta-analysis. Computers, 14(5), 185.
https://doi.org/10.3390/computers14050185

Computer Science Achievement and Writing Skills Predict Vibe Coding
Proficiency. (2026). Computer science achievement and writing skills
predict vibe coding proficiency. Proceedings of the 2026 CHI Conference
on Human Factors in Computing Systems.
https://doi.org/10.1145/3772318.3791666

Flavell, J. H. (1979). Metacognition and cognitive monitoring: A new
area of cognitive--developmental inquiry. American Psychologist, 34(10),
906--911.

Karpathy, A. (2025, February 2). There\'s a new kind of coding I call
\"vibe coding\" \[Post\]. X (formerly Twitter).
https://x.com/karpathy/status/1886192184808149383

Munoz, A., & Rook, L. (2026). Leveraging generative AI through vibe
coding: A case of simulation-based curriculum redesign in management
education. Education Sciences, 16(4), 558.
https://doi.org/10.3390/educsci16040558

Nucamp. (2025). Rethinking coding education: Teaching the next
generation in a vibe coding world. Retrieved from
https://www.nucamp.co/blog/vibe-coding-rethinking-coding-education-teaching-the-next-generation-in-a-vibe-coding-world

Piaget, J. (1964). Part I: Cognitive development in children: Piaget
development and learning. Journal of Research in Science Teaching, 2(3),
176--186.

Prompt Engineering as a 21st-Century Literacy. (2025). Prompt
engineering as a 21st-century literacy: A K-12 curriculum design and
assessment framework. ResearchGate.
https://www.researchgate.net/publication/395179480

Sarkar, A., & Drosos, I. (2025). Vibe coding: Programming through
conversation with artificial intelligence. arXiv:2506.23253.
https://arxiv.org/abs/2506.23253

Springer Nature. (2025a). Fostering programming skill and critical
thinking through AI-assisted PBL integration. Journal of New Approaches
in Educational Research.
https://link.springer.com/article/10.1007/s44322-025-00041-0

Springer Nature. (2025b). The impact of AI-assisted pair programming on
student motivation, programming anxiety, collaborative learning, and
programming performance. International Journal of STEM Education.
https://link.springer.com/article/10.1186/s40594-025-00537-3

Vibe coding learning design for EFL students. (2025). A vibe coding
learning design to enhance EFL students\' talking to, through, and about
AI. arXiv:2509.08854.

Vygotsky, L. S. (1978). Mind in society: The development of higher
psychological processes. Harvard University Press.

Wood, D., Bruner, J. S., & Ross, G. (1976). The role of tutoring in
problem solving. Journal of Child Psychology and Psychiatry, 17(2),
89--100.
