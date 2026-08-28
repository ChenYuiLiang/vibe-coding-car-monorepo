# Vibe Coding Pedagogy: A Teaching Framework Design Study Centered on Vibe Classroom

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

## Abstract

Vibe Coding, understood as the use of natural-language interaction with large language models (LLMs) to generate and revise software, lowers the initial syntactic barrier to programming but creates new educational risks. Young novices may produce convincing interfaces without understanding behavior, accept faulty output because it appears fluent, or confuse completion of a software exercise with successful operation of a physical product. This paper presents a curriculum design study of a Vibe Coding pedagogy for upper-elementary and junior-high learners (K–9) with little or no prior programming experience. The design is centered on Vibe Classroom, a GitHub-Organization-based assignment, process-documentation, and autograding environment operated by Taiwan Vibe Coding Co. The study analyzes curriculum artifacts, assignment specifications, Tutor guides, assessment documents, and integration notes to derive the PACE framework: Prompt Design, Audit, Commit, and Evaluate. PACE makes intention, verification, provenance, and reflection visible within an otherwise rapid AI-assisted workflow. A two-tier Tutor model, flipped learning, progressive task stages, and project-based artifacts provide additional scaffolding. The paper also resolves an important product-path ambiguity in the vehicle-control curriculum: the vehicle-hosted Wi-Fi page is the normal day-to-day driving interface, whereas JSON packet exercises, Canvas joysticks, and Web Bluetooth are optional Classroom laboratories for conceptual extension. Two course vignettes illustrate how learners move from vague requests to testable specifications, diagnose generated defects, and distinguish sandbox evidence from product evidence. The resulting framework does not claim causal learning gains; rather, it offers a theoretically grounded, practice-ready design for accountable AI-assisted programming education. Recommendations address Tutor preparation, age-appropriate assessment, platform continuity, cognitive load, safety, and future empirical evaluation.

**Keywords:** Vibe Coding · AI-assisted programming education · K–9 computing education · Vibe Classroom · PACE framework · Tutor scaffolding · Flipped classroom · Project-based learning

## 1 Introduction

### 1.1 From Code Production to Directed Collaboration

The public discussion of Vibe Coding accelerated after Karpathy used the term to describe software creation through conversational direction of AI systems [1]. Its appeal is clear: a user can describe an intended interface, provide an error message, request a revision, and see executable code without first mastering every syntactic convention. Collins Dictionary’s selection of the expression as its 2025 Word of the Year indicates that the idea has moved beyond a specialist developer community [2]. For education, however, cultural visibility does not itself establish pedagogical value.

The shift is particularly consequential for K–9 learners. Natural-language interaction can make software creation feel attainable before learners possess substantial syntax knowledge. At the same time, fluent output can conceal brittle event handling, inaccessible interfaces, insecure constants, fabricated APIs, or assumptions that a novice cannot readily detect. A final screen that “looks right” may therefore produce an illusion of understanding. The educational problem is not whether learners should be permitted to use AI, but how their use can be structured so that generation remains connected to judgment and responsibility.

### 1.2 Course Context and Product-Path Problem

Taiwan Vibe Coding Co. has developed a flipped learning sequence in which learners study short conceptual materials through vibe-coding.tw and complete repository-based activities in Vibe Classroom. Weekly study groups are mediated by Tutors who first rehearse the tasks themselves. The approach has been used in online formats and in an in-person session at the Yangmingshan Nursery Scout Camp with junior-high-age Scouts. These settings share a practical constraint: learners differ in device access, reading pace, prior experience, and willingness to reveal confusion.

Several assignments use a vehicle controller as an authentic front-end context. This context can motivate learners because the relationship between a button press and motion is concrete. It also creates a curriculum-mapping problem. The production vehicle is normally driven through a vehicle-hosted Wi-Fi HTML page containing an engine state and directional controls. By contrast, Classroom activities involving JSON, binary representations, Canvas joysticks, or Web Bluetooth are conceptual laboratories and optional alternative-channel explorations. If these layers are presented as a single compulsory sequence, learners may conclude that Bluetooth or a Canvas joystick must be completed before the car can move. Conversely, passing an isolated Classroom test may be mistaken for proof that the physical vehicle is ready. This paper therefore treats product-path clarity as a pedagogical requirement, not merely technical documentation.

