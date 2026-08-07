import { validateFirmwareBinary, encodePacket, decodePacket, OTA_CONFIG } from './dist/index.js';
import assert from 'assert';

console.log('=== Running @vibe-coding/protocol Verification Tests ===');

// Test 1: Valid ESP32-C3 Firmware Header
const validBinary = new Uint8Array(20000);
validBinary[0] = OTA_CONFIG.ESP32_MAGIC_BYTE; // 0xE9
validBinary[1] = 0x03; // segments
validBinary[2] = 0x00; // SPI mode
validBinary[3] = 0x20; // SPI speed/size
validBinary[12] = OTA_CONFIG.TARGET_CHIP_ESP32C3; // 0x05

const validResult = validateFirmwareBinary(validBinary);
console.log('Test 1 - Valid ESP32-C3 Firmware:', validResult);
assert.strictEqual(validResult.valid, true);
assert.strictEqual(validResult.magicByteHex, '0xE9');
assert.strictEqual(validResult.targetChip, 'ESP32-C3');

// Test 2: Invalid Magic Byte
const invalidBinary = new Uint8Array([0x00, 0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77]);
const invalidResult = validateFirmwareBinary(invalidBinary);
console.log('Test 2 - Invalid Magic Byte:', invalidResult);
assert.strictEqual(invalidResult.valid, false);
assert.strictEqual(invalidResult.errors.length > 0, true);

// Test 3: Oversized Binary (> 1.5MB)
const oversizedBinary = new Uint8Array(1600000);
oversizedBinary[0] = OTA_CONFIG.ESP32_MAGIC_BYTE;
const oversizedResult = validateFirmwareBinary(oversizedBinary);
console.log('Test 3 - Oversized Binary:', oversizedResult);
assert.strictEqual(oversizedResult.valid, false);

// Test 4: Packet Encoding & Decoding
const packet = encodePacket(50, -30);
assert.strictEqual(packet[0], 0xFF);
const decoded = decodePacket(packet);
assert.deepStrictEqual(decoded, { type: 'DRIVE', v: 50, w: -30 });
console.log('Test 4 - Drive Packet Encoding/Decoding: Passed!');

console.log('All protocol verification tests completed successfully!');
