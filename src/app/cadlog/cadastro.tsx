import React, { useState, useEffect } from 'react';
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
  // CORREÇÃO: Adicionando TextInputProps para tipagem
  TextInputProps 
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Feather } from '@expo/vector-icons'; // 1. Importar o Feather Icons

// --- FUNÇÕES DE VALIDAÇÃO E FORMATAÇÃO (com tipagem) ---

const validateEmail = (email: string): boolean => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

const formatCpf = (cpf: string): string => {
  const cleanedCpf = cpf.replace(/\D/g, '');
  return cleanedCpf
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
};

const formatCep = (cep: string): string => {
  const cleanedCep = cep.replace(/\D/g, '');
  return cleanedCep
    .replace(/(\d{5})(\d)/, '$1-$2');
};

const formatPhoneNumber = (phoneNumber: string): string => {
  const cleaned = ('' + phoneNumber).replace(/\D/g, '');
  if (cleaned.length <= 2) return `(${cleaned}`;
  if (cleaned.length <= 7) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
  return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
};

// --- COMPONENTES DAS ETAPAS (com tipagem) ---

// Tipos para os props de cada etapa
type Step1Props = {
  fullName: string; setFullName: (value: string) => void;
  cpf: string; setCpf: (value: string) => void;
  email: string; setEmail: (value: string) => void;
  dateOfBirth: Date | null; setDateOfBirth: (value: Date) => void;
  showDatePicker: boolean; setShowDatePicker: (value: boolean) => void;
  cellPhone: string; setCellPhone: (value: string) => void;
  id_gender: number | null; setId_gender: (value: number | null) => void;
  nextStep: () => void;
  isNextDisabled: boolean;
};

const Step1 = ({
  fullName, setFullName, cpf, setCpf, email, setEmail,
  dateOfBirth, setDateOfBirth, showDatePicker, setShowDatePicker,
  cellPhone, setCellPhone, id_gender, setId_gender,
  nextStep, isNextDisabled
}: Step1Props) => {
  const onChangeDate = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || dateOfBirth;
    setShowDatePicker(false);
    if (currentDate) {
      setDateOfBirth(currentDate);
    }
  };

  return (
    <>
      <Text style={styles.sectionTitle}>Dados Pessoais</Text>
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
        onChangeText={(text) => setCpf(formatCpf(text))}
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
      
      <Text style={styles.label}>Data de Nascimento:</Text>
      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.inputDate}>
        <Text style={{ color: dateOfBirth ? '#333' : '#a0a0a0', fontSize: 16, fontFamily: "fontai" }}>
          {dateOfBirth ? dateOfBirth.toLocaleDateString('pt-BR') : 'DD/MM/AAAA'}
        </Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={dateOfBirth || new Date()}
          mode="date"
          display="default"
          onChange={onChangeDate}
          maximumDate={new Date()}
        />
      )}

      <Text style={styles.label}>Celular:</Text>
      <TextInput
        style={styles.input}
        placeholder="(XX) XXXXX-XXXX"
        value={cellPhone}
        onChangeText={(text) => setCellPhone(formatPhoneNumber(text))}
        keyboardType="phone-pad"
        maxLength={15}
        placeholderTextColor="#a0a0a0"
      />
      
      <Text style={styles.label}>Gênero:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={id_gender}
          onValueChange={(itemValue) => setId_gender(itemValue)}
          style={styles.picker}
          itemStyle={styles.pickerItem}
        >
          <Picker.Item label="Selecione o gênero" value={null} />
          <Picker.Item label="Feminino" value={1} />
          <Picker.Item label="Masculino" value={2} />
          <Picker.Item label="Outro" value={3} />
        </Picker>
      </View>

      <TouchableOpacity
        style={[styles.button, isNextDisabled && styles.buttonDisabled]}
        onPress={nextStep}
        disabled={isNextDisabled}
      >
        <Text style={styles.buttonText}>Próximo</Text>
      </TouchableOpacity>
    </>
  );
};
// Demais componentes de Etapa (Step2, Step3) e a função Cadastro permanecem aqui
// ...

