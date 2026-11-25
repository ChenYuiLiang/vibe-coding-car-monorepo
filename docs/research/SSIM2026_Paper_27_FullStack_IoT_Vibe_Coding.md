# Full-Stack Vibe Coding Pedagogy for IoT Hardware–Software Integration: A Monorepo Architecture and Hardware-in-the-Loop Verification Study

Yu-Kuan (Rover) Chen^1^, Yui-Liang Chen^2^, Rui-Yu Lin^2,*^, and Yu-Ting Chen^3^

<sup>1</sup> Taiwan Vibe Coding Co., Taiwan

<sup>2</sup> Department of Information Management, Shih Hsin University, Taipei, Taiwan

<sup>3</sup> Department of Early Childhood Development and Education, Chaoyang University of Technology, Taichung, Taiwan

* Corresponding author: Rui-Yu Lin (m115660040@mail.shu.edu.tw)

## Abstract

Large language models (LLMs) enable Vibe Coding, an emerging software development paradigm in which applications are iteratively synthesized, audited, and refined through natural-language dialogue. In Internet of Things (IoT) education, however, generating plausible source code does not guarantee a functioning physical system. A mobile browser control interface and an embedded microcontroller firmware occupy fundamentally heterogeneous runtime environments; both may satisfy localized unit checks while failing to interoperate due to command parameter drift, wireless network topology shifts, incomplete boot chains, or timing-dependent motor safety violations. This paper presents an empirical design-based case study investigating a full-stack educational architecture and Hardware-in-the-Loop (HIL) verification methodology developed for undergraduate IoT engineering courses. Specifically, the study examines how novice learners interact with a custom miniature robotic vehicle powered by an Espressif ESP32-C3 microcontroller, using a monorepo architecture and a four-plane intelligent learning ecosystem to scaffold learning. The four planes comprise: (1) an interaction plane hosting a mobile browser controller; (2) a contract plane governing shared JSON HTTP and Bluetooth Low Energy (BLE) protocol schemas; (3) an execution plane managing FreeRTOS firmware, pulse-width modulation (PWM) motor drivers, and a 500 ms safety watchdog; and (4) an observability and recovery plane providing dual-path deployment via Over-the-Air (OTA) updates and serial Universal Asynchronous Receiver-Transmitter (UART) rescue. Through qualitative curriculum artifact analysis of 142 student commit histories, 86 HIL test execution logs, and 43 diagnostic triage tickets, we catalog 14 recurrent cross-layer failure modes. Furthermore, we adapt the Plan–Audit–Commit–Evaluate (PACE) pedagogical framework to require multi-layered physical HIL evidence rather than relying solely on generated code syntax or simulator output. Our findings demonstrate that integrating monorepo contract governance with physical verification transforms superficial AI-assisted coding into authentic cyber-physical engineering literacy, bridging the critical gap between apparent code completion and validated operational reality.

**Keywords:** Vibe Coding · Internet of Things (IoT) · ESP32-C3 · Monorepo · Hardware-in-the-Loop (HIL) · Over-the-Air (OTA) · PACE Pedagogical Framework · Cyber-Physical Systems


## 1 Introduction

### 1.1 From Plausible Code to an Operating Cyber-Physical System
Generative artificial intelligence (GenAI) powered by Large Language Models (LLMs) has fundamentally transformed the economics and practice of software engineering. Novice programmers and experienced engineers alike can now articulate high-level behavioral intentions in natural language, inspect synthetically generated implementations, and iteratively steer code generation without authoring every programmatic statement from scratch. The contemporary industry paradigm termed <i>Vibe Coding</i> highlights this conversation-driven, intent-oriented workflow [1, 2]. When applied to isolated software domains—such as self-contained web applications or standalone scripts—the output of Vibe Coding can often be evaluated immediately through instant browser rendering, local unit test suites, and standard automated linters.



However, when Vibe Coding is applied to the Internet of Things (IoT) and cyber-physical systems (CPS), learners encounter an acute pedagogical and operational barrier. In an embedded IoT context, software does not execute in a homogeneous browser sandbox. Instead, execution is distributed across a mobile web browser interface and a physical embedded microcontroller operating in real time. Correctness is governed not merely by syntax or component rendering, but by physical laws, voltage constraints, RF link stability, real-time motor actuation timing, and fail-safe stopping mechanisms.



<b>Definition and Specifications of the Physical Object of Study:</b> To ground this research empirically, the physical object of study throughout this paper is explicitly defined as a custom miniature two-wheeled robotic smart vehicle (measuring approximately 120 mm × 90 mm × 60 mm), engineered specifically as a pedagogical cyber-physical testbed for university-level IoT courses. The robotic vehicle is powered by an Espressif ESP32-C3 System-on-Chip (featuring a 32-bit RISC-V single-core processor operating at 160 MHz with integrated 2.4 GHz Wi-Fi IEEE 802.11b/g/n and Bluetooth Low Energy 5.0). The physical chassis incorporates a Texas Instruments DRV8833 dual H-bridge motor driver, two micro DC gear motors with optical wheel encoders, a 3.7 V rechargeable lithium-ion battery with an onboard battery management system and dual 3.3 V / 5.0 V low-dropout voltage regulators, multi-color status LEDs, and a native USB-C interface for hardware flashing and serial telemetry monitoring. The vehicle firmware runs atop FreeRTOS, serving an onboard embedded HTTP/WebSocket asynchronous web server that presents a responsive touch controller directly to connecting client mobile devices. It is explicitly an educational tabletop robotic artifact, not a full-sized automotive vehicle.



This cyber-physical disconnect creates a persistent discrepancy between <i>apparent completion</i> (code that looks correct to an AI assistant or compiles cleanly) and <i>operational reality</i> (a physical vehicle that safely moves, steers, and stops upon command). In practice, an LLM may synthesize a visually flawless mobile remote control page that dispatches malformed query parameters. Firmware may compile with zero errors yet fail to boot due to an incomplete partition table. A student web application may attempt to invoke Web Bluetooth APIs on an iOS Safari browser that categorically lacks Web Bluetooth support. An Over-the-Air (OTA) firmware flash may report successful byte transmission while the newly flashed binary panics during Wi-Fi initialization, stranding the vehicle in an unrecoverable state. These recurring discrepancies are not isolated syntax errors; they represent broken links in an intricate, cross-layer chain connecting human pedagogical intent to physical actuation.



In the hands-on engineering curriculum developed by Taiwan Vibe Coding Co. in collaboration with university educational laboratories at Shih Hsin University and Chaoyang University of Technology, the instructional sequence resolves this tension by decoupling introductory mobile interface development from embedded firmware engineering, subsequently reuniting them in an intensive closed-loop Integration Laboratory. The primary, production-grade control channel is deliberately established as a vehicle-hosted Wi-Fi HTTP remote: the learner's smartphone connects to the vehicle's Software Access Point (SoftAP) or shared local infrastructure Wi-Fi, accesses the embedded web application served directly from ESP32 flash memory, and dispatches directional movement commands via a directional pad (D-pad). Bluetooth Low Energy (BLE) is maintained as an optional secondary channel for advanced protocol analysis, while browser-based canvas simulations and standalone JSON exercises serve as formative sandboxes rather than substitutes for real-world physical verification.



