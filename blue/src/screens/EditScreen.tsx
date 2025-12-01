import React, { useEffect, useState } from 'react';
import {
	Animated,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	StyleSheet,
	Switch,
	Text,
	TextInput,
	TouchableOpacity,
	View
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useBluetooth } from '../contexts/BluetoothContext';

export const EditScreen: React.FC<{ navigate: (to: string) => void }> = ({ navigate }) => {
	const { devices, updateDevice, editingDeviceId, setEditingDeviceId } = useBluetooth();
	const [selectedId, setSelectedId] = useState<string | null>(devices[0]?.id ?? null);
	const selected = devices.find((d) => d.id === selectedId);

	const [notes, setNotes] = useState(selected?.notes ?? '');
	const [customName, setCustomName] = useState(selected?.customName ?? '');
	const [priority, setPriority] = useState(selected?.priority?.toString() ?? '0');
	const [autoConnect, setAutoConnect] = useState(selected?.autoConnect ?? false);

	useEffect(() => {
		if (editingDeviceId) {
			setSelectedId(editingDeviceId);
			const dev = devices.find((d) => d.id === editingDeviceId);
			if (dev) {
				setNotes(dev.notes ?? '');
				setCustomName(dev.customName ?? '');
				setPriority(dev.priority?.toString() ?? '0');
				setAutoConnect(dev.autoConnect ?? false);
			}
			// clear the editing hint
			setEditingDeviceId(null);
		} else if (selectedId) {
			// When selectedId changes manually
			const dev = devices.find((d) => d.id === selectedId);
			if (dev) {
				setNotes(dev.notes ?? '');
				setCustomName(dev.customName ?? '');
				setPriority(dev.priority?.toString() ?? '0');
				setAutoConnect(dev.autoConnect ?? false);
			}
		}
	}, [editingDeviceId, selectedId, devices]);

	const fadeAnim = React.useRef(new Animated.Value(1)).current;

	const handleSelectDevice = (deviceId: string) => {
		// Animação de fade out/in
		Animated.sequence([
			Animated.timing(fadeAnim, {
				toValue: 0,
				duration: 150,
				useNativeDriver: true,
			}),
			Animated.timing(fadeAnim, {
				toValue: 1,
				duration: 150,
				useNativeDriver: true,
			}),
		]).start();

		setSelectedId(deviceId);
	};

	const handleSave = () => {
		if (selectedId) {
			updateDevice(selectedId, {
				notes,
				customName,
				priority: parseInt(priority) || 0,
				autoConnect
			});
			// keep user on the edit screen; you could also navigate back
		}
	};

	return (
		<KeyboardAvoidingView
			style={styles.container}
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
		>
			<ScrollView
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}
			>
				{/* Header */}
				<View style={styles.header}>
					<Text style={styles.title}>Editar Dispositivo</Text>
					<Text style={styles.subtitle}>
						Gerencie preferências e prioridades
					</Text>
				</View>

				{/* Device List */}
				{devices.length === 0 ? (
					<View style={styles.emptyState}>
						<Icon name="bluetooth" size={48} color="#C7C7CC" />
						<Text style={styles.emptyStateText}>
							Nenhum dispositivo salvo
						</Text>
						<TouchableOpacity
							style={styles.discoverButton}
							onPress={() => navigate('discover')}
						>
							<Text style={styles.discoverButtonText}>Descobrir Dispositivos</Text>
						</TouchableOpacity>
					</View>
				) : (
					<View>
						<View style={styles.section}>
							<Text style={styles.sectionTitle}>Selecione um dispositivo</Text>
							<View style={styles.deviceList}>
								{devices.map((device) => (
									<TouchableOpacity
										key={device.id}
										style={[
											styles.deviceItem,
											selectedId === device.id && styles.deviceItemSelected
										]}
										onPress={() => handleSelectDevice(device.id)}
										activeOpacity={0.7}
									>
										<View style={styles.deviceIcon}>
											<Icon
												name="smartphone"
												size={20}
												color={selectedId === device.id ? '#007AFF' : '#8E8E93'}
											/>
										</View>
										<View style={styles.deviceInfo}>
											<Text style={[
												styles.deviceName,
												selectedId === device.id && styles.deviceNameSelected
											]}>
												{device.customName || device.name}
											</Text>
											<Text style={styles.deviceAddress}>{device.address}</Text>
										</View>
										{selectedId === device.id && (
											<Icon name="check" size={20} color="#007AFF" />
										)}
									</TouchableOpacity>
								))}
							</View>
						</View>

						{/* Edit Section */}
						{selected && (
							<Animated.View style={[styles.editSection, { opacity: fadeAnim }]}>
								<View style={styles.editCard}>
									<View style={styles.editHeader}>
										<Icon name="sliders" size={20} color="#007AFF" />
										<Text style={styles.editTitle}>Configurações</Text>
									</View>

									<Text style={styles.label}>Nome Personalizado</Text>
									<TextInput
										value={customName}
										onChangeText={setCustomName}
										style={styles.textInput}
										placeholder="Ex: Fone de Ouvido"
										placeholderTextColor="#C7C7CC"
									/>

									<Text style={styles.label}>Prioridade (Maior = Preferido)</Text>
									<TextInput
										value={priority}
										onChangeText={setPriority}
										style={styles.textInput}
										placeholder="0"
										placeholderTextColor="#C7C7CC"
										keyboardType="numeric"
									/>

									<View style={styles.switchRow}>
										<Text style={styles.labelSwitch}>Conexão Automática</Text>
										<Switch
											value={autoConnect}
											onValueChange={setAutoConnect}
											trackColor={{ false: "#767577", true: "#34C759" }}
											thumbColor={autoConnect ? "#FFFFFF" : "#f4f3f4"}
										/>
									</View>

									<Text style={styles.label}>Notas</Text>
									<TextInput
										value={notes}
										onChangeText={setNotes}
										style={[styles.textInput, styles.textArea]}
										placeholder="Adicione notas..."
										placeholderTextColor="#C7C7CC"
										multiline
										numberOfLines={3}
										textAlignVertical="top"
									/>

									<TouchableOpacity
										style={styles.saveButton}
										onPress={handleSave}
										activeOpacity={0.8}
									>
										<Icon name="save" size={20} color="#FFFFFF" />
										<Text style={styles.saveButtonText}>Salvar Alterações</Text>
									</TouchableOpacity>
								</View>
							</Animated.View>
						)}
					</View>
				)}
			</ScrollView>
		</KeyboardAvoidingView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#F2F2F7',
	},
	scrollContent: {
		flexGrow: 1,
	},
	header: {
		backgroundColor: '#FFFFFF',
		paddingHorizontal: 20,
		paddingTop: 20,
		paddingBottom: 24,
		borderBottomWidth: 1,
		borderBottomColor: '#E5E5EA',
	},
	title: {
		fontSize: 28,
		fontWeight: '700',
		color: '#000000',
		marginBottom: 4,
	},
	subtitle: {
		fontSize: 15,
		color: '#8E8E93',
		lineHeight: 20,
	},
	section: {
		marginTop: 20,
		paddingHorizontal: 20,
	},
	sectionTitle: {
		fontSize: 13,
		fontWeight: '600',
		color: '#8E8E93',
		textTransform: 'uppercase',
		letterSpacing: 0.3,
		marginBottom: 8,
	},
	deviceList: {
		backgroundColor: '#FFFFFF',
		borderRadius: 12,
		overflow: 'hidden',
		...Platform.select({
			ios: {
				shadowColor: '#000000',
				shadowOffset: { width: 0, height: 2 },
				shadowOpacity: 0.04,
				shadowRadius: 4,
			},
			android: {
				elevation: 2,
			},
		}),
	},
	deviceItem: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 16,
		paddingVertical: 14,
		borderBottomWidth: 0.5,
		borderBottomColor: '#E5E5EA',
	},
	deviceItemSelected: {
		backgroundColor: '#F0F8FF',
	},
	deviceIcon: {
		width: 36,
		height: 36,
		borderRadius: 18,
		backgroundColor: '#F2F2F7',
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 12,
	},
	deviceInfo: {
		flex: 1,
	},
	deviceName: {
		fontSize: 16,
		fontWeight: '600',
		color: '#000000',
		marginBottom: 2,
	},
	deviceNameSelected: {
		color: '#007AFF',
	},
	deviceAddress: {
		fontSize: 13,
		color: '#8E8E93',
	},
	editSection: {
		marginTop: 24,
		paddingHorizontal: 20,
		paddingBottom: 20,
	},
	editCard: {
		backgroundColor: '#FFFFFF',
		borderRadius: 12,
		padding: 20,
		...Platform.select({
			ios: {
				shadowColor: '#000000',
				shadowOffset: { width: 0, height: 2 },
				shadowOpacity: 0.04,
				shadowRadius: 4,
			},
			android: {
				elevation: 2,
			},
		}),
	},
	editHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 20,
	},
	editTitle: {
		fontSize: 17,
		fontWeight: '600',
		color: '#000000',
		marginLeft: 8,
	},
	label: {
		fontSize: 13,
		fontWeight: '600',
		color: '#8E8E93',
		marginBottom: 8,
		textTransform: 'uppercase',
	},
	textInput: {
		borderWidth: 1,
		borderColor: '#E5E5EA',
		borderRadius: 8,
		padding: 12,
		fontSize: 16,
		color: '#000000',
		backgroundColor: '#F8F8F8',
		marginBottom: 20,
	},
	textArea: {
		minHeight: 80,
	},
	switchRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: 20,
		paddingVertical: 4,
	},
	labelSwitch: {
		fontSize: 16,
		fontWeight: '500',
		color: '#000000',
	},
	saveButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#007AFF',
		paddingVertical: 14,
		borderRadius: 10,
		marginTop: 8,
		...Platform.select({
			ios: {
				shadowColor: '#007AFF',
				shadowOffset: { width: 0, height: 3 },
				shadowOpacity: 0.2,
				shadowRadius: 6,
			},
			android: {
				elevation: 3,
			},
		}),
	},
	saveButtonText: {
		color: '#FFFFFF',
		fontSize: 16,
		fontWeight: '600',
		marginLeft: 8,
	},
	emptyState: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: 40,
	},
	emptyStateText: {
		fontSize: 17,
		fontWeight: '600',
		color: '#3C3C43',
		marginTop: 16,
		marginBottom: 20,
	},
	discoverButton: {
		paddingHorizontal: 24,
		paddingVertical: 12,
		backgroundColor: '#007AFF',
		borderRadius: 8,
	},
	discoverButtonText: {
		color: '#FFFFFF',
		fontSize: 16,
		fontWeight: '600',
	},
});