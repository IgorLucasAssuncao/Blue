import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const IndexPage = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Bem-vindo à Página !</Text>
            <Text>Esta é uma página React Native padrão.</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
});

export default IndexPage;