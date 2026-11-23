#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Build script to compile SSIM 2026 Live Demo Runbook Markdown into a professional,
executive-ready 3-page landscape PDF using Pandoc and Headless Google Chrome.
"""

import os
import re
import subprocess
import pypdf
import shutil

def main():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    md_path = os.path.join(base_dir, 'docs', 'SSIM2026_Live_Demo_Runbook.md')
    html_path = os.path.join(base_dir, 'docs', 'SSIM2026_Live_Demo_Runbook.html')
    pdf_path = os.path.join(base_dir, 'docs', 'SSIM2026_Live_Demo_Runbook.pdf')
    brain_pdf = '/Users/yui-liangchen/.gemini/antigravity/brain/9f26693f-eafc-44c8-82fa-01511de12210/SSIM2026_Live_Demo_Runbook.pdf'
    monorepo_pdf = os.path.join(base_dir, 'vibe-coding-car-monorepo', 'docs', 'SSIM2026_Live_Demo_Runbook.pdf')

    print(f"Reading markdown from {md_path}...")
    res = subprocess.run(['pandoc', md_path, '-f', 'markdown', '-t', 'html'], capture_output=True, text=True, check=True)
    raw_html = res.stdout

    # Parse sections
    # 1. Title & Meta
    title_meta_match = re.search(r'(<h1.*?</h1>\s*<blockquote>.*?</blockquote>)', raw_html, re.DOTALL)
    title_meta = title_meta_match.group(1) if title_meta_match else ""

    # 2. Section 1: Pre-Flight Checklist
    sec1_match = re.search(r'(<h2 id="一-展前-30-分鐘整備清單-pre-flight-checklist">.*?)(<hr />\s*<h2 id="二-現場-3-分鐘毫秒級操作時序表-step-by-step-runbook">)', raw_html, re.DOTALL)
    sec1_content = sec1_match.group(1) if sec1_match else ""

    # Split sec1 into Hardware and Software cards
    hw_match = re.search(r'(<h3 id="硬體載具整備負責人俞廷-yu-ting">.*?)(<h3 id="軟體與手機端整備負責人瑞昱-rui-yu">)', sec1_content, re.DOTALL)
    sw_match = re.search(r'(<h3 id="軟體與手機端整備負責人瑞昱-rui-yu">.*)', sec1_content, re.DOTALL)
    
    sec1_heading = '<h2 id="一-展前-30-分鐘整備清單-pre-flight-checklist">🧰 一、 展前 30 分鐘整備清單 (Pre-Flight Checklist)</h2>'
    if hw_match and sw_match:
        hw_html = hw_match.group(1)
        sw_html = sw_match.group(1)
        sec1_formatted = f"""
        {sec1_heading}
        <div class="grid-2">
          <div class="checklist-card">
            {hw_html}
          </div>
          <div class="checklist-card">
            {sw_html}
          </div>
        </div>
        """
    else:
        sec1_formatted = sec1_content

    # 3. Section 2: Step-by-Step Runbook
    sec2_match = re.search(r'(<h2 id="二-現場-3-分鐘毫秒級操作時序表-step-by-step-runbook">.*?)(<hr />\s*<h2 id="三-現場突發狀況應變手冊-emergency-contingency-sop">)', raw_html, re.DOTALL)
    sec2_content = sec2_match.group(1) if sec2_match else ""

    # Highlight 01:30 Watchdog row in sec2 table
    sec2_content = sec2_content.replace(
        '<tr>\n<td style="text-align: center;"><strong>01:30 ~ 02:15</strong></td>',
        '<tr class="climax-row">\n<td style="text-align: center;"><span class="climax-badge">01:30 ~ 02:15</span></td>'
    )

    # 4. Section 3: Emergency Contingency SOP
    sec3_match = re.search(r'(<h2 id="三-現場突發狀況應變手冊-emergency-contingency-sop">.*?)(<hr />\s*<h2 id="四-tutors-現場加分小技巧">)', raw_html, re.DOTALL)
    sec3_content = sec3_match.group(1) if sec3_match else ""

    # 5. Section 4: Tips
    sec4_match = re.search(r'(<h2 id="四-tutors-現場加分小技巧">.*)', raw_html, re.DOTALL)
    sec4_content = sec4_match.group(1) if sec4_match else ""

    # Convert Section 4 tips into 3 cards
    sec4_cards = f"""
    <h2 id="四-tutors-現場加分小技巧">💡 四、 Tutors 現場加分小技巧</h2>
    <div class="grid-3">
      <div class="tip-card">
        <div class="tip-title">1. 動作要大、自信穩健</div>
        <div class="tip-body">在操作「飛航模式斷開藍牙」時，瑞昱可將手機稍微舉高向評審示意，讓全場看清楚「斷開連線」與「自走車急停」是毫秒級聯動。</div>
      </div>
      <div class="tip-card">
        <div class="tip-title">2. 串口螢幕調大字體</div>
        <div class="tip-body">俞廷將 VS Code 串口監控字體設為 <b>18pt 以上</b>，使前排評審能清晰看見 <code>[WATCHDOG CUTOFF MOTORS!]</code> 的大寫紅字警告輸出。</div>
      </div>
      <div class="tip-card">
        <div class="tip-title">3. 服裝一致與默契</div>
        <div class="tip-body">發表當天全體著商務休閒裝（深色襯衫或系服），動作俐落、目光堅定，展現團隊專業工程紀律與高度默契！</div>
      </div>
    </div>
    """

    css = """
    <style>
      @page {
        size: A4 landscape;
        margin: 8mm 12mm 10mm 12mm;
      }
      * { box-sizing: border-box; }
      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang TC", "Heiti TC", "Microsoft JhengHei", Roboto, sans-serif;
        color: #1e293b;
        background: #ffffff;
        font-size: 8.2pt;
        line-height: 1.4;
        margin: 0;
        padding: 0;
      }

      /* Running Page Header */
      .page-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1.5px solid #0284c7;
        padding-bottom: 3px;
        margin-bottom: 8px;
        font-size: 7.5pt;
        color: #64748b;
        font-weight: 600;
      }
      .page-header .brand {
        color: #0369a1;
        letter-spacing: 0.05em;
        font-weight: 700;
      }

      /* Page Wrappers */
      .page {
        height: 100%;
        display: flex;
        flex-direction: column;
      }
      .page-break {
        page-break-after: always;
        break-after: page;
      }

      /* Main Title */
      h1 {
        font-size: 14pt;
        color: #0f172a;
        margin: 0 0 4px 0;
        font-weight: 800;
      }

      /* Metadata Blockquote Box */
      blockquote {
        background: #f0f9ff;
        border: 1px solid #bae6fd;
        border-left: 4px solid #0284c7;
        border-radius: 6px;
        margin: 4px 0 10px 0;
        padding: 6px 12px;
        font-size: 8pt;
        color: #0f172a;
      }
      blockquote p {
        margin: 1px 0;
        line-height: 1.45;
      }

      /* Headings */
      h2 {
        font-size: 11pt;
        color: #0f172a;
        border-left: 3.5px solid #0369a1;
        padding-left: 6px;
        margin: 6px 0 6px 0;
        font-weight: 700;
        page-break-after: avoid;
      }
      h3 {
        font-size: 9pt;
        color: #0369a1;
        margin: 4px 0 3px 0;
        font-weight: 700;
      }

      /* Grids & Cards */
      .grid-2 {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
        margin-bottom: 6px;
      }
      .grid-3 {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 10px;
        margin-top: 6px;
      }
      .checklist-card {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 6px;
        padding: 8px 12px;
        border-top: 3px solid #0284c7;
      }
      .tip-card {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 6px;
        padding: 8px 10px;
        border-top: 3px solid #10b981;
      }
      .tip-title {
        font-weight: 700;
        color: #065f46;
        font-size: 8.5pt;
        margin-bottom: 4px;
      }
      .tip-body {
        font-size: 7.8pt;
        color: #334155;
        line-height: 1.35;
      }

      /* Checklists */
      ul.task-list {
        list-style-type: none;
        padding-left: 0;
        margin: 3px 0;
      }
      ul.task-list > li {
        margin-bottom: 5px;
        padding-left: 18px;
        position: relative;
        font-size: 8pt;
      }
      ul.task-list > li > label > input[type="checkbox"] {
        position: absolute;
        left: 0;
        top: 2px;
        width: 12px;
        height: 12px;
        accent-color: #0284c7;
      }
      ul.task-list ul {
        list-style-type: disc;
        padding-left: 16px;
        margin: 1px 0 3px 0;
        color: #475569;
        font-size: 7.6pt;
      }
      ul.task-list ul li {
        margin-bottom: 1px;
      }

      /* Tables */
      table {
        width: 100%;
        border-collapse: collapse;
        margin: 6px 0 8px 0;
        font-size: 7.6pt;
        background: #ffffff;
      }
      th, td {
        border: 1px solid #cbd5e1;
        padding: 4px 6px;
        text-align: left;
        vertical-align: top;
        line-height: 1.3;
      }
      th {
        background-color: #0f172a;
        color: #ffffff;
        font-weight: 700;
        font-size: 7.8pt;
        letter-spacing: 0.02em;
      }
      tr:nth-child(even) td {
        background-color: #f8fafc;
      }

      /* Climax Highlight for Watchdog Row */
      tr.climax-row td {
        background-color: #fff1f2 !important;
        border-top: 1.5px solid #ef4444;
        border-bottom: 1.5px solid #ef4444;
      }
      .climax-badge {
        display: inline-block;
        background: #dc2626;
        color: #ffffff;
        font-weight: 800;
        padding: 2px 4px;
        border-radius: 3px;
        font-size: 7.5pt;
      }

      /* Code snippets */
      code {
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        background-color: #e2e8f0;
        color: #0f172a;
        padding: 1px 3px;
        border-radius: 2px;
        font-size: 7.2pt;
      }

      /* Footer Note */
      .footer-note {
        margin-top: auto;
        padding-top: 4px;
        border-top: 1px solid #cbd5e1;
        display: flex;
        justify-content: space-between;
        font-size: 7.2pt;
        color: #64748b;
      }
    </style>
    """

    full_html = f"""<!DOCTYPE html>
