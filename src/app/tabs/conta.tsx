import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';

export default function conta() {
  return (
    <View style={styles.container}>
      {/* O componente Link do expo-router é usado para navegar para a rota raiz (index.tsx) */}
      {/* O prop 'asChild' permite que o Link envolva o TouchableOpacity sem renderizar um texto adicional */}
      <Link href="/" asChild>
        <TouchableOpacity style={styles.backButton}>
          <Text style={styles.backButtonText}>{'<'}</Text>
        </TouchableOpacity>
      </Link>
      <Text style={styles.text}>Tela conta</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    padding: 10,
  },
  backButtonText: {
    fontSize: 24,
    color: '#007bff',
    fontWeight: 'bold',
  },
});
