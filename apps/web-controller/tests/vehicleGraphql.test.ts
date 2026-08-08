import {
  createVehicleGraphQLApi,
  graphQLOperations,
  type BluetoothCharacteristic,
  type BluetoothDevice,
  type BluetoothNavigator,
  type BluetoothServer,
  type BluetoothService,
  type CommandResult,
  type VehicleStatus
} from '../src/api/vehicleGraphql';

interface MockBluetooth {
  bluetooth: BluetoothNavigator;
  characteristic: BluetoothCharacteristic;
  server: BluetoothServer;
  disconnect: jest.Mock<void, []>;
  writeValue: jest.Mock<Promise<void>, [BufferSource]>;
  triggerDisconnect: () => void;
}

function createMockBluetooth(): MockBluetooth {
  let disconnectListener: (() => void) | null = null;
  const writeValue = jest.fn<Promise<void>, [BufferSource]>().mockResolvedValue(undefined);
  const disconnect = jest.fn<void, []>();

  const characteristic: BluetoothCharacteristic = {
    writeValue
  };

  const service: BluetoothService = {
    getCharacteristic: jest.fn().mockResolvedValue(characteristic)
  };

  const server: BluetoothServer = {
    connected: true,
    connect: jest.fn().mockResolvedValue(undefined),
    disconnect,
    getPrimaryService: jest.fn().mockResolvedValue(service)
  };
  server.connect = jest.fn().mockResolvedValue(server);

  const device: BluetoothDevice = {
    name: 'Demo Car',
    gatt: server,
    addEventListener: jest.fn((_type, listener) => {
      disconnectListener = listener;
    })
  };

  return {
    bluetooth: {
      requestDevice: jest.fn().mockResolvedValue(device)
    },
    characteristic,
    server,
    disconnect,
    writeValue,
    triggerDisconnect: () => disconnectListener?.()
  };
}

