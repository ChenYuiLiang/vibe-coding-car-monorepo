// Vibe Coding Vehicle Shared Protocol

export const BLE_CONFIG = {
  SERVICE_UUID: '4fafc201-1fb5-459e-8fcc-c5c9c331914b',
  CHARACTERISTIC_UUID: 'beb5483e-36e1-4688-b7f5-ea07361b26a8',
  DEVICE_NAME_PREFIX: 'ESP32-Car'
};

export const OTA_CONFIG = {
  ESP32_MAGIC_BYTE: 0xE9,
  TARGET_CHIP_ESP32C3: 0x05,
  MAX_FIRMWARE_SIZE_BYTES: 1572864, // 1.5MB OTA partition limit
  WATCHDOG_TIMEOUT_MS: 500,
  PROTOCOL_VERSION: 1
};

export interface VehicleCommand {
  type: 'DRIVE' | 'STOP' | 'STEER';
  v: number; // Line speed (-100 to 100)
  w: number; // Angular speed (-100 to 100)
}

export interface FirmwareHeaderInfo {
  magic: number;
  segments: number;
  flashMode: number;
  flashSpeedSize: number;
  entryPoint: number;
  targetChipId?: number;
  isValidMagic: boolean;
}

export interface FirmwareValidationResult {
  valid: boolean;
  fileSize: number;
  magicByteHex: string;
  targetChip: string;
  errors: string[];
  warnings: string[];
}

export function encodePacket(v: number, w: number): Uint8Array {
  // Protocol: [HEADER (0xFF), V_NORM, W_NORM, CHECKSUM]
  const vNorm = Math.min(255, Math.max(0, Math.round(v + 128)));
  const wNorm = Math.min(255, Math.max(0, Math.round(w + 128)));
  const checksum = (vNorm + wNorm) & 0xFF;
  return new Uint8Array([0xFF, vNorm, wNorm, checksum]);
}

export function decodePacket(packet: Uint8Array): VehicleCommand | null {
  if (packet.length < 4 || packet[0] !== 0xFF) return null;
  const vNorm = packet[1];
  const wNorm = packet[2];
  const checksum = packet[3];
  if (((vNorm + wNorm) & 0xFF) !== checksum) return null;

  return {
    type: 'DRIVE',
    v: vNorm - 128,
    w: wNorm - 128
  };
}

/**
 * Parses ESP32 Image Header according to Espressif Firmware Format.
 * ESP32 Image Header Format (first 8 bytes):
 * Byte 0: Magic byte (0xE9)
 * Byte 1: Segment count
 * Byte 2: SPI Flash Mode
 * Byte 3: SPI Flash Speed and Size
 * Bytes 4-7: Entry point address (uint32_t LE)
 * Byte 12: Extended Chip ID for ESP32-C3 / S2 / S3 in modern image header (if applicable)
 */
export function parseFirmwareHeader(data: Uint8Array): FirmwareHeaderInfo {
  if (data.length < 8) {
    return {
      magic: 0,
      segments: 0,
      flashMode: 0,
      flashSpeedSize: 0,
      entryPoint: 0,
      isValidMagic: false
    };
  }

  const magic = data[0];
  const segments = data[1];
  const flashMode = data[2];
  const flashSpeedSize = data[3];
  const entryPoint = data[4] | (data[5] << 8) | (data[6] << 16) | (data[7] << 24);
  const targetChipId = data.length >= 13 ? data[12] : undefined;

  return {
    magic,
    segments,
    flashMode,
    flashSpeedSize,
    entryPoint,
    targetChipId,
    isValidMagic: magic === OTA_CONFIG.ESP32_MAGIC_BYTE
  };
}

/**
 * Validates a firmware binary buffer against ESP32 & Vibe-Car OTA rules.
 */
export function validateFirmwareBinary(binary: Uint8Array): FirmwareValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const fileSize = binary.length;

  if (fileSize === 0) {
    errors.push('韌體檔案大小不可為 0 位元組 (Empty binary)');
    return {
      valid: false,
      fileSize,
      magicByteHex: '0x00',
      targetChip: 'Unknown',
      errors,
      warnings
    };
  }

  if (fileSize > OTA_CONFIG.MAX_FIRMWARE_SIZE_BYTES) {
    errors.push(`韌體檔案超限 (${(fileSize / 1024 / 1024).toFixed(2)}MB > 上限 1.50MB)`);
  }

  const header = parseFirmwareHeader(binary);
  const magicByteHex = '0x' + header.magic.toString(16).toUpperCase().padStart(2, '0');

  if (!header.isValidMagic) {
    errors.push(`非法的 ESP32 韌體標頭魔術字節: ${magicByteHex} (預期應為 0xE9)`);
  }

  let targetChip = 'ESP32 Standard / Generic';
  if (header.targetChipId !== undefined) {
    if (header.targetChipId === OTA_CONFIG.TARGET_CHIP_ESP32C3) {
      targetChip = 'ESP32-C3';
    } else if (header.targetChipId === 0x00) {
      targetChip = 'ESP32 Classic';
    } else if (header.targetChipId === 0x02) {
      targetChip = 'ESP32-S2';
    } else if (header.targetChipId === 0x09) {
      targetChip = 'ESP32-S3';
    } else {
      targetChip = `ESP Chip ID: 0x${header.targetChipId.toString(16)}`;
    }
  }

  if (fileSize < 10000) {
    warnings.push('韌體檔案尺寸異常偏小 (<10KB)，請確認是否為完整韌體編譯產物');
  }

  return {
    valid: errors.length === 0,
    fileSize,
    magicByteHex,
    targetChip,
    errors,
    warnings
  };
}

