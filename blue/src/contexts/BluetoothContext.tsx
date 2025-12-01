import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Device } from 'react-native-ble-plx';
import { bluetoothService } from '../services/bluetoothService';
import { loadConnections, saveConnections } from '../storage/storage';
import { BluetoothDevice } from '../types';

type BluetoothContextType = {
	devices: BluetoothDevice[]; // Saved devices
	availableDevices: BluetoothDevice[]; // Scanned devices
	isScanning: boolean;
	connectedDevice: BluetoothDevice | null;
	startScanning: () => Promise<void>;
	stopScanning: () => void;
	connectToDevice: (d: BluetoothDevice) => Promise<void>;
	disconnectDevice: () => Promise<void>;
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
	const [availableDevices, setAvailableDevices] = useState<BluetoothDevice[]>([]);
	const [isScanning, setIsScanning] = useState(false);
	const [editingDeviceId, setEditingDeviceId] = useState<string | null>(null);

	// Ref to keep track of devices without triggering re-renders in the scan callback
	const devicesRef = useRef<BluetoothDevice[]>([]);
	const connectedDeviceIdRef = useRef<string | null>(null);

	useEffect(() => {
		devicesRef.current = devices;
	}, [devices]);

	useEffect(() => {
		(async () => {
			const loaded = await loadConnections();
			setDevices(loaded || []);
		})();
	}, []);

	useEffect(() => {
		saveConnections(devices).catch((e) => console.warn('saveConnections error', e));
	}, [devices]);

	const startScanning = async () => {
		const granted = await bluetoothService.requestPermissions();
		if (!granted) {
			console.warn('Bluetooth permissions not granted');
			return;
		}

		setIsScanning(true);
		setAvailableDevices([]);

		bluetoothService.startScan(
			(device: Device) => {
				if (!device.name) return; // Filter unnamed devices for cleaner UI

				setAvailableDevices((prev) => {
					if (prev.find((d) => d.address === device.id)) return prev;
					return [...prev, {
						id: device.id,
						name: device.name || 'Unknown',
						address: device.id,
						rssi: device.rssi || 0
					}];
				});

				// Priority Auto-Connect Logic
				checkPriorityConnection(device);
			},
			(error) => {
				console.warn('Scan error', error);
				setIsScanning(false);
			}
		);
	};

	const stopScanning = () => {
		bluetoothService.stopScan();
		setIsScanning(false);
	};

	const [connectedDevice, setConnectedDevice] = useState<BluetoothDevice | null>(null);
	const connectedDeviceRef = useRef<BluetoothDevice | null>(null);

	useEffect(() => {
		connectedDeviceRef.current = connectedDevice;
	}, [connectedDevice]);

	// ... (existing useEffects)

	const connectToDevice = async (device: BluetoothDevice) => {
		try {
			console.log(`Connecting to ${device.name}...`);
			await bluetoothService.connect(device.id);
			setConnectedDevice(device);
			console.log(`Connected to ${device.name}`);
		} catch (e) {
			console.warn('Connection failed', e);
		}
	};

	const disconnectDevice = async () => {
		if (connectedDevice) {
			await bluetoothService.disconnect(connectedDevice.id);
			setConnectedDevice(null);
		}
	};

	const checkPriorityConnection = async (scannedDevice: Device) => {
		const savedDevice = devicesRef.current.find(d => d.address === scannedDevice.id);

		if (savedDevice && savedDevice.autoConnect) {
			const current = connectedDeviceRef.current;

			// If not connected, connect to this one
			if (!current) {
				console.log(`Auto-connecting to ${savedDevice.name} (Priority: ${savedDevice.priority})`);
				connectToDevice(savedDevice);
				return;
			}

			// If connected, check priority
			const currentPriority = current.priority || 0;
			const newPriority = savedDevice.priority || 0;

			if (newPriority > currentPriority) {
				console.log(`Found higher priority device: ${savedDevice.name} (${newPriority}) > ${current.name} (${currentPriority})`);
				console.log('Switching connection...');
				await disconnectDevice();
				await connectToDevice(savedDevice);
			}
		}
	};

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
		<BluetoothContext.Provider value={{
			devices,
			availableDevices,
			isScanning,
			connectedDevice,
			startScanning,
			stopScanning,
			connectToDevice,
			disconnectDevice,
			addDevice,
			updateDevice,
			removeDevice,
			setDevicesLocal,
			editingDeviceId,
			setEditingDeviceId
		}}>
			{children}
		</BluetoothContext.Provider>
	);
};

export const useBluetooth = () => {
	const ctx = useContext(BluetoothContext);
	if (!ctx) throw new Error('useBluetooth must be used within BluetoothProvider');
	return ctx;
};
