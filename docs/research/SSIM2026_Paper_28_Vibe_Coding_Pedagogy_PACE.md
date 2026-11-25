# Vibe Coding Pedagogy: A Teaching Framework Design Study Based on an IoT Front-End Development Course

Yu-Kuan (Rover) Chen^1^, Yui-Liang Chen^2^, Rui-Yu Lin^2,*^, and Yu-Ting Chen^3^

<sup>1</sup> Taiwan Vibe Coding Co., Taiwan

<sup>2</sup> Department of Information Management, Shih Hsin University, Taipei, Taiwan

<sup>3</sup> Department of Early Childhood Development and Education, Chaoyang University of Technology, Taichung, Taiwan

* Corresponding author: Rui-Yu Lin (m115660040@mail.shu.edu.tw)

## Abstract

Vibe Coding, understood as the use of natural-language interaction with Large Language Models (LLMs) to iteratively synthesize and refine software, lowers the initial syntactic barriers to programming but introduces critical pedagogical risks. Novice learners may generate superficially convincing user interfaces without comprehending underlying execution logic, accept logically flawed code because it appears syntactically fluent, or mistake isolated simulator success for physical operational readiness. Grounded in design-based research methodology, this paper investigates a pedagogical framework for upper-elementary, junior-high, and undergraduate novices engaging in AI-assisted Internet of Things (IoT) front-end development. The framework is grounded in four foundational educational theories: Vygotskian social constructivism and Bruner's scaffolding, Flavell's metacognitive self-regulation, Piaget's cognitive disequilibrium, and Blumenfeld's Project-Based Learning (PBL). We formulate the PACE framework—encompassing Prompt Design, Audit, Commit, and Evaluate—to make learner intention, critical verification, code provenance, and reflective reasoning explicit within rapid AI-assisted workflows. The architecture incorporates a flipped learning cycle, a two-tier tutor facilitation model, and an explicit product-path hierarchy that establishes a vehicle-hosted Wi-Fi HyperText Markup Language (HTML) interface as the authoritative physical driving baseline, while treating JavaScript Object Notation (JSON) exercises, Canvas joysticks, and Bluetooth Low Energy (BLE) as formative conceptual laboratories. Drawing upon qualitative curriculum artifact analysis of student repositories, audit logs, and tutor diagnostic records, we present two curriculum-grounded illustrative cases constructed under Skilling and Stylianides' (2019) vignette framework, demonstrating how learners transition from vague conversational prompts to verifiable behavioral specifications. We conclude with operational design propositions and an explicit authorial disclosure statement, establishing an actionable foundation for human-centered, accountable computing education in the era of generative AI.

**Keywords:** Vibe Coding · AI-assisted programming education · PACE pedagogical framework · Metacognition · Scaffolding · Internet of Things (IoT) · Project-based learning · Curriculum design


## 1 Introduction

### 1.1 From Code Production to Directed Human-AI Collaboration
The contemporary phenomenon of <i>Vibe Coding</i>—a term popularized by Karpathy to describe software development driven by conversational dialogue with Large Language Models (LLMs) [1]—has rapidly expanded across the software industry and public discourse [2]. In educational settings, Vibe Coding fundamentally shifts the initial cognitive demand: learners no longer need to master punctilious syntax rules before expressing computational ideas. A student can describe a desired user interface, supply error feedback, request successive refinements, and observe executable software synthesized within seconds.



However, for novice learners in kindergarten through ninth grade (K–9) and introductory undergraduate courses, this rapid syntax generation introduces profound educational vulnerabilities. When an AI coding assistant produces fluent, aesthetically pleasing code, novices frequently succumb to an <i>illusion of explanatory depth</i>—assuming they understand the program merely because it renders attractively on screen. Synthetically generated code frequently conceals brittle touch event handling, inaccessible Document Object Model (DOM) structures, fabricated Application Programming Interface (API) endpoints, or non-deterministic timing assumptions that novices cannot detect. In the absence of structured pedagogical scaffolding, Vibe Coding degenerates into passive prompt-and-paste behavior, eroding students' critical computational thinking and diagnostic agency. The central challenge for computing education is therefore not whether generative artificial intelligence (GenAI) should be permitted, but how its use can be structured so that generation remains tightly coupled with cognitive judgment, contract auditing, and personal accountability.



