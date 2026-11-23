import os
import pptx
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

prs = pptx.Presentation()
prs.slide_width = Inches(13.333)
prs.slide_height = Inches(7.5)
blank_layout = prs.slide_layouts[6]

# Colors
C_NAVY_DARK = RGBColor(15, 23, 42)      # #0F172A
C_NAVY_LIGHT = RGBColor(30, 41, 59)     # #1E293B
C_BLUE_PRIMARY = RGBColor(37, 99, 235)  # #2563EB
C_CYAN_ACCENT = RGBColor(14, 165, 233)  # #0EA5E9
C_WHITE = RGBColor(255, 255, 255)       # #FFFFFF
C_GRAY_LIGHT = RGBColor(248, 250, 252)  # #F8FAFC
C_GRAY_CARD = RGBColor(241, 245, 249)   # #F1F5F9
C_GRAY_BORDER = RGBColor(203, 213, 225) # #CBD5E1
C_GRAY_TEXT = RGBColor(51, 65, 85)      # #334155
C_GRAY_MUTED = RGBColor(100, 116, 139)  # #64748B
C_GREEN = RGBColor(16, 185, 129)        # #10B981
C_RED = RGBColor(239, 68, 68)           # #EF4444

def set_slide_background(slide, color):
    bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg.fill.solid()
    bg.fill.fore_color.rgb = color
    bg.line.fill.background()
    return bg

def add_header(slide, section_tag, title_text, dark=False):
    tb_tag = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.7), Inches(0.35))
    p_tag = tb_tag.text_frame.paragraphs[0]
    p_tag.text = section_tag.upper()
    p_tag.font.size = Pt(11)
    p_tag.font.bold = True
    p_tag.font.color.rgb = C_CYAN_ACCENT if dark else C_BLUE_PRIMARY
    
    tb_title = slide.shapes.add_textbox(Inches(0.8), Inches(0.75), Inches(11.7), Inches(0.7))
    p_title = tb_title.text_frame.paragraphs[0]
    p_title.text = title_text
    p_title.font.size = Pt(24)
    p_title.font.bold = True
    p_title.font.color.rgb = C_WHITE if dark else C_NAVY_DARK

def add_speaker_note(slide, note_text):
    notes_slide = slide.notes_slide
    tf = notes_slide.notes_text_frame
    tf.text = note_text

# ==================== SLIDE 1: Title Slide (Dark) ====================
s1 = prs.slides.add_slide(blank_layout)
set_slide_background(s1, C_NAVY_DARK)

badge = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.8), Inches(4.5), Inches(0.45))
badge.fill.solid()
badge.fill.fore_color.rgb = C_NAVY_LIGHT
badge.line.color.rgb = C_BLUE_PRIMARY
p_b = badge.text_frame.paragraphs[0]
p_b.text = 'SSIM 2026 ｜ Oral Presentation'
p_b.font.size = Pt(12)
p_b.font.bold = True
p_b.font.color.rgb = C_CYAN_ACCENT
p_b.alignment = PP_ALIGN.CENTER

tb_t1 = s1.shapes.add_textbox(Inches(0.8), Inches(1.5), Inches(11.7), Inches(2.3))
tf_t1 = tb_t1.text_frame
tf_t1.word_wrap = True
p_t1 = tf_t1.paragraphs[0]
p_t1.text = 'Full-Stack Vibe Coding Pedagogy & Monorepo HIL Architecture for Physical AI Education'
p_t1.font.size = Pt(30)
p_t1.font.bold = True
p_t1.font.color.rgb = C_WHITE
p_t1.line_spacing = 1.15

p_sub = tf_t1.add_paragraph()
p_sub.text = 'Bridging the Cyber-Physical Chasm through the PACE Framework and Shared Protocols (Papers 27 & 28)'
p_sub.font.size = Pt(16)
p_sub.font.color.rgb = C_CYAN_ACCENT
p_sub.space_before = Pt(12)

pcard = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(4.3), Inches(11.7), Inches(2.4))
pcard.fill.solid()
pcard.fill.fore_color.rgb = C_NAVY_LIGHT
pcard.line.color.rgb = RGBColor(51, 65, 85)

tb_p = s1.shapes.add_textbox(Inches(1.1), Inches(4.5), Inches(11.1), Inches(2.0))
tf_p = tb_p.text_frame
p1_p = tf_p.paragraphs[0]
p1_p.text = 'Presenter: Rover (Yu-Kuan) Chen  (Taiwan Vibe Coding Co.)'
p1_p.font.size = Pt(17)
p1_p.font.bold = True
p1_p.font.color.rgb = C_WHITE

p2_p = tf_p.add_paragraph()
p2_p.text = 'Co-Authors & Demo Tutors: Rui-Yu Lin (Shih Hsin Univ.), Yu-Ting Chen (Chaoyang Univ. of Tech.)'
p2_p.font.size = Pt(14)
p2_p.font.color.rgb = RGBColor(226, 232, 240)
p2_p.space_before = Pt(6)

p3_p = tf_p.add_paragraph()
p3_p.text = '指導教授 Principal Advisor: 陳育亮 博士 (Prof. Yui-Liang Chen, Ph.D.)'
p3_p.font.size = Pt(14)
p3_p.font.color.rgb = C_CYAN_ACCENT
p3_p.space_before = Pt(6)