As a concrete case, the Car Starter track is numbered **S01–S15 by learning stage** rather than by historical topic blocks: shell UI (S01–S03), touch and hold/stop (S04–S07), panel and flow (S08–S09), packet-design contrast (S10), optional BLE labs (S11–S13), and Canvas joystick labs (S14–S15). Repository slugs may retain skill names (for example, `touch-basics` or `ble-async`); what matters pedagogically is that the sequence places the product-aligned path before optional channels, so ordinary driving is not gated on BLE or Canvas mastery.

### 1.3 Research Questions and Contributions

The study addresses three questions:

**RQ1.** How does Vibe Coding redistribute the competencies required in introductory programming for K–9 novices?

**RQ2.** Which curriculum, platform, and Tutor-workflow elements make AI-assisted programming accountable and manageable for learners with no prior coding background?

**RQ3.** How can constructivism, scaffolding, metacognition, and project-based learning inform an operable course framework while preserving a clear distinction between the daily vehicle product path and optional laboratories?

The paper contributes: (1) the PACE framework, which translates prompt design, audit, version history, and multilayer evaluation into observable learning practices; (2) a detailed account of a two-tier Tutor workflow centered on Vibe Classroom; (3) a progressive sequence for K–9 novices; (4) course vignettes showing PACE in use; and (5) recommendations for separating the vehicle-hosted Wi-Fi driving path from BLE, Canvas, and JSON laboratories. The study is a design analysis rather than a randomized effectiveness trial, and its claims are correspondingly framed as design propositions for subsequent testing.

## 2 Related Work and Theoretical Foundations

### 2.1 Vibe Coding and AI-Assisted Programming

Sarkar and Drosos describe conversational programming as an iterative workflow involving goal formation, prompting, reviewing, acceptance or rejection, testing, error identification, and refinement [3]. Their analysis is educationally important because it contradicts a literal interpretation of “forgetting that the code exists.” Effective users retain situational awareness and calibrate trust dynamically. Prompting itself combines product-level intent with technical constraints, examples, error evidence, and boundaries. This suggests that prompt literacy should not be assessed by eloquence alone; it should be assessed by whether a prompt establishes testable behavior and appropriate constraints.

Research on generative AI in programming education reports benefits such as faster task completion, reduced anxiety, and expanded access to examples, while also identifying risks involving overreliance, academic integrity, hallucination, and reduced opportunities for productive struggle [4, 5]. A recent systematic review and meta-analysis similarly concludes that outcomes depend strongly on instructional design rather than tool availability alone [4]. AI-assisted project-based learning can support both programming performance and critical thinking when students are required to explain, test, and revise outputs [5]. These findings motivate a structured middle position: neither prohibition nor unrestricted generation.

Vibe Coding has also been examined as a means for educators and non-specialists to build interactive artifacts. Munoz and Rook’s Specify–Refine–Verify–Embed approach emphasizes that domain experts must define the underlying model and verify the generated result [6]. PACE shares the concern for specification and verification but addresses learner development, provenance, and assessment. Its Commit phase adds a temporal record of human–AI collaboration, while its Evaluate phase combines machine-executable checks with qualitative evidence.

### 2.2 Prompt Literacy, Code Reading, and Calibrated Trust

Prompting is sometimes treated as a replacement for technical knowledge. Evidence and practice suggest a more complex relationship. Learners who can name interface states, describe inputs and outputs, paste a relevant failure message, and delimit the requested change are better positioned to obtain and evaluate useful output. Writing ability can therefore become part of programming competence, but it does not eliminate the need to understand program behavior. A learner who requests “make the controls smoother” must eventually decide what smoothness means: larger touch targets, immediate visual feedback, suppression of page scrolling, repeated commands while held, or a guaranteed stop when contact ends.

Metacognition supplies a related theoretical lens. Flavell defines metacognition as knowledge and regulation of one’s own cognitive activity [7]. Process documents such as VIBE.md, SPEC.md, and AUDIT.md externalize decisions that might otherwise remain hidden. Writing “I expected the stop command to run on touch end, but the generated code only handled mouse release” requires the learner to compare intention, implementation, and observation. The document is therefore not ancillary paperwork; it is a scaffold for monitoring understanding.

### 2.3 Classroom Platforms, Repositories, and Formative Autograding