export default function Cadastro() {
  const router = useRouter();

  const [step, setStep] = useState(1);

  const [fullName, setFullName] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [cellPhone, setCellPhone] = useState('');
  const [id_gender, setId_gender] = useState<number | null>(null);
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [complement, setComplement] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [id_state, setId_state] = useState<number | null>(null);
  const [id_city, setId_city] = useState<number | null>(null);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  // Removido o 'useFonts' daqui, pois agora está no _layout.tsx

  useEffect(() => {
    // ... lógicas de busca de estados e cidades
  }, []);

  useEffect(() => {
    // ... lógicas de busca de cidades por estado
  }, [id_state]);

  const fetchCepData = async (cep: string) => {
    // ... lógica de busca de CEP
  };

  const isStep1Valid = fullName.trim() !== '' &&
    cpf.replace(/\D/g, '').length === 11 &&
    validateEmail(email) &&
    dateOfBirth !== null &&
    cellPhone.replace(/\D/g, '').length >= 10 &&
    id_gender !== null;

  const isStep2Valid = street.trim() !== '' &&
    number.trim() !== '' &&
    neighborhood.trim() !== '' &&
    id_state !== null &&
    id_city !== null &&
    zipCode.replace(/\D/g, '').length === 8;

  const isStep3Valid = password.length >= 6 && password === confirmPassword;

  const nextStepHandler = () => {
    if (step === 1 && !isStep1Valid) return;
    if (step === 2 && !isStep2Valid) return;
    setStep(currentStep => currentStep + 1);
  };

  const prevStepHandler = () => setStep(currentStep => currentStep - 1);

  const handleRegister = async () => {
    if (!isStep3Valid) return;

    setIsRegistering(true);

    const userData = {
      name: fullName,
      cpf: cpf.replace(/\D/g, ''),
      date_birth: dateOfBirth ? dateOfBirth.toLocaleDateString('en-CA') : '',
      email: email,
      cell_phone: cellPhone,
      password: password,
      is_parliament: false,
      id_gender: id_gender,
      status: true,
      zipcode: zipCode,
      address: street,
      number: number,
      complement: complement.trim() !== '' ? complement : null,
      neighborhood: neighborhood,
      id_state: id_state,
      id_city: id_city,
    };
    
    try {
      const API_URL = 'https://www.resolvevereador.com.br/api/users/store';
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      const data = await response.json();

      if (data.code === 201) {
        Alert.alert('Sucesso', data.message || 'Usuário cadastrado com sucesso!');
        router.replace('/(auth)/login');
      } else {
        if (data.data && typeof data.data === 'object') {
          const errorMessages = Object.values(data.data).flat().join('\n');
          Alert.alert('Erro no Cadastro', errorMessages);
        } else {
          Alert.alert('Erro no Cadastro', data.message || 'Ocorreu um erro. Verifique os dados.');
        }
      }
    } catch (error) {
      console.error('Erro na requisição de cadastro:', error);
      Alert.alert('Erro de Conexão', 'Não foi possível se conectar ao servidor.');
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <LinearGradient
      colors={['#4c669f', '#3b5998', '#192f6a']}
      style={styles.fullScreenGradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
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

              {step === 1 && <Step1
                fullName={fullName} setFullName={setFullName}
                cpf={cpf} setCpf={setCpf}
                email={email} setEmail={setEmail}
                dateOfBirth={dateOfBirth} setDateOfBirth={setDateOfBirth}
                showDatePicker={showDatePicker} setShowDatePicker={setShowDatePicker}
                cellPhone={cellPhone} setCellPhone={setCellPhone}
                id_gender={id_gender} setId_gender={setId_gender}
                nextStep={nextStepHandler}
                isNextDisabled={!isStep1Valid}
              />}
              {step === 2 && <Step2
                street={street} setStreet={setStreet}
                number={number} setNumber={setNumber}
                neighborhood={neighborhood} setNeighborhood={setNeighborhood}
                complement={complement} setComplement={setComplement}
                city={city} setCity={setCity}
                state={state} setState={setState}
                zipCode={zipCode} setZipCode={setZipCode}
                id_state={id_state} setId_state={setId_state}
                id_city={id_city} setId_city={setId_city}
                states={states} cities={cities}
                loadingStates={loadingStates} loadingCities={loadingCities}
                fetchCepData={fetchCepData}
                nextStep={nextStepHandler} prevStep={prevStepHandler}
                isNextDisabled={!isStep2Valid}
              />}
              {step === 3 && <Step3
                password={password} setPassword={setPassword}
                confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword}
                prevStep={prevStepHandler} handleRegister={handleRegister}
                isNextDisabled={!isStep3Valid}
                isRegistering={isRegistering}
              />}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fullScreenGradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
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
    top: Platform.OS === 'ios' ? 60 : 40,
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
    marginTop: Platform.OS === 'ios' ? 100 : 70,
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
  inputDate: {
    width: '100%',
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: '#f8f8f8',
    justifyContent: "center",
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
  buttonDisabled: {
    backgroundColor: '#cccccc',
    opacity: 0.7,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    gap: 10,
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
  },
  pickerContainer: {
    width: '100%',
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    marginBottom: 10,
  },
  picker: {
    width: '100%',
    height: 50,
    color: '#333',
  },
  pickerItem: {
    fontSize: 16,
    fontFamily: "fontai",
  },
});