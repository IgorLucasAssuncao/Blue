import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Platform, Animated } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather'; // ou outro pacote de ícones

type Props = {
current: string;
navigate: (to: string) => void;
};

export const BottomMenu: React.FC<Props> = ({ current, navigate }) => {
const items = [
  { key: 'discover', label: 'Descobrir', icon: 'compass' },
  { key: 'saved', label: 'Salvas', icon: 'bookmark' },
  { key: 'edit', label: 'Editar', icon: 'edit-3' },
  { key: 'settings', label: 'Config', icon: 'settings' },
];

const insets = useSafeAreaInsets();
const scaleValue = React.useRef(new Animated.Value(1)).current;

const handlePress = (key: string) => {
  Animated.sequence([
    Animated.timing(scaleValue, {
      toValue: 0.95,
      duration: 100,
      useNativeDriver: true,
    }),
    Animated.timing(scaleValue, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }),
  ]).start();
  navigate(key);
};

return (
  <SafeAreaView edges={["bottom"]} style={[styles.container, { paddingBottom: insets.bottom }]}>
    <View style={styles.bar}>
      {items.map((it) => {
        const isActive = current === it.key;
        
        return (
          <Animated.View 
            key={it.key} 
            style={[
              styles.itemContainer,
              isActive && styles.activeItemContainer,
              { transform: [{ scale: isActive ? scaleValue : 1 }] }
            ]}
          >
            <TouchableOpacity
              onPress={() => handlePress(it.key)}
              style={styles.btn}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={it.label}
              accessibilityState={{ selected: isActive }}
            >
              <View style={[styles.iconContainer, isActive && styles.activeIconContainer]}>
                <Icon
                  name={it.icon}
                  size={24}
                  color={isActive ? '#FFFFFF' : '#8E8E93'}
                />
                {isActive && <View style={styles.activeDot} />}
              </View>
              <Text style={[styles.label, isActive && styles.activeLabel]}>
                {it.label}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        );
      })}
    </View>
  </SafeAreaView>
);
};

const styles = StyleSheet.create({
container: {
  backgroundColor: '#FFFFFF',
  ...Platform.select({
    ios: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
    },
    android: {
      elevation: 8,
    },
  }),
},
bar: {
  height: 65,
  flexDirection: 'row',
  justifyContent: 'space-around',
  alignItems: 'center',
  backgroundColor: '#FFFFFF',
  borderTopWidth: 0.5,
  borderTopColor: '#E5E5EA',
  paddingHorizontal: 16,
},
itemContainer: {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
},
activeItemContainer: {
  transform: [{ scale: 1.05 }],
},
btn: {
  alignItems: 'center',
  justifyContent: 'center',
  paddingVertical: 8,
  paddingHorizontal: 12,
  minWidth: 64,
},
iconContainer: {
  width: 40,
  height: 40,
  borderRadius: 20,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'transparent',
  marginBottom: 4,
},
activeIconContainer: {
  backgroundColor: '#007AFF',
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
activeDot: {
  position: 'absolute',
  bottom: -8,
  width: 4,
  height: 4,
  borderRadius: 2,
  backgroundColor: '#007AFF',
},
label: {
  fontSize: 11,
  fontWeight: '500',
  color: '#8E8E93',
  marginTop: 2,
  letterSpacing: 0.2,
},
activeLabel: {
  color: '#007AFF',
  fontWeight: '700',
  fontSize: 12,
},
});