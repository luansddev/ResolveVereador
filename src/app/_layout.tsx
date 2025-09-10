import React from 'react';
import { Stack } from 'expo-router';
import { AuthProvider } from '../context/AuthContext';

export default function RootLayout() {
  return (
    // O AuthProvider agora envolve todo o aplicativo, disponibilizando o contexto para todas as telas.
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {/* As rotas principais do seu app são definidas aqui */}
        <Stack.Screen name="index" />
        <Stack.Screen name="cadlog" />
        <Stack.Screen name="tabs" />
      </Stack>
    </AuthProvider>
  );
}