### 1.2 Research Questions and Scope
This study investigates how AI-assisted programming workflows can be systematically structured to ensure that novice learners develop rigorous, verifiable cyber-physical engineering competencies. The primary research question guiding this investigation is:


<blockquote><b>Primary RQ:</b> How can AI-assisted code generation, monorepo artifact management, deployment pathways, recovery procedures, and acceptance criteria be architected into an intelligent learning ecosystem so that learner changes to a mobile remote and ESP32 firmware reliably produce verifiable physical vehicle operation?</blockquote>

To address this central inquiry, three subsidiary research questions are formulated:


<ul>
  <li><b>RQ1—Cross-Stack Semantic Consistency:</b> How can locally generated AI code modifications maintain strict semantic and contractual alignment across disparate web and embedded firmware environments?</li>
  <li><b>RQ2—Executable Deployment and Recoverability:</b> How can source code changes be reliably deployed into active microcontroller memory without confusing build success with operational deployment, and how can recoverability be guaranteed when wireless links fail?</li>
  <li><b>RQ3—Physical Hardware-in-the-Loop Verification:</b> What multi-layered empirical evidence is required to confirm that interface interactions, network transport, microcontroller firmware, and physical motor actuation function correctly and safely together?</li>
</ul>

<b>Scope and Academic Boundary:</b> This paper focuses specifically on the technical and architectural foundations of the intelligent learning ecosystem—the monorepo design, protocol schema governance, dual-path deployment topology, fault catalog, and HIL verification testbed. A companion pedagogical study explores the broader socio-cognitive dimensions of teacher-learner facilitation and classroom conversational dynamics [3]. The unit of analysis here is the <i>cross-layer developmental iteration cycle</i>: the full closed loop encompassing prompt formulation, contract auditing, monorepo build, physical deployment, and multi-sensor empirical verification.



### 1.3 Principal Contributions
This work makes five distinct scholarly and practical contributions to the field of AI-assisted engineering education and intelligent learning ecosystems:


<ol>
  <li><b>A Four-Plane Intelligent Learning Architecture:</b> We formulate a robust closed-loop system model partitioning cyber-physical IoT development into distinct Interaction, Contract, Execution, and Observability planes, eliminating cross-stack hallucinations during AI generation.</li>
  <li><b>An Architectural Channel-Priority Hierarchy:</b> We define an unambiguous communication hierarchy establishing vehicle-hosted Wi-Fi HTTP as the primary baseline, positioning BLE as an optional advanced module, and formally separating sandbox exercises from product deployment.</li>
  <li><b>Dual-Path Deployment and Reversible OTA Methodology:</b> We articulate an operational deployment model utilizing state-contingent OTA flashing for reachable systems and four-binary USB-UART recovery for bricked hardware.</li>
  <li><b>Empirical Failure Catalog and Diagnostic Triage Logic:</b> Drawing from 142 student commit histories and 86 physical test logs, we catalog 14 recurrent cross-layer failure modes and establish an "earliest explanatory layer" triage methodology.</li>
  <li><b>Cyber-Physical Adaptation of the PACE Pedagogical Framework:</b> We adapt the Plan–Audit–Commit–Evaluate (PACE) framework, defining objective, rubric-based exit gates requiring physical HIL evidence before code can be accepted.</li>
</ol>

## 2 Related Work and Conceptual Positioning

### 2.1 AI-Assisted Programming and Generative Scaffolding in Education
Recent research examining the role of LLMs in computing education highlights unprecedented opportunities for automated explanation, code synthesis, and customized formative feedback [4]. However, empirical studies simultaneously identify critical risks, including learner over-reliance, passive acceptance of syntactically plausible but logically flawed code, and degraded diagnostic metacognition [5]. While AI coding assistants substantially lower the barrier to code generation, they shift the essential locus of human engineering effort from low-level syntax composition toward rigorous prompt specification, code auditing, and multi-tiered verification.



In embedded IoT education, this challenge is intensified. When an LLM generates invalid code for a pure web application, the browser console immediately signals a runtime exception. In contrast, embedded software involves toolchain compilation, binary linking, flash partition mapping, hardware peripheral configuration, and real-time task scheduling under FreeRTOS. An LLM suggestion may compile cleanly yet cause an immediate silent brownout, a deadlock in the Wi-Fi stack, or a runaway motor state. Consequently, in an intelligent learning ecosystem, LLM outputs must be formally treated as unverified engineering hypotheses that require systematic auditing against shared interface contracts before physical deployment [6].



### 2.2 Monorepo Architecture and Shared Interface Contracts
In industry practice, monorepos—single version-controlled repositories housing multiple interrelated projects—have demonstrated substantial efficacy in coordinating dependencies, enforcing atomic commits across architectural boundaries, and maintaining system-wide visibility [7]. For IoT education, co-locating the mobile web controller, embedded C++ firmware, shared protocol schemas, and testing scripts within a unified monorepo provides crucial pedagogical scaffolding.



Because web browsers execute TypeScript/JavaScript while microcontrollers run compiled C++, these disparate environments cannot directly import shared binary runtime libraries. Instead, the monorepo establishes a single source of architectural truth through formal contract specifications [8, 9]. Protocol schemas stored in a centralized directory define exact HTTP endpoint routes, query parameters, valid numerical velocity boundaries, JSON payload structures, and BLE GATT characteristic UUIDs. When a learner directs an AI assistant to modify a communication parameter, the monorepo enables automated contract testing fixtures to validate both client-side requests and server-side handlers simultaneously, preventing cross-stack semantic drift.



### 2.3 Cyber-Physical Failure Propagation in IoT Systems
Cyber-physical systems inherently couple computational algorithms with physical dynamics and environmental uncertainties [10]. On an ESP32-C3 robotic vehicle, a digital gesture registered on a capacitive smartphone touchscreen is translated into a velocity vector, transmitted across an IEEE 802.11 wireless link, parsed by an embedded HTTP server, mapped to PWM duty cycles by an H-bridge driver, and converted into mechanical torque by DC gear motors [11]. A failure occurring at any stage in this cross-layer pipeline produces the identical physical symptom: the vehicle fails to move or fails to stop.



Continuous delivery literature emphasizes automated deployment pipelines and rapid feedback loops [6]. In cyber-physical educational settings, however, deployment feedback must encompass the physical state of the hardware. Over-the-Air (OTA) updates provide rapid deployment velocity but introduce an existential dependency: the vehicle must maintain an active network stack to receive subsequent updates. If an unverified AI-generated binary disables the network peripheral, OTA capability is destroyed, necessitating low-level physical recovery.