p3_sub = tf_p.add_paragraph()
p3_sub.text = '世新大學 資訊管理學系 (Dept. of Information Management, Shih Hsin University)'
p3_sub.font.size = Pt(12)
p3_sub.font.color.rgb = RGBColor(203, 213, 225)
p3_sub.space_before = Pt(2)

p4_p = tf_p.add_paragraph()
p4_p.text = 'Venue: Chaoyang University of Technology (CYUT), Taiwan ｜ Dec 17–19, 2026'
p4_p.font.size = Pt(12)
p4_p.font.color.rgb = C_GRAY_MUTED
p4_p.space_before = Pt(8)

add_speaker_note(s1, '''[0:00 - 1:00] Rover:
Good morning session chairs, distinguished scholars, and fellow researchers. I am Rover Chen from Taiwan Vibe Coding Company. Together with our principal advisor Professor Yui-Liang Chen (指導教授 陳育亮 博士) from Shih Hsin University, and our live demo tutors Rui-Yu Lin and Yu-Ting Chen from Chaoyang University of Technology, we are honored to present our research synthesizing Paper 27 and Paper 28. Today, we will introduce our full-stack pedagogical and engineering architecture designed to teach Physical AI through Vibe Coding, culminating in a live hardware demonstration right on stage.''')

# ==================== SLIDE 2: The Core Problem ====================
s2 = prs.slides.add_slide(blank_layout)
set_slide_background(s2, C_GRAY_LIGHT)
add_header(s2, 'Section 1: The Problem & Context (Paper 28)', 'The Core Problem: The Cyber-Physical Chasm')

cards_data_2 = [
    ('1. Syntax Gatekeeping', 'Novice students spend >70% of working memory wrestling with low-level C/C++ compiler errors, pointer arithmetic, register configs, and interrupt flags.', C_RED),
    ('2. Cognitive Overload (CLT)', 'Extraneous cognitive load suffocates the mental capacity required for high-order system architecture, kinematic intuition, and creative design (Sweller, 1988).', C_BLUE_PRIMARY),
    ('3. Acute Programming Anxiety', 'Repeated compilation failures and burned hardware trigger acute Programming Anxiety (PAS), leading to learned helplessness and high dropout rates.', C_NAVY_DARK)
]
for i, (title, desc, color) in enumerate(cards_data_2):
    left = Inches(0.8 + i * 4.0)
    card = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, Inches(1.8), Inches(3.7), Inches(4.8))
    card.fill.solid()
    card.fill.fore_color.rgb = C_WHITE
    card.line.color.rgb = C_GRAY_BORDER
    
    accent = s2.shapes.add_shape(MSO_SHAPE.RECTANGLE, left, Inches(1.8), Inches(3.7), Inches(0.12))
    accent.fill.solid()
    accent.fill.fore_color.rgb = color
    accent.line.fill.background()
    
    tb = s2.shapes.add_textbox(left + Inches(0.2), Inches(2.2), Inches(3.3), Inches(4.2))
    tf = tb.text_frame
    tf.word_wrap = True
    p1 = tf.paragraphs[0]
    p1.text = title
    p1.font.size = Pt(17)
    p1.font.bold = True
    p1.font.color.rgb = color
    
    p2 = tf.add_paragraph()
    p2.text = desc
    p2.font.size = Pt(14)
    p2.font.color.rgb = C_GRAY_TEXT
    p2.space_before = Pt(14)
    p2.line_spacing = 1.3

add_speaker_note(s2, '''[1:00 - 2:15] Rover:
In traditional IoT and embedded computing education, students confront what we define as the 'Cyber-Physical Chasm'. Novices are overwhelmed by tedious low-level C++ syntax, memory pointers, and breadboard pinouts. According to Cognitive Load Theory, when over 70% of mental bandwidth is exhausted fighting syntax and compiler errors, students suffer acute programming anxiety. They never reach the point of understanding system integration or physical kinematics.''')

# ==================== SLIDE 3: The Paradigm Shift & Hallucination ====================
s3 = prs.slides.add_slide(blank_layout)
set_slide_background(s3, C_GRAY_LIGHT)
add_header(s3, 'Section 1: The Problem & Context (Papers 27 & 28)', 'Paradigm Shift: Vibe Coding & The "Protocol Hallucination" Trap')

b_left = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.8), Inches(5.6), Inches(4.8))
b_left.fill.solid()
b_left.fill.fore_color.rgb = C_WHITE
b_left.line.color.rgb = C_GREEN

tb_l = s3.shapes.add_textbox(Inches(1.1), Inches(2.0), Inches(5.0), Inches(4.4))
tf_l = tb_l.text_frame
tf_l.word_wrap = True
pl1 = tf_l.paragraphs[0]
pl1.text = 'The Promise: Vibe Coding (Karpathy, 2025)'
pl1.font.size = Pt(18)
pl1.font.bold = True
pl1.font.color.rgb = C_GREEN

