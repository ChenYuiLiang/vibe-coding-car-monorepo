import fs from 'fs';

async function uploadOta() {
  const binPath = './firmware_esp32c3_vibe_car.bin';
  if (!fs.existsSync(binPath)) {
    console.error('❌ 找不到韌體檔案 firmware_esp32c3_vibe_car.bin');
    process.exit(1);
  }
  const fileBuffer = fs.readFileSync(binPath);
  console.log(`\n🚀 [OTA Node Uploader] 準備上傳韌體二進位檔 (${(fileBuffer.length / 1024 / 1024).toFixed(2)} MB) 至 http://192.168.4.1/update ...`);

  const blob = new Blob([fileBuffer], { type: 'application/octet-stream' });
  const formData = new FormData();
  formData.append('update', blob, 'firmware.bin');

  try {
    const res = await fetch('http://192.168.4.1/update', {
      method: 'POST',
      body: formData,
      signal: AbortSignal.timeout(15000)
    });
    const text = await res.text();
    if (res.ok) {
      console.log('\n===================================================');
      console.log('🎉 [OTA SUCCESS] 線上升級成功！ESP32-C3 正在重啟中...');
      console.log(`ESP32 回傳訊息: ${text}`);
      console.log('===================================================\n');
    } else {
      console.error(`\n❌ [OTA ERROR] HTTP ${res.status}: ${text}`);
    }
  } catch (err) {
    console.error(`\n❌ [OTA Network Error] 無法存取 http://192.168.4.1/update`);
    console.error(`👉 請確認電腦/手機已連上 ESP32-Car-AP WiFi 基地台 (密碼: vibe123456)。`);
    console.error(`錯誤細節: ${err.message}\n`);
  }
}

uploadOta();