### 2.4 Hardware-in-the-Loop (HIL) Verification as Pedagogical Acceptance
Hardware-in-the-Loop (HIL) simulation and testing methodologies are standard in mission-critical aerospace and automotive engineering, wherein physical controllers are exercised against realistic sensor inputs and physical loads [12]. In this study, we operationalize a lightweight, pedagogically tailored HIL verification framework. Rather than evaluating student success through static code inspections or mock test runners, learners must demonstrate that their software drives a physical ESP32-C3 testbed on a test stand, correctly executes directional translation, obeys strict watchdog timeouts, and safely handles connection aborts.



## 3 Case Context and Research Methodology

### 3.1 Educational Case Setting and Physical Platform
This study was conducted within the instructional context of a specialized 6-week IoT engineering course designed and delivered by Taiwan Vibe Coding Co. in collaborative partnership with the Department of Information Management at Shih Hsin University and the Department of Early Childhood Development and Education at Chaoyang University of Technology. A total of 28 undergraduate students participated in the course, which was structured around two progressive pedagogical phases: the Entry-Level Track (focusing on mobile UI design, touch event lifecycles, and HTTP client architecture) and the Basic-Level Track (focusing on ESP32-C3 firmware architecture, PWM motor control, FreeRTOS task scheduling, SoftAP/STA Wi-Fi management, and OTA updating).



To ensure reproducible and reliable laboratory execution, the course employs a standardized fleet firmware image housed in the monorepo. While learners develop standalone exploratory sketches to understand individual hardware peripherals (such as ADC battery monitoring or raw BLE advertising), final project certification requires integrating their work into the official fleet firmware image. This production image hosts the embedded web control surface directly at the root HTTP route (<code>/</code>), exposes real-time telemetry endpoints (<code>/api/status</code>), provides bounded drive execution (<code>/api/drive?v=&lt;linear&gt;&amp;w=&lt;angular&gt;</code>), and incorporates automated SoftAP-to-STA network self-healing.



### 3.2 Qualitative Curriculum Artifact Analysis and Unit of Analysis
To evaluate the efficacy of the proposed architecture, we employed a qualitative curriculum artifact analysis methodology grounded in design-based research principles [13, 14]. The empirical dataset comprises comprehensive digital and physical artifacts systematically generated across the 6-week curriculum:


<ul>
  <li><b>142 Version-Controlled Student Git Commits:</b> Sourced from 14 team repositories, capturing iterative code revisions, prompt documentation, commit messages, and automated test outputs.</li>
  <li><b>86 Structured HIL Test Execution Logs:</b> Comprising timestamped serial UART monitor logs, captured HTTP request/response payloads, and video recordings of physical vehicle actuation on constrained test benches.</li>
  <li><b>43 Diagnostic Triage Tickets:</b> Detailed troubleshooting records documented by teaching assistants and tutors during laboratory debugging interventions.</li>
</ul>

<b>Unit of Analysis:</b> The explicit unit of analysis in this study is the <i>cross-layer developmental iteration cycle</i>. This cycle is formally defined as the discrete operational progression beginning with a learner's natural-language prompt to an AI coding assistant, proceeding through code synthesis and monorepo contract auditing, continuing through binary build and target flashing, and culminating in physical execution on the ESP32-C3 vehicle and diagnostic rubric evaluation.



<b>Analytical Procedures:</b> The corpus of artifacts was analyzed through three inductive qualitative coding passes:


<ol>
  <li><b>The First Pass (Descriptive Failure Inventory):</b> We systematically cataloged all documented integration breakdowns, compiling compile errors, network connection drops, firmware panics, and unexpected physical vehicle behaviors into an exhaustive failure inventory.</li>
  <li><b>The Second Pass (Cross-Layer Thematic Mapping):</b> We analyzed each failure instance to identify its earliest explanatory root cause across the architectural planes, mapping how errors in prompt design propagated across the network interface into physical motor driver faults.</li>
  <li><b>The Third Pass (Pedagogical Scaffolding Synthesis):</b> We synthesized recurrent failure modes into actionable instructional constraints, establishing explicit protocol rules, triage playbooks, and HIL rubric criteria that guide student metacognitive problem-solving.</li>
</ol>

<b>Table 1. Case components, operational responsibilities, and verification evidence</b>


<table>
  <thead>
    <tr>
      <th>Architectural Component</th>
      <th>Principal Engineering Responsibility</th>
      <th>Fast Local Feedback Mechanism</th>
      <th>Empirical HIL Acceptance Evidence</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><b>Mobile Web Controller</b></td>
      <td>Touch gesture capture, pointer event tracking, HTTP request construction</td>
      <td>Vite local preview, browser DOM inspections, vitest unit tests</td>
      <td>Responsive UI loaded on smartphone directly from ESP32 IP address</td>
    </tr>
    <tr>
      <td><b>ESP32-C3 Firmware</b></td>
      <td>Asynchronous HTTP serving, PWM motor actuation, watchdog timing</td>
      <td>PlatformIO local build, native GCC contract mock tests</td>
      <td>Serial UART telemetry, oscilloscope PWM verification, wheel actuation</td>
    </tr>
    <tr>
      <td><b>Shared Protocol Schemas</b></td>
      <td>Cross-stack syntactic and semantic contract specification</td>
      <td>JSON schema validation fixtures, automated TypeScript/C++ linters</td>
      <td>Zero-drift execution: client request precisely triggers mapped motor output</td>
    </tr>
    <tr>
      <td><b>Dual Deployment System</b></td>
      <td>Artifact generation, OTA partition flashing, USB-UART disaster recovery</td>
      <td>Binary magic byte verification, elf size checks, upload status codes</td>
      <td>Device reboots into newly flashed application while maintaining network</td>
    </tr>
  </tbody>
</table>

As illustrated in Table 1, each component of the educational platform couples fast local feedback (enabling rapid exploratory coding) with empirical HIL acceptance gates (ensuring cyber-physical validity). This dual-feedback structure prevents learners from mistaking local syntax validation for end-to-end operational success.



### 3.3 Validity Boundaries and Ethical Safeguards
In accordance with design-based case study guidelines [14], this investigation focuses on system architecture and operational failure dynamics rather than quantitative student learning gains or causal comparative trials. All student artifact data were fully anonymized prior to qualitative analysis, with personal student identifiers and network credentials stripped. Physical testing protocols mandated that all vehicle testing in laboratory environments be conducted on elevated test stands (preventing runaway collisions) or within enclosed padded testing arenas equipped with hardware kill-switches.



## 4 Closed-Loop System Architecture

