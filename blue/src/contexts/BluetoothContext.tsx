import React, { createContext, useContext, useEffect, useState } from 'react';
import { MOCK_DEVICES } from '../data/mockDevices';
import { firebaseService } from '../services/FirebaseService';
import { BluetoothDevice } from '../types';
import { useAuth } from './AuthContext';

type BluetoothContextType = {
	devices: BluetoothDevice[]; // Synced devices from Firestore
	availableDevices: BluetoothDevice[]; // Mock devices available to sync
	loading: boolean;
	loadMockDevices: () => void;
	syncDevice: (device: BluetoothDevice) => Promise<void>;
	unsyncDevice: (deviceId: string) => Promise<void>;
	updateDevice: (id: string, data: Partial<BluetoothDevice>) => Promise<void>;
	editingDeviceId: string | null;
	setEditingDeviceId: (id: string | null) => void;
};

const BluetoothContext = createContext<BluetoothContextType | undefined>(undefined);

export const BluetoothProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const { user } = useAuth();
	const [devices, setDevices] = useState<BluetoothDevice[]>([]); // Synced devices
	const [availableDevices, setAvailableDevices] = useState<BluetoothDevice[]>([]); // Mock devices
	const [loading, setLoading] = useState(false);
	const [editingDeviceId, setEditingDeviceId] = useState<string | null>(null);

	// Load synced devices from Firestore when user changes
	useEffect(() => {
		if (user) {
			loadSyncedDevices();
		} else {
			setDevices([]);
		}
	}, [user]);

	const loadSyncedDevices = async () => {
		setLoading(true);
		try {
			const syncedDevices = await firebaseService.getDevices();
			setDevices(syncedDevices);
		} catch (error) {
			console.error('Error loading synced devices:', error);
		} finally {
			setLoading(false);
		}
	};

	const loadMockDevices = () => {
		// Merge mock devices with sync status
		const mergedDevices = MOCK_DEVICES.map(mockDevice => {
			const syncedDevice = devices.find(d => d.address === mockDevice.address);
			if (syncedDevice) {
				return { ...mockDevice, isSynced: true };
			}
			return { ...mockDevice, isSynced: false };
		});
		setAvailableDevices(mergedDevices);
	};

	const syncDevice = async (device: BluetoothDevice) => {
		try {
			await firebaseService.syncDevice(device);
			await loadSyncedDevices();
			// Update available devices to reflect sync status
			setAvailableDevices(prev =>
				prev.map(d => d.id === device.id ? { ...d, isSynced: true } : d)
			);
		} catch (error) {
			console.error('Error syncing device:', error);
			throw error;
		}
	};

	const unsyncDevice = async (deviceId: string) => {
		try {
			await firebaseService.deleteDevice(deviceId);
			await loadSyncedDevices();
			// Update available devices to reflect sync status
			setAvailableDevices(prev =>
				prev.map(d => d.id === deviceId ? { ...d, isSynced: false } : d)
			);
		} catch (error) {
			console.error('Error unsyncing device:', error);
			throw error;
		}
	};

	const updateDevice = async (id: string, data: Partial<BluetoothDevice>) => {
		try {
			const device = devices.find(d => d.id === id);
			if (device) {
				const updatedDevice = { ...device, ...data };
				await firebaseService.syncDevice(updatedDevice);
				await loadSyncedDevices();
			}
		} catch (error) {
			console.error('Error updating device:', error);
			throw error;
		}
	};

	return (
		<BluetoothContext.Provider
			value={{
				devices,
				availableDevices,
				loading,
				loadMockDevices,
				syncDevice,
				unsyncDevice,
				updateDevice,
				editingDeviceId,
				setEditingDeviceId,
			}}
		>
			{children}
		</BluetoothContext.Provider>
	);
};

export const useBluetooth = () => {
	const ctx = useContext(BluetoothContext);
	if (!ctx) throw new Error('useBluetooth must be used within BluetoothProvider');
	return ctx;
};