pl2 = tf_l.add_paragraph()
pl2.text = '• Shift from manual code-typing to natural-language human-AI intent orchestration.\n• Rapid synthesis of full-stack prototypes in minutes.\n• Removes low-level syntax barriers, empowering learners to focus on system design.'
pl2.font.size = Pt(14)
pl2.font.color.rgb = C_GRAY_TEXT
pl2.space_before = Pt(12)
pl2.line_spacing = 1.35

b_right = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.9), Inches(1.8), Inches(5.6), Inches(4.8))
b_right.fill.solid()
b_right.fill.fore_color.rgb = C_WHITE
b_right.line.color.rgb = C_RED

tb_r = s3.shapes.add_textbox(Inches(7.2), Inches(2.0), Inches(5.0), Inches(4.4))
tf_r = tb_r.text_frame
tf_r.word_wrap = True
pr1 = tf_r.paragraphs[0]
pr1.text = 'The Trap: Protocol Hallucination in IoT'
pr1.font.size = Pt(18)
pr1.font.bold = True
pr1.font.color.rgb = C_RED

pr2 = tf_r.add_paragraph()
pr2.text = '• AI produces code that "looks correct" and compiles, but catastrophically fails on hardware.\n• Schema Mismatches: Web app sends JSON while firmware expects 4-byte binary structs.\n• Hardware Blindness: AI assigns strapping pins (GPIO 2/8/9) or omits watchdog timers, causing crashes or bricked boards.'
pr2.font.size = Pt(14)
pr2.font.color.rgb = C_GRAY_TEXT
pr2.space_before = Pt(12)
pr2.line_spacing = 1.35

add_speaker_note(s3, '''[2:15 - 3:30] Rover:
When Andrej Karpathy coined 'Vibe Coding' in 2025, it was hailed as a revolution. But in embedded IoT, code that 'vibes' on screen can literally burn motors on the bench. AI frequently exhibits 'Protocol Hallucination'—generating a Web controller expecting one schema, while the C3 firmware expects another. Un-scaffolded Vibe Coding simply turns students into reckless copy-paste operators. We needed a systematic pedagogical and architectural defense.''')

# ==================== SLIDE 4: The PACE Framework ====================
s4 = prs.slides.add_slide(blank_layout)
set_slide_background(s4, C_GRAY_LIGHT)
add_header(s4, 'Section 2: Pedagogical Innovation (Paper 28 Core)', 'Pedagogical Framework: The 4-Stage PACE Model')

pace_steps = [
    ('P - Prompt Design', 'Role-Task-Constraint structure. Specify hardware pin reservations, non-blocking requirements, and packet schemas explicitly.', C_BLUE_PRIMARY),
    ('A - Code Audit', 'Critical peer and automated code review. Ban blocking delay(); inspect strapping pins; verify 500ms heartbeat safeguards.', C_CYAN_ACCENT),
    ('C - Micro-Commit', 'Fine-grained Git commits with mandatory provenance tags: [AI-Generated], [Human-Modified], and rationale logs.', C_GREEN),
    ('E - Dual Evaluation', 'Layer 1: CI automated linting and contract unit tests. Layer 2: Hardware-in-the-Loop physical track verification.', C_NAVY_DARK)
]
for i, (title, desc, color) in enumerate(pace_steps):
    left = Inches(0.8 + i * 3.0)
    card = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, Inches(1.8), Inches(2.75), Inches(4.8))
    card.fill.solid()
    card.fill.fore_color.rgb = C_WHITE
    card.line.color.rgb = C_GRAY_BORDER
    
    accent = s4.shapes.add_shape(MSO_SHAPE.RECTANGLE, left, Inches(1.8), Inches(2.75), Inches(0.12))
    accent.fill.solid()
    accent.fill.fore_color.rgb = color
    accent.line.fill.background()
    
    tb = s4.shapes.add_textbox(left + Inches(0.15), Inches(2.1), Inches(2.45), Inches(4.3))
    tf = tb.text_frame
    tf.word_wrap = True
    p1 = tf.paragraphs[0]
    p1.text = title
    p1.font.size = Pt(16)
    p1.font.bold = True
    p1.font.color.rgb = color
    
    p2 = tf.add_paragraph()
    p2.text = desc
    p2.font.size = Pt(13)
    p2.font.color.rgb = C_GRAY_TEXT
    p2.space_before = Pt(12)
    p2.line_spacing = 1.3

add_speaker_note(s4, '''[3:30 - 4:45] Rover:
To solve this, Paper 28 introduces the PACE Teaching Framework. PACE completely redefines the student developer's identity: the learner is not a syntax typist, but a Chief Engineering Auditor. Through structured Prompts, rigorous Audits for hardware traps, fine-grained Commits with AI provenance, and physical Evaluation, students take absolute ownership of the engineering lifecycle.''')

# ==================== SLIDE 5: Two-Tier Mentorship & Vibe Classroom ====================
s5 = prs.slides.add_slide(blank_layout)
set_slide_background(s5, C_GRAY_LIGHT)
add_header(s5, 'Section 2: Pedagogical Innovation (Paper 28 Core)', 'Two-Tier Mentorship & The Vibe Classroom Platform')

b5_l = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.8), Inches(5.6), Inches(4.8))
b5_l.fill.solid()
b5_l.fill.fore_color.rgb = C_WHITE
b5_l.line.color.rgb = C_GRAY_BORDER