Repository-based education connects code, history, tests, and feedback. GitHub Classroom popularized assignment templates, per-learner repositories, roster management, and Actions-based autograding. Studies of automated assessment in programming courses suggest that immediate, repeatable checks can improve feedback timing and make iterative work visible [8]. Newer autograding research explores richer feedback beyond pass/fail outcomes [9]. Nevertheless, automated tests only inspect what they encode. A learner can satisfy DOM selectors without understanding interaction safety, or create a visually attractive page that fails on a phone.

Vibe Classroom retains the pedagogical core of repository-based assignment distribution while adapting it to the course’s AI-assisted workflow. Each learner works in a separate repository, pushes changes, sees test results, and maintains process artifacts. Tutors can inspect recent commits and documents rather than relying solely on a final submission. This design also responds to continuity concerns surrounding changes to GitHub Classroom availability and transition plans announced in 2026 [10, 11]. The course remains dependent on GitHub infrastructure, but its orchestration and assessment conventions are under program control.

### 2.4 Constructivism, Scaffolding, and Project-Based Learning

Vygotsky’s social constructivism locates learning in mediated activity and interaction within the zone of proximal development [12]. In an AI-assisted classroom, it is tempting to designate the model as the more knowledgeable other. That analogy is incomplete. An LLM can provide examples and responsive hints, but it does not reliably know the learner, the physical classroom, or whether its own answer is correct. The human Tutor remains essential for interpreting affect, controlling task complexity, and challenging superficial explanations.

Project-based learning (PBL) emphasizes meaningful questions, sustained inquiry, artifact creation, and public or social demonstration [14]. A mobile control panel is more authentic than an isolated event-listener exercise because learners can connect interface states to safety and physical action. Yet authenticity must be controlled. The full hardware stack is too complex for every beginner task. The course therefore alternates between product-aligned simulations and bounded laboratories. This preserves a visible purpose while keeping each learning episode tractable.

## 3 Research Design

### 3.1 Design-Oriented Curriculum Artifact Analysis

This study uses curriculum artifact analysis as a design-oriented method. The analyzed materials include assignment READMEs, Tutor guides, task rubrics, repository structures, process-document templates, autograding expectations, retest plans, and integration notes for front-end and vehicle activities. The unit of analysis is not an individual learner outcome but a recurring relationship among intended competency, learner action, platform evidence, Tutor intervention, and completion criteria.

The method supports traceable design reasoning but not causal inference. No claim is made that PACE raises scores by a specified amount or that one Tutor ratio is optimal. Reported vignettes are composite, curriculum-grounded scenarios constructed from recurrent task structures and anticipated failure modes; they are not presented as verbatim transcripts of named children.

### 3.2 Setting and Participants Addressed by the Design

The intended learners are primarily in grades 5–9 and may have no prior experience with source control, command-line tools, HTML, or AI coding agents. The course is delivered through asynchronous materials and facilitated study groups. Current Tutor preparation can occur in Microsoft Teams, after which Tutors guide learners through Vibe Classroom in online, local, or camp-based settings. This distributed format requires consistent artifacts because the original course designer cannot mediate every interaction directly.

The technical context uses HTML, CSS, JavaScript or TypeScript, browser events, responsive layout, and state management. Vehicle-themed assignments introduce a D-pad, an ENGINE-like enable state, touch interactions, and stop behavior. Optional laboratories explore JSON representation, binary data, Canvas rendering, and Web Bluetooth. The technologies are instructional carriers for AI-assisted problem solving rather than a claim that every K–9 learner should become a specialist in all of them.

## 4 Course Architecture Centered on Vibe Classroom

### 4.1 The Flipped Learning Loop

The course loop begins before the synchronous meeting. Learners encounter short explanations, annotated examples, and preparation checks through the learning site. The objective is not full mastery but enough familiarity to recognize the week’s vocabulary and task. During the study group, learners accept or open an assignment, inspect its requirements, plan a small change, collaborate with an AI system, and push evidence to Vibe Classroom. After automated feedback, they revise and summarize what changed.

### 4.2 Assignment and Evidence Flow

A typical assignment includes a starter artifact, learner-facing acceptance criteria, a process-document template, tests, and evidence instructions. The learner’s repository is the longitudinal record. Vibe Classroom exposes whether a task has been accepted, whether a push occurred, and whether automated checks passed. The Tutor reads this status together with the process documents and the rendered artifact.

**[Fig. 1 about here]**