### 1.2 Course Context and the Product-Path Problem
To investigate this pedagogical challenge empirically, Taiwan Vibe Coding Co. collaborated with educational researchers from Shih Hsin University and Chaoyang University of Technology to design an intensive IoT front-end development curriculum. The instructional model combines pre-class asynchronous conceptual modules with synchronous studio workshops guided by trained Tutors. The curriculum was field-tested across diverse educational settings, including university computing laboratories, after-school middle-school workshops, and an experiential robotics session conducted at the Yangmingshan Nursery Scout Camp with junior-high participants.



A central project context across these courses is the development of a mobile touch controller for a miniature two-wheeled robotic smart vehicle powered by an Espressif ESP32-C3 microcontroller. While controlling a physical vehicle provides powerful motivation, it creates a severe curriculum-mapping ambiguity that we term the <i>Product-Path Problem</i>. In practice, the production vehicle is operated through a vehicle-hosted Wi-Fi HTTP remote: the learner's smartphone joins the vehicle's Software Access Point (SoftAP) and loads an embedded HTML control page featuring a directional pad (D-pad) and an Educational Next-Generation Interactive Environment (ENGINE) safety gate. However, classroom exercises frequently introduce formative sandboxes—such as simulated Canvas joysticks, JSON packet inspection, or Web Bluetooth (BLE) pairing exercises. When these elements are presented without an explicit architectural hierarchy, novice learners become severely confused: they assume that complex BLE GATT pairing or Canvas coordinate mathematics must be completed before the car can drive, or conversely, mistake passing an isolated browser test for proof that the physical vehicle works. Resolving this product-path ambiguity is an essential pedagogical requirement.



### 1.3 Research Questions and Contributions
This design-based research study is guided by three research questions:


<ul>
  <li><b>RQ1—Redistribution of Competencies:</b> How does Vibe Coding redistribute the essential competencies required in introductory programming, shifting effort from low-level syntax recall to high-level intention specification, code auditing, and system verification?</li>
  <li><b>RQ2—Accountability and Scaffolding Mechanisms:</b> Which curriculum structures, platform conventions, and tutor-facilitation workflows ensure that AI-assisted programming remains accountable and manageable for novice learners with no prior coding background?</li>
  <li><b>RQ3—Theoretical Grounding and Curricular Hierarchy:</b> How can constructivist scaffolding, metacognitive self-regulation, and project-based learning inform an operational educational framework while maintaining an unambiguous distinction between baseline product driving and optional laboratory explorations?</li>
</ul>

This paper makes five principal contributions: (1) we formulate the PACE framework (Prompt Design, Audit, Commit, Evaluate), establishing observable artifacts and exit criteria for each phase; (2) we articulate a two-tier Tutor facilitation workflow designed for AI-assisted studios; (3) we define a progressive 5-stage learning progression for young novices; (4) we present two curriculum-grounded illustrative cases constructed under Skilling and Stylianides' (2019) framework demonstrating PACE in action; and (5) we provide an explicit architectural product-path hierarchy separating vehicle-hosted Wi-Fi HTTP from secondary BLE and Canvas sandboxes, accompanied by a formal authorial disclosure statement.



## 2 Related Work and Theoretical Foundations

### 2.1 Vibe Coding, Conversational Programming, and Generative Scaffolding
Sarkar and Drosos conceptualize conversational programming as an iterative cycle encompassing goal formulation, prompt construction, output inspection, critical evaluation, test execution, and targeted refinement [3]. Their empirical analysis demonstrates that effective AI collaboration does not involve "forgetting that the code exists." Rather, proficient developers maintain active situational awareness and calibrate trust dynamically based on observed model performance. Recent systematic meta-analyses in computing education confirm that while generative AI significantly reduces coding anxiety and accelerates task progress, learning gains are strictly contingent upon instructional design [4, 5]. When learners are required to explain, audit, and verify AI-generated output against concrete criteria, project-based learning enhances both technical performance and critical thinking. These findings substantiate our pedagogical approach: establishing a structured middle ground between outright prohibition and unconstrained code generation.



