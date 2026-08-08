import fs from 'fs';
import { execSync } from 'child_process';

function uploadOtaWithCurl() {
  let binPath = './firmware_esp32c3_vibe_car_slim.bin';
  if (!fs.existsSync(binPath)) {
    binPath = './firmware_esp32c3_vibe_car.bin';
  }
  if (!fs.existsSync(binPath)) {
    console.error('❌ 找不到韌體檔案');
    process.exit(1);
  }

  const fileSize = fs.statSync(binPath).size;
  console.log(`\n🚀 [OTA Uploader] 準備傳送 ${(fileSize / 1024 / 1024).toFixed(2)} MB 韌體至 http://192.168.4.1/update ...`);

  try {
    const cmd = `curl -v -F "update=@${binPath}" http://192.168.4.1/update`;
    console.log(`👉 執行原生 HTTP 傳送指令: ${cmd}\n`);
    const stdout = execSync(cmd, { encoding: 'utf-8', timeout: 60000 });
    console.log('\n===================================================');
    console.log('🎉 [OTA SUCCESS] 線上升級成功！ESP32-C3 正在重啟中...');
    console.log(`ESP32 回傳訊息:\n${stdout}`);
    console.log('===================================================\n');
  } catch (err) {
    console.error(`\n❌ [OTA Network Error] 傳送失敗`);
    if (err.stdout) console.log(`標準輸出: ${err.stdout}`);
    if (err.stderr) console.log(`錯誤日誌:\n${err.stderr}`);
    process.exit(1);
  }
}

uploadOtaWithCurl();
