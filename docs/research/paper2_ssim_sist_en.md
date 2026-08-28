# Full-Stack Vibe Coding Pedagogy for IoT Hardware–Software Integration: A Monorepo Architecture and Hardware-in-the-Loop Verification Study

**Rover Yu-Kuan Chen**  
Taiwan Vibe Coding Co., Taiwan  
rover.k.chen@gmail.com  

**Yui-Liang Chen**  
Department of Information Management, Shih Hsin University, Taiwan  
ychen@mail.shu.edu.tw  

**Rui-Yu Lin (Corresponding Author)**  
Department of Information Management, Shih Hsin University, Taiwan  
linroy1202a@gmail.com  

**Yu-Ting Chen**  
Department of Early Childhood Development and Education, Chaoyang University of Technology, Taiwan  
abc100308@gmail.com  

---

## Abstract

Large language models enable *Vibe Coding*, in which software is generated and revised through natural-language interaction. In Internet of Things (IoT) development, however, plausible source code is not equivalent to a functioning system. A mobile control interface and ESP32 firmware occupy heterogeneous execution environments and can each pass local checks while disagreeing about commands, network state, deployment artifacts, or safety behavior. This paper presents an engineering-centered case study of a closed-loop development and verification architecture used across an Entry-level Autonomous Car Course and a Basic Autonomous Car Course. The architecture has four mutually dependent elements: a monorepo that co-locates the Web and firmware implementations; a shared protocol specification that constrains HTTP, optional Bluetooth Low Energy (BLE), and maintenance semantics; dual deployment paths using over-the-air (OTA) updates when the vehicle remains reachable and USB rescue when it does not; and Hardware-in-the-Loop (HIL) acceptance that combines interface, network, firmware, and physical-motion evidence. The primary product control channel is a vehicle-hosted Wi-Fi HTTP remote containing a D-pad and drive endpoint. BLE is an optional secondary channel, while Classroom JSON, Canvas, and connection exercises are learning sandboxes rather than substitutes for the product remote. We catalog recurrent failures, including protocol drift, incorrect access-point assumptions, incomplete boot chains, premature OTA validation, browser incompatibility, command-release loss, and power-related resets. Two closed-loop walkthroughs show how entry-side interaction work and basic-side firmware work converge on the same observable vehicle behavior. We further adapt Prompt–Audit–Commit–Evaluate (PACE) so that evaluation requires deployment and HIL evidence. The study contributes a reproducible engineering workflow and assessment rubric rather than a new model or a child-centered tutoring framework. Its central finding is that AI-assisted IoT development becomes dependable only when generation, protocol audit, deployment, recovery, and physical verification are treated as one continuous loop.

**Keywords:** Vibe Coding · Internet of Things · ESP32-C3 · Monorepo · Shared protocol · Wi-Fi HTTP · Over-the-air update · Hardware-in-the-Loop · Mobile remote control

---

## 1 Introduction

### 1.1 From plausible code to an operating vehicle

Generative artificial intelligence has changed the cost and form of software production. A learner or developer can describe a desired behavior, inspect a proposed implementation, and request successive revisions without composing every statement manually. The popular term *Vibe Coding* emphasizes this intent-driven interaction [1, 2]. In a browser-only task, the resulting artifact can often be evaluated immediately through rendering, unit tests, and developer tools. An IoT vehicle imposes a more demanding criterion. Code is split between a mobile browser and an embedded target; network interfaces change during operation; an update may alter the only channel available for the next update; and correctness ultimately includes voltage, timing, motor actuation, and safe stopping.

This creates a recurring discrepancy between apparent and operational completion. A remote-control page may render correctly but send the wrong query parameters. Firmware may compile but never boot after an incomplete flash. The vehicle may advertise a Bluetooth service that an iPhone browser cannot use. An OTA upload may report success while the new application crashes before re-establishing HTTP connectivity. A classroom simulation may show a moving joystick while no command reaches the motor driver. These are not isolated syntax errors. They are broken links in a cross-layer chain from user intent to physical effect.

The case examined in this paper separates introductory mobile-interface work from basic embedded-firmware work, then reunites both in an Integration Lab. The deployed product path is deliberately unambiguous: the phone joins either the vehicle SoftAP or the same infrastructure network as the vehicle, opens the page hosted by the vehicle, and sends HTTP drive commands from a D-pad. BLE is retained as an optional channel for compatible browsers and protocol laboratories. Classroom exercises involving JSON messages, Canvas joysticks, or BLE state machines are valuable sandboxes, but they do not constitute evidence that the product remote can drive the car.