### 2.2 Metacognitive Monitoring, Prompt Literacy, and Process Artifacts
Prompting is frequently misconstrued as an informal conversational activity. In engineering education, prompt literacy represents a disciplined form of problem decomposition. A novice who prompts an AI assistant to "make the car drive better" receives ambiguous code. Conversely, a learner who articulates interface states, boundary constraints, pointer event types, and fail-safe stop invariants engages in authentic computational thinking.



This process is fundamentally anchored in Flavell's theory of metacognition—the active monitoring and self-regulation of one's own cognitive processes [7]. In our curriculum, metacognitive reflection is operationalized through structured process documents: <code>VIBE.md</code> (capturing intent and initial prompts), <code>SPEC.md</code> (defining functional contracts and boundaries), and <code>AUDIT.md</code> (documenting observed discrepancies and repair strategies). Requiring a student to document: <i>"I intended for the vehicle to stop on touch release, but the generated code only listened for mouse events, causing a stuck-throttle failure on my tablet"</i> compels the learner to consciously compare mental intentions with empirical reality, externalizing metacognitive monitoring.



### 2.3 Social Constructivism, Triadic Scaffolding, and Tutor Facilitation
Vygotskian social constructivism positions learning within the Zone of Proximal Development (ZPD)—the developmental region between what a learner can accomplish independently and what can be achieved through mediation with more capable partners [12]. In an AI-assisted classroom, the LLM functions as a tireless generative partner, providing immediate syntactic scaffolding [13]. However, an LLM lacks pedagogical intentionality: it cannot assess affective frustration, interpret classroom physical constraints, or detect when its own suggestions lead a student into a conceptual dead-end.



Therefore, our framework establishes a <i>Triadic Scaffolding Model</i>: the Learner acts as the active system architect, the GenAI Assistant provides rapid implementation proposals, and the Human Tutor serves as the critical pedagogical facilitator. The tutor's responsibility is not to supply direct code answers, but to provide adaptive cognitive scaffolds—posing diagnostic questions, pointing out unhandled edge cases, and guiding the learner back to contract invariants.



### 2.4 Cognitive Disequilibrium and Authentic Project-Based Learning
Piaget's developmental theory posits that meaningful conceptual growth occurs through <i>cognitive disequilibrium</i>—moments when an individual's existing mental schema fails to explain an observed phenomenon, compelling accommodation [15]. In cyber-physical IoT development, cognitive disequilibrium occurs naturally: a student may observe green checks in a unit test runner, yet witness their physical robotic vehicle drive uncontrollably off the table due to an unhandled <code>pointercancel</code> event. Project-Based Learning (PBL) capitalizes on these authentic breakdowns [14]. Driving a physical vehicle across a room provides an undeniable reality check that artificial simulation sandboxes cannot replicate.



## 3 Research Design and Methodology

### 3.1 Design-Based Research and Curriculum Artifact Analysis
This study employs a Design-Based Research (DBR) methodology, an established paradigm for engineering educational interventions through iterative cycles of design, implementation, analysis, and theory refinement in authentic settings [13, 14]. Our analytical approach uses qualitative curriculum artifact analysis (Bowen, 2009; Yin, 2018), examining a comprehensive corpus of instructional and learner-produced materials collected across four iterative course offerings (2025–2026).



<b>Analyzed Artifact Corpus:</b> The data corpus includes 28 assignment starter repositories, 142 student commit histories, 43 tutor intervention logs, 56 learner process documents (<code>VIBE.md</code>, <code>SPEC.md</code>, <code>AUDIT.md</code>), rubric assessment sheets, and video records of physical vehicle HIL verification trials.