tb5_l = s5.shapes.add_textbox(Inches(1.1), Inches(2.0), Inches(5.0), Inches(4.4))
tf5_l = tb5_l.text_frame
tf5_l.word_wrap = True
p5l1 = tf5_l.paragraphs[0]
p5l1.text = 'Two-Tier Mentorship Ecosystem'
p5l1.font.size = Pt(18)
p5l1.font.bold = True
p5l1.font.color.rgb = C_NAVY_DARK

p5l2 = tf5_l.add_paragraph()
p5l2.text = '• Tier 1 (Core Team Training): Taiwan Vibe Coding Co. conducts weekly study groups with collegiate tutors (Rui-Yu & Yu-Ting).\n• Tier 2 (Hands-on Scaffolding): Tutors accompany novice learners in university laboratories and outdoor camps.\n• Real-World Validation: Successfully tested with junior-high Boy Scouts at the Yangmingshan Camp, achieving 100% vehicle builds.'
p5l2.font.size = Pt(14)
p5l2.font.color.rgb = C_GRAY_TEXT
p5l2.space_before = Pt(12)
p5l2.line_spacing = 1.35

b5_r = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.9), Inches(1.8), Inches(5.6), Inches(4.8))
b5_r.fill.solid()
b5_r.fill.fore_color.rgb = C_WHITE
b5_r.line.color.rgb = C_GRAY_BORDER

tb5_r = s5.shapes.add_textbox(Inches(7.2), Inches(2.0), Inches(5.0), Inches(4.4))
tf5_r = tb5_r.text_frame
tf5_r.word_wrap = True
p5r1 = tf5_r.paragraphs[0]
p5r1.text = 'Vibe Classroom Cloud Infrastructure'
p5r1.font.size = Pt(18)
p5r1.font.bold = True
p5r1.font.color.rgb = C_BLUE_PRIMARY

p5r2 = tf5_r.add_paragraph()
p5r2.text = '• GitHub Classroom: One-click template distribution per student team.\n• GitHub Codespaces: Cloud-based VS Code environment with pre-installed PlatformIO CLI and Web dev tools.\n• Automated GitHub Actions: Instant CI linting, contract check, and automated artifact validation upon every git push.'
p5r2.font.size = Pt(14)
p5r2.font.color.rgb = C_GRAY_TEXT
p5r2.space_before = Pt(12)
p5r2.line_spacing = 1.35

add_speaker_note(s5, '''[4:45 - 6:00] Rover:
Crucially, AI velocity requires human companionship. We established a Two-Tier Mentorship system: our core team trains collegiate tutors, who then scaffold novice students in the lab. We deployed this model using GitHub Classroom and validated it not only in university classes, but also at the Yangmingshan Boy Scout Camp for adolescents with zero programming background.''')

# ==================== SLIDE 6: Full-Stack Monorepo ====================
s6 = prs.slides.add_slide(blank_layout)
set_slide_background(s6, C_GRAY_LIGHT)
add_header(s6, 'Section 3: Engineering Architecture (Paper 27 Core)', 'Full-Stack Monorepo Architecture: Single Source of Truth')

f_boxes = [
    ('Heterogeneous Monorepo', 'Turborepo + pnpm managing both apps/web-controller (HTML5/Web BLE) and apps/esp32-c3 (PlatformIO C++ firmware) in one unified repo.', C_BLUE_PRIMARY),
    ('Shared Protocol (packages/protocol)', 'Single Source of Truth. TypeScript & C header bindings share packet schemas. Any field alteration immediately forces compile check across both ends.', C_GREEN),
    ('68% Packet Slimming', 'Verbose 46-byte JSON compressed into compact 15-byte binary TypedArray. Reduces transmission latency to <15ms at 50Hz control frequency.', C_NAVY_DARK)
]
for i, (title, desc, color) in enumerate(f_boxes):
    top = Inches(1.8 + i * 1.7)
    box = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), top, Inches(11.7), Inches(1.45))
    box.fill.solid()
    box.fill.fore_color.rgb = C_WHITE
    box.line.color.rgb = C_GRAY_BORDER
    
    accent = s6.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), top, Inches(0.12), Inches(1.45))
    accent.fill.solid()
    accent.fill.fore_color.rgb = color
    accent.line.fill.background()
    
    tb = s6.shapes.add_textbox(Inches(1.2), top + Inches(0.15), Inches(11.0), Inches(1.15))
    tf = tb.text_frame
    tf.word_wrap = True
    p1 = tf.paragraphs[0]
    p1.text = title
    p1.font.size = Pt(17)
    p1.font.bold = True
    p1.font.color.rgb = color
    
    p2 = tf.add_paragraph()
    p2.text = desc
    p2.font.size = Pt(13)
    p2.font.color.rgb = C_GRAY_TEXT
    p2.space_before = Pt(4)

add_speaker_note(s6, '''[6:00 - 7:30] Rover:
Now turning to Paper 27: How do we technically enforce consistency? We architected the system as a Turborepo Monorepo. By anchoring both the phone Web controller and the ESP32 firmware to a single shared protocol package (packages/protocol), we completely eradicate protocol hallucination. Furthermore, binary packet slimming cuts payload size by 68%, achieving sub-15ms control latency.''')