Curriculum numbering follows that engineering priority. In the Entry-level (Car Starter) track, units are numbered **S01–S15 by learning stage**—shell UI, touch and hold/stop, panel and flow, packet-design contrast, optional BLE labs, then Canvas joystick labs—so ordinary driving is not gated on BLE or Canvas mastery. Repository skill slugs may retain historical names. In the Basic track, Classroom identifiers **B01–B30** remain topic-block numbers for now, but the recommended integration sequence places Wi-Fi/HTTP practice before BLE, and treats many unit sketches as separate from the fleet image used for product HIL.

### 1.2 Research questions and scope

The principal research question is:

> How should AI-assisted edits, shared artifacts, deployment paths, recovery procedures, and acceptance evidence be organized so that changes to a mobile remote and ESP32 firmware reliably produce a testable physical result?

Three subsidiary questions guide the analysis:

* **RQ1—Cross-stack consistency:** How can locally plausible AI edits remain semantically aligned across Web and embedded implementations?
* **RQ2—Executable delivery:** How can a source change be moved into the correct browser or board execution state without confusing build success with deployment success?
* **RQ3—Physical verification:** What evidence is sufficient to demonstrate that interface, transport, firmware, and actuation work together?

The paper is intentionally different from a companion pedagogy study centered on tutoring, learner age, and general classroom scaffolding [3]. The unit of analysis here is the engineering closed loop: repository structure, protocol control, deployment topology, recovery, failure diagnosis, and HIL acceptance. Educational implications are discussed because the architecture is used in courses, but the contribution is not a K–9 instructional model and does not evaluate a conversational Tutor.

### 1.3 Contributions

The paper makes five contributions. First, it defines a channel-priority architecture in which the vehicle-hosted Wi-Fi HTTP remote is primary, BLE is optional, and sandboxes are explicitly non-product artifacts. Second, it explains how a monorepo and shared protocol reduce cross-stack hallucination. Third, it presents OTA and USB as complementary deployment paths determined by device reachability. Fourth, it derives a failure-mode catalog and HIL rubric from repeated integration work. Fifth, it adapts PACE to require evidence from a deployed embedded system rather than accepting generated code or unit-test output alone.

## 2 Related Work and Conceptual Positioning

### 2.1 AI-assisted programming and verification

Research on large language models in education reports substantial opportunities for explanation, feedback, and code generation, together with risks involving inaccurate output, over-reliance, assessment validity, and unequal ability to audit responses [4]. Studies of AI code assistants similarly show that natural-language interaction can accelerate progress while shifting effort toward specification, interpretation, and debugging [5]. These observations are especially relevant to Vibe Coding: the reduction in keystrokes does not remove the need to determine whether a generated change respects a system contract.

Embedded integration differs from browser-only programming because compilation is followed by image construction, flashing, boot selection, network initialization, and peripheral behavior. A fault can remove the channel needed to observe or repair it, while correctness may be physical and temporal. We therefore treat LLM output as an engineering proposal that must be audited, deployed through a state-appropriate path, and evaluated through multiple observations [6].

### 2.2 Monorepos, traceability, and shared contracts

A monorepo is useful only when co-location establishes atomic changes, discoverable scripts, and enforceable interfaces. Industrial experience shows its visibility and dependency-management benefits [7]. Here, an agent modifying the remote can inspect the firmware and protocol in the same workspace, and a semantic change can update both ends in one reviewable unit.

Interface description is central because Web and embedded code cannot generally import the same runtime implementation. The Web side may consume TypeScript constants and encoders, while the firmware side mirrors constants in C++ and is checked by fixtures or documented vectors. “Shared protocol” consequently means a governed source of truth and conformance examples, not an assumption that one binary library runs everywhere. HTTP semantics follow established request-response concepts [8]; optional BLE behavior follows Generic Attribute Profile constraints and browser security requirements [9]. Explicit contracts convert a vague integration expectation into fields, ranges, response conditions, checksums, and timeouts that can be tested.

### 2.3 IoT, cyber-physical systems, and failure propagation

Cyber-physical systems join computation, networking, timing, and physical dynamics [10]. In this vehicle, a browser gesture becomes a velocity and angular-rate request, firmware maps it to wheel commands, and PWM drives an H-bridge under battery, friction, and wiring constraints. Defects in different layers can all appear as “the car does not move.”

ESP32-C3 development adds bootloader, partition, Wi-Fi, BLE, watchdog, and OTA concerns [11]. OTA improves iteration speed, but it also makes availability part of the deployment precondition. If an image disables all reachable interfaces, OTA cannot repair that image. The system therefore needs a lower-level recovery path. Continuous-delivery literature emphasizes repeatable pipelines and rapid feedback [6]; for embedded systems, repeatability includes the physical transport and complete flash layout, not only producing an application binary.

### 2.4 Hardware-in-the-Loop as an acceptance strategy