### 4.1 Four Planes of the Intelligent Learning Ecosystem
To resolve cross-layer integration failures systematically, we formulated a comprehensive four-plane closed-loop system architecture, illustrated in Figure 1. Rather than adopting generic commercial IoT architectures that assume reliable high-speed cloud infrastructure, this architecture is designed from first principles specifically to support educational transparency, error isolation, and crash recoverability.



![<b>Fig. 1.</b> The Four-Plane Closed-Loop System Architecture for IoT Hardware–Software Integration. The architecture explicitly decouples the Web Controller Plane, Communication & Protocol Plane, ESP32-C3 Firmware Plane, and Observability & HIL Verification Plane within a unified monorepo governance boundary.](figures/fig1_paper27_four_plane_architecture.png)

*<b>Fig. 1.</b> The Four-Plane Closed-Loop System Architecture for IoT Hardware–Software Integration. The architecture explicitly decouples the Web Controller Plane, Communication & Protocol Plane, ESP32-C3 Firmware Plane, and Observability & HIL Verification Plane within a unified monorepo governance boundary.*



The four planes function in tight synchronization:


<ol>
  <li><b>Plane 1: Web Controller Plane (Interaction):</b> Operates on the learner's mobile browser, hosting responsive touch controls, D-pad steering buttons, an ENGINE ignition gate, and real-time Server-Sent Events (SSE) telemetry displays. Crucially, the touch interaction layer implements robust pointer event handlers (<code>pointerdown</code>, <code>pointerup</code>, <code>pointercancel</code>) to prevent stuck-throttle failures.</li>
  <li><b>Plane 2: Communication & Protocol Plane (Contract):</b> Governs communication semantics between the client and vehicle. It establishes dual-channel routing: a primary, ubiquitous vehicle-hosted Wi-Fi HTTP transport (supporting both SoftAP and Station modes) and an optional secondary Web Bluetooth (BLE) channel. Centralized schemas in <code>shared/protocol/</code> define authoritative routes, query parameters, and valid numerical ranges.</li>
  <li><b>Plane 3: ESP32-C3 Firmware & Actuation Plane (Execution):</b> Implements an embedded FreeRTOS firmware stack. An asynchronous HTTP server routes incoming requests to a core drive state machine. The firmware computes differential drive kinematics, outputs PWM signals to the DRV8833 motor bridge, maintains a dedicated 500 ms hardware safety watchdog, and manages dual OTA flash partitions (<code>ota_0</code> and <code>ota_1</code>).</li>
  <li><b>Plane 4: Observability & HIL Verification Plane (Delivery & Diagnostics):</b> Provides end-to-end system visibility and recovery tooling. It integrates automated contract testing suites, real-time serial UART telemetry streaming, structured HIL verification rubrics, and a four-binary USB flashing pipeline for unbricking damaged devices.</li>
</ol>

### 4.2 Architectural Channel Priority and Product Boundaries
Channel priority is an architectural requirement and not simply a documentation preference. In beginner-level IoT projects, learners frequently attempt to implement Bluetooth Low Energy because of its conceptual association with wireless gadgets. However, Web Bluetooth relies on browser-specific APIs that are strictly unavailable in iOS Safari and requires complex asynchronous GATT pairing state machines. If BLE is positioned as the primary channel, students spend disproportionate effort debugging operating system permissions rather than learning core embedded principles.



Therefore, our architecture establishes an absolute channel-priority hierarchy:


<ul>
  <li><b>Primary Product Channel (Vehicle-Hosted Wi-Fi HTTP):</b> The ESP32-C3 boots as a WPA2-secured SoftAP (default IP <code>192.168.4.1</code>). The user connects their smartphone Wi-Fi to the vehicle AP, navigates to <code>http://192.168.4.1</code>, and interacts with the web controller served directly from the microcontroller's internal flash storage. This eliminates external internet dependencies, guarantees 100% cross-platform compatibility across all mobile browsers, and co-locates the UI version with the firmware version on the exact same physical chip.</li>
  <li><b>Optional Secondary Channel (Web Bluetooth BLE):</b> Retained strictly as an advanced elective laboratory module. Learners explore binary GATT services, 128-bit UUIDs, and byte-level checksums, but completing a BLE module is never a prerequisite for baseline vehicle driving.</li>
  <li><b>Formative Learning Sandboxes (Non-Product Artifacts):</b> Classroom exercises involving Canvas joysticks, mock JSON APIs, or node server simulations are explicitly designated as formative sandboxes. Passing a sandbox unit test demonstrates understanding of isolated programming concepts, but learners are explicitly taught that sandbox tests do not constitute evidence of vehicle operational readiness.</li>
</ul>

![<b>Fig. 2.</b> Cross-Layer Diagnostic State Machine and Failure Triage. When a failure occurs, diagnostic tracing proceeds systematically from learner prompt formulation down through DOM event dispatch, transport transmission, embedded watchdog supervision, and physical recovery.](figures/fig2_paper27_diagnostic_state_machine.png)

*<b>Fig. 2.</b> Cross-Layer Diagnostic State Machine and Failure Triage. When a failure occurs, diagnostic tracing proceeds systematically from learner prompt formulation down through DOM event dispatch, transport transmission, embedded watchdog supervision, and physical recovery.*



### 4.3 Monorepo Governance as an Integration Scaffold
The project monorepo includes the Web Controller, firmware, protocol definitions, utility scripts, official release images, and diagnostic playbooks. This structural co-location provides critical pedagogical scaffolding for Vibe Coding. When an LLM assistant is invoked within the monorepo context, it possesses complete cross-stack visibility: it can inspect the C++ route handlers in <code>firmware/src/main.cpp</code> while modifying the JavaScript fetch logic in <code>controller/src/main.js</code>.



Furthermore, the monorepo enforces <i>atomic cross-layer commits</i>. When a student modifies an endpoint parameter (e.g., changing linear velocity from <code>v</code> to <code>speed</code>), git pre-commit hooks execute contract validation fixtures that verify both ends of the interface. If the client sends parameters that the firmware schema does not recognize, the commit is rejected locally before the student attempts a physical flash.



### 4.4 Shared Protocol Schema as Authoritative Truth
The shared protocol layer establishes strict boundary invariants. For HTTP drive commands, the contract defines:


<ul>
  <li><b>Endpoint Routing:</b> Primary route <code>GET /api/drive</code> with supported aliases for backward compatibility.</li>
  <li><b>Parameter Invariants:</b> <code>v</code> (linear velocity, integer range [-100, 100]) and <code>w</code> (angular velocity, integer range [-100, 100]).</li>
  <li><b>Kinematic Clamping:</b> Microcontroller firmware implements deterministic differential drive mapping: left motor PWM \(M_L = 	ext{clamp}(v - w, -100, 100)\) and right motor PWM \(M_R = 	ext{clamp}(v + w, -100, 100)\). Any parameter exceeding boundaries is safely clamped rather than causing an integer overflow.</li>
  <li><b>Fail-Safe Stop Invariant:</b> A request with \(v=0\) and \(w=0\), or the explicit endpoint <code>GET /api/stop</code>, immediately cuts motor PWM duty cycles to zero and engages active dynamic braking via the DRV8833 bridge.</li>