**Fig. 1.** PACE embedded in the Vibe Classroom learning loop: learner intent and prompt design lead to AI-assisted production, audit, provenance-tagged commits, automated and qualitative evaluation, and a new refinement cycle.

### 4.3 Two-Tier Tutor Workflow

During a session, Tutors use a triage sequence. First, they ask the learner to state the intended behavior in one sentence. Second, they inspect the latest platform result and the smallest relevant change. Third, they classify the blockage as intent, prompt, generated code, test interpretation, Git workflow, browser/device behavior, or hardware integration. Fourth, they offer the least intrusive scaffold likely to restore progress. This may be a question (“Which event should cause stopping?”), a comparison (“What differs between mouse release and touch release?”), or a bounded prompt frame. Direct code replacement is reserved for cases where the instructional objective lies elsewhere.

After the learner resumes, the Tutor requests a brief teach-back or change-one-behavior demonstration. The learner might alter a button label, adjust a threshold, or point to the stop handler. This checks whether the learner has regained a causal model. At the end of the session, Tutors record recurring blockers for the next preparation meeting. Thus, Tutor development and curriculum development form a feedback loop.

### 4.4 Product Path and Optional Laboratory Map

The curriculum uses three related but non-equivalent layers. Their distinction is summarized in Table 1.

**Table 1. Product path and laboratory map for vehicle-themed units**

| Layer | Purpose | Typical learner evidence | Completion meaning |
|---|---|---|---|
| Vibe Classroom sandbox | Practice one concept with rapid tests | Green checks, process notes, mobile screenshot | The bounded assignment works |
| Vehicle-hosted Wi-Fi page | Daily product driving through the car’s HTML interface | ENGINE state, D-pad response, Wi-Fi access, observed vehicle motion | The normal driving path works |
| Optional laboratories | Extend concepts through JSON, Canvas, binary data, or BLE | Lab-specific tests and reflection | An optional concept/channel was explored |

This map changes the instructional narrative. Learners first build product-aligned interaction concepts: layout, enable state, touch lifecycle, and stopping. When a physical integration session is available, the vehicle-hosted Wi-Fi page defines day-to-day success. Optional laboratories are introduced later as alternative representations or channels. JSON can teach explicit data structure; Canvas can teach coordinate mapping; BLE can teach permissions and connection state. None is falsely presented as a gate to ordinary driving.

**[Fig. 2 about here]**

**Fig. 2.** Product-path map separating the vehicle-hosted Wi-Fi driving page from Vibe Classroom sandboxes and optional JSON, Canvas, binary-data, and BLE laboratories.

## 5 The PACE Framework

PACE organizes AI-assisted programming into four visible phases. It is a cycle rather than a one-time checklist: evaluation can reveal a new audit finding, which prompts a revised intention and another commit.

**Table 2. PACE phases, artifacts, and Tutor prompts**

| Phase | Learner practice | Observable artifact | Example Tutor question |
|---|---|---|---|
| Prompt Design | Define intent, constraints, scope, and acceptance | VIBE.md or SPEC.md plus the submitted prompt | “How will you know this behavior is finished?” |
| Audit | Compare output with requirements, tests, safety, and platform constraints | AUDIT.md with defect and repair evidence | “What did the model assume that the task did not say?” |
| Commit | Save small, labeled changes showing provenance and revision | `[AI-Generated]`, `[Human-Modified]`, or `[AI-Fixed]` commits | “Which decision in this commit was yours?” |
| Evaluate | Combine automated checks, rendered behavior, explanation, and product evidence | Actions result, screenshot/demo, document review | “What does the green test prove, and what does it not prove?” |

### 5.1 P—Prompt Design

Prompt Design begins with a problem representation. Learners describe the user, desired behavior, current state, constraints, and acceptance criteria before asking for code. For younger learners, a prompt frame may contain four sentences: “I am building…,” “It should…,” “Do not change…,” and “I will test it by….” The structure turns an impulsive request into a small specification.

Consider a D-pad task. “Make a cool controller” gives the model broad discretion and gives the learner no clear basis for evaluation. A PACE prompt might request a 3×3 responsive control grid, reserve the center cell for status, disable directional commands until ENGINE is active, show press feedback, prevent page scrolling during control, and send a stop action when touch ends. It may also state that only the interaction module should change. The learner need not know the final code, but must own the intended behavior.

### 5.2 A—Audit

