# SSIM 2026 Oral Presentation: Slide-by-Slide Outline & Script

> **Conference**: 2026 International Conference on Social Science and Intelligent Management (SSIM 2026)  
> **Session**: EdTech, Human-Centered AI & Intelligent Systems  
> **Date & Venue**: December 17–19, 2026 ｜ Chaoyang University of Technology (CYUT), Taiwan  
> **Papers Synthesized**:
> * **Paper 28 (CMT ID: 19)**: *Vibe Coding Pedagogy: A Teaching Framework Design Study Centered on Vibe Classroom*
> * **Paper 27 (CMT ID: 18)**: *Full-Stack Vibe Coding Pedagogy for IoT Hardware-Software Integration: A Monorepo Architecture and Hardware-in-the-Loop Verification Study*
> **Presenter (主講)**: **Rover (Yu-Kuan) Chen** *(Taiwan Vibe Coding Co.)*  
> **Co-Authors & Demo Tutors (現場操盤手)**: **Rui-Yu Lin** *(Shih Hsin Univ.)*, **Yu-Ting Chen** *(CYUT)*  
> **Principal Advisor (通訊/指導作者)**: **Prof. Yui-Liang Chen** *(Shih Hsin Univ.)*

---

## 🎯 Executive Dual-Paper Mapping (雙論文對照與架構統合)

| 演講區塊 (Presentation Section) | 涵蓋論文 (Paper Coverage) | 核心主題與學術貢獻 (Core Subject & Scholarly Contributions) |
| :--- | :---: | :--- |
| **Section 1: The Problem & Paradigm Shift**<br>*(Slides 1–3)* | **Paper 28**<br>(Pedagogy) | • Vibe Coding 典範轉移（Karpathy 2025; Collins 年度詞彙）<br>• 傳統嵌入式語法阻抗與外在認知負荷（Cognitive Load Theory）<br>• 程式焦慮（Programming Anxiety）與學習者痛點 |
| **Section 2: The Pedagogical Innovation**<br>*(Slides 4–6)* | **Paper 28**<br>(Pedagogy) | • **PACE 教學框架**（Prompt 設計、Audit 審查、Commit 溯源、Evaluate 雙層驗收）<br>• **Vibe Classroom 平台架構**（GitHub Classroom + Actions 自動評分）<br>• **雙層 Tutor 輔導制度**（Teams 讀書會培訓 $\to$ Tutor 現場伴學，如苗圃童軍營地實踐） |
| **Section 3: Full-Stack Engineering Architecture**<br>*(Slides 7–9)* | **Paper 27**<br>(Architecture) | • 跨端異構挑戰：Web 觸控遙控 vs. ESP32 韌體<br>• **根除「協定幻覺（Protocol Hallucination）」**<br>• **Turborepo Monorepo & `packages/protocol`**（46B $\to$ 15B 二進位封包壓縮，減量 68%）<br>• 實體安全機制：500ms Watchdog 急停、8秒 SoftAP 自癒、20秒延遲 OTA 回滾 |
| **Section 4: Hardware-in-the-Loop & Curriculum**<br>*(Slides 10–11)* | **Paper 27 & 28**<br>(Integration) | • **HIL 三大非偽造實機產物**（`mobile-preview.png`、`hardware-setup.jpg`、`serial-log.png`）<br>• 45 個微單元階梯式課綱（Car Starter 15 單元 + Car Basic 30 單元 + Integration Lab） |
| **Section 5: LIVE DEMONSTRATION**<br>*(Slides 12–13)* | **Paper 27 & 28**<br>(Live Action) | • **3 分鐘雙人實機連動演示**（主講 Rover 引導 $\leftrightarrow$ 瑞昱手機操作 $\leftrightarrow$ 俞廷串口監控與自走車）<br>• 實機展示 Web BLE 零安裝遙控、差速運動學、500ms Watchdog 斷線瞬間急停鎖死 |
| **Section 6: Empirical Findings & Discussion**<br>*(Slides 14–16)* | **Paper 27 & 28**<br>(Synthesis) | • 實證量化數據：程式焦慮降低 31.4%、自我效能感（CPSES）提升 26.8%<br>• 100% 實機完工率；探討 Human-in-the-Loop 在 Physical AI 時代的工程責任感<br>• Q&A 答辯預案 |

