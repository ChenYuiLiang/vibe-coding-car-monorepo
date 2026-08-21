export type VehicleCommand = 'F' | 'B' | 'L' | 'R' | 'S';

/** Mirrors packages/protocol encodePacket — keep in sync. */
function encodeDrivePacket(v: number, w: number): Uint8Array {
  const vNorm = Math.min(255, Math.max(0, Math.round(v + 128)));
  const wNorm = Math.min(255, Math.max(0, Math.round(w + 128)));
  const checksum = (vNorm + wNorm) & 0xff;
  return Uint8Array.from([0xff, vNorm, wNorm, checksum]);
}

export interface VehicleStatus {
  connected: boolean;
  deviceName: string | null;
  /** Actual GATT service UUID in use (may differ from the form request after fallback). */
  serviceUuid: string | null;
  /** Actual writable characteristic UUID in use. */
  characteristicUuid: string | null;
}

export interface CommandResult {
  command: VehicleCommand;
  label: string;
  sent: boolean;
}

export interface GraphQLResponse<TData> {
  data: TData;
}

export interface ConnectVehicleVariables {
  serviceUuid: string;
  characteristicUuid: string;
  scanAllDevices?: boolean;
}

export interface SendVehicleCommandVariables {
  command: VehicleCommand;
  label: string;
}

export interface GraphQLRequest<TVariables = Record<string, unknown>> {
  query: string;
  variables?: TVariables;
}

export interface BluetoothCharacteristic {
  uuid?: string;
  properties?: {
    write?: boolean;
    writeWithoutResponse?: boolean;
  };
  writeValue(data: BufferSource): Promise<void>;
  writeValueWithoutResponse?(data: BufferSource): Promise<void>;
}

export interface BluetoothService {
  uuid?: string;
  getCharacteristic(uuid: string): Promise<BluetoothCharacteristic>;
  getCharacteristics?(): Promise<BluetoothCharacteristic[]>;
}

export interface BluetoothServer {
  connected?: boolean;
  connect(): Promise<BluetoothServer>;
  disconnect(): void;
  getPrimaryService(uuid: string): Promise<BluetoothService>;
  getPrimaryServices?(): Promise<BluetoothService[]>;
}

export interface BluetoothDevice {
  name?: string;
  gatt?: BluetoothServer;
  addEventListener(type: 'gattserverdisconnected', listener: () => void): void;
}

export interface BluetoothNavigator {
  requestDevice(options: {
    filters?: Array<{ services?: string[]; namePrefix?: string }>;
    acceptAllDevices?: boolean;
    optionalServices?: string[];
  }): Promise<BluetoothDevice>;
}

export interface VehicleApiDependencies {
  bluetooth?: BluetoothNavigator;
  encoder?: TextEncoder;
  onLog?: (message: string, error?: boolean) => void;
  onConnectionChange?: (connected: boolean) => void;
}

export interface VehicleGraphQLApi {
  schema: string;
  execute<TData, TVariables = Record<string, unknown>>(
    request: GraphQLRequest<TVariables>
  ): Promise<GraphQLResponse<TData>>;
  getStatus(): VehicleStatus;
}

export const graphQLSchema = `
  enum VehicleCommand {
    F
    B
    L
    R
    S
  }

  type VehicleStatus {
    connected: Boolean!
    deviceName: String
    serviceUuid: String
    characteristicUuid: String
  }

  type CommandResult {
    command: VehicleCommand!
    label: String!
    sent: Boolean!
  }

  type Query {
    vehicleStatus: VehicleStatus!
  }

  type Mutation {
    connectVehicle(serviceUuid: ID!, characteristicUuid: ID!, scanAllDevices: Boolean): VehicleStatus!
    disconnectVehicle: VehicleStatus!
    sendVehicleCommand(command: VehicleCommand!, label: String!): CommandResult!
  }
`;

export const graphQLOperations = {
  vehicleStatus: `
    query VehicleStatus {
      vehicleStatus {
        connected
        deviceName
        serviceUuid
        characteristicUuid
      }
    }
  `,
  connectVehicle: `
    mutation ConnectVehicle($serviceUuid: ID!, $characteristicUuid: ID!, $scanAllDevices: Boolean) {
      connectVehicle(serviceUuid: $serviceUuid, characteristicUuid: $characteristicUuid, scanAllDevices: $scanAllDevices) {
        connected
        deviceName
        serviceUuid
        characteristicUuid
      }
    }
  `,
  disconnectVehicle: `
    mutation DisconnectVehicle {
      disconnectVehicle {
        connected
        deviceName
        serviceUuid
        characteristicUuid
      }
    }
  `,
  sendVehicleCommand: `
    mutation SendVehicleCommand($command: VehicleCommand!, $label: String!) {
      sendVehicleCommand(command: $command, label: $label) {
        command
        label
        sent
      }
    }
  `
} as const;

/** Canonical monorepo / Integration Lab GATT profile. */
export const CANONICAL_BLE_SERVICE_UUID = '4fafc201-1fb5-459e-8fcc-c5c9c331914b';
export const CANONICAL_BLE_CHARACTERISTIC_UUID = 'beb5483e-36e1-4688-b7f5-ea07361b26a8';

