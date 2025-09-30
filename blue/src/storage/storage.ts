import AsyncStorage from '@react-native-async-storage/async-storage';
import { BluetoothDevice } from '../types';

const KEY = '@blue:connections';

export const loadConnections = async (): Promise<BluetoothDevice[]> => {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw) as BluetoothDevice[];
  } catch (e) {
    console.warn('loadConnections error', e);
    return [];
  }
};

export const saveConnections = async (devices: BluetoothDevice[]) => {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(devices));
  } catch (e) {
    console.warn('saveConnections error', e);
  }
};
