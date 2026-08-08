# 🌐 Car Starter 入門系列：全套教材與實機測試指南 (Car Starter Curriculum Guide)

本教材指南包含 **Car Starter 入門系列**（Web 遙控介面與觸控前端開發）全 15 個單元的核心知識點、程式碼解析、以及在真實手機裝置上的實機測試流程與驗收標準。

> **命名說明：** 下方資料夾後綴 `<github-username>` 代表你的 GitHub 使用者名稱。GitHub Classroom accept 作業後，本機／遠端 repo 會變成 `單元名-你的帳號`（每人不同），不是固定字串。

---

## 📚 課程目錄與單元架構

```
Car Starter 入門系列 (15 個單元)
├── 1. start-01-master-web-app (Web App 基礎與自適應佈局)
│   ├── car-starter-html5-basics-<github-username>
│   ├── car-starter-flexbox-layout-<github-username>
│   └── car-starter-ui-ux-standards-<github-username>
├── 2. start-02-master-web-ble (Web Bluetooth 藍牙通訊)
│   ├── car-starter-ble-async-<github-username>
│   ├── car-starter-ble-security-<github-username>
│   └── car-starter-typed-arrays-<github-username>
├── 3. start-03-master-remote-control (遙控面板與資料傳輸)
│   ├── car-starter-control-panel-<github-username>
│   ├── car-starter-data-json-<github-username>
│   └── car-starter-flow-logic-<github-username>
├── 4. start-04-master-touch-events (行動端觸控與手勢控制)
│   ├── car-starter-touch-basics-<github-username>
│   ├── car-starter-touch-vs-mouse-<github-username>
│   ├── car-starter-prevent-default-<github-username>
│   └── car-starter-long-press-<github-username>
└── 5. start-05-master-joystick-lab (Canvas 虛擬搖桿實驗室)
    ├── car-starter-canvas-joystick-<github-username>
    └── car-starter-joystick-math-<github-username>
```

---

## 🛠️ 主題一：Web App 基礎與自適應佈局 (start-01)

### 1-1 HTML5 語義化標籤與滿版容器 (`car-starter-html5-basics-<github-username>`)
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

### 1-2 CSS Flexbox 遙控器排版 (`car-starter-flexbox-layout-<github-username>`)
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

### 1-3 UI/UX 行動端設計規範 (`car-starter-ui-ux-standards-<github-username>`)
- **核心觀念**：觸控按鈕尺寸 $\ge 48 \times 48\text{px}$，使用 `touch-action: manipulation` 與 `user-select: none` 消除預設縮放與文字選取。

---

## 📡 主題二：Web Bluetooth 藍牙通訊 (start-02)

### 2-1 Web Bluetooth API 異步連線 (`car-starter-ble-async-<github-username>`)
- **核心觀念**：使用 `navigator.bluetooth.requestDevice` 搜尋 ESP32 GATT 服務，建立 `gatt.connect()` 非同步連線。
- **關鍵程式碼**：
  ```javascript
  async function connectBLE() {
    const device = await navigator.bluetooth.requestDevice({
      filters: [{ namePrefix: 'ESP32' }],
      optionalServices: ['4fafc201-1fb5-459e-8fcc-c5c9c331914b']
    });
    const server = await device.gatt.connect();
    console.log('BLE Connected to ESP32');
  }
  ```

### 2-2 BLE 配對與安全機制 (`car-starter-ble-security-<github-username>`)
- **核心觀念**：處理藍牙連線斷開 `gattserverdisconnected` 事件，實作自動重連機制。

### 2-3 TypedArrays 二進位指令封包 (`car-starter-typed-arrays-<github-username>`)
- **核心觀念**：使用 `Uint8Array` 封包代替高延遲 JSON，提升低功耗藍牙 (BLE) 數據寫入效率。
  ```javascript
  // 封包格式: [Header(0xFF), SpeedL, SpeedR, Checksum]
  const packet = new Uint8Array([0xFF, 120, 150, (120 + 150) & 0xFF]);
  await characteristic.writeValue(packet);
  ```

---

## 🕹️ 主題三：遙控面板與資料傳輸 (start-03)

### 3-1 遙控控制台 UI (`car-starter-control-panel-<github-username>`)
- 整合表單元件 `<input type="range">` 設定速度，`<progress>` 顯示實時輸出，`<ul>` 輸出系統日誌。

### 3-2 JSON 控制指令序列化 (`car-starter-data-json-<github-username>`)
- 使用 `JSON.stringify({ cmd: 'drive', v: 80, w: 30 })` 封裝遙控傳送指令。

### 3-3 控制流程與狀態維護 (`car-starter-flow-logic-<github-username>`)
- 實作防抖 (Debounce) 與節流 (Throttle) 防止 Web 端在高頻拖拉時引發請求阻塞。

---

## 📱 主題四：行動端觸控與手勢控制 (start-04)

### 4-1 Touch Events 處理 (`car-starter-touch-basics-<github-username>`)
- 監聽 `touchstart` / `touchmove` / `touchend` 獲取 `e.touches[0].clientX/clientY`。

### 4-2 Touch vs Mouse 雙相相容 (`car-starter-touch-vs-mouse-<github-username>`)
- 封裝通用 pointer 事件，確保在電腦瀏覽器與手機觸控板均可順暢操作。

### 4-3 防止預設縮放與手勢 (`car-starter-prevent-default-<github-username>`)
- 在觸控區域調用 `e.preventDefault()` 徹底關閉雙擊放大與 Safari 拉動下拉刷新手勢。

### 4-4 長按與手勢發送 (`car-starter-long-press-<github-username>`)
- 使用 `setInterval` 在按鈕按住期間以 50ms 週期連續發送運動指令，放開手時發送停止指令。

---

## 🎨 主題五：Canvas 虛擬搖桿實驗室 (start-05)

### 5-1 Canvas 繪製虛擬搖桿 (`car-starter-canvas-joystick-<github-username>`)
- 利用 2D Canvas Context 繪製搖桿外圈底盤與內圈滑塊。

### 5-2 搖桿極座標與向量計算 (`car-starter-joystick-math-<github-username>`)
- 計算觸控點與中心點距離 $r = \sqrt{\Delta x^2 + \Delta y^2}$，夾角 $\theta = \operatorname{atan2}(\Delta y, \Delta x)$，轉換為左右輪速度輸出。

---

## 📱 手機實機測試與驗收 SOP

1. **架設 Live Server 本機網路服務**：
   - 在 VS Code 開啟對應作業資料夾，點擊 **Go Live** 啟動服務（Port 5500）。
   - 查詢電腦區域網路 IP（例如 `192.168.1.100`）。
2. **手機連線實測**：
   - 手機連接至同一 Wi-Fi，瀏覽器造訪 `http://192.168.1.100:5500`。
   - 在手機上測試直向/橫向旋轉，並操作按鈕與搖桿。
3. **完成實測報告**：
   - 將手機實機截圖存至 `assets/mobile-preview.png`。
   - 填寫 `submission.md` 並完成 Git Commit。