---

## 📽️ Slide-by-Slide Outline & Speaking Script (逐頁投影片與講稿)

### Slide 1: Title & Presentation Team
* **Header**: SSIM 2026 Oral Presentation
* **Main Title**: Full-Stack Vibe Coding Pedagogy and Monorepo Hardware-in-the-Loop Architecture for Physical AI Education
* **Subtitle**: Bridging the Cyber-Physical Chasm through the PACE Framework and Shared Protocols
* **Presenter**: **Rover (Yu-Kuan) Chen** (Taiwan Vibe Coding Co.)
* **Co-Authors & Tutors**: **Yui-Liang Chen** (Shih Hsin Univ.), **Rui-Yu Lin** (Shih Hsin Univ.), **Yu-Ting Chen** (Chaoyang Univ. of Tech.)
* **🗣️ Rover's Speaking Script (0:00 - 1:00)**:
  > *"Good morning, session chairs, distinguished scholars, and fellow researchers. I am Rover Chen from Taiwan Vibe Coding Company. Together with Professor Yui-Liang Chen from Shih Hsin University and our course tutors Rui-Yu Lin and Yu-Ting Chen from Chaoyang University of Technology, we are honored to present our research synthesizing two papers: our pedagogical framework, 'PACE', and our full-stack engineering architecture for Physical AI education."*

---

### Slide 2: The Core Problem: The Cyber-Physical Chasm *(Paper 28 Context)*
* **Visual**: A split diagram showing computer science students overwhelmed by low-level C pointers, and mechanical/electronic students struggling with modern Web UI.
* **Key Bullet Points**:
  * **Syntax Gatekeeping**: Novice students spend >70% of mental capacity fighting compiler error logs, missing semicolons, and register addresses.
  * **Cognitive Overload (Sweller, 1988)**: Extraneous cognitive load suffocates the working memory required for high-order architectural thinking.
  * **Programming Anxiety (Connolly et al., 2009)**: Repeated failure in hardware debugging induces fear and learned helplessness.
* **🗣️ Rover's Speaking Script (1:00 - 2:15)**:
  > *"In traditional computing and IoT education, students face what we call the 'Cyber-Physical Chasm'. Novices are overwhelmed by tedious low-level C++ syntax, memory pointers, and breadboard pinouts. According to Cognitive Load Theory, when 80% of mental bandwidth is exhausted on trivial syntax errors, students suffer from acute programming anxiety and never develop genuine system architectural intuition."*

---

### Slide 3: The Paradigm Shift: Vibe Coding & The "Protocol Hallucination" Trap *(Paper 27 & 28)*
* **Visual**: Andrej Karpathy's quote (2025) + A diagram illustrating AI hallucinating incompatible UUIDs between phone and microcontroller.
* **Key Bullet Points**:
  * **Vibe Coding (Karpathy, 2025)**: Transitioning from manual line-by-line typing to natural-language intent guiding LLMs, with human critical review.
  * **The Fatal Trap in Embedded IoT**:
    * LLMs produce code that *looks plausible* and *compiles cleanly*, but fails catastrophically on physical devices.
    * **Protocol Hallucination**: AI invents mismatched BLE UUIDs, inconsistent byte endianness, or assigns dangerous Strapping Pins (GPIO 2, 8, 9).
  * **Our Research Question**: *How can learners exploit the generative velocity of AI without falling into unguided 'free-vibing' and hardware bricking?*
* **🗣️ Rover's Speaking Script (2:15 - 3:30)**:
  > *"When Andrej Karpathy coined 'Vibe Coding' in 2025, it was hailed as a revolution. But in embedded systems, code that 'vibes' in simulation can burn motors in reality. AI frequently suffers from 'Protocol Hallucination'—generating a Web controller that expects JSON, while the microcontroller firmware expects binary structs. Un-scaffolded Vibe Coding simply turns students into reckless copy-paste operators. We needed a rigorous pedagogical and architectural defense."*

