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

    # Split using robust regex on h2 tags
    parts = re.split(r'<h2[\s\n]+[^>]*id=\"([^\"]+)\"[^>]*>', raw_html)
    title_meta = parts[0]
    
    sec1_id, sec1_raw = parts[1], parts[2]
    sec2_id, sec2_raw = parts[3], parts[4]
    sec3_id, sec3_raw = parts[5], parts[6]
    sec4_id, sec4_raw = parts[7], parts[8]

    # Clean trailing <hr /> from sections
    sec1_raw = re.sub(r'<hr\s*/?>\s*$', '', sec1_raw).strip()
    sec2_raw = re.sub(r'<hr\s*/?>\s*$', '', sec2_raw).strip()
    sec3_raw = re.sub(r'<hr\s*/?>\s*$', '', sec3_raw).strip()
    sec4_raw = re.sub(r'<hr\s*/?>\s*$', '', sec4_raw).strip()

    # Format Sec 1 into 2 cards
    hw_split = re.split(r'<h3[\s\n]+[^>]*id=\"[^\"]*手機[^\"]*\"[^>]*>', sec1_raw)
    sec1_heading = '<h2>🧰 一、 展前 30 分鐘整備清單 (Pre-Flight Checklist)</h2>'
    if len(hw_split) == 2:
        hw_content = hw_split[0]
        sw_content = '<h3>2. 手機 Wi-Fi 主通道、互動手機與投屏整備（負責人：林瑞昱 Rui-Yu）</h3>' + hw_split[1]
        sec1_formatted = f"""
        {sec1_heading}
        <div class="grid-2">
          <div class="checklist-card">{hw_content}</div>
          <div class="checklist-card">{sw_content}</div>
        </div>
        """
    else:
        sec1_formatted = f"{sec1_heading}\n{sec1_raw}"

    # Format Sec 2 with badges
    sec2_heading = '<h2>⏱️ 二、 現場 8 分鐘操作時序與觀眾互動表 (8-Minute Live Demo & Audience Protocol)</h2>'
    sec2_content = sec2_raw.replace(
        '<strong>05:30–07:00</strong>',
        '<span class="climax-badge">05:30–07:00</span>'
    ).replace(
        '<strong>03:00–05:30</strong>',
        '<span class="audience-badge">03:00–05:30</span>'
    ).replace(
        '階段四：【全場高潮】',
        '<span style="color:#dc2626; font-weight:800;">階段四：【全場高潮】</span>'
    ).replace(
        '階段三：【全場焦點】',
        '<span style="color:#0284c7; font-weight:800;">階段三：【全場焦點】</span>'
    )
    sec2_formatted = f"{sec2_heading}\n{sec2_content}"

    # Format Sec 3
    sec3_heading = '<h2>🚨 三、 現場突發狀況應變手冊 (Emergency Contingency SOP)</h2>'
    sec3_formatted = f"{sec3_heading}\n{sec3_raw}"

    # Format Sec 4 (4 cards)
    sec4_cards = """
    <h2>💡 四、 舞台執行加分細節 (Tutors Pro-Tips)</h2>
    <div class="grid-4">
      <div class="tip-card">
        <div class="tip-title">1. 觀眾互動熱情低門檻</div>
        <div class="tip-body">專用手機預先開好網頁並點亮 ENGINE，觀眾只需一指按壓與放開，保證 100% 成功無冷場。</div>
      </div>
      <div class="tip-card">
        <div class="tip-title">2. 倒數帶動全場氣氛</div>
        <div class="tip-body">Rover 帶動全場倒數：「Three, Two, One, Cut!」，讓評審完全沉浸在系統中斷驗證情境中。</div>
      </div>
      <div class="tip-card">
        <div class="tip-title">3. 串口螢幕調大字體</div>
        <div class="tip-body">俞廷預先將 VS Code 串口字體設為 <b>18pt 以上</b>，讓前排清晰看見 <code>[WATCHDOG STOP]</code> 紅字警告。</div>
      </div>
      <div class="tip-card">
        <div class="tip-title">4. 全隊儀態與專業默契</div>
        <div class="tip-body">全員著深色商務休閒裝；操作動作俐落、不搶話，Rover 英文解說與雙手卡點精準呼應。</div>
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
        margin: 4px 0 8px 0;
        padding: 6px 12px;
        font-size: 7.8pt;
        color: #0f172a;
      }
      blockquote p {
        margin: 1px 0;
        line-height: 1.42;
      }

      /* Headings */
      h2 {
        font-size: 10.5pt;
        color: #0f172a;
        border-left: 3.5px solid #0369a1;
        padding-left: 6px;
        margin: 6px 0 6px 0;
        font-weight: 700;
        page-break-after: avoid;
      }
      h3 {
        font-size: 8.8pt;
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
      .grid-4 {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr;
        gap: 8px;
        margin-top: 6px;
      }
      .checklist-card {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 6px;
        padding: 7px 11px;
        border-top: 3px solid #0284c7;
      }
      .tip-card {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 6px;
        padding: 6px 8px;
        border-top: 3px solid #10b981;
      }
      .tip-title {
        font-weight: 700;
        color: #065f46;
        font-size: 8.2pt;
        margin-bottom: 3px;
      }
      .tip-body {
        font-size: 7.5pt;
        color: #334155;
        line-height: 1.32;
      }

      /* Checklists */
      ul.task-list {
        list-style-type: none;
        padding-left: 0;
        margin: 2px 0;
      }
      ul.task-list > li {
        margin-bottom: 4px;
        padding-left: 18px;
        position: relative;
        font-size: 7.8pt;
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
        margin: 1px 0 2px 0;
        color: #475569;
        font-size: 7.4pt;
      }
      ul.task-list ul li {
        margin-bottom: 1px;
      }

      /* Tables */
      table {
        width: 100%;
        border-collapse: collapse;
        margin: 5px 0 6px 0;
        font-size: 7.5pt;
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
        font-size: 7.6pt;
        letter-spacing: 0.02em;
      }
      tr:nth-child(even) td {
        background-color: #f8fafc;
      }

      .climax-badge {
        display: inline-block;
        background: #dc2626;
        color: #ffffff;
        font-weight: 800;
        padding: 2px 4px;
        border-radius: 3px;
        font-size: 7.4pt;
      }
      .audience-badge {
        display: inline-block;
        background: #0284c7;
        color: #ffffff;
        font-weight: 800;
        padding: 2px 4px;
        border-radius: 3px;
        font-size: 7.4pt;
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

<!-- ==================== PAGE 2: 8-MINUTE ACTION & AUDIENCE RUNBOOK ==================== -->
<div class="page page-break">
  <div class="page-header">
    <span class="brand">SSIM 2026 ｜ Live Stage Action Runbook (8-Minute Demonstration & Audience Interaction)</span>
    <span>Papers 27 & 28 ｜ Full-Stack Vibe Coding Pedagogy & Monorepo HIL Architecture</span>
  </div>

  {sec2_formatted}

  <div class="footer-note">
    <span>SSIM 2026 ｜ Live Demo Runbook (Page 2 of 3: 8-Min Timing & Audience Protocol)</span>
    <span>Presenter: Rover Chen ｜ Tutors: Rui-Yu Lin, Yu-Ting Chen ｜ Advisor: 陳育亮 博士</span>
  </div>
</div>

<!-- ==================== PAGE 3: EMERGENCY CONTINGENCY SOP & TIPS ==================== -->
<div class="page">
  <div class="page-header">
    <span class="brand">SSIM 2026 ｜ Contingency SOP & Tutors Pro-Tips</span>
    <span>Department of Information Management, Shih Hsin University</span>
  </div>

  {sec3_formatted}

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
