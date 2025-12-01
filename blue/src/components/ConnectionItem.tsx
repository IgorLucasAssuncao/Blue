import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { BluetoothDevice } from '../types';

type Props = {
	device: BluetoothDevice;
	onEdit?: (d: BluetoothDevice) => void;
	onForget?: (id: string) => void;
};

export const ConnectionItem: React.FC<Props> = ({ device, onEdit, onForget }) => {
	return (
		<View style={styles.row}>
			<View style={styles.iconContainer}>
				<Icon name="smartphone" size={24} color="#007AFF" />
			</View>
			<View style={{ flex: 1 }}>
				<View style={styles.nameRow}>
					<Text style={styles.name}>{device.customName || device.name}</Text>
					{device.autoConnect && (
						<Icon name="zap" size={14} color="#FFD60A" style={styles.autoIcon} />
					)}
				</View>
				<Text style={styles.addr}>{device.address}</Text>
				<View style={styles.badges}>
					{device.priority !== undefined && device.priority > 0 && (
						<View style={styles.badge}>
							<Text style={styles.badgeText}>Prioridade: {device.priority}</Text>
						</View>
					)}
				</View>
				{device.notes ? <Text style={styles.notes} numberOfLines={1}>{device.notes}</Text> : null}
			</View>
			<View style={styles.actions}>
				<TouchableOpacity onPress={() => onEdit && onEdit(device)} style={styles.actionBtn}>
					<Icon name="edit-2" size={20} color="#8E8E93" />
				</TouchableOpacity>
				<TouchableOpacity onPress={() => onForget && onForget(device.id)} style={[styles.actionBtn, styles.deleteBtn]}>
					<Icon name="trash-2" size={20} color="#FF3B30" />
				</TouchableOpacity>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	row: {
		flexDirection: 'row',
		padding: 16,
		borderBottomWidth: 1,
		borderColor: '#eee',
		alignItems: 'center'
	},
	iconContainer: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: '#F2F2F7',
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 12,
	},
	nameRow: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	name: {
		fontWeight: '600',
		fontSize: 16,
		color: '#000',
		marginRight: 6
	},
	autoIcon: {
		marginTop: 2,
	},
	addr: {
		color: '#8E8E93',
		fontSize: 13,
		marginTop: 2
	},
	badges: {
		flexDirection: 'row',
		marginTop: 6,
	},
	badge: {
		backgroundColor: '#E5F2FF',
		paddingHorizontal: 8,
		paddingVertical: 2,
		borderRadius: 4,
	},
	badgeText: {
		color: '#007AFF',
		fontSize: 11,
		fontWeight: '600',
	},
	notes: {
		color: '#333',
		marginTop: 6,
		fontSize: 13,
		fontStyle: 'italic'
	},
	actions: {
		flexDirection: 'row',
		alignItems: 'center',
		marginLeft: 8
	},
	actionBtn: {
		padding: 8,
	},
	deleteBtn: {
		marginLeft: 4,
	},
});