<b>Unit of Analysis:</b> The explicit unit of analysis is <i>the learner's self-regulated iterative problem-solving cycle across the four PACE phases</i>. Specifically, we examine the recurring relationships connecting the learner's articulated intent (Prompt), critical defect identification (Audit), version-controlled provenance recording (Commit), and multi-layered physical validation (Evaluate).



<b>Methodological Framing of Learner Cases (Skilling & Stylianides, 2019):</b> In Section 7, we present two curriculum-grounded illustrative cases. In accordance with the methodological framework formulated by Skilling and Stylianides (2019) for educational research, these cases are structured as <i>composite educational vignettes</i>. They are synthesized from recurrent, empirically observed learner breakdowns and tutor interventions across our cohorts, designed specifically to provide authentic scenarios for tutor training and pedagogical reflection rather than functioning as idiosyncratic transcripts of individual children.



### 3.2 Instructional Setting and Participant Profile
The instructional design addresses upper-elementary, junior-high, and introductory undergraduate novices (spanning grades 5 through undergraduate Year 1, ages 11–19) with little or no prior experience in software development, command-line interfaces, or embedded electronics. Learners engage in hands-on front-end web engineering using semantic HTML, CSS Grid/Flexbox, JavaScript pointer event lifecycles, and asynchronous HTTP networking. All vehicle control exercises center on the ESP32-C3 robotic smart car testbed, creating an authentic cyber-physical context.



## 4 Course Architecture and Facilitation Workflow

![<b>Fig. 1.</b> The PACE Pedagogical Framework for Vibe Coding. Illustrates the iterative cycle of Prompt Design, Audit, Commit, and Evaluate, surrounded by the Metacognitive Self-Regulated Reflection Loop and mediated by the Triadic Scaffolding Dynamics between Learner, GenAI Assistant, and Human Tutors.](figures/fig1_paper28_pace_framework.png)

*<b>Fig. 1.</b> The PACE Pedagogical Framework for Vibe Coding. Illustrates the iterative cycle of Prompt Design, Audit, Commit, and Evaluate, surrounded by the Metacognitive Self-Regulated Reflection Loop and mediated by the Triadic Scaffolding Dynamics between Learner, GenAI Assistant, and Human Tutors.*



### 4.1 The Flipped Learning Progression
The curriculum operationalizes a flipped learning structure designed to optimize high-value synchronous laboratory time. Prior to in-person sessions, learners engage with interactive micro-modules on <code>vibe-coding.tw</code>, familiarizing themselves with core vocabulary (e.g., pointer lifecycles, HTTP request methods, differential motor drive). During synchronous workshops, learners open their assigned Vibe Classroom repository, formulate prompt specifications, collaborate with AI coding assistants, and immediately deploy their interfaces to physical hardware test stands.



### 4.2 Two-Tier Tutor Facilitation Model
To manage cognitive load and ensure scalable instructional support, the course implements a Two-Tier Tutor Workflow, depicted in Figure 2:



![<b>Fig. 2.</b> Flipped Learning Architecture and Two-Tier Tutor Workflow in Vibe Classroom. Shows the transition from pre-class asynchronous code and commit auditing (Tier 1 Tutors) to in-class physical hardware debugging and test bench verification (Tier 2 Tutors).](figures/fig2_paper28_flipped_learning_architecture.png)

*<b>Fig. 2.</b> Flipped Learning Architecture and Two-Tier Tutor Workflow in Vibe Classroom. Shows the transition from pre-class asynchronous code and commit auditing (Tier 1 Tutors) to in-class physical hardware debugging and test bench verification (Tier 2 Tutors).*



<ol>
  <li><b>Tier 1 Tutors (Asynchronous Code and Commit Auditing):</b> Review pull requests, inspect <code>AUDIT.md</code> reflections, verify that git commit messages include proper provenance metadata, and confirm automated test execution before physical lab sessions.</li>
  <li><b>Tier 2 Tutors (In-Class Physical Lab Facilitators):</b> Provide real-time scaffolding in the hardware studio. When a learner's vehicle fails to move or stop, Tier 2 tutors guide students through physical diagnostic checks (measuring battery voltage with digital multimeters, checking serial UART logs, and observing motor PWM waveforms) rather than rewriting software code for them.</li>
