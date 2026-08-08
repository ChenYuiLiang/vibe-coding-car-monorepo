# ESP32-C3 Vehicle Firmware

正式流程與 AI／救援注意事項見：

**[docs/FIRMWARE-PLAYBOOK.md](../../docs/FIRMWARE-PLAYBOOK.md)**

現行艦隊映像：`1.3.1-recovery`（Integration Lab + WiFi/BLE/OTA/HTTP-v1 + recovery）

## Quick commands

```bash
# Build
pio run -e esp32c3
cp -f .pio/build/esp32c3/firmware.bin ../../firmware_esp32c3_vibe_car_slim.bin

# OTA (prefer STA IP on Mac)
cd ../..
OTA_HOST=<device-ip> npm run ota
```

多台與選檔說明：[`docs/OTA-FLEET-GUIDE.md`](../../docs/OTA-FLEET-GUIDE.md)

## SoftAP (current)

- SSID: `ESP32-Car-AP`
- Password: `vibe123456`
- Config / OTA page: `http://192.168.4.1`