HIL exposes a controller to realistic inputs across software and hardware boundaries [12]. This study uses a lightweight form: a real phone, ESP32-C3, radios, power conditions, and safely constrained wheels. It closes gaps left by static inspection without claiming automotive certification.

HIL evidence must be triangulated: screenshots do not prove endpoints, HTTP responses do not prove motor output, and motion videos may hide the command path. Independent observations reduce ambiguity.

## 3 Case Context and Method

### 3.1 Case platform

The platform combines an ESP32-C3 vehicle, a mobile Web interface, and course repositories. The Entry-level Autonomous Car Course develops interface capabilities: semantic HTML, responsive layout, touch behavior, press-and-hold control, release-to-stop, state indication, and HTTP interaction. The Basic Autonomous Car Course develops firmware capabilities: PlatformIO builds, GPIO and PWM, H-bridge control, Wi-Fi SoftAP/STA behavior, HTTP services, optional BLE GATT, OTA, state machines, and watchdog stopping. Integration brings these capabilities together.

A critical testing distinction on the Basic side is that **most Classroom units are independent PlatformIO sketches**. Uploading a unit image often overwrites the fleet firmware used for product driving. Not every Basic exercise is therefore verified “on the fleet binary”: examples deliberately kept out of the fleet image include full `ESPAsyncWebServer` stacks, classic dual-core pinning patterns unsuitable for ESP32-C3, and OTA authentication experiments that can lock a classroom board. Product HIL uses the monorepo fleet image (vehicle-hosted page, HTTP drive/status, SoftAP↔STA recovery, deferred OTA validation, optional BLE). After a unit sketch upload, operators must OTA or USB-restore the fleet image before claiming product-path success.

The production control surface is hosted by the vehicle at `/`. In SoftAP mode it is normally reached at `http://192.168.4.1`; in STA mode it is reached using the assigned IP address. The page exposes an ENGINE gate, D-pad controls, connection/firmware status, and calls such as `GET /api/drive?v=<linear>&w=<angular>`. A separate Web Controller can assist discovery and advanced operations, but it does not displace the hosted page as the minimum product path. BLE uses a named GATT service and binary command frame when the browser and security context support Web Bluetooth.

### 3.2 Data sources and analysis

The analyzed artifacts include the monorepo structure, protocol definitions, firmware source and build configuration, the firmware playbook, OTA fleet guidance, Entry and Basic unit maps, Integration Lab instructions, retest records, acceptance screenshots, and recurrent troubleshooting notes [15]. We performed qualitative artifact analysis in three passes. The first mapped intended behavior from user action to motor output. The second identified points where the observed system could diverge from that intended path. The third converted recurrent divergences into protocol rules, deployment decision points, or acceptance criteria.

Failures were classified by the earliest layer that could explain the observation: interface, protocol, browser/channel, network topology, firmware runtime, image/deployment, boot chain, electrical/physical, or evidence quality. This “earliest explanatory layer” rule prevents one symptom from being counted as many unrelated faults. It also creates an actionable triage order.

### 3.3 Validity boundaries

This single-organization engineering case follows design-based case reasoning [13, 14]. Records arose during construction and retesting rather than a pre-registered experiment; findings are operational propositions, not causal learning estimates or model comparisons. Safety tests use constrained wheels or a clear floor area with immediate power removal.

**Table 1. Case components and their verification roles (caption placeholder).**

| Component | Principal responsibility | Fast feedback | HIL evidence |
|---|---|---|---|
| Entry-side work | Touch UI and HTTP command intent | Browser preview and Web tests | Hosted page operation on a phone |
| Basic-side work | Network, command execution, and actuation | PlatformIO build and protocol tests | Status API, watchdog, and motion |
| Shared protocol | Cross-stack semantics | Fixtures and contract review | Matching request and observed action |
| Deployment system | Place correct image on target | Image checks and upload response | Rebooted version remains reachable |

## 4 Closed-Loop System Architecture

### 4.1 Four planes of the architecture

The architecture can be understood as four planes. The **interaction plane** contains the vehicle-hosted remote and, secondarily, the advanced controller and BLE tools. The **contract plane** contains HTTP routes, parameter meaning, value ranges, optional BLE UUIDs and frames, maintenance operations, status fields, and image constraints. The **execution plane** contains the browser runtime, ESP32 firmware, motor state machine, and driver pins. The **delivery and evidence plane** contains builds, OTA, USB recovery, logs, status requests, screenshots, and physical observations.

A successful change traverses all four. Changing a turn value requires a UI output, a defined range, safe firmware mapping, delivery to the board, and HIL evidence of bounded turning and stopping. AI can draft code and tests, but explicit system knowledge constrains the result.

