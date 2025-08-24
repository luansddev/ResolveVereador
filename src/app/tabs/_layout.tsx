import React from 'react';
import { View, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

// Componente para o botão do meio, que será flutuante
const CustomAddButton = ({ children, onPress }) => (
  <TouchableOpacity
    style={styles.floatingButton}
    onPress={onPress}
  >
    <View style={styles.floatingButtonContent}>
      {children}
    </View>
  </TouchableOpacity>
);

// Novo componente para desativar o efeito de clique
const NoHighlightButton = ({ children, style, ...props }) => (
  <Pressable
    {...props}
    style={({ pressed }) => [
      style,
      { opacity: 1 } // Mantém a opacidade em 1, desativando o efeito de fade
    ]}
  >
    {children}
  </Pressable>
);

export default function TabsLayout() {
  return (
    
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false, // Oculta os rótulos de texto
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#a5c0e1',
      }}
    >
      {/* Tela de Home */}
      <Tabs.Screen
        name="home"
        options={{
          title: 'Início',
          // Usa o novo componente para o botão
          tabBarButton: (props) => <NoHighlightButton {...props} />,
          tabBarIcon: ({ color }) => (
            <View style={styles.iconWrapper}>
              <Entypo name="home" size={34} color={color} />
            </View>
          ),
        }}
      />

      {/* Tela de Adicionar Ocorrência (botão flutuante) */}
      <Tabs.Screen
        name="addOcorrencia"
        options={{
          title: 'Adicionar',
          tabBarButton: (props) => <CustomAddButton {...props} />,
          tabBarIcon: () => (
            <Entypo name="megaphone" size={30} color="white" />
          ),
          // OCULTA A TAB BAR APENAS PARA ESTA TELA
          tabBarStyle: { display: 'none' }, 
        }}
      />

      {/* Tela da Conta */}
      <Tabs.Screen
        name="conta"
        options={{
          title: 'Conta',
          // Usa o novo componente para o botão
          tabBarButton: (props) => <NoHighlightButton {...props} />,
          tabBarIcon: ({ color }) => (
            <View style={styles.iconWrapper}>
              <FontAwesome6 name="user-large" size={30} color={color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#0057b7',
    borderTopWidth: 0,
    position: 'absolute',
    bottom: 25,
    borderRadius: 20,
    height: 70,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    width: '70%',
    marginHorizontal: '15%',
  },
  floatingButton: {
    top: -20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingButtonContent: {
    width: 85,
    height: 85,
    borderRadius: 50,
    backgroundColor: '#0057b7',
    borderWidth: 8,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrapper: {
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -5 }], // Ajusta a posição para centralizar o ícone verticalmente
  },
});