Audit requires active comparison among the generated output, the stated requirements, and observed behavior. For K–9 novices, audit begins with behavior rather than exhaustive static review. Learners check whether required elements exist, predict what one interaction should do, run the artifact, and inspect the relevant handler. As knowledge grows, they add checks for duplicated listeners, inaccessible controls, hard-coded secrets, unsafe defaults, and browser assumptions.

Audit also teaches that model output can be locally correct but contextually wrong. A Web Bluetooth solution may be technically plausible yet unsuitable on an unsupported mobile browser. A JSON command format may be internally consistent yet irrelevant to a vehicle page that uses short HTTP parameters. The audit criterion is alignment with the assignment and product architecture, not code sophistication.

### 5.3 C—Commit

The Commit phase establishes provenance and manageable reversibility. Learners save small coherent changes and label the collaboration mode. `[AI-Generated]` indicates an initial model-produced change; `[Human-Modified]` records a learner alteration; `[AI-Fixed]` records a model revision prompted by a human-identified defect. The labels are pedagogical metadata, not a perfect forensic system. Their purpose is to create moments at which learners notice who made which decision.

### 5.4 E—Evaluate

Evaluate combines automated and human judgment. Layer 1 checks executable requirements through GitHub Actions or equivalent tests. Layer 2 examines the rendered artifact, VIBE/SPEC/AUDIT quality, and commit sequence. Layer 3, used where appropriate, asks the learner to explain or make a small live change. For physical integration, an additional product-evidence layer confirms the vehicle-hosted Wi-Fi page and motion.

Each layer answers a different question. Automated tests ask whether encoded behavior is present. Visual and device checks ask whether the interface is usable in context. Process artifacts ask whether the learner can identify intention and defects. A live modification asks whether understanding transfers beyond memorized prose. Hardware observation asks whether the product path works. No single layer should be treated as a complete proxy for learning.

Evaluation returns information to Prompt Design. If the learner discovers that “responsive” was ambiguous, the next specification names portrait and landscape expectations. If a test passes but the touch target remains too small, the learner adds a usability criterion. PACE therefore models requirements as revisable while maintaining accountability for each revision.

## 6 Progressive Learning Stages

### 6.1 Stage 1: Developer Identity and Safe Environment

The first stage establishes accounts, two-factor authentication, editor access, repository navigation, and the meaning of clone, edit, commit, push, and test. These are not administrative preliminaries. They give learners a durable identity as participants in a development process and reduce later cognitive load. Safety instruction includes protecting credentials, recognizing secrets, and understanding that prompts may leave the local environment.

AI assistance is deliberately limited at this stage. Learners may ask for an explanation of a Git error, but they practice reading repository status and confirming the destination before pushing. Tutor scaffolds are highly explicit: screenshots, checklists, and recovery steps. Completion is a small authored change and a successful push, not a generated application.

### 6.2 Stage 2: Product-Aligned Interface Foundations

The second stage introduces semantic HTML, CSS Flexbox and Grid, responsive dimensions, button states, and basic event handling. The representative artifact is a mobile control panel whose structure resembles the vehicle’s D-pad without claiming to be the production page. Learners use prompts to generate bounded layout alternatives, then inspect how the grid maps directions.

Interaction tasks introduce enable/disable state and touch feedback. Safety is concrete: the controller should not continue issuing motion after contact ends. Learners compare mouse and touch events, suppress unintended scrolling where necessary, and observe differences across devices. Completion requires tests plus a mobile-sized demonstration. The emphasis remains on visible cause and effect rather than memorizing every event API.

### 6.3 Stage 3: Product Path and Physical Meaning

When hardware access is available, the course explicitly introduces the vehicle-hosted Wi-Fi page as the daily driving interface. Learners connect to the appropriate vehicle network or local route, open the embedded page, identify ENGINE and D-pad states, and relate interface actions to observed motion. The activity emphasizes a definition of done: a screenshot alone is insufficient; the path includes connection, control response, stopping, and physical observation.

Not every course session requires hardware. A product-path map can still be taught through diagrams and recorded demonstrations. The essential point is conceptual: a sandbox controller practices interaction; the vehicle page drives the product. Keeping these meanings separate prevents learners from overgeneralizing automated test results.

### 6.4 Stage 4: Optional Data and Channel Laboratories

