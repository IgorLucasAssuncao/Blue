import React from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useBluetooth } from '../contexts/BluetoothContext';
import { ConnectionItem } from '../components/ConnectionItem';

export const SavedScreen: React.FC<{ navigate: (to: string) => void }> = ({ navigate }) => {
  const { devices, removeDevice, setEditingDeviceId } = useBluetooth();

  const EmptyComponent = () => (
    <View style={styles.emptyState}>
      <Icon name="bookmark" size={64} color="#C7C7CC" />
      <Text style={styles.emptyStateTitle}>Nenhuma conexão salva</Text>
      <Text style={styles.emptyStateSubtitle}>Descubra e salve dispositivos Bluetooth para acessá-los rapidamente</Text>
      <TouchableOpacity style={styles.discoverButton} onPress={() => navigate('discover')}>
        <Icon name="plus" size={20} color="#FFFFFF" />
        <Text style={styles.discoverButtonText}>Descobrir Dispositivos</Text>
      </TouchableOpacity>
    </View>
  );

  const HeaderComponent = () => (
    <View style={styles.header}>
      <Text style={styles.title}>Conexões Salvas</Text>
      <Text style={styles.subtitle}>{devices.length} {devices.length === 1 ? 'dispositivo salvo' : 'dispositivos salvos'}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={devices}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.listContent, devices.length === 0 && styles.emptyListContent]}
        ListHeaderComponent={devices.length > 0 ? HeaderComponent : null}
        ListEmptyComponent={EmptyComponent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <View style={[styles.itemContainer, index === 0 && styles.firstItem, index === devices.length - 1 && styles.lastItem]}>
            <ConnectionItem device={item} onEdit={(d) => { setEditingDeviceId(d.id); navigate('edit'); }} onForget={(id) => removeDevice(id)} />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' },
  listContent: { flexGrow: 1 },
  emptyListContent: { flex: 1, justifyContent: 'center' },
  header: { backgroundColor: '#FFFFFF', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 24, borderBottomWidth: 1, borderBottomColor: '#E5E5EA' },
  title: { fontSize: 28, fontWeight: '700', color: '#000000', marginBottom: 4 },
  subtitle: { fontSize: 15, color: '#8E8E93', lineHeight: 20 },
  itemContainer: { backgroundColor: '#FFFFFF', marginHorizontal: 16, marginVertical: 4, borderRadius: 12, overflow: 'hidden' },
  firstItem: { marginTop: 16 },
  lastItem: { marginBottom: 20 },
  separator: { height: 1, backgroundColor: '#E5E5EA', marginLeft: 76, marginRight: 16 },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  emptyStateTitle: { fontSize: 20, fontWeight: '600', color: '#3C3C43', marginTop: 20, marginBottom: 8, textAlign: 'center' },
  emptyStateSubtitle: { fontSize: 15, color: '#8E8E93', textAlign: 'center', lineHeight: 22, marginBottom: 32 },
  discoverButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#007AFF', paddingHorizontal: 24, paddingVertical: 14, borderRadius: 12 },
  discoverButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600', marginLeft: 8 },
});
