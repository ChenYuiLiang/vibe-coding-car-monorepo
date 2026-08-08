import fs from 'fs';
import http from 'http';

function uploadOta() {
  let binPath = './firmware_esp32c3_vibe_car_slim.bin';
  if (!fs.existsSync(binPath)) {
    binPath = './firmware_esp32c3_vibe_car.bin';
  }
  if (!fs.existsSync(binPath)) {
    console.error('❌ 找不到韌體檔案');
    process.exit(1);
  }

  const fileSize = fs.statSync(binPath).size;
  console.log(`\n🚀 [OTA Node Uploader] 準備上傳韌體二進位檔 (${(fileSize / 1024 / 1024).toFixed(2)} MB) 至 http://192.168.4.1/update ...`);

  const boundary = '--------------------------' + Math.random().toString(36).substring(2, 16);
  
  const headerText = 
    `--${boundary}\r\n` +
    `Content-Disposition: form-data; name="update"; filename="firmware.bin"\r\n` +
    `Content-Type: application/octet-stream\r\n\r\n`;

  const footerText = `\r\n--${boundary}--\r\n`;

  const headerBuf = Buffer.from(headerText, 'utf-8');
  const footerBuf = Buffer.from(footerText, 'utf-8');

  const totalLength = headerBuf.length + fileSize + footerBuf.length;

  const req = http.request({
    hostname: '192.168.4.1',
    port: 80,
    path: '/update',
    method: 'POST',
    headers: {
      'Content-Type': `multipart/form-data; boundary=${boundary}`,
      'Content-Length': totalLength,
      'Connection': 'close'
    }
  }, (res) => {
    let data = '';
    res.on('data', chunk => { data += chunk; });
    res.on('end', () => {
      if (res.statusCode === 200) {
        console.log('\n===================================================');
        console.log('🎉 [OTA SUCCESS] 線上升級成功！ESP32-C3 正在重啟中...');
        console.log(`ESP32 回傳訊息: ${data}`);
        console.log('===================================================\n');
      } else {
        console.error(`\n❌ [OTA ERROR] HTTP ${res.statusCode}: ${data}`);
      }
    });
  });

  req.on('error', (err) => {
    console.error(`\n❌ [OTA Network Error] 無法存取 http://192.168.4.1/update`);
    console.error(`👉 請確認電腦/手機已連上 ESP32-Car-AP WiFi 基地台 (密碼: vibe123456)。`);
    console.error(`錯誤細節: ${err.message}\n`);
  });

  req.write(headerBuf);

  // Stream the binary file in 8KB chunks to fit ESP32 LwIP TCP buffer
  const fileStream = fs.createReadStream(binPath, { highWaterMark: 8192 });
  
  fileStream.on('data', (chunk) => {
    const ok = req.write(chunk);
    if (!ok) {
      fileStream.pause();
      req.once('drain', () => fileStream.resume());
    }
  });

  fileStream.on('end', () => {
    req.write(footerBuf);
    req.end();
  });
}

uploadOta();