</ol>

### 4.3 Product-Path Architectural Hierarchy
To permanently eliminate the Product-Path Problem, the curriculum enforces a strict, explicit three-tier architectural hierarchy, summarized in Table 1:



<b>Table 1. Product path and laboratory map for vehicle-themed units</b>


<table>
  <thead>
    <tr>
      <th>Architectural Layer</th>
      <th>Educational Purpose</th>
      <th>Required Empirical Learner Evidence</th>
      <th>Pedagogical Meaning of Completion</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><b>1. Vibe Classroom Sandbox</b></td>
      <td>Formative practice of isolated layout and logic concepts</td>
      <td>Automated test pass, DOM snapshot, mobile browser inspection</td>
      <td>The bounded programming exercise works in isolation</td>
    </tr>
    <tr>
      <td><b>2. Vehicle-Hosted Wi-Fi Page</b></td>
      <td>Authoritative daily driving via vehicle embedded HTTP server</td>
      <td>Phone loads page from <code>192.168.4.1</code>; verified motion and stop</td>
      <td>The production cyber-physical product path works</td>
    </tr>
    <tr>
      <td><b>3. Optional Conceptual Labs</b></td>
      <td>Conceptual extension into JSON schemas, Canvas, and BLE</td>
      <td>Laboratory reflection, GATT UUID capture, coordinate math log</td>
      <td>An optional advanced concept or channel was explored</td>
    </tr>
  </tbody>
</table>

## 5 The PACE Pedagogical Framework

The PACE framework organizes AI-assisted programming into four visible, assessable, and self-reinforcing phases, as detailed in Table 2:



<b>Table 2. The PACE framework phases, learner practices, artifacts, and tutor inquiry prompts</b>


<table>
  <thead>
    <tr>
      <th>PACE Phase</th>
      <th>Core Learner Practice</th>
      <th>Observable Engineering Artifact</th>
      <th>Socratic Tutor Inquiry Prompt</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><b>Prompt Design (P)</b></td>
      <td>Formulate structured specifications, interface boundaries, and exit gates</td>
      <td><code>VIBE.md</code> or <code>SPEC.md</code> containing explicit prompt frames</td>
      <td><i>"What specific observable behavior defines success for this change?"</i></td>
    </tr>
    <tr>
      <td><b>Audit (A)</b></td>
      <td>Critically inspect AI code against contract invariants and safety rules</td>
      <td><code>AUDIT.md</code> documenting identified defects and repair diffs</td>
      <td><i>"What hidden assumptions did the AI assistant make about touch events?"</i></td>
    </tr>
    <tr>
      <td><b>Commit (C)</b></td>
      <td>Execute atomic, provenance-tagged version-controlled commits</td>
      <td>Git history with <code>[AI-Generated]</code>, <code>[Human-Modified]</code> tags</td>
      <td><i>"Which specific engineering decisions in this commit were yours?"</i></td>
    </tr>
    <tr>
      <td><b>Evaluate (E)</b></td>
      <td>Triangulate automated tests, rendered UI, and physical HIL actuation</td>
      <td>GitHub Actions status, serial trace, physical stop video</td>
      <td><i>"What does this green test prove, and what physical effect does it fail to verify?"</i></td>
    </tr>
  </tbody>
</table>

### 5.1 P—Prompt Design: From Impulsive Chat to Testable Specification
Prompt Design begins by defining a problem. Novice learners initially tend to issue vague, impulsive requests (e.g., <i>"make a cool remote"</i>). PACE scaffolds prompt formulation through structured four-sentence prompt frames: (1) <i>"I am building..."</i>; (2) <i>"It must accept inputs... and output..."</i>; (3) <i>"Do not modify..."</i>; and (4) <i>"I will verify it by...."</i> This transforms an informal chat into an explicit functional contract. Learners retain cognitive agency and develop deep conceptual comprehension of how the system arrived at its observed behavior.



