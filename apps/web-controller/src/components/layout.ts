export interface ControlButton {
  id: string;
  label: string;
  title: string;
}

const directionButtons: ControlButton[] = [
  { id: 'btnW', label: '▲', title: '前進 (W)' },
  { id: 'btnA', label: '◄', title: '左轉 (A)' },
  { id: 'btnSpace', label: 'STOP', title: '緊急煞車 (空白鍵)' },
  { id: 'btnD', label: '►', title: '右轉 (D)' },
  { id: 'btnS', label: '▼', title: '後退 (S)' }
];

function directionButton(button: ControlButton, extraClasses = ''): string {
  return `
    <button
      id="${button.id}"
      disabled
      title="${button.title}"
      class="flex h-16 w-16 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-lg font-black text-white shadow-lg transition active:scale-90 disabled:cursor-not-allowed disabled:opacity-30 ${extraClasses}"
    >
      ${button.label}
    </button>
  `;
}

export function renderDashboard(): string {
  const [forward, left, stop, right, back] = directionButtons;

  return `
    <main class="min-h-screen bg-slate-950 px-4 py-6 font-sans text-slate-50 md:px-8">
      <div class="mx-auto max-w-6xl space-y-6">
        
        <!-- Header -->
        <header class="flex flex-col items-center justify-between gap-4 rounded-2xl border border-sky-500/20 bg-slate-900/90 p-6 shadow-2xl backdrop-blur md:flex-row">
          <div>
            <div class="flex items-center gap-3">
              <span class="inline-flex h-3 w-3 animate-ping rounded-full bg-sky-400 opacity-75"></span>
              <h1 class="text-2xl font-black tracking-tight text-white md:text-3xl">ESP32-C3 手機遙控與 OTA 韌體管理艙</h1>
            </div>
            <p class="mt-1 text-xs text-sky-300/80 md:text-sm">Vibe Coding 實體車雙端整合方案 · Web BLE + WiFi Web OTA (燒錄前強制規範檢查)</p>
          </div>
          <div class="flex items-center gap-4 rounded-xl border border-white/10 bg-slate-950/80 px-4 py-2 text-xs font-mono">
            <span class="text-slate-400">Watchdog 守護:</span>
            <span id="watchdogBadge" class="rounded bg-emerald-500/20 px-2 py-0.5 font-bold text-emerald-400">500ms 安全急停啟動</span>
          </div>
        </header>

        <!-- Main Dashboard Grid -->
        <div class="grid gap-6 md:grid-cols-12">
          
          <!-- Column 1: Connection & Vehicle Status (4 cols) -->
          <section class="flex flex-col justify-between space-y-4 rounded-2xl border border-white/10 bg-slate-900/70 p-5 backdrop-blur md:col-span-4">
            <div>
              <div class="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
                <h2 class="text-base font-bold text-slate-100">連線模式與通訊設定</h2>
                <div class="flex items-center gap-2">
                  <span id="statusDot" class="h-3 w-3 rounded-full bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.9)]"></span>
                  <span id="statusText" class="text-xs font-medium text-slate-300">未連線 (Offline)</span>
                </div>
              </div>

              <!-- Connection Mode Switcher -->
              <div class="mb-4 grid grid-cols-2 gap-2 rounded-xl bg-slate-950 p-1 font-semibold text-xs">
                <button id="tabModeBle" class="rounded-lg bg-sky-500 py-2 text-white shadow transition">
                  藍牙 (Web BLE)
                </button>
                <button id="tabModeWifi" class="rounded-lg py-2 text-slate-400 hover:text-white transition">
                  📶 WiFi (HTTP 雙模)
                </button>
              </div>

              <div id="bleConfigPanel" class="space-y-3">
                <label class="block">
                  <span class="mb-1 block text-xs text-slate-400">BLE 服務 UUID (Primary Service)</span>
                  <input id="uuidService" value="4fafc201-1fb5-459e-8fcc-c5c9c331914b" class="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 font-mono text-xs text-sky-200 outline-none focus:border-sky-400" />
                </label>

                <label class="block">
                  <span class="mb-1 block text-xs text-slate-400">BLE 特徵 UUID (Characteristic)</span>
                  <input id="uuidChar" value="beb5483e-36e1-4688-b7f5-ea07361b26a8" class="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 font-mono text-xs text-sky-200 outline-none focus:border-sky-400" />
                </label>

                <label class="flex items-center gap-2 pt-1 cursor-pointer">
                  <input id="chkScanAll" type="checkbox" checked class="h-4 w-4 rounded border-white/20 bg-slate-950 text-sky-500 focus:ring-sky-400" />
                  <span class="text-xs font-medium text-slate-300">廣域搜尋所有周圍藍牙裝置</span>
                </label>
              </div>

              <div id="wifiConfigPanel" class="hidden space-y-3">
                <label class="block">
                  <span class="mb-1 block text-xs text-slate-400">ESP32 WiFi IP / AP 網址</span>
                  <input id="espIpAddress" value="192.168.4.1" class="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 font-mono text-xs text-emerald-300 outline-none focus:border-emerald-400" />
                </label>
                <div class="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-[11px] text-emerald-200 leading-relaxed">
                  💡 <strong>WiFi 提示</strong>：連接 <code>ESP32-Car-AP</code>，密碼 <code>vibe123456</code> → 開 <code>http://192.168.4.1</code> 配網／OTA。STA 連上家用 WiFi 後熱點會關閉；斷線會自動退回 AP。<br/>
                  🏭 <strong>Factory reset</strong>：長按板上 <code>BOOT</code>（開機 3 秒／運行中 5 秒）清除 WiFi。按 <code>RESET</code> 只重開、不會清設定。
                </div>
              </div>
            </div>

            <div class="mt-4 space-y-2">
              <button id="btnConnect" class="w-full rounded-xl bg-sky-500 px-4 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-sky-400 active:scale-98">
                藍牙連線至 ESP32 遙控車
              </button>
              <button id="btnWifiConnect" class="hidden w-full rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-emerald-400 active:scale-98">
                📶 WiFi 握手連線
              </button>
              <button id="btnDisconnect" class="hidden w-full rounded-xl border border-rose-500/50 bg-rose-500/10 px-4 py-3 text-sm font-bold text-rose-300 transition hover:bg-rose-500 hover:text-white">
                斷開連線
              </button>
            </div>
          </section>

          <!-- Column 2: Mobile Touch Steering D-Pad (4 cols) -->
          <section class="flex flex-col items-center justify-between rounded-2xl border border-white/10 bg-slate-900/70 p-5 backdrop-blur md:col-span-4">
            <h2 class="w-full border-b border-white/10 pb-3 text-center text-base font-bold text-slate-100">手機觸控遙控盤</h2>
            
            <div class="my-6 flex flex-col items-center gap-3">
              <div>${directionButton(forward, 'hover:border-sky-400 hover:bg-sky-500/20')}</div>
              <div class="flex gap-3">
                ${directionButton(left, 'hover:border-sky-400 hover:bg-sky-500/20')}
                ${directionButton(stop, 'border-rose-500/80 bg-rose-500/20 text-rose-300 hover:bg-rose-600 hover:text-white')}
                ${directionButton(right, 'hover:border-sky-400 hover:bg-sky-500/20')}
              </div>
              <div>${directionButton(back, 'hover:border-sky-400 hover:bg-sky-500/20')}</div>
            </div>

            <div class="w-full text-center text-xs text-slate-400">
              支援實體鍵盤 <kbd class="rounded bg-slate-800 px-1 py-0.5 font-mono">WASD</kbd> 操作，<kbd class="rounded bg-slate-800 px-1 py-0.5 font-mono">SPACE</kbd> 為煞車
            </div>
          </section>

          <!-- Column 3: Pre-flash OTA Firmware Inspector (4 cols) -->
          <section class="flex flex-col justify-between space-y-4 rounded-2xl border border-amber-500/30 bg-slate-900/70 p-5 backdrop-blur md:col-span-4">
            <div>
              <div class="mb-3 flex items-center justify-between border-b border-white/10 pb-3">
                <h2 class="text-base font-bold text-amber-300">OTA 燒錄前規範檢查</h2>
                <span class="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300">Pre-Flash Rule</span>
              </div>

              <!-- Firmware File Selector -->
              <div class="space-y-3">
                <div>
                  <label class="mb-1 block text-xs text-slate-400">選擇韌體檔案 (.bin)</label>
                  <input id="firmwareFileInput" type="file" accept=".bin" class="w-full text-xs text-slate-300 file:mr-3 file:rounded-lg file:border-0 file:bg-sky-500/20 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-sky-300 hover:file:bg-sky-500/30" />
                </div>

                <!-- Inspector Card -->
                <div id="otaInspectorCard" class="rounded-xl border border-white/10 bg-slate-950 p-3 text-xs space-y-1.5 font-mono">
                  <div class="flex justify-between text-slate-400">
                    <span>魔術字節 (Magic Byte):</span>
                    <span id="otaMagic" class="font-bold text-slate-200">--</span>
                  </div>
                  <div class="flex justify-between text-slate-400">
                    <span>目標晶片 (Target Chip):</span>
                    <span id="otaChip" class="font-bold text-slate-200">--</span>
                  </div>
                  <div class="flex justify-between text-slate-400">
                    <span>檔案尺寸 (File Size):</span>
                    <span id="otaSize" class="font-bold text-slate-200">--</span>
                  </div>
                  <div class="flex justify-between text-slate-400 border-t border-white/10 pt-1.5">
                    <span>規範檢查結果:</span>
                    <span id="otaRuleStatus" class="font-bold text-amber-400">尚未載入檔案</span>
                  </div>
                </div>

                <!-- Progress Bar -->
                <div class="hidden" id="otaProgressContainer">
                  <div class="mb-1 flex justify-between text-[11px] font-mono text-slate-400">
                    <span>OTA 傳輸進度:</span>
                    <span id="otaProgressPercent">0%</span>
                  </div>
                  <div class="h-2 w-full overflow-hidden rounded-full bg-slate-950">
                    <div id="otaProgressBar" class="h-full w-0 bg-sky-400 transition-all duration-200"></div>
                  </div>
                </div>
              </div>
            </div>

            <button id="btnStartOta" disabled class="w-full rounded-xl bg-amber-500 px-4 py-3 text-sm font-bold text-slate-950 opacity-50 shadow-lg transition hover:bg-amber-400 disabled:cursor-not-allowed">
              確認規範並開始 OTA 燒錄
            </button>
          </section>

          <!-- Row 3: Terminal & Serial Log (12 cols) -->
          <section class="rounded-2xl border border-white/10 bg-slate-900/80 p-5 md:col-span-12">
            <div class="mb-3 flex items-center justify-between">
              <h3 class="text-sm font-bold text-slate-200">即時車載 Telemetry & OTA 監控終端</h3>
              <span class="font-mono text-[10px] text-slate-500">Hardware-in-the-Loop Log</span>
            </div>
            <div id="terminal" class="h-44 overflow-y-auto rounded-xl border border-white/10 bg-slate-950 p-4 font-mono text-xs text-slate-300 space-y-1">
              <div class="text-sky-400">[SYSTEM] 駕駛艙載入完成。ESP32 BLE 協定與 Pre-flash OTA 檢查邏輯已就緒。</div>
            </div>
          </section>

        </div>
      </div>
    </main>
  `;
}