describe('vehicle GraphQL API', () => {
  it('returns an offline status before connecting', async () => {
    const api = createVehicleGraphQLApi({});

    const response = await api.execute<{ vehicleStatus: VehicleStatus }>({
      query: graphQLOperations.vehicleStatus
    });

    expect(response.data.vehicleStatus).toEqual({
      connected: false,
      deviceName: null
    });
  });

  it('connects to a bluetooth device through the typed GraphQL mutation', async () => {
    const mock = createMockBluetooth();
    const onConnectionChange = jest.fn();
    const onLog = jest.fn();
    const api = createVehicleGraphQLApi({
      bluetooth: mock.bluetooth,
      onConnectionChange,
      onLog
    });

    const response = await api.execute<{ connectVehicle: VehicleStatus }>({
      query: graphQLOperations.connectVehicle,
      variables: {
        serviceUuid: ' 0000FFE0-0000-1000-8000-00805F9B34FB ',
        characteristicUuid: '0000FFE1-0000-1000-8000-00805F9B34FB'
      }
    });

    expect(mock.bluetooth.requestDevice).toHaveBeenCalledWith({
      filters: [{ services: ['0000ffe0-0000-1000-8000-00805f9b34fb'] }],
      optionalServices: [
        '0000ffe0-0000-1000-8000-00805f9b34fb',
        '4fafc201-1fb5-459e-8fcc-c5c9c331914b',
        '6e400001-b5a3-f393-e0a9-e50e24dcca9e'
      ]
    });
    expect(response.data.connectVehicle).toEqual({
      connected: true,
      deviceName: 'Demo Car'
    });
    expect(onConnectionChange).toHaveBeenCalledWith(true);
    expect(onLog).toHaveBeenCalledWith('GraphQL Mutation: connectVehicle(serviceUuid, characteristicUuid)');
  });

  it('falls back to standard BLE services when primary service UUID fails', async () => {
    const mock = createMockBluetooth();
    const service: BluetoothService = {
      getCharacteristic: jest.fn().mockImplementation((uuid) => {
        if (uuid === 'beb5483e-36e1-4688-b7f5-ea07361b26a8') return Promise.resolve(mock.characteristic);
        return Promise.reject(new Error('Char not found'));
      })
    };
    mock.server.getPrimaryService = jest.fn().mockImplementation((uuid) => {
      if (uuid === '4fafc201-1fb5-459e-8fcc-c5c9c331914b' || uuid === '0000ffe0-0000-1000-8000-00805f9b34fb') {
        return Promise.resolve(service);
      }
      return Promise.reject(new Error('Service not found'));
    });

    const api = createVehicleGraphQLApi({ bluetooth: mock.bluetooth });
    const response = await api.execute<{ connectVehicle: VehicleStatus }>({
      query: graphQLOperations.connectVehicle,
      variables: {
        serviceUuid: 'unknown-uuid',
        characteristicUuid: 'unknown-char'
      }
    });

    expect(response.data.connectVehicle.connected).toBe(true);
  });

  it('throws error when no matching GATT service is found', async () => {
    const mock = createMockBluetooth();
    mock.server.getPrimaryService = jest.fn().mockRejectedValue(new Error('Service not found'));

    const api = createVehicleGraphQLApi({ bluetooth: mock.bluetooth });
    await expect(
      api.execute({
        query: graphQLOperations.connectVehicle,
        variables: {
          serviceUuid: 'invalid-service-uuid',
          characteristicUuid: 'invalid-char-uuid'
        }
      })
    ).rejects.toThrow('在裝置上記錄不到相容的藍牙服務');
  });

  it('dynamically discovers primary services when explicit service UUID fails', async () => {
    const mock = createMockBluetooth();
    mock.server.getPrimaryService = jest.fn().mockRejectedValue(new Error('Service not found'));
    const discoveredService: BluetoothService = {
      uuid: 'custom-vehicle-service-uuid',
      getCharacteristic: jest.fn().mockResolvedValue(mock.characteristic)
    };
    mock.server.getPrimaryServices = jest.fn().mockResolvedValue([discoveredService]);

    const api = createVehicleGraphQLApi({ bluetooth: mock.bluetooth });
    const response = await api.execute<{ connectVehicle: VehicleStatus }>({
      query: graphQLOperations.connectVehicle,
      variables: {
        serviceUuid: 'unknown-uuid',
        characteristicUuid: 'unknown-char'
      }
    });

    expect(response.data.connectVehicle.connected).toBe(true);
  });

  it('throws error when no matching characteristic is found', async () => {
    const mock = createMockBluetooth();
    const service: BluetoothService = {
      getCharacteristic: jest.fn().mockRejectedValue(new Error('Char not found'))
    };
    mock.server.getPrimaryService = jest.fn().mockResolvedValue(service);

    const api = createVehicleGraphQLApi({ bluetooth: mock.bluetooth });
    await expect(
      api.execute({
        query: graphQLOperations.connectVehicle,
        variables: {
          serviceUuid: 'valid-service-uuid',
          characteristicUuid: 'invalid-char-uuid'
        }
      })
    ).rejects.toThrow('找不到可寫入的藍牙特徵');
  });

  it('sends a command after connecting', async () => {
    const mock = createMockBluetooth();
    const api = createVehicleGraphQLApi({ bluetooth: mock.bluetooth });

    await api.execute({
      query: graphQLOperations.connectVehicle,
      variables: {
        serviceUuid: 'service-id',
        characteristicUuid: 'characteristic-id'
      }
    });

    const response = await api.execute<{ sendVehicleCommand: CommandResult }>({
      query: graphQLOperations.sendVehicleCommand,
      variables: {
        command: 'F',
        label: '前進'
      }
    });

    expect(response.data.sendVehicleCommand).toEqual({
      command: 'F',
      label: '前進',
      sent: true
    });
    expect(mock.writeValue).toHaveBeenCalledWith(Uint8Array.from([0xff, 228, 128, (228 + 128) & 0xff]));
  });

  it('disconnects and reports offline status', async () => {
    const mock = createMockBluetooth();
    const api = createVehicleGraphQLApi({ bluetooth: mock.bluetooth });

    await api.execute({
      query: graphQLOperations.connectVehicle,
      variables: {
        serviceUuid: 'service-id',
        characteristicUuid: 'characteristic-id'
      }
    });

    const response = await api.execute<{ disconnectVehicle: VehicleStatus }>({
      query: graphQLOperations.disconnectVehicle
    });

    expect(mock.disconnect).toHaveBeenCalledTimes(1);
    expect(response.data.disconnectVehicle.connected).toBe(false);
  });

  it('marks the vehicle offline when bluetooth disconnects unexpectedly', async () => {
    const mock = createMockBluetooth();
    const onConnectionChange = jest.fn();
    const api = createVehicleGraphQLApi({
      bluetooth: mock.bluetooth,
      onConnectionChange
    });

    await api.execute({
      query: graphQLOperations.connectVehicle,
      variables: {
        serviceUuid: 'service-id',
        characteristicUuid: 'characteristic-id'
      }
    });

    mock.triggerDisconnect();

    expect(api.getStatus().connected).toBe(false);
    expect(onConnectionChange).toHaveBeenLastCalledWith(false);
  });

  it('throws if bluetooth is unavailable', async () => {
    const api = createVehicleGraphQLApi({});

    await expect(
      api.execute({
        query: graphQLOperations.connectVehicle,
        variables: {
          serviceUuid: 'service-id',
          characteristicUuid: 'characteristic-id'
        }
      })
    ).rejects.toThrow('瀏覽器不支援 Web Bluetooth API');
  });

  it('throws if a command is sent before connecting', async () => {
    const api = createVehicleGraphQLApi({});

    await expect(
      api.execute({
        query: graphQLOperations.sendVehicleCommand,
        variables: {
          command: 'S',
          label: '煞車'
        }
      })
    ).rejects.toThrow('尚未連線');
  });

  it('throws for unknown GraphQL operations', async () => {
    const api = createVehicleGraphQLApi({});

    await expect(
      api.execute({
        query: 'mutation UnknownOperation { noop }'
      })
    ).rejects.toThrow('Unknown GraphQL operation');
  });
});