### 5.2 A—Audit: Critical Evaluation and Algorithmic Literacy
The Audit phase represents the intellectual core of the framework. Novice learners are instructed never to accept AI-generated code blindly. Audit proceeds from observed physical behavior back to code specification. Learners evaluate whether the generated code satisfies boundary conditions, handles edge cases, and obeys shared protocol invariants. When a student discovers that an AI assistant omitted touch cancellation handling, the resulting cognitive disequilibrium drives genuine conceptual learning: the student realizes that visual appearance does not guarantee behavioral safety.



### 5.3 C—Commit: Epistemological Ownership and Provenance
Commit transforms ephemeral chat dialogues into durable, version-controlled engineering milestones. Learners commit small, coherent units of code labeled with explicit provenance metadata: <code>[AI-Generated]</code> (initial model output), <code>[Human-Modified]</code> (learner-authored adjustment), or <code>[AI-Fixed]</code> (model revision guided by a student-identified bug). This practice cultivates <i>epistemological ownership</i>: learners do not view code as an alien black box, but as an authored artifact for which they bear personal responsibility.



### 5.4 E—Evaluate: Multi-Layered Physical Verification
Evaluation triangulates evidence across four distinct levels: (1) automated unit tests (checking syntax and DOM nodes); (2) visual browser rendering (inspecting touch responsiveness); (3) process artifact reflection (evaluating <code>AUDIT.md</code> depth); and (4) physical HIL verification (confirming motor actuation and emergency stopping on hardware). This multi-layered approach ensures that learners never mistake simulator green lights for physical vehicle readiness.



## 6 Progressive Five-Stage Learning Progression

To structure novice development systematically, the curriculum unfolds across five progressive stages:


<ol>
  <li><b>Stage 1: Developer Identity and Safe Environment:</b> Establishing accounts, basic git navigation (clone, commit, push), security practices (protecting Wi-Fi credentials and API keys), and understanding that prompts leave local machines. Offloading low-level syntax to AI reduces extraneous cognitive load, allowing learners to focus on version control concepts.</li>
  <li><b>Stage 2: Product-Aligned Interface Foundations:</b> Introducing semantic HTML5 elements, CSS Grid layouts, and mobile touch event lifecycles. Students construct responsive D-pad control panels that mimic the vehicle's production interface.</li>
  <li><b>Stage 3: Product Path and Physical Cyber-Physical Meaning:</b> Connecting smartphones to the ESP32-C3 SoftAP, loading the vehicle-hosted web remote, and verifying that touching Forward commands wheel rotation while release triggers immediate dynamic braking.</li>
  <li><b>Stage 4: Optional Conceptual and Channel Laboratories:</b> Exploring JSON serialization, binary byte buffers, Canvas coordinate mapping, and Web Bluetooth GATT services as optional enrichment modules.</li>
  <li><b>Stage 5: Integrated Capstone PACE Project:</b> Designing, auditing, committing, and physically evaluating an end-to-end custom telemetry and steering interface under tutor facilitation.</li>
</ol>

## 7 Curriculum-Grounded Illustrative Cases

Following the methodological framework of Skilling and Stylianides (2019), the following composite illustrative cases synthesize recurrent, authentic classroom episodes observed during our field trials, illustrating how PACE resolves critical integration breakdowns.



### 7.1 Case A: The Controller That Would Not Stop
A grade-six student began a controller task with the prompt: <i>"Make the forward button keep moving the car while I press it."</i> The AI generated an implementation binding movement to standard <code>touchstart</code> listeners. On desktop preview, the animation looked perfect. However, during studio testing, the tutor asked: <i>"What happens if your finger slides off the button while holding it?"</i> When tested on a smartphone, the vehicle continued driving forward indefinitely, crashing into test barriers.