---

### Slide 4: Pedagogical Framework: The PACE Model *(Paper 28 Core)*
* **Visual**: Circular 4-stage engineering cycle diagram: **P** $\to$ **A** $\to$ **C** $\to$ **E**.
* **Key Bullet Points**:
  * **P - Prompt Design**: Moving beyond naive questions to role-task-constraint specifications (hardware boundaries, pin reservations).
  * **A - Critical Code Audit**: Auditing generated code for Strapping Pins conflicts, non-blocking `millis()` polling, and watchdog guards.
  * **C - Micro-Commit**: Enforcing Git attribution tags (`[AI-Generated]`, `[Human-Modified]`) to maintain engineering provenance.
  * **E - Dual-Layer Evaluation**: Pairing automated CI unit tests with trackside physical verification.
* **🗣️ Rover's Speaking Script (3:30 - 4:45)**:
  > *"In Paper 28, we propose the PACE Teaching Framework. PACE redefines the programmer's role: the learner is not an author of raw syntax, but a Chief Engineering Auditor. Students use structured Prompts, strictly Audit code for safety hazards, Commit with provenance tracking, and Evaluate behavior against real physical dynamics."*

---

### Slide 5: The Two-Tier Tutor System & Vibe Classroom *(Paper 28 Core)*
* **Visual**: Organizational diagram showing: `Taiwan Vibe Coding Co. (Teams Study Group) $\to$ Tutors (Rui-Yu & Yu-Ting) $\to$ Novice Learners / Scouts (GitHub Classroom)`. Photos from the Yangmingshan Boy Scout Camp.
* **Key Bullet Points**:
  * **Two-Tier Mentorship**: Experienced developers train collegiate Tutors in weekly study groups; Tutors scaffold novice learners in physical camps and university labs.
  * **Vibe Classroom Platform**: Built on GitHub Classroom with automated CI feedback via GitHub Actions.
  * **Real-World Trial**: Successfully deployed at the Yangmingshan Nursery Scout Camp for junior high scouts with zero coding background.
* **🗣️ Rover's Speaking Script (4:45 - 6:00)**:
  > *"Crucially, effective Vibe Coding requires human scaffolding. We implemented a Two-Tier Tutor system: our core team trains collegiate tutors, who then provide hands-on companionship to beginners. We validated this model not just in university classrooms, but also in authentic outdoor settings—such as our workshop for junior high Boy Scouts at Yangmingshan Camp."*

---

### Slide 6: The Full-Stack Monorepo Architecture *(Paper 27 Core)*
* **Visual**: Architectural diagram of `vibe-coding-car-monorepo` powered by Turborepo & pnpm.
* **Key Bullet Points**:
  * **Heterogeneous Tech Stack**:
    * Frontend: Mobile Web Controller (HTML5, Touch Canvas, Web Bluetooth API).
    * Firmware: ESP32-C3 RISC-V MCU (PlatformIO, C++, FreeRTOS).
  * **Single Source of Truth (`packages/protocol`)**:
    * Shared TypeScript and C header bindings.
    * If an AI agent or learner modifies a packet field, Turborepo catches type mismatches across both ends at compile time.
  * **Packet Slimming**: Compressing verbose 46-byte JSON into a compact 15-byte binary TypedArray (**68% payload reduction**).
* **🗣️ Rover's Speaking Script (6:00 - 7:30)**:
  > *"Turning to Paper 27: how do we enforce this technically? We architected the entire project as a Turborepo Monorepo. By anchoring the phone controller and the ESP32 firmware to a single shared protocol package (`packages/protocol`), we completely eradicated protocol hallucination. Furthermore, we achieved 68% packet slimming, reducing control latency to under 15 milliseconds."*

---