**Fig. 1. Closed-loop architecture from Prompt and protocol audit through monorepo build, OTA/USB deployment, vehicle-hosted HTTP control, and HIL evidence (figure placeholder).**

### 4.2 Channel priority and product boundary

Channel priority is an architectural requirement, not a documentation preference. The primary path is:

1. the vehicle starts a WPA2 SoftAP when valid STA service is unavailable;
2. the phone joins the AP and opens the vehicle page, or both devices join an infrastructure network and the phone opens the vehicle STA IP;
3. pressing a D-pad direction issues an HTTP drive request;
4. release, cancellation, or timeout produces a stop;
5. firmware maps the request to bounded motor outputs and exposes status.

This path works where Web Bluetooth is unavailable and keeps page and API versions on the same device.

BLE remains useful for GATT instruction and diagnostics but is not required for driving. Web Bluetooth needs a compatible browser and secure context [9].

Classroom JSON, Canvas, and BLE sandboxes teach serialization, mapping, and asynchronous states. Because they may differ from the vehicle, they are labeled “Lab” and accepted only against unit objectives.

**Fig. 2. Channel-priority map: vehicle-hosted Wi-Fi HTTP remote as the product path, BLE as an optional secondary channel, and Classroom exercises as non-product sandboxes (figure placeholder).**

### 4.3 Monorepo as an integration boundary

The monorepo co-locates the Web Controller, firmware, protocol, scripts, official image, and playbooks. Horizontal traceability links UI actions to handlers; vertical traceability links source to image version and evidence; operational traceability links board state to OTA or USB. Repository-wide search exposes all uses of an endpoint before editing, while micro-commits keep protocol, implementation, fixtures, artifacts, and notes reviewable.

### 4.4 Shared protocol as minimum truth

The protocol layer defines behavior at boundaries. For HTTP driving, this includes route aliases, parameter names, numeric ranges, stop semantics, status codes, and CORS behavior for an externally served controller. Linear velocity `v` and angular velocity `w` are mapped to left and right wheel demands using a bounded differential-drive transformation. Values outside the accepted range are rejected or clamped according to the documented rule. A missing or stale command must not leave previous PWM active indefinitely.

The optional BLE contract fixes the header, offset-encoded values, checksum, UUIDs, and byte order. Separate maintenance opcodes avoid confusion with movement. These rules prevent a recurrent mismatch in which a Web client emits ASCII commands to a binary parser.

OTA rules are also contractual. The official slim application image must have the ESP image magic byte, the ESP32-C3 chip identifier, and an acceptable size. An OTA application image is distinct from a bootloader, partition table, and `boot_app0` image used for full USB recovery. Treating artifacts as typed protocol objects—rather than interchangeable `.bin` files—prevents a class of destructive selection errors.

### 4.5 Network self-healing and status observability

The vehicle uses AP↔STA switching. If valid credentials allow a healthy STA connection, SoftAP is disabled; this reduces ambiguity and resource use. If STA connection fails or drops beyond a grace interval, the vehicle returns to SoftAP. A password-protected SoftAP is used because open embedded hotspots can be unreliable to join on some phones. Factory reset clears stored credentials through a deliberate BOOT-button hold, Web action, or maintenance command; RESET only restarts the device.

Because “AP disappeared” can mean success or failure, status reports firmware version, network role, IP, uptime, BLE state, FSM state, and OTA validation. Operators use a numeric STA IP when multicast DNS is unreliable.

### 4.6 Actuation and safety closure

Drive requests enter a state machine such as IDLE, RUNNING, or FAULT. Firmware validates values, computes wheel demands, applies dead-zone compensation where required, and outputs PWM/direction signals to the assigned ESP32-C3 pins. A command watchdog stops all motor outputs after approximately 500 ms without a fresh command. The browser sends stop on pointer release, pointer cancellation, window blur, and ENGINE disable; the watchdog remains authoritative when those events are lost.

This dual protection is important. Browser event handling alone cannot guarantee delivery over a changing wireless link. Firmware timeout alone may permit an unnecessarily long movement if the remote fails to send release. Together they produce defense in depth: cooperative stop in the interface and independent stop at the actuator.

## 5 Failure-Mode Catalog and Diagnostic Logic

The catalog in Table 2 was used to convert repeated integration failures into teachable constraints. Severity is contextual; the principal concern is whether a failure prevents recovery, creates unsafe movement, or produces misleading evidence.

**Table 2. Recurrent cross-layer failure modes and closure controls (caption placeholder).**