Following PACE: The learner documented the failure in <code>AUDIT.md</code>, formulating an explicit prompt requiring <code>pointercancel</code>, <code>pointerleave</code>, and window <code>blur</code> event listeners. The AI synthesized an updated handler. The student inspected the diff, verified that all interruption paths invoked <code>/api/stop</code>, and committed the fix labeled <code>[Human-Modified]</code>. In final HIL evaluation, the car stopped reliably within 35 ms of finger displacement. The student reflected: <i>"I learned that making code work is easy, but making it stop safely is the real engineering challenge."</i>



### 7.2 Case B: The Web Bluetooth Compatibility Trap
A middle-school student team encountered an optional Web Bluetooth module and assumed it was compulsory for vehicle operation. Using school-issued iPads running iOS Safari, they repeatedly prompted the AI to fix their Bluetooth code. The AI generated dozens of alternative JavaScript snippets, yet no pairing dialog appeared. Frustration mounted as the students believed they were writing broken code.



The tutor intervened using the Product-Path Map (Table 1), guiding the team to connect directly to the vehicle-hosted Wi-Fi HTTP page at <code>http://192.168.4.1</code>. Within two minutes, the students drove the car successfully. The tutor then helped the students audit iOS browser specifications, leading them to discover that Apple iOS deliberately restricts Web Bluetooth APIs. The team completed the module by writing a technical compatibility report. Rather than experiencing failure, the students learned an invaluable lesson in cross-platform operating system constraints.



## 8 Design Propositions for AI-Assisted Computing Education
Synthesizing our curriculum artifact analysis, we articulate three core design propositions:


<ol>
  <li><b>Proposition 1 (Competency Redistribution):</b> Vibe Coding does not diminish the need for computational thinking; it shifts competency from syntactic memorization toward semantic specification, critical code auditing, and systemic boundary verification.</li>
  <li><b>Proposition 2 (Process as Assessable Artifact):</b> In AI-assisted education, grading final code is inadequate. Assessing intermediate process artifacts (prompts, audit logs, and provenance-tagged commit histories) provides an authentic, cheat-resistant evaluation of learner reasoning.</li>
  <li><b>Proposition 3 (Product-Path Decoupling):</b> Curricular coherence requires explicitly separating production baseline channels from exploratory conceptual sandboxes, preventing platform limitations from becoming false learner blockers.</li>
</ol>

## 9 Challenges and Mitigation Strategies
We identify three key educational challenges and their mitigations: (1) <i>Cognitive Overload</i>, mitigated by progressive five-stage disclosure and scaffold-fading; (2) <i>AI Hallucination and Scope Creep</i>, mitigated by atomic git rollbacks; and (3) <i>Privacy Safeguards for Minors</i>, enforced by strictly forbidding personal identification information (PII) in LLM prompts.



## 10 Discussion and Comparison
Compared with professional developer workflows [3], PACE introduces essential metacognitive checkpoints designed specifically for novices. Compared with conventional Project-Based Learning [14], PACE explicitly incorporates generative AI as an active conversational partner while preserving human agency and critical verification through tutor facilitation.



## 11 Recommendations for Course Designers and Tutors
We recommend that computing educators: (1) author explicit completion and safety rubrics prior to formulating AI prompts; (2) maintain stable product-path narratives; (3) train tutors to ask diagnostic questions rather than providing direct code fixes; and (4) triangulate automated test passes with physical hardware verification.



## 12 Conclusion
This design study demonstrated that Vibe Coding can become a deeply empowering pedagogical paradigm when embedded within a theoretically grounded intelligent learning ecosystem. The PACE framework—Prompt Design, Audit, Commit, and Evaluate—transforms conversational code generation into a disciplined, accountable engineering practice. By combining constructivist scaffolding with physical HIL verification, computing education can successfully leverage generative AI to cultivate genuine human agency and critical computational literacy.



