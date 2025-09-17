import React from 'react';
import { Stack, SplashScreen } from 'expo-router';
import { AuthProvider } from '../context/AuthContext';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';

// Impede a tela de splash nativa de se esconder automaticamente antes das fontes carregarem.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // CORREÇÃO: Os caminhos agora sobem dois níveis (../../) para chegar na pasta 'assets'
  const [fontsLoaded, error] = useFonts({
    'fontuda': require('../../assets/fonts/SpaceGrotesk-Regular.ttf'),
    'fontudo': require('../../assets/fonts/SpaceGrotesk-Bold.ttf'),
    'fontai': require('../../assets/fonts/SpaceGrotesk-Regular.ttf'),
  });

  // Esconde a tela de splash assim que as fontes forem carregadas (ou se der erro).
  useEffect(() => {
    if (fontsLoaded || error) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  // Se as fontes ainda não carregaram e não há erro, não renderiza nada.
  // Isso mantém a tela de splash visível.
  if (!fontsLoaded && !error) {
    return null;
  }

  // Quando as fontes estiverem prontas, renderiza o aplicativo.
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