| Failure mode | Typical observation | Root condition | Detection and control |
|---|---|---|---|
| HTTP semantic drift | Page responds but motion is wrong or absent | UI and firmware disagree on route, `v`/`w`, range, or stop | Contract fixtures, endpoint audit, motion test |
| BLE representation drift | Connects but commands do nothing | ASCII/text sent to binary parser, wrong UUID or checksum | Known byte vectors and optional BLE HIL |
| Sandbox/product substitution | Attractive UI or green tests, no vehicle control | Lab artifact treated as deployed remote | Product-path label and hosted-page rubric |
| Stale network assumption | `192.168.4.1` fails after provisioning | Healthy STA intentionally disabled AP | Status/network-role evidence; use STA IP |
| Unjoinable SoftAP | SSID visible but phone cannot remain connected | Open AP policy, stale credentials, or mobile-data switching | WPA2 AP, forget/rejoin procedure, explicit IP |
| mDNS dependence | Hostname fails while device is healthy | Multicast filtering, OS or network behavior | Record and use numeric STA IP |
| Lost release event | Vehicle continues briefly after finger release | Pointer cancellation, focus loss, or packet loss | Multiple stop events plus 500-ms watchdog |
| Premature OTA validation | Bad image repeatedly boots or removes rollback | Application marked valid before stable service | Deferred validation after stable runtime |
| Wrong OTA artifact | Upload accepted; product capabilities disappear | Diagnostic or non-application binary selected | Single official artifact and header/chip/size checks |
| Incomplete USB boot chain | Flash reports success; no app, AP, BLE, or serial behavior | `boot_app0` or another required image omitted after erase | Four-image manifest with fixed addresses |
| “Wireless-only” recovery assumption | Lifeless board cannot be updated | OTA requires an already reachable HTTP service | Decision rule: unreachable board requires USB |
| Power/brownout reset | AP appears intermittently; resets under motor load | Weak cable, shared motor supply, current transient | Isolated supply test, reset evidence, wiring inspection |
| Pin/profile mismatch | HTTP succeeds but wheels do not move correctly | Firmware targets another board or wiring profile | `/api/info`, pin checklist, constrained motor test |
| Ambiguous evidence | Screenshot appears valid but version/path unknown | Evidence omits URL, firmware state, or physical effect | Multi-item HIL bundle with timestamp/version |

### 5.1 Why successful flashing can still mean no application

After a full erase, recovery requires the bootloader at `0x0`, partition table at `0x8000`, `boot_app0` at `0xe000`, and application at `0x10000`. A tool can successfully write an incomplete supplied set; omitting `boot_app0` can therefore yield a clean log but no application. Acceptance checks both the manifest and the hosted page after reboot.

### 5.2 OTA as a reversible state transition

OTA is safe only under explicit preconditions. Before upload, the current HTTP endpoint must be reachable and the selected artifact must pass type checks. During upload, firmware writes the inactive application slot. After reboot, the new application remains pending until it has run stably long enough to initialize essential services. Only then is it marked valid. If it crashes early, the bootloader can roll back.

Immediate validation defeats rollback by confirming an image before Wi-Fi and HTTP demonstrate viability. OTA success therefore means that the new version rebooted, reappeared on HTTP, reported expected status, and retained drive/stop behavior—not merely that bytes were uploaded.

### 5.3 Diagnosing one symptom across layers

When the car does not move, random code editing is inefficient. Triage proceeds from reachability to semantics to actuation. First, can the phone load the hosted page? Second, does `/api/status` identify the expected firmware and network role? Third, does a zero-speed request and then a bounded drive request return normally? Fourth, does firmware state change? Fifth, do motor outputs change with wheels safely raised? Sixth, are driver power, ground, and pins correct?

This order avoids rewriting UI for a battery fault or reflashing for a stale IP. Prompts should provide observed state and the earliest failed checkpoint, not merely “the car is broken.”

## 6 Two Closed-Loop Walkthroughs

### 6.1 Entry-side walkthrough: improving press, hold, and release

An Entry learner is asked to improve D-pad touch behavior. The intended behavior is that pressing Forward starts bounded forward movement, holding maintains it through refreshed HTTP commands, and every release or interruption requests stop.

**Prompt.** The learner specifies the endpoint, `v`/`w` semantics, ENGINE gate, pointer behavior, and acceptance test, preventing substitution of BLE or a Canvas-only implementation.

**Audit.** Review checks that Forward maps to positive `v` and zero `w`; Stop maps both to zero; cancellation, blur, and ENGINE-off stop safely; updates are rate-limited; and failures remain visible. A BLE-only transport is rejected.

**Implement and fast test.** Browser tests verify mapping, stop generation, ENGINE gating, cancellation, responsive layout, and touch targets. These remain entry-side evidence.

**Deploy.** The page is built into firmware. OTA is used only if HTTP is alive; otherwise USB is used. Reopening the vehicle address confirms that the deployed, not localhost, UI is under test.