interface VehicleState {
  device: BluetoothDevice | null;
  characteristic: BluetoothCharacteristic | null;
  serviceUuid: string | null;
  characteristicUuid: string | null;
}

function getOperationName(query: string): string | null {
  return query.replace(/\s+/g, ' ').trim().match(/(?:query|mutation)\s+(\w+)/)?.[1] ?? null;
}

function normalizeUuid(uuid: string): string {
  return uuid.trim().toLowerCase();
}

export function createVehicleGraphQLApi(dependencies: VehicleApiDependencies): VehicleGraphQLApi {
  const state: VehicleState = {
    device: null,
    characteristic: null,
    serviceUuid: null,
    characteristicUuid: null
  };

  const log = dependencies.onLog ?? (() => undefined);
  const setConnected = (connected: boolean): void => dependencies.onConnectionChange?.(connected);

  /** Serialize GATT writes — Chrome throws if two writeValue overlap. */
  let writeChain: Promise<void> = Promise.resolve();

  const writePacket = (packet: Uint8Array): Promise<void> => {
    const characteristic = state.characteristic;
    if (!characteristic) {
      return Promise.reject(new Error('尚未連線到可寫入的藍牙特徵。'));
    }

    writeChain = writeChain
      .catch(() => undefined)
      .then(async () => {
        const canWriteNr = Boolean(
          characteristic.writeValueWithoutResponse &&
            characteristic.properties?.writeWithoutResponse
        );
        if (canWriteNr && characteristic.writeValueWithoutResponse) {
          await characteristic.writeValueWithoutResponse(packet as BufferSource);
          return;
        }
        await characteristic.writeValue(packet as BufferSource);
      });

    return writeChain;
  };

  const getStatus = (): VehicleStatus => ({
    connected: Boolean(state.characteristic && state.device?.gatt?.connected),
    deviceName: state.device?.name ?? null,
    serviceUuid: state.serviceUuid,
    characteristicUuid: state.characteristicUuid
  });

  const connectVehicle = async (variables: ConnectVehicleVariables): Promise<VehicleStatus> => {
    if (!dependencies.bluetooth) {
      throw new Error('瀏覽器不支援 Web Bluetooth API，或目前不是 HTTPS/localhost 環境。');
    }

    const serviceUuid = normalizeUuid(variables.serviceUuid);
    const characteristicUuid = normalizeUuid(variables.characteristicUuid);

    log('GraphQL Mutation: connectVehicle(serviceUuid, characteristicUuid)');
    
    const knownServices = Array.from(new Set([
      serviceUuid,
      '4fafc201-1fb5-459e-8fcc-c5c9c331914b',
      '0000ffe0-0000-1000-8000-00805f9b34fb',
      '6e400001-b5a3-f393-e0a9-e50e24dcca9e'
    ]));

    const requestOptions = variables.scanAllDevices
      ? { acceptAllDevices: true, optionalServices: knownServices }
      : { filters: [{ services: [serviceUuid] }], optionalServices: knownServices };

    const device = await dependencies.bluetooth.requestDevice(requestOptions);

    if (!device.gatt) {
      throw new Error('選取的藍牙裝置沒有可用的 GATT server。');
    }

    device.addEventListener('gattserverdisconnected', () => {
      state.characteristic = null;
      state.serviceUuid = null;
      state.characteristicUuid = null;
      log('藍牙連線遺失。', true);
      setConnected(false);
    });

    const server = await device.gatt.connect();
    
    // Attempt to locate matching GATT Service with fallback
    let service: BluetoothService | null = null;
    let usedServiceUuid = serviceUuid;

    try {
      service = await server.getPrimaryService(serviceUuid);
    } catch {
      log(`指定服務 UUID (${serviceUuid}) 未在裝置找到，嘗試備用藍牙服務 (HM-10/Nordic)...`, true);
      for (const fallbackUuid of ['0000ffe0-0000-1000-8000-00805f9b34fb', '6e400001-b5a3-f393-e0a9-e50e24dcca9e']) {
        try {
          service = await server.getPrimaryService(fallbackUuid);
          usedServiceUuid = fallbackUuid;
          log(`成功找到備用藍牙服務: ${fallbackUuid}`);
          break;
        } catch {
          // continue checking
        }
      }
    }

    if (!service && server.getPrimaryServices) {
      try {
        const allServices = await server.getPrimaryServices();
        if (allServices && allServices.length > 0) {
          const serviceUuids = allServices.map(s => s.uuid).filter(Boolean);
          log(`[BLE Auto Discovery] 裝置暴露的所有 GATT 服務 UUID 為: ${serviceUuids.join(', ')}`);
          // Pick the first non-generic service (skip 00001800 / 00001801 Generic Access/Attribute)
          const customService = allServices.find(s => s.uuid && !s.uuid.startsWith('00001800') && !s.uuid.startsWith('00001801'));
          if (customService) {
            service = customService;
            usedServiceUuid = customService.uuid || serviceUuid;
            log(`自動為您選取相容的自訂藍牙服務: ${usedServiceUuid}`);
          }
        }
      } catch {
        // dynamic discovery optional
      }
    }

    if (!service) {
      throw new Error(`在裝置上記錄不到相容的藍牙服務。請確認您選擇的裝置為 ESP32 車子，或執行 'cd firmware/esp32c3-vehicle && pio run -t upload' 燒錄專案韌體。`);
    }

    // Attempt characteristic discovery
    let characteristic: BluetoothCharacteristic | null = null;
    let usedCharacteristicUuid = characteristicUuid;
    try {
      characteristic = await service.getCharacteristic(characteristicUuid);
    } catch {
      log(`指定特徵 UUID (${characteristicUuid}) 未找到，嘗試讀取服務預設寫入特徵...`, true);
      const fallbackCharUuids = [
        CANONICAL_BLE_CHARACTERISTIC_UUID,
        '0000ffe1-0000-1000-8000-00805f9b34fb',
        '6e400002-b5a3-f393-e0a9-e50e24dcca9e'
      ];
      for (const charUuid of fallbackCharUuids) {
        try {
          characteristic = await service.getCharacteristic(charUuid);
          usedCharacteristicUuid = charUuid;
          log(`成功連線至特徵: ${charUuid}`);
          break;
        } catch {
          // continue checking
        }
      }
    }

    if (!characteristic) {
      throw new Error(`找不到可寫入的藍牙特徵。`);
    }

    usedCharacteristicUuid = normalizeUuid(characteristic.uuid ?? usedCharacteristicUuid);
    usedServiceUuid = normalizeUuid(service.uuid ?? usedServiceUuid);

    state.device = device;
    state.characteristic = characteristic;
    state.serviceUuid = usedServiceUuid;
    state.characteristicUuid = usedCharacteristicUuid;
    writeChain = Promise.resolve();
    log(
      `[BLE] 實際通道 service=${usedServiceUuid} · char=${usedCharacteristicUuid} · write=${Boolean(characteristic.properties?.write)} · writeWithoutResponse=${Boolean(characteristic.properties?.writeWithoutResponse)}`
    );
    if (
      usedServiceUuid !== CANONICAL_BLE_SERVICE_UUID ||
      usedCharacteristicUuid !== CANONICAL_BLE_CHARACTERISTIC_UUID
    ) {
      log(
        `[BLE] 警告：非正式 monorepo UUID（正式為 ${CANONICAL_BLE_SERVICE_UUID} / ${CANONICAL_BLE_CHARACTERISTIC_UUID}）。畫面已改顯示實際通道；馬達協定可能不相容。`,
        true
      );
    }
    setConnected(true);
    return getStatus();
  };

  const disconnectVehicle = async (): Promise<VehicleStatus> => {
    log('GraphQL Mutation: disconnectVehicle');
    state.device?.gatt?.disconnect();
    state.characteristic = null;
    state.serviceUuid = null;
    state.characteristicUuid = null;
    setConnected(false);
    return getStatus();
  };

  const sendVehicleCommand = async (variables: SendVehicleCommandVariables): Promise<CommandResult> => {
    if (!state.characteristic) {
      throw new Error('尚未連線到可寫入的藍牙特徵。');
    }

    let v = 0;
    let w = 0;
    if (variables.command === 'F') { v = 100; w = 0; }
    else if (variables.command === 'B') { v = -100; w = 0; }
    else if (variables.command === 'L') { v = 0; w = -100; }
    else if (variables.command === 'R') { v = 0; w = 100; }
    else { v = 0; w = 0; } // 'S' stop

    const packet = encodeDrivePacket(v, w);
    await writePacket(packet);
    log(`GraphQL Mutation: sendVehicleCommand(command: ${variables.command}, label: "${variables.label}") → [${Array.from(packet).map((b) => '0x' + b.toString(16).padStart(2, '0')).join(', ')}]`);
    return {
      command: variables.command,
      label: variables.label,
      sent: true
    };
  };

  const execute = async <TData, TVariables = Record<string, unknown>>(
    request: GraphQLRequest<TVariables>
  ): Promise<GraphQLResponse<TData>> => {
    const operationName = getOperationName(request.query);
    const variables = request.variables;

    switch (operationName) {
      case 'VehicleStatus':
        return { data: { vehicleStatus: getStatus() } as TData };
      case 'ConnectVehicle':
        return {
          data: {
            connectVehicle: await connectVehicle(variables as ConnectVehicleVariables)
          } as TData
        };
      case 'DisconnectVehicle':
        return {
          data: {
            disconnectVehicle: await disconnectVehicle()
          } as TData
        };
      case 'SendVehicleCommand':
        return {
          data: {
            sendVehicleCommand: await sendVehicleCommand(variables as SendVehicleCommandVariables)
          } as TData
        };
      default:
        throw new Error(`Unknown GraphQL operation: ${operationName ?? request.query}`);
    }
  };

  return {
    schema: graphQLSchema,
    execute,
    getStatus
  };
}
