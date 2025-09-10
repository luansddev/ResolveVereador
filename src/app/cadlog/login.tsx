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
import { useFonts } from 'expo-font';
import { useAuth } from '../../context/AuthContext'; // 1. Importa o hook de autenticação

// Função para formatar o CPF enquanto o usuário digita
const formatCpf = (cpf) => {
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
    const [fontsLoaded] = useFonts({
      'fontuda': require('../../../assets/fonts/SpaceGrotesk-Regular.ttf'),
      'fontudo': require('../../../assets/fonts/SpaceGrotesk-Bold.ttf'),
      'fontai': require('../../../assets/fonts/SpaceGrotesk-Regular.ttf'),
      });
      if (!fontsLoaded) {
        return <Text></Text>; // Ou um loading spinner
      }
      
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth(); // 2. Pega a função signIn do contexto

  // --- FUNÇÃO DE LOGIN ATUALIZADA PARA USAR O CONTEXTO ---
  const handleLogin = async () => {
    if (!cpf || !password) {
      Alert.alert('Campos Vazios', 'Por favor, preencha o CPF e a senha.');
      return;
    }
    
    setIsLoading(true);
    try {
      // 3. Chama a função signIn do contexto. O contexto agora cuida da API, 
      // de salvar os dados e do redirecionamento automático.
      await signIn(cpf, password);
      // Se o login for bem-sucedido, o useEffect no AuthContext vai redirecionar.
    } catch (error: any) {
      // Se o signIn der erro (ex: senha errada), ele será capturado aqui.
      Alert.alert('Erro no Login', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Esqueci Minha Senha',
      'Você será redirecionado para a tela de recuperação de senha.'
    );
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
                <Text style={styles.backButtonText}>{'<'}</Text>
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

              <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotPasswordButton}>
                <Text style={styles.forgotPasswordText}>Esqueci minha senha</Text>
              </TouchableOpacity>
              
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
  backButtonText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
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
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginTop: 10,
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#007bff',
    fontSize: 14,
    textDecorationLine: 'underline',
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