# ==================== SLIDE 7: Physical Safeguards ====================
s7 = prs.slides.add_slide(blank_layout)
set_slide_background(s7, C_GRAY_LIGHT)
add_header(s7, 'Section 3: Engineering Architecture (Paper 27 Core)', 'Physical Safeguards: Triple Fail-Safe Architecture')

s_boxes = [
    ('1. 500ms Watchdog Emergency Stop', 'Vehicles listen for 50Hz heartbeat packets. If connection is lost for >= 500ms, firmware instantly cuts PWM to 0, preventing runaway crashes.', C_RED),
    ('2. Dual-Mode Wi-Fi Self-Healing', 'Operates in STA mode. If router connection drops for >= 8 seconds, the vehicle automatically spawns emergency SoftAP (vibe123456) for recovery.', C_BLUE_PRIMARY),
    ('3. 20s Delayed-Commit OTA Rollback', 'Over-The-Air updates require active confirmation within 20 seconds. If new firmware crashes or hangs, hardware automatically rolls back to safe partition.', C_GREEN)
]
for i, (title, desc, color) in enumerate(s_boxes):
    left = Inches(0.8 + i * 4.0)
    card = s7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, Inches(1.8), Inches(3.7), Inches(4.8))
    card.fill.solid()
    card.fill.fore_color.rgb = C_WHITE
    card.line.color.rgb = C_GRAY_BORDER
    
    accent = s7.shapes.add_shape(MSO_SHAPE.RECTANGLE, left, Inches(1.8), Inches(3.7), Inches(0.12))
    accent.fill.solid()
    accent.fill.fore_color.rgb = color
    accent.line.fill.background()
    
    tb = s7.shapes.add_textbox(left + Inches(0.2), Inches(2.2), Inches(3.3), Inches(4.2))
    tf = tb.text_frame
    tf.word_wrap = True
    p1 = tf.paragraphs[0]
    p1.text = title
    p1.font.size = Pt(17)
    p1.font.bold = True
    p1.font.color.rgb = color
    
    p2 = tf.add_paragraph()
    p2.text = desc
    p2.font.size = Pt(14)
    p2.font.color.rgb = C_GRAY_TEXT
    p2.space_before = Pt(14)
    p2.line_spacing = 1.3

add_speaker_note(s7, '''[7:30 - 8:45] Rover:
In Physical AI, software mistakes have kinetic consequences. We embedded three physical fail-safes into the architecture: a 500ms Watchdog emergency stop, an 8-second self-healing Wi-Fi fallback, and a 20-second dual-partition OTA rollback. These mechanisms ensure students can explore aggressively without fear of destroying hardware.''')

# ==================== SLIDE 8: HIL Verification ====================
s8 = prs.slides.add_slide(blank_layout)
set_slide_background(s8, C_GRAY_LIGHT)
add_header(s8, 'Section 4: Hardware-in-the-Loop Verification (Paper 27 Core)', 'Hardware-in-the-Loop (HIL): 3 Non-Forgeable Physical Artifacts')

h_cards = [
    ('Artifact 1: Mobile Preview', 'assets/mobile-preview.png\n\nProof of responsive Web App, touch hotspot compliance (>=48px), and active Web Bluetooth GATT connection status.', C_CYAN_ACCENT),
    ('Artifact 2: Hardware Wiring', 'assets/hardware-setup.jpg\n\nHigh-resolution photograph of physical breadboard, motor H-bridge wiring, battery voltage verification, and pinout sanity check.', C_GREEN),
    ('Artifact 3: Serial Telemetry Log', 'assets/serial-log.png\n\n115200 baud serial monitor capture showing successful boot, memory partition self-check, and active 50Hz heartbeat handshake.', C_NAVY_DARK)
]
for i, (title, desc, color) in enumerate(h_cards):
    left = Inches(0.8 + i * 4.0)
    card = s8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, Inches(1.8), Inches(3.7), Inches(4.8))
    card.fill.solid()
    card.fill.fore_color.rgb = C_WHITE
    card.line.color.rgb = C_GRAY_BORDER
    
    accent = s8.shapes.add_shape(MSO_SHAPE.RECTANGLE, left, Inches(1.8), Inches(3.7), Inches(0.12))
    accent.fill.solid()
    accent.fill.fore_color.rgb = color
    accent.line.fill.background()
    
    tb = s8.shapes.add_textbox(left + Inches(0.2), Inches(2.2), Inches(3.3), Inches(4.2))
    tf = tb.text_frame
    tf.word_wrap = True
    p1 = tf.paragraphs[0]
    p1.text = title
    p1.font.size = Pt(17)
    p1.font.bold = True
    p1.font.color.rgb = color
    
    p2 = tf.add_paragraph()
    p2.text = desc
    p2.font.size = Pt(14)
    p2.font.color.rgb = C_GRAY_TEXT
    p2.space_before = Pt(14)
    p2.line_spacing = 1.3

add_speaker_note(s8, '''[8:45 - 9:45] Rover:
To eliminate academic dishonesty and ensure genuine hands-on competence, we instituted Hardware-in-the-Loop (HIL) closed-loop verification. For every project milestone, students must submit three empirical artifacts: the mobile UI screenshot, the physical wiring photo, and the live 115200-baud serial telemetry log.''')

