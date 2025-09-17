import React from 'react';
import { useState, useEffect } from 'react'; // CORREÇÃO: Hooks importados separadamente.
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
  ActivityIndicator,
  TextInputProps
} from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../../../context/AuthContext';

// Interface para o usuário, baseada na documentação da API
interface User {
  id: number;
  name: string;
  cpf: string;
  email: string;
  cell_phone: string;
  date_birth: string;
  address: {
    zipcode: string;
    address: string;
    number: number;
    complement: string;
    neighborhood: string;
    state: { id: number };
    city: { id: number };
  } | null;
  gender: {
    id: number;
    title: string;
  } | null;
}

// --- FUNÇÕES DE FORMATAÇÃO ---
const formatCpf = (cpf: string): string => {
  if (!cpf) return '';
  const cleaned = cpf.replace(/\D/g, '');
  return cleaned
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
};

const formatPhoneNumber = (phoneNumber: string): string => {
  if (!phoneNumber) return '';
  const cleaned = phoneNumber.replace(/\D/g, '');
  if (cleaned.length <= 2) return `(${cleaned}`;
  if (cleaned.length <= 7) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
  return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
};

const formatCep = (cep: string): string => {
    if (!cep) return '';
    const cleaned = cep.replace(/\D/g, '');
    return cleaned.replace(/(\d{5})(\d)/, '$1-$2');
};

// --- COMPONENTE DE INPUT ---
type FormInputProps = TextInputProps & {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
};

const FormInput = ({ label, value, onChangeText, ...props }: FormInputProps) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={[styles.input, !props.editable && styles.inputDisabled]}
      value={value}
      onChangeText={onChangeText}
      placeholderTextColor="#a0a0a0"
      {...props}
    />
  </View>
);

// --- TELA PRINCIPAL ---
export default function EditarPerfil() {
  const router = useRouter();
  const { user, token } = useAuth() as { user: User | null; token: string | null }; 
  
  // Estados do formulário
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

  // Preenche o formulário com dados do usuário
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

  // Converte a data de DD/MM/AAAA para AAAA-MM-DD
  const convertDateToApiFormat = (date: string): string => {
    if (!date || !date.includes('/')) return date; 
    const [day, month, year] = date.split('/');
    return `${year}-${month}-${day}`;
  };

  // Envia as alterações para a API
  const handleSaveChanges = async () => {
    if (!user || !token) {
        Alert.alert("Erro de Autenticação", "Sessão inválida. Por favor, faça login novamente.");
        return;
    }
    
    if (password && password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }
    if (password && password.length < 6) {
        Alert.alert('Erro', 'A nova senha deve ter no mínimo 6 caracteres.');
        return;
    }

    setIsSaving(true);
    
    const updatedData = {
        name,
        cpf: cpf.replace(/\D/g, ''),
        date_birth: convertDateToApiFormat(user.date_birth), 
        email,
        cell_phone: cellPhone.replace(/\D/g, ''),
        zipcode: zipCode.replace(/\D/g, ''),
        address,
        number,
        complement,
        neighborhood,
        ...(password && { password }),
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
            router.back();
        } else {
            const errorMessage = data.message || (data.data && typeof data.data === 'object' ? Object.values(data.data).flat().join('\n') : 'Não foi possível salvar as alterações.');
            throw new Error(errorMessage);
        }
    } catch (error: any) {
        console.error("Erro ao salvar perfil:", error);
        Alert.alert("Erro ao salvar", error.message);
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

      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <FormInput 
          label="Nome Completo"
          value={name}
          onChangeText={setName}
        />
        <FormInput 
          label="CPF"
          value={cpf}
          onChangeText={(text: string) => setCpf(formatCpf(text))}
          keyboardType="numeric"
          maxLength={14}
          editable={false}
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
          onChangeText={(text: string) => setCellPhone(formatPhoneNumber(text))}
          keyboardType="phone-pad"
          maxLength={15}
        />
        <FormInput 
          label="CEP"
          value={zipCode}
          onChangeText={(text: string) => setZipCode(formatCep(text))}
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
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#f4f4f4ff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    color: '#333',
    fontFamily: 'fontudo',
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
    fontFamily: 'fontuda',
  },
  input: {
    backgroundColor: '#fff',
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    fontFamily: 'fontai',
  },
  inputDisabled: {
    backgroundColor: '#f0f0f0',
    color: '#999',
  },
  sectionTitle: {
    fontSize: 18,
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 20,
    fontFamily: 'fontudo',
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
    fontFamily: 'fontudo',
  },
});