</ul>

### 4.5 Network Self-Healing and Observability
In educational lab environments with dozens of active Wi-Fi radios, network connectivity is notoriously volatile. The ESP32-C3 firmware implements an automated state-machine for network self-healing. Upon boot, the vehicle attempts to connect to a pre-configured classroom Station (STA) network. If the STA connection succeeds, the firmware obtains an IP address and optionally disables its SoftAP radio to conserve RF spectrum and power. However, if the STA connection fails, drops packets beyond a 15-second grace interval, or is disconnected by classroom router congestion, the firmware automatically falls back to hosting its own robust WPA2 SoftAP. Diagnostic telemetry exposed at <code>GET /api/status</code> continuously broadcasts the vehicle's active network mode, current IP address, Wi-Fi RSSI signal strength, and FreeRTOS heap memory margins.



### 4.6 Actuation Protection and Dual-Layer Safety Closure
Physical vehicle safety requires defense in depth. Our architecture implements dual-layer safety closure combining client-side event trapping with server-side hardware supervision:


<ol>
  <li><b>Client-Side Cooperative Stopping:</b> Mobile web browsers present complex touch event lifecycles. If a user presses a virtual D-pad button and subsequently drags their finger off the screen, triggers a system gesture, or receives an incoming phone call, standard <code>touchend</code> or <code>mouseup</code> events are frequently lost. The web controller registers comprehensive listeners for <code>pointerup</code>, <code>pointercancel</code>, <code>pointerleave</code>, and window <code>blur</code> events, guaranteeing that an explicit stop command is dispatched across HTTP whenever user interaction is interrupted.</li>
  <li><b>Firmware Autonomous Watchdog Supervision:</b> Because wireless packets can drop in transit, client-side stopping alone cannot guarantee safety. The ESP32-C3 firmware runs a continuous hardware timer watchdog with a strict 500 ms expiration threshold. Every valid drive command resets this watchdog timer. If 500 ms elapses without receiving a fresh, valid drive command packet, the microcontroller firmware automatically overrides all motor PWM pins, terminating wheel rotation immediately. This prevents runaway vehicle scenarios even under total Wi-Fi disconnect.</li>
</ol>

## 5 Failure-Mode Catalog and Diagnostic Triage Logic

### 5.1 Cross-Layer Failure Taxonomy
Through systematic qualitative analysis of the 142 commit histories and 86 test execution logs, we identified and classified 14 recurring cross-layer failure modes. As detailed in Table 2, these failures span all four architectural planes.



<b>Table 2. Recurrent cross-layer failure modes, diagnostic symptoms, and closure controls</b>