**HIL evaluate.** With wheels constrained, the operator observes Forward, RUNNING, correct wheel direction, release-to-stop, and watchdog stop after disconnect. Evidence includes hosted URL/version, status, and physical observation. A Classroom joystick screenshot cannot replace this result.

### 6.2 Basic-side walkthrough: changing Wi-Fi recovery and OTA diagnostics

A Basic learner is asked to improve recovery after STA loss and expose OTA validation state. The change touches asynchronous network behavior and can remove the update path, so its loop emphasizes deployment safety.

**Prompt.** The request states that healthy STA disables AP, STA loss restores protected SoftAP after a grace period, status exposes network and OTA state, early validation is forbidden, and HTTP driving remains available.

**Audit.** Review ensures STA retry does not tear down working SoftAP, timing is nonblocking and wrap-safe, watchdog service remains intact, and hosted/status routes survive both modes. Partition, size, route aliases, and drive semantics are checked.

**Build.** PlatformIO produces the application; magic, chip identifier, size, and version are checked before it replaces the official slim artifact. Boot or partition changes also trigger rebuilding the four-image USB package.

**Deploy by state.** A reachable board receives OTA at its recorded numeric IP and is polled after reboot. A board with no AP or STA service receives the complete USB recovery chain.

**HIL evaluate.** The board exposes SoftAP, joins STA, disables AP, and restores AP after infrastructure loss. The reloaded page drives and stops the vehicle; after stable runtime, status shows OTA validation. A compiler log cannot establish these behaviors.

### 6.3 Integration convergence

Entry work controls command intention; Basic work controls realization, reachability, and recovery. Integration joins them in one scenario: open the page served by the target, move through HTTP, release to stop, and retain an observation/update route.

**Fig. 3. Entry and Basic closed-loop walkthroughs converging on the same hosted-page-to-motor HIL scenario (figure placeholder).**

## 7 HIL Rubrics and the PACE Adaptation

### 7.1 Layered HIL evidence

The rubric uses five layers:

1. **Identity and deployment:** Is the intended firmware version running on the intended board?
2. **Interface and channel:** Is the product page loaded from the vehicle through the primary Wi-Fi HTTP path?
3. **Protocol and state:** Do requests use the agreed semantics, and do status/FSM fields change coherently?
4. **Physical behavior and safety:** Do wheels move in the intended direction and stop on release, timeout, or ENGINE disable?
5. **Recovery:** Can a reachable board accept a valid OTA and can an unreachable board be restored by USB?

BLE earns credit only when assigned and cannot compensate for failed HTTP. Sandbox results demonstrate prerequisites, not product-channel completion.

**Table 3. HIL acceptance rubric (caption placeholder).**

| Criterion | Weight | Full-credit evidence | Common insufficient evidence |
|---|---:|---|---|
| Deployed identity | 15% | Hosted page/status shows expected board and version after reboot | Build log without board observation |
| Primary Wi-Fi HTTP path | 25% | Phone loads vehicle-hosted page and drive endpoint responds | Localhost preview or BLE connection only |
| Protocol/state consistency | 20% | Known commands produce coherent HTTP/FSM/status transitions | Screenshot with no request or state evidence |
| Motion and safe stop | 30% | Correct constrained motion; release and timeout both stop | UI animation or motor sound alone |
| Recovery/diagnosis | 10% | Correct OTA/USB decision and documented post-recovery check | Repeated flashing without state diagnosis |

A pass independently requires primary HTTP and motion/safe-stop. Low-speed constrained testing is sufficient; full-speed free-floor operation is unnecessary.

### 7.2 PACE for cyber-physical work

The companion pedagogy framework defines PACE as Prompt–Audit–Commit–Evaluate [3]. In this engineering setting, each term is extended.

**Prompt** states system location, protocol invariants, safety, deployment assumptions, and an acceptance scenario. It identifies the changed module and preserves Wi-Fi HTTP primacy.

**Audit** checks protocol, playbook, pins, image type, network state, watchdog, and rollback. It rejects unsupported premises such as permanent wireless-only recovery.

**Commit** keeps source, tests, version, official image, and notes traceable. It avoids both stale distributable firmware and binaries without reproducible source.

**Evaluate** proceeds through static checks, Web tests, firmware build, image validation, deployment, API observation, and HIL. Evidence routes failure back to protocol audit, network diagnosis, USB recovery, or pin/mapping checks.

**Table 4. PACE adaptation for full-stack IoT (caption placeholder).**

