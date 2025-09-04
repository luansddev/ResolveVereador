import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Platform, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

// Dados fictícios baseados na documentação da API para preencher a tela
const mockUser = {
  name: 'Luan Silva',
  email: 'luandominguesdev@gmail.com',
  cpf: '546.515.178-11',
  cell_phone: '(13) 95538-1350',
  address: {
    address: 'Rua ABC',
    number: '123',
    neighborhood: 'Bairro EFG',
    city: 'Orlândia',
    state: 'SP',
    zipcode: '11730-000',
  },
};

// Componente para reutilizar as linhas de informação
const InfoRow = ({ icon, label, value }) => (
  <View style={styles.infoRow}>
    <Feather name={icon} size={20} color="#555" style={styles.infoIcon} />
    <View>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
);

// Componente para os botões de ação
const ActionButton = ({ icon, label, onPress, color = '#333' }) => (
  <TouchableOpacity style={styles.actionButton} onPress={onPress}>
    <Feather name={icon} size={22} color={color} />
    <Text style={[styles.actionButtonText, { color }]}>{label}</Text>
    <Feather name="chevron-right" size={22} color="#ccc" />
  </TouchableOpacity>
);

export default function Conta() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={{ width: 24 }} />
        <Text style={styles.headerTitle}>Minha Conta</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.profileName}>{mockUser.name}</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Dados Pessoais</Text>
          <InfoRow icon="mail" label="E-mail" value={mockUser.email} />
          <InfoRow icon="file-text" label="CPF" value={mockUser.cpf} />
          <InfoRow icon="phone" label="Celular" value={mockUser.cell_phone} />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Endereço</Text>
          <InfoRow
            icon="map-pin"
            label="Logradouro"
            value={`${mockUser.address.address}, ${mockUser.address.number}`}
          />
          <InfoRow icon="navigation" label="Bairro" value={mockUser.address.neighborhood} />
          <InfoRow
            icon="map"
            label="Cidade / Estado"
            value={`${mockUser.address.city} - ${mockUser.address.state}`}
          />
        </View>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Ações</Text>
          <ActionButton
            icon="edit"
            label="Editar Perfil"
            onPress={() => router.push('/tabs/actions/editarPerfil')}
          />
          {/* ATUALIZADO: Navegação para a tela de ocorrências do usuário */}
          <ActionButton
            icon="list"
            label="Minhas Ocorrências"
            onPress={() => router.push('/tabs/actions/ocorrenciasUser')}
          />
          <ActionButton
            icon="log-out"
            label="Sair"
            color="#d9534f"
            onPress={() => { /* Lógica de logout */ }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f4f6f8',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 120, 
  },
  profileName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  infoIcon: {
    marginRight: 15,
    marginTop: 3,
  },
  infoLabel: {
    fontSize: 14,
    color: '#888',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  actionButtonText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 15,
  },
});

