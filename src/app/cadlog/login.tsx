import React, { useState } from 'react';
import {
  View,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { Feather } from '@expo/vector-icons'; // 1. Importar o Feather Icons

// Função para formatar o CPF enquanto o usuário digita
const formatCpf = (cpf: string): string => {
  const cleanedCpf = cpf.replace(/\D/g, '');
  if (cleanedCpf.length <= 11) {
    return cleanedCpf
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }
  return cpf.substring(0, 14);
};

export default function Login() {
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();

  const handleLogin = async () => {
    if (!cpf || !password) {
      Alert.alert('Campos Vazios', 'Por favor, preencha o CPF e a senha.');
      return;
    }
    
    setIsLoading(true);
    try {
      await signIn(cpf, password);
    } catch (error: any) {
      Alert.alert('Erro no Login', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <Link href="/" asChild>
              <TouchableOpacity style={styles.backButton}>
                {/* 2. Substituir o Text pelo ícone Feather */}
                <Feather name="arrow-left" size={28} color="#fff" />
              </TouchableOpacity>
            </Link>

            <View style={styles.alignCenter}>
              <Image source={require('../../../assets/images/Resolve Vereador/Resolve Vereador 2.png')} style={styles.logo}></Image>
            </View>

            <View style={styles.contentWrapper}>
              <Text style={styles.title}>Bem-vindo de volta</Text>

              <Text style={styles.label}>CPF:</Text>
              <TextInput
                style={styles.input}
                placeholder="000.000.000-00"
                value={cpf}
                onChangeText={(text) => setCpf(formatCpf(text))}
                keyboardType="numeric"
                maxLength={14}
                placeholderTextColor="#a0a0a0"
              />

              <Text style={styles.label}>Senha:</Text>
              <TextInput
                style={styles.input}
                placeholder="Sua senha"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                maxLength={20}
                placeholderTextColor="#a0a0a0"
              />
              
              <TouchableOpacity 
                style={[styles.button, isLoading && styles.buttonDisabled]} 
                onPress={handleLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Entrar</Text>
                )}
              </TouchableOpacity>

              <Link href="/cadlog/cadastro" asChild>
                <TouchableOpacity style={styles.registerLink}>
                  <Text>Não tem conta? <Text style={styles.registerLinkText}>Cadastre-se</Text></Text>
                </TouchableOpacity>
              </Link>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fullScreenGradient: {
    flex: 1,
  },
  alignCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#2f6f8f",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 20,
    left: 20,
    zIndex: 1,
    padding: 10,
  },
  // 3. Remover o estilo 'backButtonText' que não é mais necessário
  contentWrapper: {
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
    borderRadius: 15,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
    marginTop: Platform.OS === 'ios' ? 80 : 2, 
    marginBottom: 20,
  },
  title: {
    fontSize: 25,
    fontFamily: "fontudo",
    color: '#316996',
    marginBottom: 25,
    textAlign: 'center',
  },
  label: {
    fontSize: 18,
    color: '#555',
    marginBottom: 5,
    marginTop: 10,
    fontFamily: "fontuda"
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#f8f8f8',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#316996',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
  },
  registerLink: {
    marginTop: 20,
    alignSelf: 'center',
    paddingVertical: 10,
  },
  registerLinkText: {
    color: '#007bff',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  logo: {
    width: 260.75,
    height: 97.5,
    marginBottom: "28%"
  }
});