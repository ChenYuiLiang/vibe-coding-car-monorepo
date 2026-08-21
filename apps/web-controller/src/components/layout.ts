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
      class="flex h-16 w-16 min-h-[48px] min-w-[48px] touch-manipulation select-none items-center justify-center rounded-xl border border-white/10 bg-white/5 text-lg font-black text-white shadow-lg transition active:scale-90 disabled:cursor-not-allowed disabled:opacity-30 [-webkit-touch-callout:none] [-webkit-user-select:none] ${extraClasses}"
    >
      ${button.label}
    </button>
  `;
}

export function renderDashboard(): string {
  const [forward, left, stop, right, back] = directionButtons;

  return `
    <main class="min-h-screen bg-slate-950 px-4 py-8 font-sans text-slate-50">
      <div class="mx-auto max-w-md space-y-6">
        <header class="space-y-2 text-center">
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-sky-400/80">Vibe Car</p>
          <h1 class="text-2xl font-black text-white">開啟車載遙控頁</h1>
          <p class="text-sm text-slate-400">
            日常遙控請用車上的網頁（例如 <code class="text-emerald-300">http://192.168.1.178</code>）。
            本頁只負責幫你找到車並跳轉。
          </p>
        </header>

        <section class="space-y-4 rounded-2xl border border-white/10 bg-slate-900/80 p-5">
          <div class="flex items-center justify-between">
            <span class="text-sm font-semibold text-slate-200">車 IP</span>
            <div class="flex items-center gap-2">
              <span id="statusDot" class="h-2.5 w-2.5 rounded-full bg-rose-500"></span>
              <span id="statusText" class="text-xs text-slate-400">尚未偵測</span>
            </div>
          </div>

          <label class="block">
            <span class="mb-1 block text-xs text-slate-400">ESP32 位址（STA 為 DHCP，每人／每台路由器不同）</span>
            <input
              id="espIpAddress"
              value="192.168.4.1"
              placeholder="192.168.4.1 或 STA IP 或 esp32-car.local"
              class="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-3 font-mono text-sm text-emerald-300 outline-none focus:border-emerald-400"
            />
          </label>

          <p class="text-xs leading-relaxed text-slate-500">
            SoftAP：固定 <code class="text-slate-300">192.168.4.1</code>。
            STA：由你家 Wi‑Fi 分配 IP——可按「自動尋找」，或試 <code class="text-slate-300">esp32-car.local</code>。
          </p>

          <div class="grid gap-2">
            <button
              id="btnOpenCarPage"
              type="button"
              class="w-full rounded-xl bg-emerald-500 px-4 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-emerald-400 active:scale-[0.98]"
            >
              開啟車載遙控頁
            </button>
            <button
              id="btnFindCar"
              type="button"
              class="w-full rounded-xl border border-sky-500/40 bg-sky-500/10 px-4 py-3 text-sm font-semibold text-sky-200 transition hover:bg-sky-500/20"
            >
              自動尋找車輛 IP
            </button>
            <button
              id="btnWifiConnect"
              type="button"
              class="w-full rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-500/20"
            >
              偵測此位址 /api/status
            </button>
          </div>
        </section>

        <details class="rounded-2xl border border-white/10 bg-slate-900/50 p-4">
          <summary class="cursor-pointer select-none text-sm font-semibold text-slate-300">
            進階：BLE／本機遙控盤／OTA（開發用）
          </summary>

          <div class="mt-4 space-y-6">
            <div class="space-y-3">
              <div class="grid grid-cols-2 gap-2 rounded-xl bg-slate-950 p-1 text-xs font-semibold">
                <button id="tabModeBle" type="button" class="rounded-lg bg-sky-500 py-2 text-white shadow">
                  藍牙 (Web BLE)
                </button>
                <button id="tabModeWifi" type="button" class="rounded-lg py-2 text-slate-400 hover:text-white">
                  WiFi 控制模式
                </button>
              </div>

              <div id="bleConfigPanel" class="space-y-3">
                <label class="block">
                  <span class="mb-1 block text-xs text-slate-400">BLE 服務 UUID</span>
                  <input id="uuidService" value="4fafc201-1fb5-459e-8fcc-c5c9c331914b" class="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 font-mono text-xs text-sky-200 outline-none focus:border-sky-400" />
                </label>
                <label class="block">
                  <span class="mb-1 block text-xs text-slate-400">BLE 特徵 UUID</span>
                  <input id="uuidChar" value="beb5483e-36e1-4688-b7f5-ea07361b26a8" class="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 font-mono text-xs text-sky-200 outline-none focus:border-sky-400" />
                </label>
                <label class="flex cursor-pointer items-center gap-2">
                  <input id="chkScanAll" type="checkbox" checked class="h-4 w-4 rounded border-white/20 bg-slate-950 text-sky-500" />
                  <span class="text-xs text-slate-300">廣域搜尋藍牙裝置</span>
                </label>
                <button id="btnConnect" type="button" class="w-full rounded-xl bg-sky-500 px-4 py-3 text-sm font-bold text-white">
                  藍牙連線
                </button>
              </div>

              <div id="wifiConfigPanel" class="hidden space-y-2 text-xs text-slate-400">
                <p>WiFi 控制模式會用上方 IP 呼叫 <code>/api/drive</code>。日常請優先用車載頁。</p>
                <span id="watchdogBadge" class="inline-block rounded bg-emerald-500/20 px-2 py-0.5 font-mono text-[10px] text-emerald-400">Watchdog 500ms</span>
              </div>

              <button id="btnDisconnect" type="button" class="hidden w-full rounded-xl border border-rose-500/50 bg-rose-500/10 px-4 py-3 text-sm font-bold text-rose-300">
                斷開連線
              </button>
            </div>

            <section
              id="drivePad"
              tabindex="0"
              class="flex flex-col items-center gap-3 rounded-xl border border-white/10 bg-slate-950/80 p-4 outline-none focus:border-sky-400/60"
            >
              <h2 class="w-full text-center text-sm font-bold text-slate-200">本機遙控盤（進階）</h2>
              <div>${directionButton(forward, 'hover:border-sky-400 hover:bg-sky-500/20')}</div>
              <div class="flex gap-3">
                ${directionButton(left, 'hover:border-sky-400 hover:bg-sky-500/20')}
                ${directionButton(stop, 'border-rose-500/80 bg-rose-500/20 text-rose-300 hover:bg-rose-600 hover:text-white')}
                ${directionButton(right, 'hover:border-sky-400 hover:bg-sky-500/20')}
              </div>
              <div>${directionButton(back, 'hover:border-sky-400 hover:bg-sky-500/20')}</div>
            </section>

            <section class="space-y-3 rounded-xl border border-amber-500/30 bg-slate-950/80 p-4">
              <h2 class="text-sm font-bold text-amber-300">OTA（進階）</h2>
              <input id="firmwareFileInput" type="file" accept=".bin" class="w-full text-xs text-slate-300 file:mr-3 file:rounded-lg file:border-0 file:bg-sky-500/20 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-sky-300" />
              <div id="otaInspectorCard" class="space-y-1 rounded-lg border border-white/10 p-3 font-mono text-xs">
                <div class="flex justify-between text-slate-400"><span>Magic</span><span id="otaMagic" class="text-slate-200">--</span></div>
                <div class="flex justify-between text-slate-400"><span>Chip</span><span id="otaChip" class="text-slate-200">--</span></div>
                <div class="flex justify-between text-slate-400"><span>Size</span><span id="otaSize" class="text-slate-200">--</span></div>
                <div class="flex justify-between border-t border-white/10 pt-1 text-slate-400"><span>Rule</span><span id="otaRuleStatus" class="text-amber-400">尚未載入</span></div>
              </div>
              <div class="hidden" id="otaProgressContainer">
                <div class="mb-1 flex justify-between font-mono text-[11px] text-slate-400">
                  <span>OTA</span><span id="otaProgressPercent">0%</span>
                </div>
                <div class="h-2 w-full overflow-hidden rounded-full bg-slate-900">
                  <div id="otaProgressBar" class="h-full w-0 bg-sky-400"></div>
                </div>
              </div>
              <button id="btnStartOta" disabled type="button" class="w-full rounded-xl bg-amber-500 px-4 py-3 text-sm font-bold text-slate-950 opacity-50 disabled:cursor-not-allowed">
                開始 OTA
              </button>
            </section>

            <section class="rounded-xl border border-white/10 bg-slate-950/80 p-4">
              <h3 class="mb-2 text-sm font-bold text-slate-200">Log</h3>
              <div id="terminal" class="h-36 overflow-y-auto rounded-lg border border-white/10 bg-black/40 p-3 font-mono text-xs text-slate-300 space-y-1">
                <div class="text-sky-400">[SYSTEM] 連線入口已就緒。日常請開啟車載遙控頁。</div>
              </div>
            </section>
          </div>
        </details>
      </div>
    </main>
  `;
}
