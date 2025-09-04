import React, { useState } from 'react';
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
  Alert 
} from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

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
  
  // Estados para os campos do formulário (preenchidos com dados mock)
  const [name, setName] = useState('Luan Silva');
  const [cpf, setCpf] = useState('546.515.178-11');
  const [email, setEmail] = useState('luandominguesdev@gmail.com');
  const [cellPhone, setCellPhone] = useState('(13) 95538-1350');
  const [zipCode, setZipCode] = useState('11730-000');
  const [address, setAddress] = useState('Rua ABC');
  const [number, setNumber] = useState('123');
  const [complement, setComplement] = useState('');
  const [neighborhood, setNeighborhood] = useState('Bairro EFG');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSaveChanges = () => {
    // Aqui virá a lógica para enviar os dados para a API
    console.log({
      name,
      cpf,
      email,
      cellPhone,
      zipCode,
      address,
      number,
      complement,
      neighborhood,
      password,
    });
    Alert.alert('Salvo!', 'Suas alterações foram salvas com sucesso.');
    router.back();
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
          onChangeText={setCpf}
          keyboardType="numeric"
          // O CPF não deve ser editável em um cenário real, mas a API permite
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
          onChangeText={setCellPhone}
          keyboardType="phone-pad"
        />
        <FormInput 
          label="CEP"
          value={zipCode}
          onChangeText={setZipCode}
          keyboardType="numeric"
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
        
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
          <Text style={styles.saveButtonText}>Salvar Alterações</Text>
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
    padding: 20,
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
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

