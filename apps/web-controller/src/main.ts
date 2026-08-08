import './styles/input.css';
import { validateFirmwareBinary, type FirmwareValidationResult } from '@vibe-coding/protocol';
import { createVehicleGraphQLApi, graphQLOperations, type VehicleCommand } from './api/vehicleGraphql';
import { renderDashboard } from './components/layout';

interface UiElements {
  btnConnect: HTMLButtonElement;
  btnWifiConnect: HTMLButtonElement;
  btnDisconnect: HTMLButtonElement;
  statusDot: HTMLSpanElement;
  statusText: HTMLSpanElement;
  terminal: HTMLDivElement;
  uuidService: HTMLInputElement;
  uuidChar: HTMLInputElement;
  espIpAddress: HTMLInputElement;
  firmwareFileInput: HTMLInputElement;
  otaMagic: HTMLSpanElement;
  otaChip: HTMLSpanElement;
  otaSize: HTMLSpanElement;
  otaRuleStatus: HTMLSpanElement;
  otaProgressContainer: HTMLDivElement;
  otaProgressBar: HTMLDivElement;
  otaProgressPercent: HTMLSpanElement;
  btnStartOta: HTMLButtonElement;
  chkScanAll: HTMLInputElement;
  tabModeBle: HTMLButtonElement;
  tabModeWifi: HTMLButtonElement;
  bleConfigPanel: HTMLDivElement;
  wifiConfigPanel: HTMLDivElement;
  buttons: Record<'w' | 'a' | 's' | 'd' | 'space', HTMLButtonElement>;
}

type NavigatorWithBluetooth = Navigator & {
  bluetooth?: Parameters<typeof createVehicleGraphQLApi>[0]['bluetooth'];
};

const app = document.querySelector<HTMLDivElement>('#app');

if (!app) {
  throw new Error('找不到 #app 容器。');
}

app.innerHTML = renderDashboard();

function getElement<TElement extends HTMLElement>(id: string): TElement {
  const element = document.getElementById(id);
  if (!element) {
    throw new Error(`找不到 UI 元素: ${id}`);
  }
  return element as TElement;
}

const ui: UiElements = {
  btnConnect: getElement<HTMLButtonElement>('btnConnect'),
  btnWifiConnect: getElement<HTMLButtonElement>('btnWifiConnect'),
  btnDisconnect: getElement<HTMLButtonElement>('btnDisconnect'),
  statusDot: getElement<HTMLSpanElement>('statusDot'),
  statusText: getElement<HTMLSpanElement>('statusText'),
  terminal: getElement<HTMLDivElement>('terminal'),
  uuidService: getElement<HTMLInputElement>('uuidService'),
  uuidChar: getElement<HTMLInputElement>('uuidChar'),
  espIpAddress: getElement<HTMLInputElement>('espIpAddress'),
  chkScanAll: getElement<HTMLInputElement>('chkScanAll'),
  tabModeBle: getElement<HTMLButtonElement>('tabModeBle'),
  tabModeWifi: getElement<HTMLButtonElement>('tabModeWifi'),
  bleConfigPanel: getElement<HTMLDivElement>('bleConfigPanel'),
  wifiConfigPanel: getElement<HTMLDivElement>('wifiConfigPanel'),
  firmwareFileInput: getElement<HTMLInputElement>('firmwareFileInput'),
  otaMagic: getElement<HTMLSpanElement>('otaMagic'),
  otaChip: getElement<HTMLSpanElement>('otaChip'),
  otaSize: getElement<HTMLSpanElement>('otaSize'),
  otaRuleStatus: getElement<HTMLSpanElement>('otaRuleStatus'),
  otaProgressContainer: getElement<HTMLDivElement>('otaProgressContainer'),
  otaProgressBar: getElement<HTMLDivElement>('otaProgressBar'),
  otaProgressPercent: getElement<HTMLSpanElement>('otaProgressPercent'),
  btnStartOta: getElement<HTMLButtonElement>('btnStartOta'),
  buttons: {
    w: getElement<HTMLButtonElement>('btnW'),
    a: getElement<HTMLButtonElement>('btnA'),
    s: getElement<HTMLButtonElement>('btnS'),
    d: getElement<HTMLButtonElement>('btnD'),
    space: getElement<HTMLButtonElement>('btnSpace')
  }
};

let currentSelectedFirmwareBuffer: Uint8Array | null = null;
let currentValidationResult: FirmwareValidationResult | null = null;
let currentMode: 'BLE' | 'WIFI' = 'BLE';
let wifiConnected = false;