### Slide 7: Physical Safeguards & Fail-Safe Engineering *(Paper 27 Core)*
* **Visual**: FSM State Diagram (IDLE $\to$ RUNNING $\to$ FAULT) + Watchdog countdown graphic.
* **Key Bullet Points**:
  * **500ms Watchdog Emergency Stop**: If heartbeat packets drop for $\ge 500\text{ms}$, the MCU instantly cuts motor PWM to 0.
  * **Self-Healing Wi-Fi**: Dual-mode AP/STA with automatic fallback to SoftAP (`vibe123456`) after 8 seconds of router disconnection.
  * **20s Delayed-Commit OTA**: Over-the-air firmware updates must verify successful communication within 20 seconds, or automatically roll back to the previous partition.
* **🗣️ Rover's Speaking Script (7:30 - 8:45)**:
  > *"In Physical AI, safety is non-negotiable. We embedded 3 defensive mechanisms into the curriculum: a 500ms Watchdog that kills motors instantly upon signal loss, a self-healing Wi-Fi fallback that prevents orphaned devices, and a dual-partition OTA rollback to guarantee boards never get bricked."*

---

### Slide 8: Hardware-in-the-Loop (HIL) Verification *(Paper 27 Core)*
* **Visual**: The 3 non-forgeable physical artifacts displayed side-by-side:
  1. `assets/mobile-preview.png` (Mobile UI)
  2. `assets/hardware-setup.jpg` (Physical wiring)
  3. `assets/serial-log.png` (115200 baud serial monitor output)
* **Key Bullet Points**:
  * **Moving Beyond Screen Simulation**: Screen simulators cannot replicate battery sag, motor dead-zones, or ground noise.
  * **The 3 HIL Artifacts**: Required proof for assignment submission in GitHub Classroom.
* **🗣️ Rover's Speaking Script (8:45 - 9:45)**:
  > *"To ensure authentic learning, we established Hardware-in-the-Loop verification. Students cannot pass by submitting code alone. They must upload three physical artifacts: the responsive mobile UI, the physical circuit setup, and the live serial log showing active heartbeat negotiation."*

---

### Slide 9: 45 Micro-Unit Curriculum Roadmap *(Synthesis of Papers 27 & 28)*
* **Visual**: 4-phase ladder diagram mapping 45 micro-units over 18 weeks.
  * Phase 0: Developer Identity & PlatformIO Setup (Units 1–3)
  * Phase 1: Car Starter — Web BLE & Kinematics (Units 4–18)
  * Phase 2: Car Basic — PWM, SoftAP & Watchdog (Units 19–35)
  * Phase 3: Integration Lab — Edge Vision & Capstone (Units 36–45)
* **🗣️ Rover's Speaking Script (9:45 - 10:30)**:
  > *"We organized these concepts into 45 bite-sized micro-units across four progressive phases, taking students from cloud VS Code setup to full edge-vision autonomous navigation."*

---

### Slide 10: Transition to Live Demonstration *(Live Action)*
* **Visual**: "LIVE SYSTEM DEMONSTRATION: Web BLE Controller $\leftrightarrow$ ESP32-C3 Robotic Vehicle".
* **🗣️ Rover's Speaking Script (10:30 - 11:00)**:
  > *"Now, talk is cheap—show me the code, and show me the physical car! I would like to invite our demo tutors, Rui-Yu Lin and Yu-Ting Chen, to demonstrate our full-stack system live on stage."*

---

### Slide 11: [LIVE DEMO - Conducted by Rui-Yu & Yu-Ting] (11:00 - 13:30)
* *(Rui-Yu projects phone screen; Yu-Ting manages car and serial monitor)*
* **Demonstration Steps**:
  1. **Instant Web BLE Pairing**: Mobile Chrome connects in 1 second; vehicle LED locks solid blue.
  2. **Touch Joystick & Kinematics**: Canvas touch coordinates translated to differential motor speeds live.
  3. **Watchdog Emergency Stop**: Rui-Yu suddenly switches phone to Airplane Mode $\to$ **Vehicle halts within 500ms**, serial monitor flashes `WATCHDOG CUTOFF MOTORS!`.
* **🗣️ Rover's Live Commentary**:
  > *"Notice how the phone connects via Web Bluetooth without installing any app. As Rui-Yu maneuvers the virtual joystick, binary packets stream at 50Hz. And watch closely: when signal is lost, our 500ms Watchdog immediately clamps the motors, preventing runaway crashes."*

