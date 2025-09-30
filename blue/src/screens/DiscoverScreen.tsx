import React, { useState } from 'react';
import { 
View, 
Text, 
TouchableOpacity, 
FlatList, 
StyleSheet, 
ActivityIndicator,
Animated,
Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { discoverDevices } from '../services/bluetoothService';
import { useBluetooth } from '../contexts/BluetoothContext';

// Replace uuid import with a simple implementation
function generateUUID() {
return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
  const r = Math.random() * 16 | 0;
  const v = c === 'x' ? r : (r & 0x3 | 0x8);
  return v.toString(16);
});
}

export const DiscoverScreen: React.FC<{ navigate: (to: string) => void }> = ({ navigate }) => {
const [scanning, setScanning] = useState(false);
const [found, setFound] = useState<any[]>([]);
const { addDevice } = useBluetooth();
const fadeAnim = React.useRef(new Animated.Value(0)).current;

const scan = async () => {
setScanning(true);
setFound([]);

const devices = await discoverDevices();
setFound(devices);

// Animação de entrada dos dispositivos
Animated.timing(fadeAnim, {
  toValue: 1,
  duration: 300,
  useNativeDriver: true,
}).start();

setScanning(false);
};

const handleSaveDevice = async (item: any) => {
await addDevice({ 
  id: generateUUID(), // Using our custom UUID generator
  name: item.name, 
  address: item.address 
});
navigate('saved');
};

return (
<View style={styles.container}>
  {/* Header */}
  <View style={styles.header}>
    <Text style={styles.title}>Descobrir Dispositivos</Text>
    <Text style={styles.subtitle}>
      Encontre e conecte-se a dispositivos Bluetooth próximos
    </Text>
  </View>

  {/* Scan Button */}
  <TouchableOpacity
    style={[styles.scanButton, scanning && styles.scanButtonActive]}
    onPress={scan}
    disabled={scanning}
    activeOpacity={0.8}
  >
    {scanning ? (
      <View style={styles.scanButtonContent}>
        <ActivityIndicator color="#FFFFFF" size="small" />
        <Text style={styles.scanButtonText}>Escaneando...</Text>
      </View>
    ) : (
      <View style={styles.scanButtonContent}>
        <Icon name="bluetooth" size={20} color="#FFFFFF" />
        <Text style={styles.scanButtonText}>Escanear Dispositivos</Text>
      </View>
    )}
  </TouchableOpacity>

  {/* Results */}
  {found.length === 0 && !scanning ? (
    <View style={styles.emptyState}>
      <Icon name="bluetooth" size={48} color="#C7C7CC" />
      <Text style={styles.emptyStateText}>
        Nenhum dispositivo encontrado
      </Text>
      <Text style={styles.emptyStateSubtext}>
        Toque em "Escanear Dispositivos" para procurar
      </Text>
    </View>
  ) : (
    <Animated.View style={[styles.listContainer, { opacity: fadeAnim }]}>
      <FlatList
        data={found}
        keyExtractor={(item, index) => item.id || `device-${index}`}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item, index }) => (
          <Animated.View
            style={[
              styles.deviceCard,
              {
                opacity: fadeAnim,
                transform: [{
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                }],
              },
            ]}
          >
            <View style={styles.deviceIcon}>
              <Icon name="smartphone" size={24} color="#007AFF" />
            </View>
            
            <View style={styles.deviceInfo}>
              <Text style={styles.deviceName}>{item.name || 'Dispositivo sem nome'}</Text>
              <Text style={styles.deviceAddress}>{item.address}</Text>
            </View>
            
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => handleSaveDevice(item)}
              activeOpacity={0.7}
            >
              <Icon name="plus" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </Animated.View>
        )}
      />
    </Animated.View>
  )}
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
scanButton: {
flexDirection: 'row',
alignItems: 'center',
justifyContent: 'center',
backgroundColor: '#007AFF',
marginHorizontal: 20,
marginVertical: 20,
paddingVertical: 16,
borderRadius: 12,
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
scanButtonActive: {
backgroundColor: '#0051D5',
},
scanButtonContent: {
flexDirection: 'row',
alignItems: 'center',
},
scanButtonText: {
color: '#FFFFFF',
fontSize: 17,
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
marginBottom: 4,
},
emptyStateSubtext: {
fontSize: 15,
color: '#8E8E93',
textAlign: 'center',
lineHeight: 20,
},
listContainer: {
flex: 1,
},
listContent: {
paddingVertical: 8,
},
separator: {
height: 1,
backgroundColor: '#E5E5EA',
marginLeft: 76,
},
deviceCard: {
flexDirection: 'row',
alignItems: 'center',
backgroundColor: '#FFFFFF',
paddingHorizontal: 20,
paddingVertical: 16,
},
deviceIcon: {
width: 44,
height: 44,
borderRadius: 22,
backgroundColor: '#E5F2FF',
alignItems: 'center',
justifyContent: 'center',
marginRight: 12,
},
deviceInfo: {
flex: 1,
marginRight: 12,
},
deviceName: {
fontSize: 17,
fontWeight: '600',
color: '#000000',
marginBottom: 2,
},
deviceAddress: {
fontSize: 14,
color: '#8E8E93',
},
saveButton: {
width: 36,
height: 36,
borderRadius: 18,
backgroundColor: '#34C759',
alignItems: 'center',
justifyContent: 'center',
...Platform.select({
  ios: {
    shadowColor: '#34C759',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  android: {
    elevation: 2,
  },
}),
},
});