Only after the product-aligned interaction foundation do optional laboratories broaden the technical space. In the Car Starter numbering above, this corresponds to S10 (JSON contrast) and S11–S15 (BLE and Canvas labs). A JSON lab asks learners to represent a command and remove unnecessary fields, while explicitly contrasting that representation with the product’s current HTTP driving semantics. A binary-data lab introduces byte arrays and endianness as preparation for constrained channels. A Canvas joystick lab explores coordinate geometry, dead zones, and rendering; it does not replace the production D-pad.

A Web Bluetooth lab adds device discovery, permission, connection state, service and characteristic selection, and disconnection handling. Browser support and secure-context requirements become part of the audit. Learners are told that BLE is an optional alternative channel. This framing turns incompatibility into a platform lesson rather than an apparent failure to reach the car.

### 6.5 Stage 5: Integrated PACE Project

The final stage asks learners to manage a complete, bounded project through PACE. They write a specification, obtain an AI draft, identify at least one substantive issue, create provenance-tagged commits, reach green automated checks, and present evidence. Tutor support fades from prompt templates toward questioning and review.

The final artifact is accompanied by a short narrative of one changed assumption. For example, a learner may report that visual button release did not guarantee a stop command, or that a BLE laboratory could not be used in the available browser. This narrative demonstrates the capacity to revise a mental model, which is more educationally meaningful than claiming the first prompt was successful.

## 7 Curriculum-Grounded Vignettes

### 7.1 Vignette A: The Controller That Would Not Stop

A grade-six learner begins with the request, “Make the arrow button keep moving while I press it.” The generated code starts repeated commands on `touchstart`, and the visual animation appears convincing. During Tutor review, the learner is asked, “What event guarantees stopping if your finger slides away?” The learner cannot locate one. Rather than supplying code, the Tutor provides a test scenario: press, move the finger outside the button, and release.

The observed state remains active. The learner records the mismatch in AUDIT.md and revises the prompt to require a shared stop routine for touch end, cancellation, and lost contact, without changing layout. The next AI response adds handlers but duplicates state-reset logic. Automated tests catch one missing path. The learner consolidates the routine, creates a `[Human-Modified]` commit, and explains why a dead-man behavior is safer than assuming a clean release.

This vignette illustrates all four PACE phases. The initial intention becomes testable; audit compares behavior with safety; commits distinguish model and learner revisions; evaluation combines a test and a physical gesture. The learning outcome is not mastery of every browser event. It is recognition that an attractive interaction can conceal a safety defect and that requirements must include failure paths.

### 7.2 Vignette B: A Bluetooth Detour

A junior-high group sees a Web Bluetooth unit in the assignment list and assumes that Bluetooth must be completed before the vehicle can be driven. Their available tablets do not support the relevant browser API. Repeated AI prompts produce alternative JavaScript code, but no device chooser appears. Frustration grows because the group interprets the missing dialog as defective code.

The Tutor uses the product-path map. The group first verifies the vehicle-hosted Wi-Fi page, activates ENGINE, operates the D-pad, and observes a stop. This establishes daily driving success. The BLE activity is then reframed as an optional laboratory. The learners audit browser capability and secure-context requirements, document the unsupported environment, and inspect a prepared demonstration on a compatible device. Their lab completion is based on a reasoned compatibility report rather than a fabricated claim of connection.

This vignette shows why curricular architecture matters. Without the map, a platform limitation becomes a false prerequisite and invites random code generation. With the map, learners distinguish product evidence, laboratory evidence, and environmental constraints. They also learn that “AI wrote another version” is not a meaningful response when the actual blocker is platform capability.

## 8 Findings as Design Propositions

First, Vibe Coding redistributes introductory competence rather than eliminating it. Syntax production becomes less dominant, while intention articulation, behavioral prediction, code reading, test interpretation, and trust calibration become more visible. K–9 novices can participate in this work when tasks use concrete behavior and bounded explanations.

Fifth, product-path clarity reduces unnecessary cognitive load. Declaring the vehicle-hosted Wi-Fi page as the ordinary driving interface allows BLE, Canvas, and JSON to retain educational value without becoming false gates. This proposition is especially important in interdisciplinary courses where conceptual laboratories and production systems share vocabulary but not completion criteria.

## 9 Challenges and Mitigation Strategies

### 9.1 Cognitive Load and Uneven Prior Knowledge