# ==================== SLIDE 9: 45 Micro-Unit Curriculum Roadmap ====================
s9 = prs.slides.add_slide(blank_layout)
set_slide_background(s9, C_GRAY_LIGHT)
add_header(s9, 'Section 4: Curriculum Synthesis (Papers 27 & 28)', '45 Micro-Unit Curriculum Roadmap (18 Weeks)')

curr_phases = [
    ('Phase 0: Foundations (W1–W3)', '3 Micro-Units\n• Developer Identity\n• PlatformIO CLI & Git\n• Flash Partitions & Strapping Pins', C_NAVY_LIGHT),
    ('Phase 1: Car Starter (W4–W7)', '15 Micro-Units\n• Web App Adaptive Layout\n• Web Bluetooth GATT & Slimming\n• Canvas Virtual Joystick & Kinematics\n★ Milestone: BLE Track Challenge', C_BLUE_PRIMARY),
    ('Phase 2: Car Basic (W8–W11)', '15 Micro-Units\n• Motor PWM & Non-blocking Timers\n• Wi-Fi Dual-Mode Self-Healing\n• FSM & 500ms Watchdog Safeguard\n★ Midterm Proposal & Architecture Review', C_GREEN),
    ('Phase 3: Integration Lab (W12–W18)', '12 Micro-Units\n• ESP32-CAM Edge Vision Streaming\n• Vision Feature Tracking & Guidance\n• System Hardening & Track Fleet Test\n★ Capstone Public Exhibition & Racing', C_CYAN_ACCENT)
]
for i, (title, desc, color) in enumerate(curr_phases):
    left = Inches(0.8 + i * 3.0)
    card = s9.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, Inches(1.8), Inches(2.75), Inches(4.8))
    card.fill.solid()
    card.fill.fore_color.rgb = C_WHITE
    card.line.color.rgb = C_GRAY_BORDER
    
    accent = s9.shapes.add_shape(MSO_SHAPE.RECTANGLE, left, Inches(1.8), Inches(2.75), Inches(0.12))
    accent.fill.solid()
    accent.fill.fore_color.rgb = color
    accent.line.fill.background()
    
    tb = s9.shapes.add_textbox(left + Inches(0.15), Inches(2.1), Inches(2.45), Inches(4.3))
    tf = tb.text_frame
    tf.word_wrap = True
    p1 = tf.paragraphs[0]
    p1.text = title
    p1.font.size = Pt(15)
    p1.font.bold = True
    p1.font.color.rgb = color
    
    p2 = tf.add_paragraph()
    p2.text = desc
    p2.font.size = Pt(13)
    p2.font.color.rgb = C_GRAY_TEXT
    p2.space_before = Pt(12)
    p2.line_spacing = 1.3

add_speaker_note(s9, '''[9:45 - 10:30] Rover:
We systematically mapped this entire architecture into 45 progressive micro-units over 18 weeks. Students advance from initial developer identity, through mobile BLE remote control, firmware security, and edge-vision guidance, concluding with a public autonomous vehicle showcase.''')

# ==================== SLIDE 10: Transition to Live Demo (Dark) ====================
s10 = prs.slides.add_slide(blank_layout)
set_slide_background(s10, C_NAVY_DARK)

tb10 = s10.shapes.add_textbox(Inches(0.8), Inches(2.0), Inches(11.7), Inches(3.5))
tf10 = tb10.text_frame
tf10.word_wrap = True
p10_1 = tf10.paragraphs[0]
p10_1.text = 'LIVE HARDWARE DEMONSTRATION'
p10_1.font.size = Pt(36)
p10_1.font.bold = True
p10_1.font.color.rgb = C_CYAN_ACCENT
p10_1.alignment = PP_ALIGN.CENTER

p10_2 = tf10.add_paragraph()
p10_2.text = 'Web BLE Controller ⟷ ESP32-C3 Robotic Vehicle'
p10_2.font.size = Pt(22)
p10_2.font.color.rgb = C_WHITE
p10_2.alignment = PP_ALIGN.CENTER
p10_2.space_before = Pt(16)

p10_3 = tf10.add_paragraph()
p10_3.text = 'Conducted live by Demo Tutors: Rui-Yu Lin & Yu-Ting Chen'
p10_3.font.size = Pt(16)
p10_3.font.color.rgb = C_GRAY_MUTED
p10_3.alignment = PP_ALIGN.CENTER
p10_3.space_before = Pt(20)

add_speaker_note(s10, '''[10:30 - 11:00] Rover:
Now, talk is cheap—show me the code, and show me the physical car! I would like to invite our demo tutors, Rui-Yu Lin and Yu-Ting Chen, to demonstrate our full-stack system live on stage.''')

# ==================== SLIDE 11: Live Demo Action Breakdown ====================
s11 = prs.slides.add_slide(blank_layout)
set_slide_background(s11, C_GRAY_LIGHT)
add_header(s11, 'Section 5: Live Demonstration (3 Minutes)', 'System Verification in Action')

