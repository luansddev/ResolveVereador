import React from 'react'; // useEffect e useState não são mais necessários aqui
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Platform,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext'; // 1. Importa o hook de autenticação

// Função para formatar o CPF para exibição
const formatCpfForDisplay = (cpf) => {
  if (!cpf) return '';
  return cpf
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
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

// Botão de ação
const ActionButton = ({ icon, label, onPress, color = '#333' }) => (
  <TouchableOpacity style={styles.actionButton} onPress={onPress}>
    <Feather name={icon} size={22} color={color} />
    <Text style={[styles.actionButtonText, { color }]}>{label}</Text>
    <Feather name="chevron-right" size={22} color="#ccc" />
  </TouchableOpacity>
);

export default function Conta() {
  const router = useRouter();
  // 2. Pega os dados e funções diretamente do AuthContext
  const { user, signOut, isLoading } = useAuth();

  // A função de logout agora é muito mais simples, apenas chama o signOut do contexto
  const handleLogout = () => {
    signOut();
  };

  // 3. Usa o estado de carregamento do AuthContext
  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Carregando...</Text>
      </View>
    );
  }
  
  // Se, após o carregamento, não houver usuário, mostra uma mensagem
  if (!user) {
    return (
        <View style={styles.centerContainer}>
            <Text style={styles.errorText}>Não foi possível carregar os dados do usuário. Tente fazer login novamente.</Text>
        </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={{ width: 24 }} />
        <Text style={styles.headerTitle}>Minha Conta</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* 4. Renderiza os dados do usuário diretamente do objeto 'user' do contexto */}
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.profileName}>{user.name}</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Dados Pessoais</Text>
          <InfoRow icon="mail" label="E-mail" value={user.email} />
          <InfoRow icon="file-text" label="CPF" value={formatCpfForDisplay(user.cpf)} />
          <InfoRow icon="phone" label="Celular" value={user.cell_phone || 'Não informado'} />
        </View>

        {user.address && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Endereço</Text>
            <InfoRow
              icon="map-pin"
              label="Logradouro"
              value={`${user.address.address}, ${user.address.number}`}
            />
            <InfoRow icon="navigation" label="Bairro" value={user.address.neighborhood} />
            <InfoRow
              icon="map"
              label="Cidade / Estado"
              value={`${user.address.city.title} - ${user.address.state.acronym}`}
            />
          </View>
        )}
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Ações</Text>
          <ActionButton
            icon="edit"
            label="Editar Perfil"
            onPress={() => router.push('/tabs/actions/editarPerfil')}
          />
          <ActionButton
            icon="list"
            label="Minhas Ocorrências"
            onPress={() => router.push('/tabs/actions/ocorrenciasUser')}
          />
          <ActionButton
            icon="log-out"
            label="Sair"
            color="#d9534f"
            onPress={handleLogout}
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
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

