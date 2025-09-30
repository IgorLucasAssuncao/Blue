import { BluetoothDevice } from '../types';

// Simple mock bluetooth service — keeps the app functional without native modules.
const mockDevices: BluetoothDevice[] = [
  { id: '1', name: 'Device A', address: 'AA:BB:CC:DD:EE:01' },
  { id: '2', name: 'Device B', address: 'AA:BB:CC:DD:EE:02' },
  { id: '3', name: 'Device C', address: 'AA:BB:CC:DD:EE:03' },
];

export const discoverDevices = async (timeout = 800): Promise<BluetoothDevice[]> => {
  await new Promise((r) => setTimeout(r, timeout));
  return mockDevices.map((d) => ({ ...d }));
};

export const connectToDevice = async (id: string): Promise<boolean> => {
  // mock connect
  await new Promise((r) => setTimeout(r, 300));
  return true;
};

export const disconnectDevice = async (id: string): Promise<void> => {
  await new Promise((r) => setTimeout(r, 150));
};
