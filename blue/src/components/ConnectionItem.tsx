import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BluetoothDevice } from '../types';

type Props = {
  device: BluetoothDevice;
  onEdit?: (d: BluetoothDevice) => void;
  onForget?: (id: string) => void;
};

export const ConnectionItem: React.FC<Props> = ({ device, onEdit, onForget }) => {
  return (
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{device.name}</Text>
        <Text style={styles.addr}>{device.address}</Text>
        {device.notes ? <Text style={styles.notes}>{device.notes}</Text> : null}
      </View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => onEdit && onEdit(device)} style={styles.btn}>
          <Text>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onForget && onForget(device.id)} style={[styles.btn, { marginTop: 8 }]}>
          <Text>Esquecer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', padding: 12, borderBottomWidth: 1, borderColor: '#eee' },
  name: { fontWeight: '600' },
  addr: { color: '#666', fontSize: 12 },
  notes: { color: '#333', marginTop: 6 },
  actions: { justifyContent: 'center', alignItems: 'flex-end' },
  btn: { padding: 6, borderRadius: 6, backgroundColor: '#eee' },
});