---

### Slide 12: Empirical Findings: Cognitive & Psychological Impact *(Paper 28 Data)*
* **Visual**: Pre/Post comparison bar charts showing Programming Anxiety Scale (PAS) and Self-Efficacy (CPSES).
* **Key Empirical Metrics**:
  * **Programming Anxiety (PAS)**: Significant reduction of **31.4%** ($p < .001$).
  * **Self-Efficacy (CPSES)**: Significant gain of **26.8%** ($p < .001$, Cohen's $d = 0.92$).
  * **Physical Track Task Completion**: **100% of student groups** successfully built and drove their vehicles through the obstacle course.
* **🗣️ Rover's Speaking Script (13:30 - 14:30)**:
  > *"Our empirical data confirmed profound psychological and learning shifts. Programming anxiety dropped by over 31%, while programming self-efficacy increased by 26% with a large effect size. Most importantly, 100% of student teams successfully demonstrated physical autonomous navigation."*

---

### Slide 13: Conclusion & Key Takeaways *(Both Papers)*
* **Key Bullet Points**:
  1. **Vibe Coding is Not Code-Free**: It shifts the human developer's role from syntax typist to system auditor.
  2. **Monorepo Eradicates Protocol Drift**: Shared contracts are essential for heterogenous IoT systems.
  3. **Safety First**: Physical computing requires hardware-enforced fail-safes (Watchdog & HIL).
  4. **Open-Source Contribution**: Complete 45-unit curriculum, firmware, and Web controller are freely available on GitHub.
* **🗣️ Rover's Speaking Script (14:30 - 15:30)**:
  > *"To conclude: Vibe Coding in Physical AI is not about bypassing engineering fundamentals—it is about elevating learners into responsible system architects. By coupling the PACE pedagogy with Monorepo shared protocols and HIL verification, we empower the next generation to bridge the cyber-physical divide."*

---

### Slide 14: Acknowledgments & Q&A
* **Visual**: QR code to GitHub repo: `https://github.com/ChenYuiLiang/vibe-coding-car-monorepo` + Author contact emails.
* **🗣️ Rover's Final Line (15:30)**:
  > *"Thank you very much for your time. Rui-Yu, Yu-Ting, and I welcome any questions from the session chairs and the audience."*

---

## 🛡️ Rigorous Q&A Defense Sheet (評審提問高頻攻防指引)

* **Q1 (Reviewer on Pedagogy / Paper 28)**: *"If students rely on AI to generate code, how do you know they actually learned anything rather than just blindly prompting?"*
  * **Rover's Answer**: *"Excellent question. That is precisely why our grading rubric allocates 50% of the grade to the 'Audit' and 'HIL' dimensions. In our oral evaluations, students must explain why they rejected certain AI suggestions—for instance, explaining why an AI-suggested `delay()` blocks FreeRTOS scheduling. Furthermore, if a student copies code without understanding, the physical car fails immediately on the track."*

* **Q2 (Reviewer on Architecture / Paper 27)**: *"Why is a Monorepo necessary for an IoT course? Wouldn't two simple GitHub repositories suffice?"*
  * **Rover's Answer**: *"In our preliminary semesters, having separate repos caused what we call 'silent protocol drift'. A student would ask AI to add a speed boost to the web controller, and the AI would invent a new 6-byte packet format, leaving the firmware expecting 4 bytes. With Turborepo, both ends import the same TypeScript/C++ contract from `packages/protocol`. Any drift breaks the compile check immediately."*

* **Q3 (Reviewer on Scalability / Age Groups)**: *"Can this model scale from elementary/junior-high scouts up to university computer science majors?"*
  * **Rover's Answer**: *"Yes. For K-9 scouts, the PACE framework emphasizes prompt clarity, visual remote control, and physical safety (Car Starter). For university undergraduates, we expand PACE into embedded FreeRTOS multitasking, memory partitioning, and edge-vision guidance (Car Basic & Integration Lab)."*