<table>
  <thead>
    <tr>
      <th>Failure Classification</th>
      <th>Observable Laboratory Symptom</th>
      <th>Underlying Root Condition</th>
      <th>Architectural Prevention and Control Mechanism</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><b>1. HTTP Semantic Drift</b></td>
      <td>Web UI shows green buttons; vehicle motors remain entirely unresponsive</td>
      <td>AI assistant altered parameter name (e.g., <code>speed</code> instead of <code>v</code>)</td>
      <td>Shared JSON schema fixtures and automated contract build linters</td>
    </tr>
    <tr>
      <td><b>2. BLE Representation Drift</b></td>
      <td>BLE connects cleanly; sending commands causes firmware crash or silence</td>
      <td>Client transmits UTF-8 string instead of binary packed byte struct</td>
      <td>Documented 12-byte binary protocol schema with mandatory CRC8 validation</td>
    </tr>
    <tr>
      <td><b>3. Sandbox Substitution</b></td>
      <td>Student submits flawless joystick screen recording; car cannot be driven</td>
      <td>Learner submitted mock canvas sandbox output instead of hosted web remote</td>
      <td>Strict HIL rubric policy requiring URL verification from <code>http://192.168.4.1</code></td>
    </tr>
    <tr>
      <td><b>4. Stale Network Routing</b></td>
      <td>Smartphone cannot connect to <code>192.168.4.1</code> after classroom provisioning</td>
      <td>Vehicle successfully joined STA network and disabled its SoftAP</td>
      <td>Status LED indications and diagnostic router client tables</td>
    </tr>
    <tr>
      <td><b>5. Mobile OS AP Ejection</b></td>
      <td>Phone joins vehicle Wi-Fi but drops connection within 10 seconds</td>
      <td>Mobile OS detects "No Internet Access" and automatically falls back to cellular</td>
      <td>Disabling mobile data during testing; explicit captive portal suppression</td>
    </tr>
    <tr>
      <td><b>6. Multicast DNS Failure</b></td>
      <td><code>http://esp32-car.local</code> fails to resolve across mobile browsers</td>
      <td>Classroom Wi-Fi routers block UDP mDNS multicast packet flooding</td>
      <td>Mandatory fallback to numeric IP addresses (e.g., <code>http://192.168.4.1</code>)</td>
    </tr>
    <tr>
      <td><b>7. Lost Release Event</b></td>
      <td>Vehicle continues driving forward after student lifts finger from button</td>
      <td>Browser dropped <code>mouseup</code> event; lack of <code>pointercancel</code> handling</td>
      <td>Full pointer event lifecycle binding combined with 500 ms firmware watchdog</td>
    </tr>
    <tr>
      <td><b>8. Premature OTA Validation</b></td>
      <td>Device reboots into boot loop after OTA; fails to rollback to working image</td>
      <td>Firmware called <code>esp_ota_mark_app_valid_cancel_rollback()</code> before Wi-Fi boot</td>
      <td>Deferred OTA validation policy: app is validated only after 30s stable HTTP service</td>
    </tr>
    <tr>
      <td><b>9. Mismatched OTA Artifact</b></td>
      <td>OTA upload completes 100%; device restarts and becomes permanently unresponsive</td>
      <td>Student uploaded raw bootloader binary or wrong chip architecture build</td>
      <td>Firmware header inspection checking ESP32-C3 magic byte (<code>0xE9</code>) and chip ID</td>
    </tr>
    <tr>
      <td><b>10. Incomplete USB Flash</b></td>
      <td>Serial flashing succeeds; chip outputs bootloader output but no application</td>
      <td>Learner flashed application at <code>0x10000</code> but omitted <code>boot_app0</code> at <code>0xe000</code></td>
      <td>Standardized four-binary flashing manifest with explicit memory offset scripts</td>
    </tr>
    <tr>
      <td><b>11. Wireless-Only Fallback Trap</b></td>
      <td>Board is unresponsive after bad flash; student attempts repeated wireless OTA</td>
      <td>Microcontroller radio stack is crashed; OTA requires working HTTP service</td>
      <td>Explicit diagnostic triage rule: unreachable wireless boards require USB rescue</td>
    </tr>
    <tr>
      <td><b>12. Motor Power Brownout</b></td>
      <td>ESP32 reboots continuously the exact instant Forward button is pressed</td>
      <td>DC motor inrush current causes battery voltage to sag below 2.7 V MCU cutoff</td>
      <td>Hardware bulk capacitor decoupling; low battery telemetry alerts in UI</td>
    </tr>
    <tr>
      <td><b>13. GPIO Pinout Conflict</b></td>
      <td>Firmware runs and HTTP responds; wheels vibrate or turn wrong direction</td>
      <td>AI remapped motor pins to internal strapping pins (GPIO2 / GPIO8 / GPIO9)</td>
      <td>Hardware abstraction layer (HAL) header enforcing immutable pin definitions</td>
    </tr>
    <tr>
      <td><b>14. Ephemeral Evidence</b></td>
      <td>Student submits screenshot of terminal with no timestamps or version tags</td>
      <td>Evidence fails to demonstrate which code generated the physical result</td>
      <td>Mandatory multi-item HIL submission bundle with git commit hash metadata</td>
    </tr>
  </tbody>
</table>

### 5.2 Deep Analysis of Critical Cyber-Physical Failure Modes
To understand how these cross-layer failure modes emerge during AI-assisted development, three critical failure dynamics warrant detailed pedagogical analysis:



<b>Incomplete Boot Chains in Flash Memory:</b> In traditional desktop programming, an executable binary contains its entire runtime context. On an embedded ESP32-C3 microcontroller, booting requires a four-part flash memory structure: the second-stage bootloader at memory offset <code>0x0000</code>, the partition table at <code>0x8000</code>, the OTA data routing block (<code>boot_app0</code>) at <code>0xe000</code>, and the compiled application image at <code>0x10000</code>. When students use LLMs to generate custom flashing scripts, the AI frequently suggests standard <code>esptool.py write_flash 0x10000 firmware.bin</code> commands. This command succeeds with exit code 0, leading the student to believe flashing was successful. However, because <code>boot_app0</code> was omitted after a flash erase, the bootloader cannot determine which partition is active, leaving the processor halted. Our curriculum externalizes this memory map into explicit visual checklists and automated scripts.



<b>Reversible State Transitions in OTA Flashing:</b> Over-the-Air updates utilize dual flash partitions (<code>ota_0</code> and <code>ota_1</code>). A fatal pitfall in AI-assisted code generation is the immediate validation of newly flashed images. When an LLM generates OTA handlers, it commonly invokes <code>esp_ota_mark_app_valid_cancel_rollback()</code> immediately upon boot. If the newly flashed application subsequently panics when initializing the motor driver or connecting to Wi-Fi, the watchdog timer resets the processor. However, because the image was already marked valid, the bootloader attempts to boot the crashing partition indefinitely, bricking the device over the air. The pedagogical architecture enforces a strict <i>deferred validation policy</i>: the application must successfully boot, establish Wi-Fi, host its HTTP service, and maintain communication for at least 30 seconds before validation is committed. If a fault occurs during this observation window, the ESP32-C3 hardware watchdog automatically rolls back execution to the previous known-good partition.



<b>Motor Inrush Current and Power Brownout Resets:</b> Novice programmers naturally attribute any system restart to software bugs. When learners command both DC gear motors to accelerate forward simultaneously, the stall inrush current can spike to 1.2 A, exceeding the instantaneous discharge rating of depleted lithium-ion cells or poor-quality USB cables. This induces a transient voltage drop below the ESP32-C3 internal brownout detector threshold (2.8 V), triggering a hardware reset. The microcontroller reboots, initializes SoftAP, and presents a fresh connection. The student re-engages the throttle, triggering another immediate reset. Left unguided, students prompt the LLM to rewrite their web controller code. By introducing hardware telemetry that reports the reset reason register (<code>ESP_RST_BROWNOUT</code> vs. <code>ESP_RST_PANIC</code>), learners quickly discover the physical root cause: battery depletion or lack of motor decoupling capacitors.



### 5.3 Diagnostic Triage Logic: Earliest Explanatory Layer
When a physical vehicle fails to respond during laboratory sessions, random code modification is pedagogically destructive. We instruct learners to follow an "Earliest Explanatory Layer" triage sequence, as illustrated in the progression of Figure 2:


<ol>
  <li><b>Layer 1—Physical & Electrical Power:</b> Is the battery voltage above 3.6 V? Does the power LED remain solid without flickering when the chassis is lifted?</li>
  <li><b>Layer 2—Microcontroller Boot State:</b> Connect USB-UART. Does the serial monitor output a valid bootloader greeting, or is the chip trapped in a ROM boot loop?</li>
  <li><b>Layer 3—Network Channel Reachability:</b> Does the mobile phone successfully ping the vehicle IP address (<code>192.168.4.1</code>)? Can the browser fetch <code>http://192.168.4.1/api/status</code>?</li>
  <li><b>Layer 4—Interface DOM Event Dispatch:</b> Open mobile browser developer tools. Does pressing the D-pad button trigger a <code>pointerdown</code> event and dispatch an HTTP <code>GET /api/drive</code> request?</li>
  <li><b>Layer 5—Firmware Semantic Parsing:</b> Does the firmware serial console log the incoming request? Are the parsed <code>v</code> and <code>w</code> parameters mapped to active PWM duty cycles?</li>
  <li><b>Layer 6—Physical Actuation & Stopping:</b> With wheels safely elevated, do the DC motors rotate in the requested direction? Does releasing the touch button or disconnecting Wi-Fi trigger immediate motor shutdown within 500 ms?</li>
</ol>
This structured diagnostic progression eliminates guess-and-check prompt iterations, cultivating authentic engineering problem-solving habits.



## 6 Closed-Loop Implementation Walkthroughs

![<b>Fig. 3.</b> Hardware-in-the-Loop (HIL) Verification Workflow in the Monorepo. Shows the multi-layer testing progression from Layer 1 Contract Tests, Layer 2 Virtual HIL, Layer 3 Physical HIL on bench, through Layer 4 Live Multi-Channel Field Verification.](figures/fig3_paper27_hil_verification_workflow.png)

*<b>Fig. 3.</b> Hardware-in-the-Loop (HIL) Verification Workflow in the Monorepo. Shows the multi-layer testing progression from Layer 1 Contract Tests, Layer 2 Virtual HIL, Layer 3 Physical HIL on bench, through Layer 4 Live Multi-Channel Field Verification.*



### 6.1 Entry-Side Walkthrough: Touch Event Safety and Watchdog Co-Design
In the Entry-level Track, a student team was tasked with implementing a reliable mobile D-pad controller. In early iterations using naive LLM prompts, the generated code bound movement to standard <code>onclick</code> or <code>touchstart</code> listeners. During laboratory testing, students observed that if a user pressed Forward and inadvertently dragged their finger beyond the button boundary, the vehicle continued driving forward indefinitely, crashing into physical obstacles.



Following the PACE framework:


<ul>
  <li><b>Prompt (P):</b> The learners engineered an explicit prompt instructing the AI assistant to implement a fail-safe pointer lifecycle: <i>"Generate JavaScript pointer event handlers for a touch D-pad. Bind pointerdown to dispatch HTTP drive commands every 100 ms. Bind pointerup, pointercancel, and pointerleave to dispatch an immediate stop command. Do not use generic click events."</i></li>
  <li><b>Audit (A):</b> During code review, the team audited the generated diff against the shared contract schema, ensuring that the dispatched query string matched <code>/api/drive?v=80&w=0</code> and that the stop handler invoked <code>/api/stop</code>.</li>
  <li><b>Commit (C):</b> The validated controller code was committed to the monorepo alongside automated browser integration test scripts.</li>
  <li><b>Evaluate (E):</b> In the physical HIL laboratory, the team executed an obstacle collision test. When the driver deliberately swiped their finger off the active control surface, the <code>pointercancel</code> handler caught the interruption and stopped the vehicle in under 35 ms. When the Wi-Fi connection was abruptly disabled during motion, the firmware's 500 ms autonomous watchdog halted the motors cleanly.</li>
</ul>

### 6.2 Basic-Side Walkthrough: Resilient Network Recovery and OTA Rollback
In the Basic-level Track, another team was tasked with enhancing firmware network resilience. The assignment required the ESP32-C3 to attempt connection to a classroom access point, automatically fall back to SoftAP if the connection dropped, and support safe OTA updates.



Through iterative prompt-audit-evaluate cycles:


<ul>
  <li><b>Prompt (P):</b> The prompt specified non-blocking FreeRTOS timers for Wi-Fi reconnection, an immutable fallback WPA2 SoftAP, and deferred OTA validation requiring 30 seconds of stable HTTP service before final commitment.</li>
  <li><b>Audit (A):</b> Tutors audited the generated C++ code, checking that Wi-Fi reconnect routines did not block the main motor control loop and that the hardware watchdog timer was properly serviced during flash erase cycles.</li>
  <li><b>Commit (C):</b> The firmware source, partition table CSV, and PlatformIO configuration were atomically committed to the monorepo.</li>
  <li><b>Evaluate (E):</b> Physical verification was executed on an elevated bench. Tutors injected an artificial network failure by powering down the laboratory router. The ESP32-C3 detected carrier loss, waited out the 10-second grace window, and successfully spun up its emergency SoftAP without resetting active motor states or dropping telemetry.</li>
</ul>

## 7 Hardware-in-the-Loop Rubrics and the PACE Adaptation

### 7.1 Five-Layer HIL Assessment Rubric
To evaluate student engineering competencies objectively, we established a five-layer HIL acceptance rubric. As summarized in Table 3, each criterion carries specific empirical evidence requirements and failure thresholds.



<b>Table 3. Five-layer Hardware-in-the-Loop (HIL) acceptance rubric</b>


<table>
  <thead>
    <tr>
      <th>Evaluation Layer</th>
      <th>Weight</th>
      <th>Required Full-Credit Empirical Evidence</th>
      <th>Common Insufficient / Rejected Evidence</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><b>Layer 1: Deployed Identity</b></td>
      <td>15%</td>
      <td>Smartphone screenshot displaying <code>http://192.168.4.1/api/status</code> showing correct git commit hash and board ID after reboot</td>
      <td>Localhost web preview; PlatformIO compilation log without board hardware verification</td>
    </tr>
    <tr>
      <td><b>Layer 2: Primary Channel Access</b></td>
      <td>25%</td>
      <td>Mobile browser loads hosted web controller directly from vehicle IP; D-pad endpoints return HTTP 200</td>
      <td>Operating vehicle over simulated mock APIs or third-party web servers</td>
    </tr>
    <tr>
      <td><b>Layer 3: Protocol Semantic Consistency</b></td>
      <td>20%</td>
      <td>Serial monitor telemetry log confirming that forward, reverse, and turning requests match schema boundaries</td>
      <td>UI screenshots with no corresponding serial trace or firmware response capture</td>
    </tr>
    <tr>
      <td><b>Layer 4: Physical Motion & Safe Stop</b></td>
      <td>30%</td>
      <td>Video evidence of vehicle wheels rotating in commanded direction on bench, with verified stop within 500 ms on release or disconnect</td>
      <td>Simulated UI joystick movement; motor hum sounds without observable wheel rotation</td>
    </tr>
    <tr>
      <td><b>Layer 5: Disaster Recovery & Rollback</b></td>
      <td>10%</td>
      <td>Successful execution of dual-path deployment: valid OTA update on reachable device and four-binary USB recovery on unbootable board</td>
      <td>Repeated blind re-flashing without diagnosing target reachability</td>
    </tr>
  </tbody>
</table>

### 7.2 Pedagogical PACE Adaptation for Cyber-Physical Systems
The original PACE pedagogical framework conceptualizes AI collaboration as four phases: Plan, Audit, Commit, and Evaluate [3]. In this cyber-physical IoT study, we extend PACE to incorporate strict hardware constraints, as summarized in Table 4:



<b>Table 4. Cyber-physical adaptation of the PACE pedagogical framework</b>


<table>
  <thead>
    <tr>
      <th>PACE Phase</th>
      <th>Original Software Focus</th>
      <th>Cyber-Physical IoT Extension</th>
      <th>Mandatory Exit Gate</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><b>Plan (P)</b></td>
      <td>Task decomposition & prompt drafting</td>
      <td>Defining hardware pins, power constraints, network topologies, and fail-safe stop invariants</td>
      <td>Formal prompt specification referencing shared protocol schemas</td>
    </tr>
    <tr>
      <td><b>Audit (A)</b></td>
      <td>Reading code & inspecting syntax</td>
      <td>Validating cross-stack contracts, pointer event lifecycles, memory offsets, and watchdog timing</td>
      <td>Zero-drift schema validation; approval of non-blocking execution diffs</td>
    </tr>
    <tr>
      <td><b>Commit (C)</b></td>
      <td>Git commit & documentation</td>
      <td>Atomic commit uniting web client, firmware source, compiled binary checksums, and HIL test scripts</td>
      <td>Monorepo branch with synchronized contract fixtures and release artifacts</td>
    </tr>
    <tr>
      <td><b>Evaluate (E)</b></td>
      <td>Unit tests & linting suites</td>
      <td>Multi-layered physical HIL testing on bench, measuring emergency stop latency and network recovery</td>
      <td>100% pass across all five layers of the HIL acceptance rubric</td>
    </tr>
  </tbody>
</table>

## 8 Findings and Discussion

### 8.1 Architectural Closure Over Local Code Elegance
The primary finding of this study is that in AI-assisted cyber-physical engineering, <i>architectural closure mechanisms matter vastly more than localized code elegance</i>. Across the 142 analyzed student commit sequences, teams that focused on generating elaborate, aesthetically sophisticated mobile interfaces frequently suffered catastrophic integration failures during physical testing. Conversely, teams that enforced strict architectural closure—utilizing monorepo contract governance, primary-channel clarity, and hardware watchdog timeouts—reliably achieved working vehicles within minimal iterations. This directly answers RQ1: cross-stack consistency is not achieved by hoping an LLM understands both sides of an interface, but by enforcing shared, machine-readable contracts at repository boundaries.



### 8.2 Primary-Channel Clarity Prevents Illusory Completion
Addressing RQ2, our findings demonstrate that establishing vehicle-hosted Wi-Fi HTTP as an unyielding product baseline dramatically reduces <i>illusory completion</i>. In conventional computing education, students frequently mistake a working simulator or a clean unit test for an operational system. By formally categorizing Canvas joysticks and BLE experiments as formative sandboxes rather than product deliverables, learners developed calibrated trust in their tools. They learned to distinguish between an isolated algorithmic model and a deployed cyber-physical artifact.



### 8.3 Complementary Deployment Velocity and Recovery Safety
In response to RQ2's focus on executable delivery, the dual-path deployment model proved essential. OTA updating provided rapid iteration velocity, allowing students to test revised control algorithms in under 20 seconds. However, positioning USB-UART flashing not as an instructional failure but as the foundational bedrock of system recoverability provided a psychological safety net. When students accidentally uploaded an unbootable firmware binary, having a documented four-binary recovery playbook enabled them to restore their vehicle to an operational state in under two minutes, transforming what would have been a catastrophic disruption into a valuable lesson in flash memory management.



### 8.4 Transforming the Meaning of "Done" Through HIL Verification
Addressing RQ3, the implementation of layered HIL rubrics fundamentally altered learners' definition of completion. Prior to enforcing HIL gates, students regularly submitted AI-generated code snippets as soon as the compiler exited cleanly. Under the HIL regime, code is considered "done" only when physical actuation, sensor telemetry, and fail-safe stopping are empirically validated on hardware. This shift cultivates authentic engineering habits of mind, bridging the critical gap between synthetic code generation and real-world cyber-physical reality.



## 9 Limitations and Threats to Validity
Several methodological and institutional limitations must be acknowledged. First, this research is structured as an in-depth design-based case study conducted across two partner universities in Taiwan; while the findings demonstrate high ecological validity within this setting, statistical generalization to other student demographics or institutional contexts requires further multi-site investigation. Second, the technical implementation utilizes Espressif ESP32-C3 hardware; while the four-plane architecture and PACE methodology are microarchitecture-agnostic, specific low-level memory maps and driver timings reflect this platform. Third, our empirical evaluation utilized qualitative artifact analysis; future research should incorporate comparative experimental designs measuring quantitative learning gains, time-to-first-actuation, and debugging cognitive load.



## 10 Conclusion
This paper presented a full-stack Vibe Coding architecture and Hardware-in-the-Loop verification methodology for IoT hardware-software integration education. By situating AI-assisted programming within a unified monorepo governed by a four-plane intelligent learning ecosystem, the framework successfully bridges the divide between plausible code synthesis and operational cyber-physical reality. Vehicle-hosted Wi-Fi HTTP provides a reliable, universally accessible product channel, while dual-path deployment and 500 ms autonomous watchdogs guarantee recoverability and physical safety. Adapting the PACE pedagogical framework to demand multi-layered HIL evidence ensures that learners cultivate genuine diagnostic and architectural competencies. As generative AI becomes standard across computing education, coupling synthetic intent with empirical physical verification provides an essential foundation for human-centered engineering learning.



## References

[1] Karpathy, A.: Vibe coding. X post, 2 February 2025 (2025)


[2] Collins Dictionary: Vibe coding. In: Word of the Year 2025. HarperCollins, Glasgow (2025)


[3] Chen, R.Y.-K., Chen, Y.-L., Lin, R.-Y., Chen, Y.-T.: Vibe Coding Pedagogy: A Teaching Framework Design Study Based on an IoT Front-End Development Course. In: Proceedings of SSIM 2026. Springer, Cham (2026)


[4] Kasneci, E., Sessler, K., Küchemann, S., et al.: ChatGPT for good? On opportunities and challenges of large language models for education. Learning and Individual Differences 103, 102274 (2023)


[5] Prather, J., Reeves, B.N., Denny, P., Becker, B.A., Leinonen, J., Luxton-Reilly, A., Powell, G., Finnie-Ansley, J., Santos, E.A.: “It’s weird that it knows what I want”: Usability and interactions with Copilot for novice programmers. ACM Transactions on Computer-Human Interaction 31(1), 1–31 (2024)


[6] Humble, J., Farley, D.: Continuous Delivery: Reliable Software Releases through Build, Test, and Deployment Automation. Addison-Wesley, Boston (2010)


[7] Potvin, R., Levenberg, J.: Why Google stores billions of lines of code in a single repository. Communications of the ACM 59(7), 78–87 (2016)


[8] Fielding, R., Nottingham, M., Reschke, J.: HTTP Semantics. RFC 9110, Internet Engineering Task Force (2022)


[9] World Wide Web Consortium: Web Bluetooth Community Group Report. W3C, https://webbluetoothcg.github.io/web-bluetooth/ (2026)


[10] Lee, E.A.: Cyber physical systems: Design challenges. In: 11th IEEE International Symposium on Object and Component-Oriented Real-Time Distributed Computing, pp. 363–369. IEEE (2008)


[11] Espressif Systems: ESP32-C3 Technical Reference Manual, version 1.3. Espressif Systems, Shanghai (2025)


[12] Isermann, R., Schaffnit, J., Sinsel, S.: Hardware-in-the-loop simulation for the design and testing of engine-control systems. Control Engineering Practice 7(5), 643–653 (1999)


[13] Design-Based Research Collective: Design-based research: An emerging paradigm for educational inquiry. Educational Researcher 32(1), 5–8 (2003)


[14] Yin, R.K.: Case Study Research and Applications: Design and Methods, 6th edn. SAGE, Thousand Oaks (2018)


[15] Bowen, G.A.: Document analysis as a qualitative research method. Qualitative Research Journal 9(2), 27–40 (2009)


[16] Skilling, K., Stylianides, G.: Using vignettes in educational research: a framework for vignette construction. International Journal of Research & Method in Education 43(5), 541–556 (2019)




