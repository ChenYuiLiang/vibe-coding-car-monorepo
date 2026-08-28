# 🌐 Car Starter 入門系列：全套教材與實機測試指南 (Car Starter Curriculum Guide)

本教材指南包含 **Car Starter 入門系列**（Web 遙控介面與觸控前端開發）全 15 個單元的核心知識點、程式碼解析、以及在真實手機裝置上的實機測試流程與驗收標準。

> **命名說明：** 資料夾後綴 `<github-username>` 為 GitHub Classroom accept 後的帳號。  
> **編號說明：** **S01–S15 依修課順序編排**（產品主線 → 選用 Lab）。repo slug 不變。舊主題編號對照見 [STARTER-NUMBERING.md](../STARTER-NUMBERING.md)。

### 產品地圖（先讀這段）

| 層級 | 是什麼 | 日常怎麼用 |
|---|---|---|
| **Classroom 作業** | 觀念沙盒（本機 `http.server` 驗收） | 完成 checklist／截圖即可 |
| **車載遙控頁** | 產品遙控（車內嵌 HTML） | 手機開 STA／AP IP，D-pad + `fetch('/api/drive?v=&w=')` |
| **BLE** | 第二通訊通道 | 選用（**S11–S13**）；**不是**預設開車方式 |

### 建議修課順序＝正式編號

| 階段 | 新碼 | 對應產品 |
|---|---|---|
| A 殼 | **S01–S03** | 車頁 UI／觸控尺寸／HUD 精神 |
| B 手感 | **S04–S07** | 車頁 touch／preventDefault／按住送停 |
| C 狀態 | **S08–S09** | ENGINE、面板狀態、指令流／failsafe |
| D 對照 | **S10** | JSON 封包對照（車頁是 `?v=&w=`） |
| E BLE Lab | **S11–S13** | Web Bluetooth／Typed Arrays |
| F 搖桿 Lab | **S14–S15** | Canvas 搖桿（車頁仍是 D-pad） |

聯調總覽見 [Integration-Lab.md](../Integration-Lab.md)。

---

## 📚 課程目錄（依修課序）

```
Car Starter（15）— 編號＝修課序
├── A 殼
│   ├── S01 car-starter-html5-basics-<github-username>
│   ├── S02 car-starter-flexbox-layout-<github-username>
│   └── S03 car-starter-ui-ux-standards-<github-username>
├── B 手感
│   ├── S04 car-starter-touch-basics-<github-username>          ← 舊 S10
│   ├── S05 car-starter-touch-vs-mouse-<github-username>        ← 舊 S11
│   ├── S06 car-starter-prevent-default-<github-username>       ← 舊 S12
│   └── S07 car-starter-long-press-<github-username>            ← 舊 S13
├── C 狀態
│   ├── S08 car-starter-control-panel-<github-username>         ← 舊 S07
│   └── S09 car-starter-flow-logic-<github-username>
├── D 對照
│   └── S10 car-starter-data-json-<github-username>             ← 舊 S08
├── E BLE Lab
│   ├── S11 car-starter-ble-async-<github-username>             ← 舊 S04
│   ├── S12 car-starter-ble-security-<github-username>          ← 舊 S05
│   └── S13 car-starter-typed-arrays-<github-username>          ← 舊 S06
└── F 搖桿 Lab
    ├── S14 car-starter-canvas-joystick-<github-username>
    └── S15 car-starter-joystick-math-<github-username>
```

---

## 🛠️ 階段 A：Web App 基礎與自適應佈局（S01–S03）

### S01 HTML5 語義化標籤與滿版容器 (`car-starter-html5-basics-<github-username>`)
- **核心觀念**：使用 `<main>`, `<section>`, `<header>` 規劃控制台；套用 `100vw / 100vh` 與 `object-fit: cover` 建立滿版自適應 FPV 背景。
- **關鍵程式碼**：
  ```css
  .fpv-container {
    width: 100vw;
    height: 100vh;
    object-fit: cover;
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
  }
  ```

### S02 CSS Flexbox 遙控器排版 (`car-starter-flexbox-layout-<github-username>`)
- **核心觀念**：利用 `display: flex` 與幾何中心對齊，構建上/中/下十字方向鍵，拖動視窗時無動態破版。
- **關鍵程式碼**：
  ```css
  .d-pad {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }
  .d-pad-row {
    display: flex;
    justify-content: center;
    gap: 24px;
  }
  ```