The stack includes repositories, markup, styling, events, tests, AI interaction, and sometimes physical devices. Learners can become lost before reaching the intended concept. Mitigation begins with progressive disclosure: one tool and one behavior per early task, product path before optional channels, and visible “you are here” maps. Pairing should be structured so that one learner does not become the permanent operator. Tutor triage should separate infrastructure recovery from conceptual teaching.

Prior knowledge can be amplified by AI. Experienced learners issue better constraints and recognize defects sooner, while novices may generate more code than they can inspect. Prompt frames, behavior-first audits, and live change checks help narrow this gap. Extension tasks should be optional so faster learners can investigate Canvas or BLE without making others feel behind.

### 9.2 AI Dependence and Illusory Understanding

Process documents can themselves be generated by AI, so their presence does not prove reflection. Evaluation should triangulate evidence. A Tutor may ask the learner to point to the relevant handler, predict an outcome, or change one behavior without regenerating the entire application. Questions should be brief and psychologically safe; the objective is diagnosis, not performance anxiety.

The course should also permit deliberate non-use of AI. Learners may manually adjust a label or CSS value when that is the clearest action. PACE concerns accountable collaboration, not maximizing model involvement. Commit labels make mixed strategies visible and legitimate.

### 9.3 Model Variability, Hallucination, and Scope Expansion

When a model expands scope, the educational response is not always to improve the prompt indefinitely. Reverting to the last small commit can be the better engineering decision. Teaching recovery through version control reduces attachment to generated output and reinforces learner authority.

### 9.4 Platform, Access, and Privacy

Repository-based learning assumes accounts, connectivity, compatible devices, and accessible interfaces. Camp or community settings may have intermittent networks. Tutors need offline explanations, cached examples, and a plan for delayed pushing. Browser-specific laboratories must state compatibility in advance.

Minors require clear privacy boundaries. Prompts should exclude real names, credentials, location details, and private communications. Repositories should use appropriate visibility. Course operators should document which external AI services are approved and how data may be retained. Security education should begin with concrete practices rather than abstract policies.

### 9.5 Assessment Validity and Tutor Workload

Inter-rater consistency remains a challenge. Tutor calibration can use anonymized sample artifacts representing superficial, developing, and strong evidence. Disagreements should refine rubric language. Platform dashboards should prioritize learners who are inactive, repeatedly failing the same test, or producing a single large final commit, while avoiding simplistic risk labels.

## 10 Discussion

PACE offers a bridge between the speed of Vibe Coding and the accountability expected in education. Its central move is to treat the collaboration process as an assessable artifact. Prompt Design externalizes purpose; Audit turns distrust or confidence into evidence; Commit preserves temporal provenance; Evaluate connects machine checks with human interpretation. The framework therefore adapts established educational principles to a changed production environment rather than proposing that AI invalidates those principles.

Compared with educator-oriented generation frameworks [6], PACE gives greater weight to learner agency and repository history. Compared with workflow descriptions of professional Vibe Coding [3], it reduces complexity into teachable phases and adds explicit assessment. Compared with conventional PBL, it makes human–AI provenance part of project accountability. These distinctions are not claims of superiority; they identify the problem space for which PACE was designed.

Product-path clarity extends this argument. Curriculum coherence cannot be inferred from technical relatedness. BLE, JSON, Canvas, and Wi-Fi all belong to an IoT ecosystem, but they serve different instructional and operational purposes. A coherent curriculum states which artifact is the product, which activities are simulations or laboratories, and which evidence supports each completion claim. The vehicle-hosted Wi-Fi page is therefore not simply an implementation detail; it anchors the narrative by which learners understand why they are practicing touch state and stopping behavior.

## 11 Recommendations for Implementation and Research

For course designers, the first recommendation is to write completion criteria before writing AI instructions. Each assignment should state what a green test proves, what a screenshot proves, and what still requires human or physical verification. The second is to keep the early product narrative stable. In this curriculum, learners should hear consistently that daily driving uses the vehicle-hosted Wi-Fi page and that BLE, Canvas, and JSON are optional laboratories.

For Tutor programs, preparation should include task rehearsal, misconception maps, and scaffold-fading strategies. Tutors should practice asking diagnostic questions and distinguishing environmental blockers from conceptual ones. Tutor notes should feed back into starter code, test wording, and preparation materials. Scaling the number of learners without this learning loop risks multiplying inconsistent assistance.