demo_steps = [
    ('1. Zero-Install Web BLE Pairing', '• Tutor Rui-Yu opens Chrome on phone.\n• Clicks "Connect BLE" -> 1-sec pairing.\n• Vehicle LED locks solid blue; serial prints [BLE Connected, MTU=23].', C_BLUE_PRIMARY),
    ('2. Differential Kinematic Dynamics', '• Canvas 2D joystick converts touch vectors (r, theta) to wheel speeds (VL, VR).\n• 50Hz binary packet streaming.\n• Smooth 360-degree zero-radius spin.', C_GREEN),
    ('3. 500ms Watchdog Emergency Cutoff', '★ CLIMAX: Phone switched to Airplane Mode.\n• Connection abruptly severed.\n• Vehicle HALTS INSTANTLY (<0.5s)!\n• Serial flashes: WATCHDOG EMERGENCY STOP!', C_RED)
]
for i, (title, desc, color) in enumerate(demo_steps):
    left = Inches(0.8 + i * 4.0)
    card = s11.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, Inches(1.8), Inches(3.7), Inches(4.8))
    card.fill.solid()
    card.fill.fore_color.rgb = C_WHITE
    card.line.color.rgb = C_GRAY_BORDER
    
    accent = s11.shapes.add_shape(MSO_SHAPE.RECTANGLE, left, Inches(1.8), Inches(3.7), Inches(0.12))
    accent.fill.solid()
    accent.fill.fore_color.rgb = color
    accent.line.fill.background()
    
    tb = s11.shapes.add_textbox(left + Inches(0.2), Inches(2.2), Inches(3.3), Inches(4.2))
    tf = tb.text_frame
    tf.word_wrap = True
    p1 = tf.paragraphs[0]
    p1.text = title
    p1.font.size = Pt(17)
    p1.font.bold = True
    p1.font.color.rgb = color
    
    p2 = tf.add_paragraph()
    p2.text = desc
    p2.font.size = Pt(14)
    p2.font.color.rgb = C_GRAY_TEXT
    p2.space_before = Pt(14)
    p2.line_spacing = 1.3

add_speaker_note(s11, '''[11:00 - 13:30] Rover Live Commentary:
Notice how the phone connects via Web Bluetooth without installing any app. As Rui-Yu maneuvers the virtual joystick, binary packets stream at 50Hz with zero lag. And watch closely: when signal is lost, our 500ms Watchdog immediately clamps the motors, preventing runaway crashes. Thank you Rui-Yu and Yu-Ting! Back to our slides.''')

# ==================== SLIDE 12: Empirical Findings ====================
s12 = prs.slides.add_slide(blank_layout)
set_slide_background(s12, C_GRAY_LIGHT)
add_header(s12, 'Section 6: Empirical Findings (Paper 28 Data)', 'Quantitative Empirical Results: Psychological & Learning Shifts')

metrics = [
    ('-31.4%', 'Programming Anxiety (PAS)', 'Statistically significant drop in student coding anxiety (p < .001). Abstracting syntax eliminates compilation trauma.', C_GREEN),
    ('+26.8%', 'Programming Self-Efficacy (CPSES)', 'Significant surge in self-efficacy (p < .001, Cohen\'s d = 0.92). Students identify as system architects.', C_BLUE_PRIMARY),
    ('100%', 'Physical Track Completion Rate', 'Every single student team across 4 semesters successfully constructed, debugged, and raced their vehicle.', C_CYAN_ACCENT)
]
for i, (stat, title, desc, color) in enumerate(metrics):
    left = Inches(0.8 + i * 4.0)
    card = s12.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, Inches(1.8), Inches(3.7), Inches(4.8))
    card.fill.solid()
    card.fill.fore_color.rgb = C_WHITE
    card.line.color.rgb = C_GRAY_BORDER
    
    accent = s12.shapes.add_shape(MSO_SHAPE.RECTANGLE, left, Inches(1.8), Inches(3.7), Inches(0.12))
    accent.fill.solid()
    accent.fill.fore_color.rgb = color
    accent.line.fill.background()
    
    tb = s12.shapes.add_textbox(left + Inches(0.2), Inches(2.1), Inches(3.3), Inches(4.3))
    tf = tb.text_frame
    tf.word_wrap = True
    p1 = tf.paragraphs[0]
    p1.text = stat
    p1.font.size = Pt(36)
    p1.font.bold = True
    p1.font.color.rgb = color
    
    p2 = tf.add_paragraph()
    p2.text = title
    p2.font.size = Pt(16)
    p2.font.bold = True
    p2.font.color.rgb = C_NAVY_DARK
    p2.space_before = Pt(8)
    
    p3 = tf.add_paragraph()
    p3.text = desc
    p3.font.size = Pt(13)
    p3.font.color.rgb = C_GRAY_TEXT
    p3.space_before = Pt(12)
    p3.line_spacing = 1.3

add_speaker_note(s12, '''[13:30 - 14:30] Rover:
Our empirical data across 4 semesters and 396 student evaluations confirms profound cognitive shifts. Programming anxiety plunged by 31.4%, while programming self-efficacy surged by 26.8% with a large effect size of 0.92. Most crucially, 100% of student groups completed the autonomous track challenge.''')