### S03 UI/UX 行動端設計規範 (`car-starter-ui-ux-standards-<github-username>`)
- **核心觀念**：觸控按鈕尺寸 $\ge 48 \times 48\text{px}$，使用 `touch-action: manipulation` 與 `user-select: none` 消除預設縮放與文字選取。

---

## 📱 階段 B：行動端觸控與手勢控制（S04–S07）

### S04 Touch Events 處理 (`car-starter-touch-basics-<github-username>`)（舊 S10）
- 監聽 `touchstart` / `touchmove` / `touchend`；Ghost Click／多指／滑出停機實驗。

### S05 Touch vs Mouse 雙相相容 (`car-starter-touch-vs-mouse-<github-username>`)（舊 S11）
- 同時支援 Touch／Mouse 且單次觸發；防抖滑桿實驗（車頁用速度檔按鈕即可）。

### S06 防止預設縮放與手勢 (`car-starter-prevent-default-<github-username>`)（舊 S12）
- `preventDefault`／viewport／`touch-action` 鎖成接近原生 App。

### S07 長按與指令連發 (`car-starter-long-press-<github-username>`)（舊 S13）
- `setInterval` 按住連發、放開停止；雙重 failsafe 實驗（車頁已有連發＋失焦急停）。

---

## 🕹️ 階段 C：遙控面板與流程（S08–S09）

### S08 遙控控制台 UI (`car-starter-control-panel-<github-username>`)（舊 S07）
- ENGINE／面板狀態、速度與日誌等控制台元件。

### S09 控制流程與失效安全 (`car-starter-flow-logic-<github-username>`)
- 指令流、多鍵合成實驗、失焦急停；對應車頁 keepalive／failsafe。

---

## 📦 階段 D：封包設計對照（S10）

### S10 JSON 控制指令序列化 (`car-starter-data-json-<github-username>`)（舊 S08）
- 沙盒練習 `JSON.stringify`／瘦身／巢狀狀態；**車頁開車不送這串 JSON**，而是 `GET /api/drive?v=&w=`（或 `cmd=`）。

---

## 📡 階段 E：Web Bluetooth（選用 Lab，S11–S13）

> 日常開車走 **車載頁 Wi‑Fi HTTP**；完成本階段前請先能用車頁 D-pad 開車（A–C）。

### S11 Web Bluetooth API 異步連線 (`car-starter-ble-async-<github-username>`)（舊 S04）
- `navigator.bluetooth.requestDevice`、GATT 連線狀態機。

### S12 BLE 配對與安全機制 (`car-starter-ble-security-<github-username>`)（舊 S05）
- 斷線、過濾、HTTPS／相容性。

### S13 TypedArrays 二進位指令封包 (`car-starter-typed-arrays-<github-username>`)（舊 S06）
- `Uint8Array` 封包（對應 BLE 通道，非車頁 HTTP）。

---

## 🎨 階段 F：Canvas 虛擬搖桿實驗室（S14–S15）

> 現行車載遙控是 **D-pad**，沒有 Canvas 搖桿。驗收以 Classroom 沙盒為準。

### S14 Canvas 繪製虛擬搖桿 (`car-starter-canvas-joystick-<github-username>`)
- 2D Canvas、座標映射、儀表／AEB 實驗。

### S15 搖桿極座標與向量計算 (`car-starter-joystick-math-<github-username>`)
- 邊界鎖定、Power／Angle、放開回彈歸零。

---

## 📱 手機實機測試與驗收 SOP

1. **架設本機 HTTP 網路服務**：
   - 在作業資料夾執行：`python3 -m http.server 8080 --bind 0.0.0.0`。
   - 查詢電腦區域網路 IP（例如 `192.168.1.100`）。
2. **手機連線實測**：
   - 手機連接至同一 Wi-Fi，瀏覽器造訪 `http://192.168.1.100:8080`。
   - 在手機上測試直向/橫向旋轉，並操作按鈕與搖桿。
3. **完成實測報告**：
   - 將手機實機截圖存至 `assets/mobile-preview.png`。
   - 填寫 `submission.md` 並完成 Git Commit。
4. **產品聯調**：SoftAP `http://192.168.4.1` 或 STA `http://<車IP>/` → ENGINE → D-pad（不必先完成 E／F）。
