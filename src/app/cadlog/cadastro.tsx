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
} from 'react-native';
import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';

// ETAPA 1: Componente de Dados Pessoais
// Definido fora do componente principal para evitar re-renderizações que fecham o teclado.
const Step1 = ({ fullName, setFullName, cpf, setCpf, email, setEmail, nextStep }) => (
  <>
    <Text style={styles.label}>Nome completo:</Text>
    <TextInput
      style={styles.input}
      placeholder="Seu nome completo"
      value={fullName}
      onChangeText={setFullName}
      autoCapitalize="words"
      placeholderTextColor="#a0a0a0"
    />
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
    <Text style={styles.label}>E-mail:</Text>
    <TextInput
      style={styles.input}
      placeholder="seu.email@example.com"
      value={email}
      onChangeText={setEmail}
      keyboardType="email-address"
      autoCapitalize="none"
      placeholderTextColor="#a0a0a0"
    />
    <TouchableOpacity style={styles.button} onPress={nextStep}>
      <Text style={styles.buttonText}>Próximo</Text>
    </TouchableOpacity>
  </>
);

// ETAPA 2: Componente de Endereço
const Step2 = ({ street, setStreet, number, setNumber, neighborhood, setNeighborhood, city, setCity, state, setState, zipCode, setZipCode, nextStep, prevStep }) => (
  <>
    <Text style={styles.sectionTitle}>Endereço Completo</Text>
    <Text style={styles.label}>Rua:</Text>
    <TextInput style={styles.input} placeholder="Nome da rua/avenida" value={street} onChangeText={setStreet} autoCapitalize="words" placeholderTextColor="#a0a0a0" />
    <Text style={styles.label}>Número:</Text>
    <TextInput style={styles.input} placeholder="Ex: 123" value={number} onChangeText={setNumber} keyboardType="numeric" placeholderTextColor="#a0a0a0" />
    <Text style={styles.label}>Bairro:</Text>
    <TextInput style={styles.input} placeholder="Nome do bairro" value={neighborhood} onChangeText={setNeighborhood} autoCapitalize="words" placeholderTextColor="#a0a0a0" />
    <Text style={styles.label}>Cidade:</Text>
    <TextInput style={styles.input} placeholder="Nome da cidade" value={city} onChangeText={setCity} autoCapitalize="words" placeholderTextColor="#a0a0a0" />
    <Text style={styles.label}>Estado:</Text>
    <TextInput style={styles.input} placeholder="Ex: SP (sigla)" value={state} onChangeText={setState} autoCapitalize="characters" maxLength={2} placeholderTextColor="#a0a0a0" />
    <Text style={styles.label}>CEP:</Text>
    <TextInput style={styles.input} placeholder="00000-000" value={zipCode} onChangeText={setZipCode} keyboardType="numeric" maxLength={9} placeholderTextColor="#a0a0a0" />
    
    <View style={styles.buttonGroup}>
      <TouchableOpacity style={[styles.button, styles.buttonSecondary]} onPress={prevStep}>
        <Text style={[styles.buttonText, styles.buttonTextSecondary]}>Voltar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.buttonPrimary]} onPress={nextStep}>
        <Text style={styles.buttonText}>Próximo</Text>
      </TouchableOpacity>
    </View>
  </>
);

// ETAPA 3: Componente de Senha
const Step3 = ({ password, setPassword, confirmPassword, setConfirmPassword, prevStep, handleRegister }) => (
  <>
    <Text style={styles.sectionTitle}>Crie sua Senha</Text>
    <Text style={styles.label}>Senha:</Text>
    <TextInput
      style={styles.input}
      placeholder="Mínimo 6 caracteres"
      value={password}
      onChangeText={setPassword}
      secureTextEntry
      maxLength={20}
      placeholderTextColor="#a0a0a0"
    />
    <Text style={styles.label}>Confirme a Senha:</Text>
    <TextInput
      style={styles.input}
      placeholder="Repita sua senha"
      value={confirmPassword}
      onChangeText={setConfirmPassword}
      secureTextEntry
      maxLength={20}
      placeholderTextColor="#a0a0a0"
    />
    <View style={styles.buttonGroup}>
      <TouchableOpacity style={[styles.button, styles.buttonSecondary]} onPress={prevStep}>
        <Text style={[styles.buttonText, styles.buttonTextSecondary]}>Voltar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.buttonPrimary]} onPress={handleRegister}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>
    </View>
  </>
);


