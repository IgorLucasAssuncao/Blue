export type BluetoothDevice = {
	id: string;
	name: string;
	address?: string;
	notes?: string;
	// New fields
	priority?: number;
	customName?: string;
	autoConnect?: boolean;
	rssi?: number;
	// Firebase fields
	isSynced?: boolean;
	userId?: string;
};