# ==================== SLIDE 13: Conclusion ====================
s13 = prs.slides.add_slide(blank_layout)
set_slide_background(s13, C_GRAY_LIGHT)
add_header(s13, 'Section 6: Synthesis & Takeaways (Both Papers)', 'Conclusion & Key Engineering Takeaways')

takeaways = [
    ('1. Vibe Coding is Not "Code-Free"', 'It elevates the human from syntax typist to Chief Engineering Auditor. Critical code auditing is the core competency of the AI era.', C_NAVY_DARK),
    ('2. Shared Contracts Eradicate Drift', 'In cross-platform IoT, Monorepo shared packages (packages/protocol) provide the Single Source of Truth, making protocol hallucination structurally impossible.', C_BLUE_PRIMARY),
    ('3. Safety-First Engineering', 'Physical AI demands hardware-enforced fail-safes: 500ms Watchdogs, self-healing networks, and HIL verification are non-negotiable.', C_RED),
    ('4. Open-Source Commitment', 'Our entire 45-unit curriculum, Monorepo codebase, and 3D schematics are fully open-sourced for the global academic community.', C_GREEN)
]
for i, (title, desc, color) in enumerate(takeaways):
    top = Inches(1.8 + i * 1.3)
    box = s13.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), top, Inches(11.7), Inches(1.15))
    box.fill.solid()
    box.fill.fore_color.rgb = C_WHITE
    box.line.color.rgb = C_GRAY_BORDER
    
    accent = s13.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), top, Inches(0.12), Inches(1.15))
    accent.fill.solid()
    accent.fill.fore_color.rgb = color
    accent.line.fill.background()
    
    tb = s13.shapes.add_textbox(Inches(1.2), top + Inches(0.1), Inches(11.0), Inches(0.95))
    tf = tb.text_frame
    tf.word_wrap = True
    p1 = tf.paragraphs[0]
    p1.text = title
    p1.font.size = Pt(16)
    p1.font.bold = True
    p1.font.color.rgb = color
    
    p2 = tf.add_paragraph()
    p2.text = desc
    p2.font.size = Pt(13)
    p2.font.color.rgb = C_GRAY_TEXT
    p2.space_before = Pt(3)

add_speaker_note(s13, '''[14:30 - 15:30] Rover:
To conclude: Vibe Coding in Physical AI is not about cutting corners—it is about empowering students to become responsible system architects. By coupling the PACE pedagogy with Monorepo shared protocols and HIL verification, we bridge the cyber-physical chasm for the generative AI generation.''')

# ==================== SLIDE 14: Q&A (Dark) ====================
s14 = prs.slides.add_slide(blank_layout)
set_slide_background(s14, C_NAVY_DARK)

tb14 = s14.shapes.add_textbox(Inches(0.8), Inches(1.5), Inches(11.7), Inches(4.5))
tf14 = tb14.text_frame
tf14.word_wrap = True

p14_1 = tf14.paragraphs[0]
p14_1.text = 'Thank You Very Much!'
p14_1.font.size = Pt(38)
p14_1.font.bold = True
p14_1.font.color.rgb = C_WHITE
p14_1.alignment = PP_ALIGN.CENTER

p14_2 = tf14.add_paragraph()
p14_2.text = 'Questions & Answers'
p14_2.font.size = Pt(26)
p14_2.font.bold = True
p14_2.font.color.rgb = C_CYAN_ACCENT
p14_2.alignment = PP_ALIGN.CENTER
p14_2.space_before = Pt(16)

p14_3 = tf14.add_paragraph()
p14_3.text = 'Open-Source Monorepo & Curriculum Repository:\nhttps://github.com/ChenYuiLiang/vibe-coding-car-monorepo'
p14_3.font.size = Pt(18)
p14_3.font.color.rgb = RGBColor(226, 232, 240)
p14_3.alignment = PP_ALIGN.CENTER
p14_3.space_before = Pt(24)

p14_4 = tf14.add_paragraph()
p14_4.text = 'Rover Chen (rover@vibecoding.tw) ｜ 指導教授 陳育亮 博士 (ychen@mail.shu.edu.tw)'
p14_4.font.size = Pt(15)
p14_4.font.color.rgb = C_GRAY_MUTED
p14_4.alignment = PP_ALIGN.CENTER
p14_4.space_before = Pt(20)

add_speaker_note(s14, '''[15:30] Rover:
Thank you very much for your time and attention. Rover Chen, Rui-Yu Lin, and Yu-Ting Chen now warmly welcome questions from the session chairs and distinguished audience.''')

os.makedirs('docs', exist_ok=True)
os.makedirs('vibe-coding-car-monorepo/docs', exist_ok=True)

out_path_1 = 'docs/SSIM2026_Oral_Presentation.pptx'
out_path_2 = 'vibe-coding-car-monorepo/docs/SSIM2026_Oral_Presentation.pptx'
out_path_3 = '/Users/yui-liangchen/.gemini/antigravity/brain/9f26693f-eafc-44c8-82fa-01511de12210/SSIM2026_Oral_Presentation.pptx'

prs.save(out_path_1)
prs.save(out_path_2)
prs.save(out_path_3)
print('Successfully generated 14 widescreen slides PPTX with embedded speaker notes!')
