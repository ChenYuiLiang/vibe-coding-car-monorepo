# SSIM 2026 · Springer SIST 全文合規檢查（篇 04／05）

> 對照：[Springer CS Proceedings Guidelines](https://www.springer.com/gp/computer-science/lncs/conference-proceedings-guidelines)  
> 本會規定（追蹤表）：**英文全文 10–12 頁**、官方 **SIST／Proceedings Word 範本**、相似度 **&lt; 20%**。  
> 截止：全文 **2026-10-15**。

---

## 1. 現況 vs 目標（2026-08-25）

| 項目 | 目標 | 現況 | 判定 |
|--|--|--|--|
| 語言 | 英文全文 | 已備 `paper1_ssim_sist_en.md`、`paper2_ssim_sist_en.md`（≈5.5–6k tokens，估 11 頁級） | **底稿達標**；仍須貼 Word 範本後以 PDF 頁數確認 |
| 篇幅 | 10–12 頁（範本排版後） | 英文底稿已擴寫；中文 md 僅工作稿 | **待 Word 量頁** |
| 範本 | Springer Proceedings Word（SIST 用同一族） | 尚未進 `splnproc*.docm` | **未達**（人工貼範本） |
| 產品敘事 | 車載 Wi‑Fi 主線／BLE Lab | 中英稿皆已對齊 | **OK** |
| 相似度 | &lt;20%（Turnitin／iThenticate） | 未測 | **待測** |

英文投稿底稿（請貼進 Word 範本後量頁數）：

- [paper1_ssim_sist_en.md](./paper1_ssim_sist_en.md) → 篇 **05**（CMT 19）  
- [paper2_ssim_sist_en.md](./paper2_ssim_sist_en.md) → 篇 **04**（CMT 18）

中文工作稿仍保留：`paper1_vibe_coding_pedagogy.md`、`paper2_fullstack_iot_vibe_coding.md`。

---

## 2. 格式 SOP（務必照做）

1. 下載 **Microsoft Word Proceedings Template**（ZIP）自 Springer 上述 guidelines 頁；SIST 卷亦用此 Proceedings 範本族（非期刊雙欄）。  
2. 開啟 `splnproc*.docm`（Mac 用 `_mac` 版），用範本 Ribbon 套用 Title／Author／Abstract／Heading 1–3／Figure／Table／Reference。  
3. 將對應 `*_ssim_sist_en.md` **分段貼上後改套樣式**（勿保留 Markdown 標題符號）。  
4. **不要**手動縮行距、改字級、塞邊界來「擠進 12 頁」——Springer 會重排，頁數會回彈。  
5. 圖：置中、有 caption（Fig. 1 …）；表：Table 1 …；引用用編號制 `[1]`。  
6. 產出 PDF 後數頁：目標 **10–12**。少於 10 → 加一節案例／失敗模式／圖；超過 12 → 縮文獻回顧與附錄式列表。  
7. Camera-ready 另交：可編輯 Word／LaTeX + PDF + License-to-Publish。

官方作者說明 PDF 要點（與會方 10–12 頁並用）：

- 結構：Abstract → Keywords → 1 Introduction → … → References  
- 短於約 4 頁可能被移到 back matter（本會要求 10–12，遠高於此）  
- 勿自編頁碼／running head  

---

## 3. 相似度 &lt;20% 實務

| 做 | 不做 |
|--|--|
| 文獻用**改寫＋引用**，長引號少於 1–2 句 | 整段貼 Karpathy／部落格／自家 README |
| Method／Findings 用課程專屬術語（PACE、HIL、車載頁、SoftAP↔STA） | 複製 Integration-Lab／Playbook 大段原文 |
| 圖表自製（閉環圖、產品地圖表） | 從他文截圖無出處 |
| 兩篇之間：**方法重疊處改寫**，案例焦點分開（05＝Classroom／PACE；04＝Monorepo／HIL） | 兩篇摘要／結論幾乎同句 |

上傳前：Turnitin 或 iThenticate；排除參考文獻後仍看總相似；單一來源建議 &lt;5–8%。

---

## 4. 兩篇分工（降重複）

| 篇 | 核心貢獻（勿寫成同一篇） |
|--|--|
| **05** Pedagogy | Vibe Classroom、PACE、Tutor、K-9、沙盒 vs 產品路徑的**教學設計** |
| **04** Full-stack IoT | Monorepo、共享協定、OTA／USB、HIL 證據、**實作—測試閉環** |

共用一句產品地圖即可，細節只在一篇展開。

---

## 5. 完成勾選（全文前）

- [ ] 英文稿貼入 Word 範本  
- [ ] PDF 頁數 10–12（篇04、篇05各一）  
- [ ] 圖至少 1–2（閉環／PACE 或產品地圖）  
- [ ] 參考文獻格式一致（編號）  
- [ ] 相似度報告 &lt;20%  
- [ ] 作者／單位／email 與 CMT 一致  
- [ ] Google Doc 與本機英文稿同步  

**負責人提醒（追蹤表）**：全文上傳 **陳育冠**；摘要已送者不必為敘事微調重送摘要，以全文為準。
