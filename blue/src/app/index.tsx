import React, { useState } from 'react';
import { View } from 'react-native';
import { BluetoothProvider } from '../contexts/BluetoothContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BottomMenu } from '../components/BottomMenu';
import { DiscoverScreen } from '../screens/DiscoverScreen';
import { SavedScreen } from '../screens/SavedScreen';
import { EditScreen } from '../screens/EditScreen';
import { SettingsScreen } from '../screens/SettingsScreen';

const App = () => {
    const [route, setRoute] = useState('discover');

    const navigate = (to: string) => setRoute(to);

        return (
            <SafeAreaProvider>
                <BluetoothProvider>
                    <View style={{ flex: 1 }}>
                        <View style={{ flex: 1 }}>
                            {route === 'discover' && <DiscoverScreen navigate={navigate} />}
                            {route === 'saved' && <SavedScreen navigate={navigate} />}
                            {route === 'edit' && <EditScreen navigate={navigate} />}
                            {route === 'settings' && <SettingsScreen />}
                        </View>
                        <BottomMenu current={route} navigate={navigate} />
                    </View>
                </BluetoothProvider>
            </SafeAreaProvider>
        );
};

export default App;