function log(message: string, error = false): void {
  const time = new Date().toLocaleTimeString('en-US', {
    hour12: false,
    fractionalSecondDigits: 3
  });
  const row = document.createElement('div');
  row.className = error ? 'text-rose-400 font-semibold' : 'text-slate-300';
  row.textContent = `[${time}] ${message}`;
  ui.terminal.appendChild(row);
  ui.terminal.scrollTop = ui.terminal.scrollHeight;
}

function updateConnectionState(connected: boolean): void {
  const isOnline = currentMode === 'BLE' ? connected : wifiConnected;
  ui.statusDot.className = isOnline
    ? 'h-3 w-3 rounded-full bg-emerald-500 shadow-[0_0_14px_rgba(16,185,129,0.9)]'
    : 'h-3 w-3 rounded-full bg-rose-500 shadow-[0_0_14px_rgba(244,63,94,0.9)]';
  
  if (currentMode === 'BLE') {
    ui.statusText.textContent = connected ? '已連線就緒 (BLE Online)' : '未連線狀態 (Offline)';
    ui.btnConnect.classList.toggle('hidden', connected);
    ui.btnWifiConnect.classList.add('hidden');
    ui.btnDisconnect.classList.toggle('hidden', !connected);
  } else {
    ui.statusText.textContent = wifiConnected ? `📶 WiFi 已連線 (${ui.espIpAddress.value})` : '未連線狀態 (WiFi Offline)';
    ui.btnConnect.classList.add('hidden');
    ui.btnWifiConnect.classList.toggle('hidden', wifiConnected);
    ui.btnDisconnect.classList.toggle('hidden', !wifiConnected);
  }

  Object.values(ui.buttons).forEach((button) => {
    button.disabled = !isOnline;
  });
}

// Mode Switcher Event Handlers
ui.tabModeBle.addEventListener('click', () => {
  currentMode = 'BLE';
  ui.tabModeBle.className = 'rounded-lg bg-sky-500 py-2 text-white shadow transition font-bold';
  ui.tabModeWifi.className = 'rounded-lg py-2 text-slate-400 hover:text-white transition';
  ui.bleConfigPanel.classList.remove('hidden');
  ui.wifiConfigPanel.classList.add('hidden');
  updateConnectionState(api.getStatus().connected);
  log('已切換至【藍牙 Web BLE】控制模式。');
});

ui.tabModeWifi.addEventListener('click', () => {
  currentMode = 'WIFI';
  ui.tabModeWifi.className = 'rounded-lg bg-emerald-500 py-2 text-white shadow transition font-bold';
  ui.tabModeBle.className = 'rounded-lg py-2 text-slate-400 hover:text-white transition';
  ui.wifiConfigPanel.classList.remove('hidden');
  ui.bleConfigPanel.classList.add('hidden');
  updateConnectionState(false);
  log('已切換至【📶 WiFi HTTP 雙模】控制模式。手機請連至 ESP32-Car-AP WiFi 基地台！');
});

const api = createVehicleGraphQLApi({
  bluetooth: (navigator as NavigatorWithBluetooth).bluetooth,
  onLog: log,
  onConnectionChange: updateConnectionState
});

async function connectVehicle(): Promise<void> {
  try {
    await api.execute({
      query: graphQLOperations.connectVehicle,
      variables: {
        serviceUuid: ui.uuidService.value,
        characteristicUuid: ui.uuidChar.value,
        scanAllDevices: ui.chkScanAll.checked
      }
    });
    log('連線成功！已成功握手 ESP32 藍牙通道， Watchdog 安全超時監控運作中。');
  } catch (error) {
    log(error instanceof Error ? error.message : String(error), true);
  }
}

async function connectWifiVehicle(): Promise<void> {
  const ip = ui.espIpAddress.value.trim();
  const url = `http://${ip}/api/status`;
  log(`[WiFi HTTP] 握手連線至 ${url}...`);

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      const data = await res.json();
      wifiConnected = true;
      updateConnectionState(false);
      log(`[WiFi Connected] 成功握手 ESP32 WiFi 節點！ Watchdog 超時: ${data.watchdogTimeout}ms`);
    } else {
      throw new Error(`HTTP 狀態碼: ${res.status}`);
    }
  } catch (err) {
    wifiConnected = false;
    updateConnectionState(false);
    log(`[WiFi HTTP Error] 無法連線至 ${url}。請確認已連 ESP32-Car-AP（密碼 vibe123456）或家用 WiFi 的裝置 IP / esp32-car.local。`, true);
  }
}

