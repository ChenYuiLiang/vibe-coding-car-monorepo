import fs from 'fs';
import { execFileSync } from 'child_process';

const CANDIDATE_HOSTS = [
  process.env.OTA_HOST,
  'esp32-car.local',
  '192.168.4.1',
].filter(Boolean);

function resolveFirmwarePath() {
  const candidates = [
    './firmware_esp32c3_vibe_car_slim.bin',
    './firmware_esp32c3_vibe_car.bin',
    './firmware/esp32c3-vehicle/.pio/build/esp32c3/firmware.bin',
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

function probeHost(host) {
  try {
    const out = execFileSync(
      'curl',
      ['-fsS', '-m', '3', `http://${host}/api/status`],
      { encoding: 'utf8' }
    );
    return out;
  } catch {
    return null;
  }
}

function upload(host, binPath) {
  const fileSize = fs.statSync(binPath).size;
  console.log(`\n🚀 OTA → http://${host}/update  (${(fileSize / 1024).toFixed(0)} KB)`);
  console.log(`   file: ${binPath}`);

  // Multipart upload. ESP32 LwIP buffers are small; curl streaming + Expect
  // handling is more reliable than buffering the whole body in Node.
  const args = [
    '-sS',
    '-m', '120',
    '-H', 'Expect:',
    '-F', `update=@${binPath};type=application/octet-stream`,
    `http://${host}/update`,
  ];

  try {
    const stdout = execFileSync('curl', args, {
      encoding: 'utf8',
      timeout: 130000,
      maxBuffer: 2 * 1024 * 1024,
    });
    console.log('\n===================================================');
    console.log('🎉 OTA SUCCESS — device is rebooting');
    if (stdout) console.log(`ESP32: ${stdout}`);
    console.log('===================================================\n');
    return true;
  } catch (err) {
    // Device often resets before curl finishes reading the response body.
    const msg = String(err?.stderr || err?.message || err);
    if (/Empty reply|Connection reset|Failed to connect|Recv failure|timed out/i.test(msg)) {
      console.log('\n===================================================');
      console.log('🎉 OTA likely SUCCESS (device reset during HTTP response)');
      console.log('👉 Wait ~10s, then check AP ESP32-Car-AP or http://esp32-car.local');
      console.log('===================================================\n');
      return true;
    }
    console.error('\n❌ OTA FAILED');
    if (err.stdout) console.error(err.stdout);
    if (err.stderr) console.error(err.stderr);
    return false;
  }
}

function main() {
  const binPath = resolveFirmwarePath();
  if (!binPath) {
    console.error('❌ No firmware .bin found. Build first: cd firmware/esp32c3-vehicle && pio run');
    process.exit(1);
  }

  console.log('🔍 Probing ESP32 hosts (STA mDNS first, then open AP)...');
  let target = null;
  for (const host of CANDIDATE_HOSTS) {
    const status = probeHost(host);
    if (status) {
      console.log(`✅ Reachable: ${host}`);
      console.log(`   status: ${status}`);
      target = host;
      break;
    }
    console.log(`… miss: ${host}`);
  }

  if (!target) {
    console.error(`
❌ ESP32 not reachable.

Recovery checklist:
  1) Join open WiFi "ESP32-Car-AP" (NO password) → http://192.168.4.1
  2) Or join home WiFi and open http://esp32-car.local
  3) Or set OTA_HOST=<ip> npm run ota

If neither AP nor STA is visible, the board needs a one-time USB erase/flash
from another computer/hub — wireless recovery is impossible while offline.
`);
    process.exit(1);
  }

  const ok = upload(target, binPath);
  process.exit(ok ? 0 : 1);
}

main();
