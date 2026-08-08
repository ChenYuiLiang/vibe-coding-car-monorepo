import fs from 'fs';
import http from 'http';

function validateAndUploadOta() {
  let binPath = './firmware_esp32c3_vibe_car_slim.bin';
  if (!fs.existsSync(binPath)) {
    binPath = './firmware_esp32c3_vibe_car.bin';
  }
  if (!fs.existsSync(binPath)) {
    console.error('❌ 找不到韌體檔案');
    process.exit(1);
  }

  const fileSize = fs.statSync(binPath).size;
  const fileBuffer = fs.readFileSync(binPath);

  console.log(`\n🚀 [OTA Node Uploader] 步驟 1/2: 發送 Pre-Flashing Inspector 預檢驗至 http://192.168.4.1/api/ota/validate ...`);

  // Step 1: Send first 512 bytes to /api/ota/validate to pass safety check
  const headerSample = fileBuffer.subarray(0, Math.min(512, fileBuffer.length));

  const validateReq = http.request({
    hostname: '192.168.4.1',
    port: 80,
    path: '/api/ota/validate',
    method: 'POST',
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Length': headerSample.length
    }
  }, (validateRes) => {
    let validateData = '';
    validateRes.on('data', chunk => { validateData += chunk; });
    validateRes.on('end', () => {
      console.log(`👉 ESP32 預檢驗回應 (HTTP ${validateRes.statusCode}): ${validateData}`);

      // Step 2: Now upload full binary to /update
      console.log(`\n🚀 [OTA Node Uploader] 步驟 2/2: 開始傳送 0.99 MB 韌體至 http://192.168.4.1/update ...`);
      
      const boundary = '--------------------------' + Math.random().toString(36).substring(2, 16);
      const headerText = 
        `--${boundary}\r\n` +
        `Content-Disposition: form-data; name="update"; filename="firmware.bin"\r\n` +
        `Content-Type: application/octet-stream\r\n\r\n`;
      const footerText = `\r\n--${boundary}--\r\n`;

      const headerBuf = Buffer.from(headerText, 'utf-8');
      const footerBuf = Buffer.from(footerText, 'utf-8');
      const totalLength = headerBuf.length + fileSize + footerBuf.length;

      const uploadReq = http.request({
        hostname: '192.168.4.1',
        port: 80,
        path: '/update',
        method: 'POST',
        headers: {
          'Content-Type': `multipart/form-data; boundary=${boundary}`,
          'Content-Length': totalLength,
          'Connection': 'close'
        }
      }, (uploadRes) => {
        let uploadData = '';
        uploadRes.on('data', chunk => { uploadData += chunk; });
        uploadRes.on('end', () => {
          if (uploadRes.statusCode === 200) {
            console.log('\n===================================================');
            console.log('🎉 [OTA SUCCESS] 線上升級成功！ESP32-C3 正在重啟中...');
            console.log(`ESP32 回傳訊息: ${uploadData}`);
            console.log('===================================================\n');
          } else {
            console.error(`\n❌ [OTA ERROR] HTTP ${uploadRes.statusCode}: ${uploadData}`);
          }
        });
      });

      uploadReq.on('error', (err) => {
        console.error(`\n❌ [OTA Network Error] 無法存取 /update: ${err.message}`);
      });

      uploadReq.write(headerBuf);

      const fileStream = fs.createReadStream(binPath, { highWaterMark: 8192 });
      fileStream.on('data', (chunk) => {
        const ok = uploadReq.write(chunk);
        if (!ok) {
          fileStream.pause();
          uploadReq.once('drain', () => fileStream.resume());
        }
      });

      fileStream.on('end', () => {
        uploadReq.write(footerBuf);
        uploadReq.end();
      });
    });
  });

  validateReq.on('error', (err) => {
    console.error(`\n❌ [OTA Validation Network Error] 無法連線至 /api/ota/validate: ${err.message}`);
    console.error(`👉 請確認電腦/手機已連上 ESP32-Car-AP WiFi 基地台 (密碼: vibe123456)。\n`);
  });

  validateReq.write(headerSample);
  validateReq.end();
}

validateAndUploadOta();
