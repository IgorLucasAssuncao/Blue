import React, { useState } from 'react';
import {
	ActivityIndicator,
	Alert,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useAuth } from '../contexts/AuthContext';

export const SignUpScreen: React.FC<{ navigate: (to: string) => void }> = ({ navigate }) => {
	const { signUp } = useAuth();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [loading, setLoading] = useState(false);

	const handleSignUp = async () => {
		if (!email || !password || !confirmPassword) {
			Alert.alert('Erro', 'Por favor, preencha todos os campos');
			return;
		}

		if (password !== confirmPassword) {
			Alert.alert('Erro', 'As senhas não coincidem');
			return;
		}

		if (password.length < 6) {
			Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres');
			return;
		}

		setLoading(true);
		try {
			await signUp(email, password);
			// Navigation will happen automatically via AuthContext state change
		} catch (error: any) {
			Alert.alert('Cadastro Falhou', error.message || 'Ocorreu um erro');
		} finally {
			setLoading(false);
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
				<View style={styles.content}>
					{/* Header */}
					<View style={styles.header}>
						<Icon name="user-plus" size={64} color="#007AFF" />
						<Text style={styles.title}>Criar Conta</Text>
						<Text style={styles.subtitle}>Configure seu cofre pessoal</Text>
					</View>

					{/* Form */}
					<View style={styles.form}>
						<Text style={styles.label}>Email</Text>
						<TextInput
							style={styles.input}
							placeholder="seu@email.com"
							placeholderTextColor="#C7C7CC"
							value={email}
							onChangeText={setEmail}
							autoCapitalize="none"
							keyboardType="email-address"
							editable={!loading}
						/>

						<Text style={styles.label}>Senha</Text>
						<TextInput
							style={styles.input}
							placeholder="Mínimo 6 caracteres"
							placeholderTextColor="#C7C7CC"
							value={password}
							onChangeText={setPassword}
							secureTextEntry
							editable={!loading}
						/>

						<Text style={styles.label}>Confirmar Senha</Text>
						<TextInput
							style={styles.input}
							placeholder="Digite a senha novamente"
							placeholderTextColor="#C7C7CC"
							value={confirmPassword}
							onChangeText={setConfirmPassword}
							secureTextEntry
							editable={!loading}
						/>

						<TouchableOpacity
							style={[styles.button, loading && styles.buttonDisabled]}
							onPress={handleSignUp}
							disabled={loading}
							activeOpacity={0.8}
						>
							{loading ? (
								<ActivityIndicator color="#FFFFFF" />
							) : (
								<>
									<Icon name="check-circle" size={20} color="#FFFFFF" />
									<Text style={styles.buttonText}>Cadastrar</Text>
								</>
							)}
						</TouchableOpacity>

						<TouchableOpacity
							style={styles.linkButton}
							onPress={() => navigate('login')}
							disabled={loading}
						>
							<Text style={styles.linkText}>
								Já tem uma conta? <Text style={styles.linkTextBold}>Faça login</Text>
							</Text>
						</TouchableOpacity>
					</View>
				</View>
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
	content: {
		flex: 1,
		justifyContent: 'center',
		paddingHorizontal: 32,
		paddingVertical: 48,
	},
	header: {
		alignItems: 'center',
		marginBottom: 48,
	},
	title: {
		fontSize: 32,
		fontWeight: '700',
		color: '#000000',
		marginTop: 16,
	},
	subtitle: {
		fontSize: 15,
		color: '#8E8E93',
		marginTop: 8,
	},
	form: {
		width: '100%',
	},
	label: {
		fontSize: 13,
		fontWeight: '600',
		color: '#8E8E93',
		marginBottom: 8,
		textTransform: 'uppercase',
		letterSpacing: 0.3,
	},
	input: {
		backgroundColor: '#FFFFFF',
		borderWidth: 1,
		borderColor: '#E5E5EA',
		borderRadius: 12,
		padding: 16,
		fontSize: 16,
		color: '#000000',
		marginBottom: 20,
	},
	button: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#007AFF',
		paddingVertical: 16,
		borderRadius: 12,
		marginTop: 8,
		...Platform.select({
			ios: {
				shadowColor: '#007AFF',
				shadowOffset: { width: 0, height: 4 },
				shadowOpacity: 0.3,
				shadowRadius: 8,
			},
			android: {
				elevation: 4,
			},
		}),
	},
	buttonDisabled: {
		backgroundColor: '#C7C7CC',
	},
	buttonText: {
		color: '#FFFFFF',
		fontSize: 17,
		fontWeight: '600',
		marginLeft: 8,
	},
	linkButton: {
		alignItems: 'center',
		marginTop: 24,
	},
	linkText: {
		fontSize: 15,
		color: '#8E8E93',
	},
	linkTextBold: {
		color: '#007AFF',
		fontWeight: '600',
	},
});
