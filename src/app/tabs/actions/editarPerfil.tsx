import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView, 
  TextInput, 
  Platform, 
  StatusBar,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../../../context/AuthContext'; // Ajuste o caminho se sua pasta for 'context'

// --- FUNÇÕES DE FORMATAÇÃO ---
const formatCpf = (cpf) => {
  if (!cpf) return '';
  const cleaned = cpf.replace(/\D/g, '');
  return cleaned
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
};

const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return '';
  const cleaned = phoneNumber.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phoneNumber;
};

const formatCep = (cep) => {
    if (!cep) return '';
    const cleaned = cep.replace(/\D/g, '');
    return cleaned.replace(/(\d{5})(\d)/, '$1-$2');
};


// Componente reutilizável para os campos de input
const FormInput = ({ label, value, onChangeText, ...props }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      placeholderTextColor="#a0a0a0"
      {...props}
    />
  </View>
);

export default function EditarPerfil() {
  const router = useRouter();
  // Pega o usuário e o token do nosso gerenciador de sessão
  const { user, token } = useAuth(); 
  
  // Estados para os campos do formulário
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [cellPhone, setCellPhone] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [address, setAddress] = useState('');
  const [number, setNumber] = useState('');
  const [complement, setComplement] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [isSaving, setIsSaving] = useState(false);

  // Preenche o formulário com os dados do usuário do contexto quando a tela abre
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setCpf(formatCpf(user.cpf || ''));
      setEmail(user.email || '');
      setCellPhone(formatPhoneNumber(user.cell_phone || ''));
      if (user.address) {
        setZipCode(formatCep(user.address.zipcode || ''));
        setAddress(user.address.address || '');
        setNumber(String(user.address.number) || '');
        setComplement(user.address.complement || '');
        setNeighborhood(user.address.neighborhood || '');
      }
    }
  }, [user]);

  // Função para enviar os dados atualizados para a API
  const handleSaveChanges = async () => {
    if (!user || !token) {
        Alert.alert("Erro de Autenticação", "Sessão inválida. Por favor, faça login novamente.");
        return;
    }
    
    // Validação de senha
    if (password && password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }
    if (password && password.length < 6) {
        Alert.alert('Erro', 'A nova senha deve ter no mínimo 6 caracteres.');
        return;
    }

    setIsSaving(true);
    
    // Monta o objeto JSON para a API, conforme a documentação
    const updatedData = {
        name,
        cpf: cpf.replace(/\D/g, ''),
        email,
        cell_phone: cellPhone,
        zipcode: zipCode,
        address,
        number,
        complement,
        neighborhood,
        // Inclui a senha apenas se o usuário a preencheu
        ...(password && { password: password }),
        // A API exige que todos os campos sejam enviados, mesmo os que não mudaram
        id_state: user.address?.state?.id, 
        id_city: user.address?.city?.id,
        id_gender: user.gender?.id,
        status: true,
        is_parliament: false,
    };

    try {
        const response = await fetch(`https://www.resolvevereador.com.br/api/users/update/${user.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
            body: JSON.stringify(updatedData),
        });

        const data = await response.json();

        if (response.ok && data.code === 200) {
            Alert.alert('Sucesso!', 'Seu perfil foi atualizado.');
            // Em um app completo, você também precisaria atualizar o 'user' no AuthContext
            router.back();
        } else {
            throw new Error(data.message || 'Não foi possível salvar as alterações.');
        }
    } catch (error: any) {
        console.error("Erro ao salvar perfil:", error);
        Alert.alert("Erro", error.message);
    } finally {
        setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar Perfil</Text>
        <View style={{ width: 24 }} /> 
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <FormInput 
          label="Nome Completo"
          value={name}
          onChangeText={setName}
        />
        <FormInput 
          label="CPF"
          value={cpf}
          onChangeText={(text) => setCpf(formatCpf(text))}
          keyboardType="numeric"
          maxLength={14}
          editable={false} // CPF não deve ser editável
        />
        <FormInput 
          label="E-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <FormInput 
          label="Celular"
          value={cellPhone}
          onChangeText={(text) => setCellPhone(formatPhoneNumber(text))}
          keyboardType="phone-pad"
          maxLength={15}
        />
        <FormInput 
          label="CEP"
          value={zipCode}
          onChangeText={(text) => setZipCode(formatCep(text))}
          keyboardType="numeric"
          maxLength={9}
        />
        <FormInput 
          label="Endereço"
          value={address}
          onChangeText={setAddress}
        />
        <FormInput 
          label="Número"
          value={number}
          onChangeText={setNumber}
          keyboardType="numeric"
        />
        <FormInput 
          label="Complemento"
          value={complement}
          onChangeText={setComplement}
        />
        <FormInput 
          label="Bairro"
          value={neighborhood}
          onChangeText={setNeighborhood}
        />
        
        <Text style={styles.sectionTitle}>Alterar Senha (opcional)</Text>
        <FormInput 
          label="Nova Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Deixe em branco para não alterar"
        />
        <FormInput 
          label="Confirmar Nova Senha"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
        
        <TouchableOpacity style={[styles.saveButton, isSaving && styles.saveButtonDisabled]} onPress={handleSaveChanges} disabled={isSaving}>
          {isSaving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Salvar Alterações</Text>
          )}
        </TouchableOpacity>
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
  backButton: {
    padding: 5,
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#fff',
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 20,
  },
  saveButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
  },
  saveButtonDisabled: {
    backgroundColor: '#a0c7e4',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