For assessment, educators should combine fast executable feedback with one or two high-value qualitative checks. A lightweight rubric can score the specificity of intention, quality of one audit finding, coherence of commits, and ability to explain a changed behavior. Oral checks should be short and based on the learner’s own artifact. Commit-tag counts should never be used as a standalone measure of learning.

Future mixed-method research should track test transitions, commit sequences, Tutor interventions, and rubric-coded audit quality, while using pre/post tasks to assess whether learners can identify defects and formulate testable repairs. Final task completion alone is inadequate because AI may compress production time without improving understanding.

## 12 Conclusion

This paper presented a design study of Vibe Coding pedagogy for K–9 novices centered on Vibe Classroom. The analysis suggests that AI-assisted programming is educationally productive only when rapid generation is coupled with visible intention, critical audit, reversible action, and multilayer evaluation. The PACE framework—Prompt Design, Audit, Commit, and Evaluate—organizes these responsibilities into an iterative workflow that can be supported by repositories, autograding, process documents, and human facilitation.

The course architecture adds flipped preparation, a two-tier Tutor model, progressive stages, and authentic project artifacts. Its product-path narrative is explicit: the vehicle-hosted Wi-Fi HTML page is the ordinary interface for daily driving, while BLE, Canvas, binary data, and JSON activities are optional Classroom laboratories. This distinction protects learners from false prerequisites and prevents sandbox evidence from being overstated as product success.

The study is limited to curriculum artifacts and design-grounded observations from one program. It does not establish causal gains, optimal staffing, or long-term retention. Nevertheless, it offers a coherent set of design propositions and operational recommendations. Vibe Coding should not be taught as effortless delegation to a model. For young learners, it is better understood as supervised practice in specifying, questioning, revising, and taking responsibility for computational artifacts.

## References

1. Karpathy, A.: There’s a new kind of coding I call “vibe coding” [social media post]. X (2 February 2025)
2. Collins English Dictionary: Word of the Year 2025: Vibe Coding. HarperCollins, Glasgow (2025)
3. Sarkar, A., Drosos, I.: Vibe coding: Programming through conversation with artificial intelligence. arXiv:2506.23253 (2025)
4. The influence of artificial intelligence tools on learning outcomes in computer programming: A systematic review and meta-analysis. Computers 14(5), 185 (2025). https://doi.org/10.3390/computers14050185
5. Fostering programming skill and critical thinking through AI-assisted project-based learning integration. Journal of New Approaches in Educational Research (2025). https://doi.org/10.1007/s44322-025-00041-0
6. Munoz, A., Rook, L.: Leveraging generative AI through vibe coding: A case of simulation-based curriculum redesign in management education. Education Sciences 16(4), 558 (2026). https://doi.org/10.3390/educsci16040558
7. Flavell, J.H.: Metacognition and cognitive monitoring: A new area of cognitive-developmental inquiry. American Psychologist 34(10), 906–911 (1979)
8. Automated assessment in mobile programming courses: Leveraging GitHub Classroom and Flutter for enhanced student outcomes. arXiv:2504.04230 (2025)
9. Autograder+: A multi-faceted AI framework for rich pedagogical feedback in programming education. arXiv:2510.26402 (2025)
10. GitHub: GitHub Classroom sign-ups are no longer available. GitHub Changelog (26 May 2026), https://github.blog/changelog/2026-05-26-github-classroom-sign-ups-are-no-longer-available/
11. GitHub Community: Important announcement for educators: GitHub Classroom functionality will be transitioning to partners (2026), https://github.com/orgs/community/discussions/196615
12. Vygotsky, L.S.: Mind in Society: The Development of Higher Psychological Processes. Harvard University Press, Cambridge (1978)
13. Wood, D., Bruner, J.S., Ross, G.: The role of tutoring in problem solving. Journal of Child Psychology and Psychiatry 17(2), 89–100 (1976)
14. Blumenfeld, P.C., Soloway, E., Marx, R.W., Krajcik, J.S., Guzdial, M., Palincsar, A.: Motivating project-based learning: Sustaining the doing, supporting the learning. Educational Psychologist 26(3–4), 369–398 (1991)
15. Piaget, J.: Part I: Cognitive development in children: Piaget development and learning. Journal of Research in Science Teaching 2(3), 176–186 (1964)
16. Taiwan Vibe Coding Co.: Vibe Classroom curriculum materials, Tutor guides, assignment specifications, and vehicle-integration notes. Internal curriculum corpus (2026)

Estimated word count: approximately 5,800 words.
