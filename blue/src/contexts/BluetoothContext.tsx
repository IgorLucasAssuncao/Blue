import React, { createContext, useContext, useEffect, useState } from 'react';
import { BluetoothDevice } from '../types';
import { loadConnections, saveConnections } from '../storage/storage';

type BluetoothContextType = {
  devices: BluetoothDevice[];
  addDevice: (d: BluetoothDevice) => Promise<void>;
  updateDevice: (id: string, data: Partial<BluetoothDevice>) => Promise<void>;
  removeDevice: (id: string) => Promise<void>;
  setDevicesLocal: (devices: BluetoothDevice[]) => void;
  editingDeviceId: string | null;
  setEditingDeviceId: (id: string | null) => void;
};

const BluetoothContext = createContext<BluetoothContextType | undefined>(undefined);

export const BluetoothProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [devices, setDevices] = useState<BluetoothDevice[]>([]);
  const [editingDeviceId, setEditingDeviceId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const loaded = await loadConnections();
      setDevices(loaded || []);
    })();
  }, []);

  useEffect(() => {
    saveConnections(devices).catch((e) => console.warn('saveConnections error', e));
  }, [devices]);

  const addDevice = async (d: BluetoothDevice) => {
    setDevices((s) => {
      if (d.address) {
        const exists = s.find((x) => x.address === d.address);
        if (exists) return s.map((x) => (x.address === d.address ? { ...x, ...d } : x));
      }
      if (s.find((x) => x.id === d.id)) return s;
      return [...s, d];
    });
  };

  const updateDevice = async (id: string, data: Partial<BluetoothDevice>) => {
    setDevices((s) => s.map((item) => (item.id === id ? { ...item, ...data } : item)));
  };

  const removeDevice = async (id: string) => {
    setDevices((s) => s.filter((item) => item.id !== id));
  };

  const setDevicesLocal = (ds: BluetoothDevice[]) => setDevices(ds);

  return (
    <BluetoothContext.Provider value={{ devices, addDevice, updateDevice, removeDevice, setDevicesLocal, editingDeviceId, setEditingDeviceId }}>
      {children}
    </BluetoothContext.Provider>
  );
};

export const useBluetooth = () => {
  const ctx = useContext(BluetoothContext);
  if (!ctx) throw new Error('useBluetooth must be used within BluetoothProvider');
  return ctx;
};
