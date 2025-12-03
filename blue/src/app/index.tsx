import { useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BottomMenu } from '../components/BottomMenu';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { BluetoothProvider } from '../contexts/BluetoothContext';
import { DiscoverScreen } from '../screens/DiscoverScreen';
import { EditScreen } from '../screens/EditScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { SavedScreen } from '../screens/SavedScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { SignUpScreen } from '../screens/SignUpScreen';

const MainApp = () => {
	const [route, setRoute] = useState('discover');
	const { user, loading } = useAuth();

	const navigate = (to: string) => setRoute(to);

	if (loading) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size="large" color="#007AFF" />
			</View>
		);
	}

	// Show auth screens if not logged in
	if (!user) {
		if (route === 'signup') {
			return <SignUpScreen navigate={navigate} />;
		}
		return <LoginScreen navigate={navigate} />;
	}

	// Show main app if logged in
	return (
		<BluetoothProvider>
			<View style={{ flex: 1 }}>
				<View style={{ flex: 1 }}>
					{route === 'discover' && <DiscoverScreen navigate={navigate} />}
					{route === 'saved' && <SavedScreen navigate={navigate} />}
					{route === 'edit' && <EditScreen navigate={navigate} />}
					{route === 'settings' && <SettingsScreen navigate={navigate} />}
				</View>
				<BottomMenu current={route} navigate={navigate} />
			</View>
		</BluetoothProvider>
	);
};

const App = () => {
	return (
		<SafeAreaProvider>
			<AuthProvider>
				<MainApp />
			</AuthProvider>
		</SafeAreaProvider>
	);
};

const styles = StyleSheet.create({
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#F2F2F7',
	},
});

export default App;