# 116 年度教育部教學實踐研究計畫 (Teaching Practice Research Plan)

本目錄存放 **116 年度教育部補助大專校院教學實踐研究計畫** 之申請計畫書與相關官方規範文件。

---

## 📌 計畫基本資訊

* **計畫名稱**：  
  * **中文**：導入 Vibe Coding 於 Physical AI 實作課程：以專案導向提升學生系統整合力與問題解決效能之教學實踐研究
  * **英文**：Integrating Vibe Coding into Physical AI Practice: A Project-Based Teaching Practice Research on Enhancing Students' Systems Integration and Problem-Solving Competencies
* **申請機構 / 系所**：世新大學 資訊管理學系
* **計畫主持人**：陳育亮 教授
* **申請學門**：工程學門（一般研究計畫）
* **執行期程**：116 年 8 月 1 日 至 117 年 7 月 31 日（共 1 年）
* **搭配課程**：《實體人工智慧導論與實作》（Introduction to Physical AI and Implementation，大二專業選修，2 學分，18 週共 36 小時）

---

## 📂 檔案清單

1. **[116年度教育部教學實踐研究計畫書_初稿.md](116年度教育部教學實踐研究計畫書_初稿.md)**：  
   完整計畫書 Markdown 格式（含計畫基本資料、主持人自評、問題意識、文獻探討、18 週完整課程進度表、Rubric 評量規準、研究設計、知情同意書與量表範本）。
2. **`116年度教育部教學實踐研究計畫書_初稿.docx`**：  
   由 Markdown 編譯產出之 Word 檔案，便於排版及報部送審。
3. **`(2)_附件1_116年度徵件說明與計畫書格式.doc`**：  
   教育部 116 年度教學實踐研究計畫官方徵件作業要點與原始計畫書空白格式。

---

## 🔗 與本專案（Vibe Coding Classroom & Monorepo）之整合關聯

本教學實踐研究計畫以本倉庫之實體無人車（`vibe-coding-car-monorepo`）為主要教學載體，對應關係如下：

```text
教學實踐計畫 18 週學習進度
├── [W1-W3] 準備期：開發環境、微控制器架構與感測驅動
│     └── 對應：01-unit-developer-identity, basic-01 ~ basic-03
├── [W4-W7] 模組一：互動與控制 (里程碑一：手機遙控自走車競速賽)
│     └── 對應：Car Starter (15 單元) + basic-04 (PWM/馬達) + packages/protocol (BLE)
├── [W8-W12] 模組二：邊緣視覺與自主 (里程碑二：視覺自主循線避障)
│     └── 對應：Car Basic (30 單元) + ESP32-CAM 串流與 FSM 狀態機
└── [W13-W18] 模組三：系統整合與專案展演 (AMR 期末競技展)
      └── 對應：Integration Lab 全系統虛實整合 + Hardware-in-the-Loop (HIL) 實機驗收
```

### 📚 學術研究鏈結（SSIM 2026 研討會論文）：
* **Paper 04**：*Full-Stack Vibe Coding Pedagogy for IoT Hardware-Software Integration: A Monorepo Architecture and Hardware-in-the-Loop Verification Study*（CMT ID: 18）
* **Paper 05**：*Vibe Coding Pedagogy: A Teaching Framework Design Study Centered on Vibe Classroom*（CMT ID: 19）
* 論文與進度追蹤詳見 [`docs/research/SSIM2026_Paper_Submission_Tracker.md`](../research/SSIM2026_Paper_Submission_Tracker.md)。
