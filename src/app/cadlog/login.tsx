import React, { useState } from 'react';
import {
  View,
  Image, // Adicionado import para Image
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert, // Para exibir mensagens, substituindo alert()
} from 'react-native';
import { Link } from 'expo-router';
import { useFonts } from 'expo-font';

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

  // A função handleLogin agora apenas loga os dados, a navegação será pelo Link
  const handleLogin = () => {
    console.log('Dados de Login (apenas frontend por enquanto):', { cpf, password });
    // Futuramente, aqui você chamaria sua API de autenticação
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Esqueci Minha Senha',
      'Você será redirecionado para a tela de recuperação de senha.'
    );
    // Futuramente, você pode usar Link para navegar para uma tela de recuperação
    // Ex: <Link href="/forgot-password" asChild>...</Link>
  };

  return (
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            {/* Botão para retornar à tela de índice */}
            <Link href="/" asChild>
              <TouchableOpacity style={styles.backButton}>
                <Text style={styles.backButtonText}>{'<'}</Text>
              </TouchableOpacity>
            </Link>

            {/* Nova View para centralizar a imagem */}
            <View style={styles.alignCenter}>
              <Image source={require('../../../assets/images/Resolve Vereador/Resolve Vereador 2.png')} style={styles.logo}></Image>
            </View>

            <View style={styles.contentWrapper}>
              <Text style={styles.title}>Bem-vindo de volta</Text> {/* Texto do título alterado para "Entre" */}

              {/* CPF */}
              <Text style={styles.label}>CPF:</Text>
              <TextInput
                style={styles.input}
                placeholder="000.000.000-00"
                value={cpf}
                onChangeText={setCpf}
                keyboardType="numeric"
                maxLength={14}
                placeholderTextColor="#a0a0a0"
              />

              {/* Senha */}
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

              {/* Opção "Esqueci minha senha" */}
              <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotPasswordButton}>
                <Text style={styles.forgotPasswordText}>Esqueci minha senha</Text>
              </TouchableOpacity>

              {/* Botão de Login (agora navega diretamente para Home) */}
              <Link href="/tabs/home" asChild>
                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                  <Text style={styles.buttonText}>Entrar</Text>
                </TouchableOpacity>
              </Link>

              {/* Link para cadastro (opcional, mas comum) */}
              <Link href="/cadastro" asChild>
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
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Fundo semi-transparente para a caixa
    borderRadius: 15,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
    marginTop: Platform.OS === 'ios' ? 80 : 2, // Espaço ajustado para a imagem
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
    fontFamily: "fontudo"
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
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
