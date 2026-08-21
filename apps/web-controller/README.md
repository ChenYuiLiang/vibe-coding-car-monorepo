# Web Controller（連線入口）

給 clone monorepo 的成員：這套前端**預設是「找車 → 開啟車載遙控頁」**，不是日常主遙控介面。

日常控車請用韌體提供的頁面：`http://<車IP>/`。

## 啟動

在 monorepo 根目錄：

```bash
npm install
npm run dev
```

- 本機：終端顯示的 `Local` 網址（常為 `http://127.0.0.1:5173/`）
- 手機：與電腦同一 Wi‑Fi，開 `Network` 網址（例如 `http://192.168.x.x:5173/`）
- 埠被佔用時 Vite 會換號，**以終端輸出為準**

## SoftAP vs STA（IP 為什麼會變）

| 模式 | 手機／電腦要連哪個 Wi‑Fi | 車的網址 |
|------|-------------------------|----------|
| SoftAP | `ESP32-Car-AP` / 密碼 `vibe123456` | 固定 **`http://192.168.4.1`** |
| STA | 與車相同的家用／教室 SSID | **DHCP 分配，不固定** |

STA 連成功後 SoftAP 會關閉（設計如此），所以掃不到 `ESP32-Car-AP` 不代表車壞了。

## 建議操作順序

1. 確認車已供電，韌體為課程版（可開 HTTP）。
2. 手機與車同一網路（SoftAP 或同一 STA SSID）。
3. 開啟本連線入口頁。
4. 按 **「自動尋找車輛 IP」**（或手動填 SoftAP / STA IP / `esp32-car.local`）。
5. 按 **「開啟車載遙控頁」** → 進入 `http://<車IP>/` 操作方向鍵。
6. BLE／本機遙控盤／OTA：收在頁面 **「進階」**，開發時再用。

成功連線後會把位址記在瀏覽器 `localStorage`，下次開啟會還原。

## 手動查 STA IP（自動尋找失敗時）

1. 試 `http://esp32-car.local`（部分系統不可用）
2. 路由器管理頁 → 已連線裝置
3. 暫連 SoftAP → 開 `http://192.168.4.1` 看狀態／重新配網

## 和 Classroom S01～S15 的關係

- Classroom 各單元是**獨立作業 repo**，練單一前端觀念。
- 產品整合：把能力補進 **車載網頁**（`firmware/.../main.cpp`）或本入口的進階功能。
- 詳細聯調見 [`../../curriculum/Integration-Lab.md`](../../curriculum/Integration-Lab.md)。

## 相關檔案

| 檔案 | 用途 |
|------|------|
| `src/components/layout.ts` | 連線入口 UI |
| `src/main.ts` | 自動尋車、跳轉、進階 BLE／WiFi／OTA |
| `src/api/vehicleGraphql.ts` | Web BLE 與課程 UUID／封包 |
| `../../firmware/esp32c3-vehicle/src/main.cpp` | 車載 HTML + `/api/*` |