async function sendCommand(command: VehicleCommand, label: string): Promise<void> {
  if (currentMode === 'BLE') {
    try {
      await api.execute({
        query: graphQLOperations.sendVehicleCommand,
        variables: { command, label }
      });
      log(`[BLE Drive Packet] 送出 '${command}' (${label})`);
    } catch (error) {
      log(error instanceof Error ? error.message : String(error), true);
    }
  } else {
    // WiFi HTTP Control Mode
    let v = 0;
    let w = 0;
    if (command === 'F') { v = 100; w = 0; }
    if (command === 'B') { v = -100; w = 0; }
    if (command === 'L') { v = 0; w = -100; }
    if (command === 'R') { v = 0; w = 100; }
    if (command === 'S') { v = 0; w = 0; }

    const ip = ui.espIpAddress.value.trim();
    const driveUrl = `http://${ip}/api/drive?v=${v}&w=${w}`;
    try {
      fetch(driveUrl).catch(() => undefined);
      log(`[WiFi HTTP Drive] Send '${command}' (${label}): v=${v}, w=${w}`);
    } catch (err) {
      log(`[WiFi HTTP Drive Error] ${err}`, true);
    }
  }
}

// Pre-flash OTA Validation Event Handler
ui.firmwareFileInput.addEventListener('change', async (event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) {
    currentSelectedFirmwareBuffer = null;
    currentValidationResult = null;
    ui.otaMagic.textContent = '--';
    ui.otaChip.textContent = '--';
    ui.otaSize.textContent = '--';
    ui.otaRuleStatus.textContent = '尚未載入檔案';
    ui.otaRuleStatus.className = 'font-bold text-amber-400';
    ui.btnStartOta.disabled = true;
    ui.btnStartOta.classList.add('opacity-50');
    return;
  }

  log(`[OTA Inspector] 載入檔案: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`);

  const arrayBuffer = await file.arrayBuffer();
  currentSelectedFirmwareBuffer = new Uint8Array(arrayBuffer);
  currentValidationResult = validateFirmwareBinary(currentSelectedFirmwareBuffer);

  ui.otaMagic.textContent = currentValidationResult.magicByteHex;
  ui.otaChip.textContent = currentValidationResult.targetChip;
  ui.otaSize.textContent = `${(file.size / 1024 / 1024).toFixed(2)} MB (${file.size.toLocaleString()} bytes)`;

  if (currentValidationResult.valid) {
    ui.otaRuleStatus.textContent = '✓ 符合 OTA 規範 (通過五重檢核)';
    ui.otaRuleStatus.className = 'font-bold text-emerald-400';
    ui.btnStartOta.disabled = false;
    ui.btnStartOta.classList.remove('opacity-50');
    log(`[OTA Rule Check PASSED] 標頭 Magic: ${currentValidationResult.magicByteHex}, 晶片: ${currentValidationResult.targetChip}. 允許開始燒錄。`);
  } else {
    ui.otaRuleStatus.textContent = `❌ 攔截: ${currentValidationResult.errors.join('; ')}`;
    ui.otaRuleStatus.className = 'font-bold text-rose-400';
    ui.btnStartOta.disabled = true;
    ui.btnStartOta.classList.add('opacity-50');
    log(`[OTA Rule Check BLOCKED] 燒錄前規範檢查不通過: ${currentValidationResult.errors.join(', ')}`, true);
  }
});

// OTA Upload Execution Handler
ui.btnStartOta.addEventListener('click', async () => {
  if (!currentSelectedFirmwareBuffer || !currentValidationResult?.valid) {
    log('無法進行 OTA 燒錄：韌體檔未通過規範檢查。', true);
    return;
  }

  const file = ui.firmwareFileInput.files?.[0];
  if (!file) return;

  const targetIp = ui.espIpAddress.value.trim();
  const otaUrl = `http://${targetIp}/update`;

  log(`[OTA Execution] 開始對 ${otaUrl} 進行 OTA 線上更新傳輸...`);
  ui.otaProgressContainer.classList.remove('hidden');
  ui.otaProgressBar.style.width = '0%';
  ui.otaProgressPercent.textContent = '0%';
  ui.btnStartOta.disabled = true;

  const formData = new FormData();
  formData.append('update', file, file.name);

  const xhr = new XMLHttpRequest();
  xhr.open('POST', otaUrl, true);

  xhr.upload.onprogress = (e) => {
    if (e.lengthComputable) {
      const percent = Math.round((e.loaded / e.total) * 100);
      ui.otaProgressBar.style.width = `${percent}%`;
      ui.otaProgressPercent.textContent = `${percent}%`;
    }
  };

  xhr.onload = () => {
    if (xhr.status === 200) {
      log(`[OTA Success] ${xhr.responseText}`);
      ui.otaProgressPercent.textContent = '100% (燒錄完成，重啟中)';
      ui.otaProgressBar.className = 'h-full w-full bg-emerald-400 transition-all duration-200';
    } else {
      log(`[OTA Failed] HTTP ${xhr.status}: ${xhr.responseText || '傳輸失敗'}`, true);
      ui.otaProgressBar.className = 'h-full w-full bg-rose-500 transition-all duration-200';
    }
    ui.btnStartOta.disabled = false;
  };

  xhr.onerror = () => {
    log(`[OTA Network Error] 無法連線至 ${otaUrl}。請確認手機是否連至 ESP32 WiFi AP。`, true);
    ui.otaProgressBar.className = 'h-full w-full bg-rose-500 transition-all duration-200';
    ui.btnStartOta.disabled = false;
  };

  xhr.send(formData);
});

