import { PermissionsAndroid, Platform } from 'react-native';
import { BleError, BleManager, Device } from 'react-native-ble-plx';

class BluetoothService {
	private manager: BleManager | null = null;

	constructor() {
		// Lazy initialization to avoid crash in Expo Go
	}

	private getManager(): BleManager | null {
		if (this.manager) return this.manager;
		try {
			this.manager = new BleManager();
			return this.manager;
		} catch (error) {
			console.warn('Failed to initialize BleManager. Are you running in Expo Go? Native modules are not supported in Expo Go.', error);
			return null;
		}
	}

	async requestPermissions(): Promise<boolean> {
		if (Platform.OS === 'android') {
			if (Platform.Version >= 31) {
				const result = await PermissionsAndroid.requestMultiple([
					PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
					PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
					PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
				]);

				return (
					result['android.permission.BLUETOOTH_CONNECT'] === PermissionsAndroid.RESULTS.GRANTED &&
					result['android.permission.BLUETOOTH_SCAN'] === PermissionsAndroid.RESULTS.GRANTED &&
					result['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED
				);
			} else {
				const granted = await PermissionsAndroid.request(
					PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
				);
				return granted === PermissionsAndroid.RESULTS.GRANTED;
			}
		}
		return true; // iOS permissions are handled by the library/OS automatically on first use usually, or added in Info.plist
	}

	startScan(onDeviceFound: (device: Device) => void, onError: (error: BleError) => void) {
		const manager = this.getManager();
		if (!manager) {
			onError({ message: 'Bluetooth Manager not initialized. Run in Development Build.', errorCode: 0, attErrorCode: 0, iosErrorCode: 0, androidErrorCode: 0, reason: 'Native Module Missing' } as any);
			return;
		}

		manager.startDeviceScan(null, null, (error, device) => {
			if (error) {
				onError(error);
				return;
			}
			if (device) {
				onDeviceFound(device);
			}
		});
	}

	stopScan() {
		this.getManager()?.stopDeviceScan();
	}

	async connect(deviceId: string): Promise<Device> {
		const manager = this.getManager();
		if (!manager) throw new Error('Bluetooth Manager not initialized');

		try {
			const device = await manager.connectToDevice(deviceId);
			return await device.discoverAllServicesAndCharacteristics();
		} catch (error) {
			throw error;
		}
	}

	async disconnect(deviceId: string) {
		try {
			await this.getManager()?.cancelDeviceConnection(deviceId);
		} catch (error) {
			console.warn('Disconnect error', error);
		}
	}
}

export const bluetoothService = new BluetoothService();