<html lang="zh-Hant">
<head>
<meta charset="utf-8">
<title>SSIM 2026 現場 Live Demo 逐步操作手冊 (Tutors' Demo Runbook)</title>
{css}
</head>
<body>

<!-- ==================== PAGE 1: PRE-FLIGHT CHECKLIST ==================== -->
<div class="page page-break">
  <div class="page-header">
    <span class="brand">SSIM 2026 ｜ International Conference on Social Science and Intelligent Management</span>
    <span>Dec 17–19, 2026 ｜ Chaoyang University of Technology (CYUT)</span>
  </div>

  {title_meta}

  {sec1_formatted}

  <div class="footer-note">
    <span>SSIM 2026 ｜ Live Demo Runbook (Page 1 of 3: Pre-Flight Checklist)</span>
    <span>Advisor: Prof. Yui-Liang Chen (陳育亮 博士) ｜ Shih Hsin University</span>
  </div>
</div>

<!-- ==================== PAGE 2: 3-MINUTE ACTION RUNBOOK ==================== -->
<div class="page page-break">
  <div class="page-header">
    <span class="brand">SSIM 2026 ｜ Live Stage Action Runbook (3-Minute Demonstration)</span>
    <span>Papers 27 & 28 ｜ Full-Stack Vibe Coding Pedagogy & Monorepo HIL Architecture</span>
  </div>

  {sec2_content}

  <div class="footer-note">
    <span>SSIM 2026 ｜ Live Demo Runbook (Page 2 of 3: Step-by-Step Timing Runbook)</span>
    <span>Presenter: Rover Chen ｜ Tutors: Rui-Yu Lin, Yu-Ting Chen ｜ Advisor: 陳育亮 博士</span>
  </div>
</div>

<!-- ==================== PAGE 3: EMERGENCY CONTINGENCY SOP & TIPS ==================== -->
<div class="page">
  <div class="page-header">
    <span class="brand">SSIM 2026 ｜ Contingency SOP & Tutors Pro-Tips</span>
    <span>Department of Information Management, Shih Hsin University</span>
  </div>

  {sec3_content}

  {sec4_cards}

  <div class="footer-note">
    <span>SSIM 2026 ｜ Live Demo Runbook (Page 3 of 3: Contingency SOP & Team Execution)</span>
    <span>Open-Source Monorepo: https://github.com/ChenYuiLiang/vibe-coding-car-monorepo</span>
  </div>
</div>

</body>
</html>
"""

    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(full_html)
    print(f"Generated HTML preview at {html_path}")

    # Compile with Chrome Headless
    chrome_bin = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    cmd = [
        chrome_bin,
        '--headless',
        '--disable-gpu',
        '--no-pdf-header-footer',
        f'--print-to-pdf={pdf_path}',
        html_path
    ]
    print(f"Running Chrome headless to compile {pdf_path}...")
    subprocess.run(cmd, check=True)

    size = os.path.getsize(pdf_path)
    reader = pypdf.PdfReader(pdf_path)
    page_count = len(reader.pages)
    print(f"Successfully generated PDF: {pdf_path}")
    print(f"Exact Page Count: {page_count} pages, Size: {size / 1024:.1f} KB")

    # Copy to brain and monorepo
    shutil.copy2(pdf_path, brain_pdf)
    shutil.copy2(pdf_path, monorepo_pdf)
    print(f"Copied to brain: {brain_pdf}")
    print(f"Copied to monorepo: {monorepo_pdf}")

if __name__ == '__main__':
    main()