ui.btnConnect.addEventListener('click', connectVehicle);
ui.btnWifiConnect.addEventListener('click', connectWifiVehicle);
ui.btnDisconnect.addEventListener('click', () => {
  if (currentMode === 'BLE') {
    api.execute({ query: graphQLOperations.disconnectVehicle }).catch((error) => {
      log(error instanceof Error ? error.message : String(error), true);
    });
  } else {
    wifiConnected = false;
    updateConnectionState(false);
    log('已斷開 WiFi HTTP 連線。');
  }
});

// Touch and Button Event Listeners
ui.buttons.w.addEventListener('mousedown', () => sendCommand('F', '前進'));
ui.buttons.s.addEventListener('mousedown', () => sendCommand('B', '後退'));
ui.buttons.a.addEventListener('mousedown', () => sendCommand('L', '左轉'));
ui.buttons.d.addEventListener('mousedown', () => sendCommand('R', '右轉'));
ui.buttons.space.addEventListener('mousedown', () => sendCommand('S', '煞車'));

const releaseStop = () => { void sendCommand('S', '鬆開急停'); };
ui.buttons.w.addEventListener('mouseup', releaseStop);
ui.buttons.s.addEventListener('mouseup', releaseStop);
ui.buttons.a.addEventListener('mouseup', releaseStop);
ui.buttons.d.addEventListener('mouseup', releaseStop);
ui.buttons.w.addEventListener('mouseleave', releaseStop);
ui.buttons.s.addEventListener('mouseleave', releaseStop);
ui.buttons.a.addEventListener('mouseleave', releaseStop);
ui.buttons.d.addEventListener('mouseleave', releaseStop);

ui.buttons.w.addEventListener('touchstart', (e) => { e.preventDefault(); sendCommand('F', '前進'); });
ui.buttons.s.addEventListener('touchstart', (e) => { e.preventDefault(); sendCommand('B', '後退'); });
ui.buttons.a.addEventListener('touchstart', (e) => { e.preventDefault(); sendCommand('L', '左轉'); });
ui.buttons.d.addEventListener('touchstart', (e) => { e.preventDefault(); sendCommand('R', '右轉'); });
ui.buttons.space.addEventListener('touchstart', (e) => { e.preventDefault(); sendCommand('S', '煞車'); });
ui.buttons.w.addEventListener('touchend', (e) => { e.preventDefault(); releaseStop(); });
ui.buttons.s.addEventListener('touchend', (e) => { e.preventDefault(); releaseStop(); });
ui.buttons.a.addEventListener('touchend', (e) => { e.preventDefault(); releaseStop(); });
ui.buttons.d.addEventListener('touchend', (e) => { e.preventDefault(); releaseStop(); });

document.addEventListener('keydown', (event) => {
  const isOnline = currentMode === 'BLE' ? api.getStatus().connected : wifiConnected;
  if (!isOnline || event.repeat) {
    return;
  }

  const key = event.key.toUpperCase();
  if (key === 'W') void sendCommand('F', '前進');
  if (key === 'S') void sendCommand('B', '後退');
  if (key === 'A') void sendCommand('L', '左轉');
  if (key === 'D') void sendCommand('R', '右轉');
  if (key === ' ' || key === 'SPACE') {
    event.preventDefault();
    void sendCommand('S', '煞車');
  }
});

if (!(navigator as NavigatorWithBluetooth).bluetooth) {
  ui.btnConnect.disabled = true;
  ui.btnConnect.textContent = '瀏覽器不支援藍牙 API';
  log('瀏覽器不支援 Web Bluetooth API，請使用 HTTPS/localhost 與支援的瀏覽器。', true);
} else {
  log(`GraphQL schema 已載入 (${api.schema.length} chars)。`);
}

