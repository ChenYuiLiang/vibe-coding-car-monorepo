export type VehicleCommand = 'F' | 'B' | 'L' | 'R' | 'S';

export interface VehicleStatus {
  connected: boolean;
  deviceName: string | null;
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
  writeValue(data: BufferSource): Promise<void>;
}

export interface BluetoothService {
  getCharacteristic(uuid: string): Promise<BluetoothCharacteristic>;
}

export interface BluetoothServer {
  connected?: boolean;
  connect(): Promise<BluetoothServer>;
  disconnect(): void;
  getPrimaryService(uuid: string): Promise<BluetoothService>;
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
    connectVehicle(serviceUuid: ID!, characteristicUuid: ID!): VehicleStatus!
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
      }
    }
  `,
  connectVehicle: `
    mutation ConnectVehicle($serviceUuid: ID!, $characteristicUuid: ID!) {
      connectVehicle(serviceUuid: $serviceUuid, characteristicUuid: $characteristicUuid) {
        connected
        deviceName
      }
    }
  `,
  disconnectVehicle: `
    mutation DisconnectVehicle {
      disconnectVehicle {
        connected
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

interface VehicleState {
  device: BluetoothDevice | null;
  characteristic: BluetoothCharacteristic | null;
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
    characteristic: null
  };

  const encoder = dependencies.encoder ?? new TextEncoder();
  const log = dependencies.onLog ?? (() => undefined);
  const setConnected = (connected: boolean): void => dependencies.onConnectionChange?.(connected);

  const getStatus = (): VehicleStatus => ({
    connected: Boolean(state.characteristic && state.device?.gatt?.connected),
    deviceName: state.device?.name ?? null
  });

  const connectVehicle = async (variables: ConnectVehicleVariables): Promise<VehicleStatus> => {
    if (!dependencies.bluetooth) {
      throw new Error('瀏覽器不支援 Web Bluetooth API，或目前不是 HTTPS/localhost 環境。');
    }

    const serviceUuid = normalizeUuid(variables.serviceUuid);
    const characteristicUuid = normalizeUuid(variables.characteristicUuid);

    log('GraphQL Mutation: connectVehicle(serviceUuid, characteristicUuid)');
    let device: BluetoothDevice;
    try {
      device = await dependencies.bluetooth.requestDevice({
        filters: [{ services: [serviceUuid] }]
      });
    } catch {
      // Fallback: If UUID filter is not broadcasting, allow scanning all nearby BLE devices
      device = await dependencies.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: [serviceUuid]
      });
    }

    if (!device.gatt) {
      throw new Error('選取的藍牙裝置沒有可用的 GATT server。');
    }

    device.addEventListener('gattserverdisconnected', () => {
      state.characteristic = null;
      log('藍牙連線遺失。', true);
      setConnected(false);
    });

    const server = await device.gatt.connect();
    const service = await server.getPrimaryService(serviceUuid);
    const characteristic = await service.getCharacteristic(characteristicUuid);

    state.device = device;
    state.characteristic = characteristic;
    setConnected(true);
    return getStatus();
  };

  const disconnectVehicle = async (): Promise<VehicleStatus> => {
    log('GraphQL Mutation: disconnectVehicle');
    state.device?.gatt?.disconnect();
    state.characteristic = null;
    setConnected(false);
    return getStatus();
  };

  const sendVehicleCommand = async (variables: SendVehicleCommandVariables): Promise<CommandResult> => {
    if (!state.characteristic) {
      throw new Error('尚未連線到可寫入的藍牙特徵。');
    }

    await state.characteristic.writeValue(encoder.encode(variables.command));
    log(`GraphQL Mutation: sendVehicleCommand(command: ${variables.command}, label: "${variables.label}")`);
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
