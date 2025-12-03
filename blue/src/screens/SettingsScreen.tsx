import React from 'react';
import { Alert, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useAuth } from '../contexts/AuthContext';

export const SettingsScreen: React.FC<{ navigate?: (to: string) => void }> = ({ navigate }) => {
	const { user, signOut } = useAuth();

	const handleSignOut = () => {
		Alert.alert(
			'Sair',
			'Tem certeza que deseja sair?',
			[
				{ text: 'Cancelar', style: 'cancel' },
				{
					text: 'Sair',
					style: 'destructive',
					onPress: async () => {
						await signOut();
						navigate?.('login');
					},
				},
			]
		);
	};

	return (
		<View style={styles.container}>
			{/* Header */}
			<View style={styles.header}>
				<Text style={styles.title}>Configurações</Text>
				<Text style={styles.subtitle}>
					Gerencie suas preferências
				</Text>
			</View>

			{/* User Info */}
			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Conta</Text>
				<View style={styles.card}>
					<View style={styles.userInfo}>
						<View style={styles.userIcon}>
							<Icon name="user" size={24} color="#007AFF" />
						</View>
						<View style={styles.userDetails}>
							<Text style={styles.userName}>Usuário</Text>
							<Text style={styles.userEmail}>{user?.email}</Text>
						</View>
					</View>
				</View>
			</View>

			{/* Sign Out */}
			<View style={styles.section}>
				<TouchableOpacity
					style={styles.signOutButton}
					onPress={handleSignOut}
					activeOpacity={0.8}
				>
					<Icon name="log-out" size={20} color="#FF3B30" />
					<Text style={styles.signOutButtonText}>Sair</Text>
				</TouchableOpacity>
			</View>

			{/* App Info */}
			<View style={styles.footer}>
				<Text style={styles.footerText}>Blue v1.0.0</Text>
				<Text style={styles.footerSubtext}>Gerenciador de Conexões Bluetooth</Text>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#F2F2F7',
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
	card: {
		backgroundColor: '#FFFFFF',
		borderRadius: 12,
		padding: 16,
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
	userInfo: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	userIcon: {
		width: 48,
		height: 48,
		borderRadius: 24,
		backgroundColor: '#E5F2FF',
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 12,
	},
	userDetails: {
		flex: 1,
	},
	userName: {
		fontSize: 17,
		fontWeight: '600',
		color: '#000000',
		marginBottom: 2,
	},
	userEmail: {
		fontSize: 14,
		color: '#8E8E93',
	},
	signOutButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#FFFFFF',
		paddingVertical: 16,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: '#FF3B30',
	},
	signOutButtonText: {
		color: '#FF3B30',
		fontSize: 17,
		fontWeight: '600',
		marginLeft: 8,
	},
	footer: {
		position: 'absolute',
		bottom: 32,
		left: 0,
		right: 0,
		alignItems: 'center',
	},
	footerText: {
		fontSize: 13,
		color: '#8E8E93',
		fontWeight: '600',
	},
	footerSubtext: {
		fontSize: 12,
		color: '#C7C7CC',
		marginTop: 4,
	},
});