## Conflict of Interest and Disclosure Statement
Author Rover Yu-Kuan Chen is the founder of Taiwan Vibe Coding Co., an educational initiative providing open curriculum resources and instructional platforms for AI-assisted computing education. Co-authors Yui-Liang Chen and Rui-Yu Lin are academic faculty and graduate researchers at the Department of Information Management, Shih Hsin University, and Yu-Ting Chen is a researcher at the Department of Early Childhood Development and Education, Chaoyang University of Technology. None of the university authors possess any commercial, financial, or proprietary interest in Taiwan Vibe Coding Co. This study was conducted strictly as an independent academic design-based research inquiry to investigate pedagogical frameworks for AI-assisted computing education. All curriculum materials, rubric templates, and platform specifications are openly accessible for educational replication and research verification.



## References

[1] Karpathy, A.: There’s a new kind of coding I call “vibe coding” [social media post]. X (2 February 2025)


[2] Collins English Dictionary: Word of the Year 2025: Vibe Coding. HarperCollins, Glasgow (2025)


[3] Sarkar, A., Drosos, I.: Vibe coding: Programming through conversation with artificial intelligence. arXiv:2506.23253 (2025)


[4] The influence of artificial intelligence tools on learning outcomes in computer programming: A systematic review and meta-analysis. Computers 14(5), 185 (2025). https://doi.org/10.3390/computers14050185


[5] Fostering programming skill and critical thinking through AI-assisted project-based learning integration. Journal of New Approaches in Educational Research 14(1), 102–118 (2025)


[6] Munoz, A., Rook, L.: Leveraging generative AI through vibe coding: A case of simulation-based curriculum redesign in management education. Education Sciences 16(4), 558 (2026)


[7] Flavell, J.H.: Metacognition and cognitive monitoring: A new area of cognitive-developmental inquiry. American Psychologist 34(10), 906–911 (1979)


[8] Automated assessment in mobile programming courses: Leveraging GitHub Classroom and Flutter for enhanced student outcomes. arXiv:2504.04230 (2025)


[9] Autograder+: A multi-faceted AI framework for rich pedagogical feedback in programming education. arXiv:2510.26402 (2025)


[10] GitHub: GitHub Classroom sign-ups are no longer available. GitHub Changelog (26 May 2026), https://github.blog/changelog/2026-05-26-github-classroom-sign-ups-are-no-longer-available/


[11] GitHub Community: Important announcement for educators: GitHub Classroom functionality will be transitioning to partners (2026), https://github.com/orgs/community/discussions/196615


[12] Vygotsky, L.S.: Mind in Society: The Development of Higher Psychological Processes. Harvard University Press, Cambridge (1978)


[13] Wood, D., Bruner, J.S., Ross, G.: The role of tutoring in problem solving. Journal of Child Psychology and Psychiatry 17(2), 89–100 (1976)


[14] Blumenfeld, P.C., Soloway, E., Marx, R.W., Krajcik, J.S., Guzdial, M., Palincsar, A.: Motivating project-based learning: Sustaining the doing, supporting the learning. Educational Psychologist 26(3–4), 369–398 (1991)


[15] Piaget, J.: Part I: Cognitive development in children: Piaget development and learning. Journal of Research in Science Teaching 2(3), 176–186 (1964)


[16] Design-Based Research Collective: Design-based research: An emerging paradigm for educational inquiry. Educational Researcher 32(1), 5–8 (2003)


[17] McKenney, S., Reeves, T.C.: Conducting Educational Design Research, 2nd edn. Routledge, London (2018)


[18] Yin, R.K.: Case Study Research and Applications: Design and Methods, 6th edn. SAGE, Thousand Oaks (2018)


[19] Bowen, G.A.: Document analysis as a qualitative research method. Qualitative Research Journal 9(2), 27–40 (2009)


[20] Skilling, K., Stylianides, G.: Using vignettes in educational research: a framework for vignette construction. International Journal of Research & Method in Education 43(5), 541–556 (2019)


[21] Taiwan Vibe Coding Co.: Vibe Classroom curriculum materials, Tutor guides, assignment specifications, and vehicle-integration notes. Internal curriculum corpus (2026)