| Stage | Required engineering question | Exit condition |
|---|---|---|
| Prompt | What behavior, invariant, deployment state, and test define success? | Bounded change request with acceptance scenario |
| Audit | Does the proposal preserve protocol, safety, topology, and recovery? | Cross-layer review and relevant tests pass |
| Commit | Are source, artifact, version, and notes traceable together? | Reviewable reproducible change |
| Evaluate | Does the deployed system work and fail safely on hardware? | Required HIL rubric gates pass |

### 7.3 Rubric use in diagnosis

The rubric also diagnoses faults: missing identity suggests deployment ambiguity; wrong movement suggests semantics, pins, or power; unsafe stopping suggests event or watchdog defects; post-OTA HTTP loss suggests startup or validation.

## 8 Findings and Discussion

### 8.1 Closure mechanisms matter more than local code quality

Across the artifacts and recurrent failures, integration success was associated with closure mechanisms: a declared primary channel, contract visibility, a deployment decision based on reachability, and evidence that crossed into physical behavior. Locally polished code did not compensate for a broken loop. This answers RQ1 by showing that consistency is maintained through governed contracts and cross-repository visibility rather than by assuming that an LLM will infer both implementations correctly.

The monorepo’s value is organizational, not automatic. Co-location prevents drift only when paired with shared fixtures, version evidence, refreshed artifacts, and acceptance gates.

### 8.2 Primary-channel clarity reduces false completion

The explicit hierarchy—vehicle-hosted Wi-Fi HTTP first, BLE optional, sandboxes non-product—resolved several ambiguous completion claims. A BLE scan can establish that firmware is alive but cannot prove Safari-compatible product control. A Canvas joystick can establish coordinate mathematics but cannot prove deployment. Conversely, HTTP primacy does not devalue these exercises; it assigns each artifact an honest scope.

BLE may appear earlier in a syllabus, but engineering dependency—not lesson number—determines the integration path. The Entry track’s stage-ordered S01–S15 numbering and the Basic track’s recommended sequence (environment and actuation foundations, then Wi-Fi/HTTP, then optional BLE and specialty sketches) encode that rule without requiring every Classroom repository to be renamed.

### 8.3 OTA increases velocity; USB preserves recoverability

RQ2 is answered by a two-path deployment model. OTA supports rapid iteration when a known HTTP service is alive. USB is the floor of recoverability for an erased, corrupted, or radio-silent board. Presenting USB as a failure of “wireless development” is counterproductive. It is the root recovery mechanism that makes aggressive OTA iteration tolerable.

The distinction between an OTA application artifact and a complete USB image set proved especially important. File extensions do not carry enough meaning. Header validation, a single named official artifact, fixed-address manifests, and post-reboot version checks are inexpensive controls with high impact.

### 8.4 HIL changes the definition of done

RQ3 is answered by layered evidence with mandatory gates. Unit tests rapidly reject known software errors, and simulations reduce hardware contention, but neither tests the actual phone, network role, board image, motor wiring, or stop behavior. HIL does not replace unit testing; it covers different uncertainties. The rubric’s strongest feature is not its score but its refusal to let optional evidence substitute for the primary channel and safe motion.

Rather than regenerating a feature after any failure, the operator gathers identity, reachability, state, and physical evidence, narrowing the defective layer.

### 8.5 Operational documentation is executable knowledge

The firmware playbook externalizes rules difficult to infer from symptoms: healthy STA may disable AP, RESET retains credentials, OTA validation is deferred, and `boot_app0` follows erase. Versioned documentation makes these rules available during Prompt and Audit.

## 9 Limitations and Threats to Validity

The study examines one platform and organization. ESP32-C3 details and browser support limit low-level transfer; the closure pattern should be tested on other devices.

Second, qualitative artifact evidence does not estimate learning gains or defect reduction. Future studies should measure deployment attempts, diagnosis time, recovery frequency, and rubric reliability.

Third, evolving documentation contained historical inconsistencies, making retrospective frequency counts unreliable; we report categories rather than prevalence.

Fourth, the lightweight HIL rubric omits worst-case latency, electromagnetic compatibility, braking distance, adversarial security, and automotive certification. Future work should add timestamped probes, packet capture, power telemetry, and safe fault injection.

Finally, *Vibe Coding* can mean casual prompt-and-paste or disciplined agentic work. Here it means natural-language generation embedded in PACE; dependability comes from surrounding controls, not the label.

## 10 Conclusion

AI-assisted development can support a mobile remote and ESP32 firmware, but only if source generation is connected to contract audit, executable delivery, recovery, and physical evidence. In the studied architecture, the monorepo makes cross-stack dependencies visible; the shared protocol constrains HTTP and optional BLE semantics; OTA accelerates reachable boards while USB restores unreachable ones; and HIL verifies the complete path from the vehicle-hosted Wi-Fi HTTP page to safe motor behavior.