export default function Cadastro() {
  // Estado para controlar a etapa atual do formulário
  const [step, setStep] = useState(1);

  // Estados para todos os campos do formulário
  const [fullName, setFullName] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Carregamento das fontes
  const [fontsLoaded] = useFonts({
    'fontuda': require('../../../assets/fonts/SpaceGrotesk-Regular.ttf'),
    'fontudo': require('../../../assets/fonts/SpaceGrotesk-Bold.ttf'),
    'fontai': require('../../../assets/fonts/SpaceGrotesk-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return <Text>Carregando...</Text>;
  }

  // Função para avançar para a próxima etapa
  const nextStep = () => {
    if (step === 1 && (!fullName || !cpf || !email)) {
        Alert.alert('Campos Incompletos', 'Por favor, preencha todos os dados pessoais.');
        return;
    }
    if (step === 2 && (!street || !number || !neighborhood || !city || !state || !zipCode)) {
        Alert.alert('Campos Incompletos', 'Por favor, preencha o endereço completo.');
        return;
    }
    setStep(currentStep => currentStep + 1);
  };

  // Função para voltar para a etapa anterior
  const prevStep = () => {
    setStep(currentStep => currentStep - 1);
  };

  // Função final para registrar o usuário
  const handleRegister = () => {
    if (password !== confirmPassword) {
      Alert.alert('Erro no Cadastro', 'A senha e a confirmação de senha não coincidem.');
      return;
    }
     if (password.length < 6) {
      Alert.alert('Senha Inválida', 'A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    Alert.alert(
      'Cadastro Realizado!',
      `
      Nome Completo: ${fullName}
      CPF: ${cpf}
      E-mail: ${email}
      Endereço:
        Rua: ${street}, Nº: ${number}
        Bairro: ${neighborhood}
        Cidade: ${city}, Estado: ${state}
        CEP: ${zipCode}
      `
    );
    console.log({
      fullName, cpf, email, password,
      street, number, neighborhood, city, state, zipCode,
    });
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

            <View style={styles.contentWrapper}>
              <View style={styles.imagePlaceholder}>
                <Image source={require('../../../assets/images/Resolve Vereador/Resolve Vereador 1.png')} style={styles.logo} />
              </View>

              <Text style={styles.title}>Cadastre-se</Text>
              
              <View style={styles.progressContainer}>
                  <View style={[styles.progressStep, step >= 1 && styles.progressStepActive]} />
                  <View style={[styles.progressStep, step >= 2 && styles.progressStepActive]} />
                  <View style={[styles.progressStep, step >= 3 && styles.progressStepActive]} />
              </View>

              {/* Renderiza a etapa correta passando os estados e funções como props */}
              {step === 1 && <Step1 fullName={fullName} setFullName={setFullName} cpf={cpf} setCpf={setCpf} email={email} setEmail={setEmail} nextStep={nextStep} />}
              {step === 2 && <Step2 street={street} setStreet={setStreet} number={number} setNumber={setNumber} neighborhood={neighborhood} setNeighborhood={setNeighborhood} city={city} setCity={setCity} state={state} setState={setState} zipCode={zipCode} setZipCode={setZipCode} nextStep={nextStep} prevStep={prevStep} />}
              {step === 3 && <Step3 password={password} setPassword={setPassword} confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword} prevStep={prevStep} handleRegister={handleRegister} />}
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
  safeArea: {
    flex: 1,
    backgroundColor: "#2f6f8f"
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
    marginTop: Platform.OS === 'ios' ? 80 : 50,
    marginBottom: 20,
  },
  imagePlaceholder: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 10,
  },
  logo: {
    width: 156.4,
    height: 58.6,
  },
  title: {
    fontSize: 32,
    color: '#316996',
    marginBottom: 15,
    textAlign: 'center',
    fontFamily: "fontudo",
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '50%',
    alignSelf: 'center',
    marginBottom: 25,
  },
  progressStep: {
    flex: 1,
    height: 8,
    backgroundColor: '#ddd',
    borderRadius: 4,
    marginHorizontal: 4,
  },
  progressStepActive: {
    backgroundColor: '#0090a9ff',
  },
  label: {
    fontSize: 18,
    color: '#555',
    marginBottom: 5,
    marginTop: 10,
    fontFamily: "fontuda",
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
    fontFamily: "fontai",
  },
  sectionTitle: {
    fontSize: 22,
    color: '#333',
    marginTop: 10,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 5,
    fontFamily: "fontudo",
    textAlign: 'center',
  },
  button: {
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 10,
    backgroundColor: '#00bcdeff',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: "fontudo",
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  buttonPrimary: {
    backgroundColor: '#0090a9ff',
    flex: 1,
    marginLeft: 5,
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderColor: '#0090a9ff',
    borderWidth: 2,
    flex: 1,
    marginRight: 5,
  },
  buttonTextSecondary: {
      color: '#0090a9ff',
  }
});