The product boundary remains explicit: hosted HTTP is primary, BLE optional, and Classroom sandboxes are not product remotes. PACE requires test intent, invariant audits, traceable commits, and deployed evaluation. Code is complete only when physical behavior is observable, safely stoppable, and recoverable.

## References

1. Karpathy, A.: Vibe coding. X post, 2 February 2025 (2025)
2. Collins Dictionary: Vibe coding. In: Word of the Year 2025. HarperCollins, Glasgow (2025)
3. Chen, R.Y.-K., Chen, Y.-L.: Vibe Coding Pedagogy: A Teaching Framework Design Study Centered on Vibe Classroom. Working paper, Taiwan Vibe Coding Co. (2026)
4. Kasneci, E., Sessler, K., Küchemann, S., et al.: ChatGPT for good? On opportunities and challenges of large language models for education. Learning and Individual Differences 103, 102274 (2023)
5. Prather, J., Reeves, B.N., Denny, P., Becker, B.A., Leinonen, J., Luxton-Reilly, A., Powell, G., Finnie-Ansley, J., Santos, E.A.: “It’s weird that it knows what I want”: Usability and interactions with Copilot for novice programmers. ACM Transactions on Computer-Human Interaction 31(1), 1–31 (2024)
6. Humble, J., Farley, D.: Continuous Delivery: Reliable Software Releases through Build, Test, and Deployment Automation. Addison-Wesley, Boston (2010)
7. Potvin, R., Levenberg, J.: Why Google stores billions of lines of code in a single repository. Communications of the ACM 59(7), 78–87 (2016)
8. Fielding, R., Nottingham, M., Reschke, J.: HTTP Semantics. RFC 9110, Internet Engineering Task Force (2022)
9. World Wide Web Consortium: Web Bluetooth Community Group Report. W3C, https://webbluetoothcg.github.io/web-bluetooth/ (accessed 25 August 2026)
10. Lee, E.A.: Cyber physical systems: Design challenges. In: 11th IEEE International Symposium on Object and Component-Oriented Real-Time Distributed Computing, pp. 363–369. IEEE (2008)
11. Espressif Systems: ESP32-C3 Technical Reference Manual, version 1.3. Espressif Systems, Shanghai (2025)
12. Isermann, R., Schaffnit, J., Sinsel, S.: Hardware-in-the-loop simulation for the design and testing of engine-control systems. Control Engineering Practice 7(5), 643–653 (1999)
13. Design-Based Research Collective: Design-based research: An emerging paradigm for educational inquiry. Educational Researcher 32(1), 5–8 (2003)
14. Yin, R.K.: Case Study Research and Applications: Design and Methods, 6th edn. SAGE, Thousand Oaks (2018)
15. Taiwan Vibe Coding Co.: Vibe Coding Car Monorepo: Integration Lab, Firmware Playbook, OTA Fleet Guide, Entry/Basic Course Maps, and Retest Records. Internal technical artifacts (2026)
16. PlatformIO: PlatformIO Core Documentation. https://docs.platformio.org/ (accessed 25 August 2026)
17. Bluetooth SIG: Bluetooth Core Specification, version 5.4. Bluetooth Special Interest Group, Kirkland (2023)
18. International Electrotechnical Commission: IEC 61508-3: Functional Safety of Electrical/Electronic/Programmable Electronic Safety-Related Systems—Software Requirements. IEC, Geneva (2010)

## Appendix A: Minimal HIL Submission Bundle

An integration submission contains: (1) a phone screenshot with vehicle URL, ENGINE, and D-pad; (2) status with version, network role, uptime, and OTA validation; (3) bounded drive and zero-command evidence; (4) a wiring photograph; and (5) observation of motion, release-to-stop, and watchdog stop. An assigned BLE lab adds identity and one decoded frame. Sandbox evidence cannot replace an integration item.

## Appendix B: Deployment Decision Card

1. Query the known SoftAP or STA HTTP address.
2. If status is reachable, record version/IP, validate the official slim application image, perform OTA, and confirm the new version plus drive/stop behavior after reboot.
3. If HTTP is unreachable, check whether the vehicle moved to STA, use the recorded/router IP, and inspect power.
4. If no AP or STA endpoint remains, use USB; after erase, flash bootloader `0x0`, partition table `0x8000`, `boot_app0` `0xe000`, and application `0x10000`.
5. Never mark recovery complete from an upload or flash log alone. Reopen the hosted page and repeat the minimum HIL gates.

## Appendix C: Figure and Table Placement Notes

Figures 1–3 should be redrawn as vectors. Tables 1–4 may be condensed for column width. Screenshots should remove credentials and identify vehicle-hosted versus sandbox pages.

---

*Estimated word count (main text, references, tables, and appendices): approximately 5,780 words.*
