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
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

// --- FUNÇÕES DE VALIDAÇÃO E FORMATAÇÃO ---

const validateEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

const formatCpf = (cpf) => {
  const cleanedCpf = cpf.replace(/\D/g, '');
  return cleanedCpf
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
};

const formatCep = (cep) => {
  const cleanedCep = cep.replace(/\D/g, '');
  return cleanedCep
    .replace(/(\d{5})(\d)/, '$1-$2');
};

const formatPhoneNumber = (phoneNumber) => {
  const cleaned = ('' + phoneNumber).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phoneNumber;
};

// --- COMPONENTES DAS ETAPAS ---

const Step1 = ({
  fullName, setFullName, cpf, setCpf, email, setEmail,
  dateOfBirth, setDateOfBirth, showDatePicker, setShowDatePicker,
  cellPhone, setCellPhone, id_gender, setId_gender,
  nextStep, isNextDisabled
}) => {
  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || dateOfBirth;
    setShowDatePicker(Platform.OS === 'ios' ? false : false); 
    setDateOfBirth(currentDate);
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

const Step2 = ({
  street, setStreet, number, setNumber, neighborhood, setNeighborhood,
  complement, setComplement,
  city, setCity, state, setState, zipCode, setZipCode,
  id_state, setId_state, id_city, setId_city,
  states, cities, loadingStates, loadingCities,
  fetchCepData, nextStep, prevStep, isNextDisabled
}) => {
  const handleZipCodeChange = (text) => {
    setZipCode(formatCep(text));
  };

  const handleZipCodeBlur = () => {
    if (zipCode.replace(/\D/g, '').length === 8) {
      fetchCepData(zipCode);
    }
  };

  return (
    <>
      <Text style={styles.sectionTitle}>Endereço Completo</Text>
      <Text style={styles.label}>CEP:</Text>
      <TextInput
        style={styles.input}
        placeholder="00000-000"
        value={zipCode}
        onChangeText={handleZipCodeChange}
        keyboardType="numeric"
        maxLength={9}
        placeholderTextColor="#a0a0a0"
        onBlur={handleZipCodeBlur}
      />
      <Text style={styles.label}>Rua:</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome da rua/avenida"
        value={street}
        onChangeText={setStreet}
        autoCapitalize="words"
        placeholderTextColor="#a0a0a0"
      />
      <Text style={styles.label}>Número:</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: 123"
        value={number}
        onChangeText={setNumber}
        keyboardType="numeric"
        placeholderTextColor="#a0a0a0"
      />
      <Text style={styles.label}>Bairro:</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome do bairro"
        value={neighborhood}
        onChangeText={setNeighborhood}
        autoCapitalize="words"
        placeholderTextColor="#a0a0a0"
      />
      <Text style={styles.label}>Complemento (opcional):</Text>
      <TextInput
        style={styles.input}
        placeholder="Apartamento, bloco, etc."
        value={complement}
        onChangeText={setComplement}
        autoCapitalize="words"
        placeholderTextColor="#a0a0a0"
      />
      {/* ATENÇÃO: Os campos de Estado e Cidade abaixo ainda usam a API do IBGE. */}
      {/* Eles precisarão ser substituídos quando o dono da API fornecer os novos endpoints para buscar estados e cidades. */}
      <Text style={styles.label}>Estado:</Text>
      <View style={styles.pickerContainer}>
        {loadingStates ? (
          <ActivityIndicator size="small" color="#007bff" />
        ) : (
          <Picker
            selectedValue={id_state}
            onValueChange={(itemValue) => {
              setId_state(itemValue);
              const selectedStateObj = states.find(s => s.id === itemValue);
              setState(selectedStateObj ? selectedStateObj.sigla : '');
            }}
            style={styles.picker}
            itemStyle={styles.pickerItem}
          >
            <Picker.Item label="Selecione um estado" value={null} />
            {states.map((s) => (
              <Picker.Item key={s.id} label={s.nome} value={s.id} />
            ))}
          </Picker>
        )}
      </View>

      <Text style={styles.label}>Cidade:</Text>
      <View style={styles.pickerContainer}>
        {loadingCities ? (
          <ActivityIndicator size="small" color="#007bff" />
        ) : (
          <Picker
            selectedValue={id_city}
            onValueChange={(itemValue) => {
              setId_city(itemValue);
              const selectedCityObj = cities.find(c => c.id === itemValue);
              setCity(selectedCityObj ? selectedCityObj.nome : '');
            }}
            style={styles.picker}
            itemStyle={styles.pickerItem}
            enabled={id_state !== null}
          >
            <Picker.Item label="Selecione uma cidade" value={null} />
            {cities.map((c) => (
              <Picker.Item key={c.id} label={c.nome} value={c.id} />
            ))}
          </Picker>
        )}
      </View>
      
      <View style={styles.buttonGroup}>
        <TouchableOpacity style={[styles.button, styles.buttonSecondary]} onPress={prevStep}>
          <Text style={[styles.buttonText, styles.buttonTextSecondary]}>Voltar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.buttonPrimary, isNextDisabled && styles.buttonDisabled]}
          onPress={nextStep}
          disabled={isNextDisabled}
        >
          <Text style={styles.buttonText}>Próximo</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const Step3 = ({ password, setPassword, confirmPassword, setConfirmPassword, prevStep, handleRegister, isNextDisabled, isRegistering }) => (
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
      <TouchableOpacity
        style={[styles.button, styles.buttonPrimary, (isNextDisabled || isRegistering) && styles.buttonDisabled]}
        onPress={handleRegister}
        disabled={isNextDisabled || isRegistering}
      >
        {isRegistering ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Cadastrar</Text>
        )}
      </TouchableOpacity>
    </View>
  </>
);

export default function Cadastro() {
  const router = useRouter();

  const [step, setStep] = useState(1);

  const [fullName, setFullName] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [cellPhone, setCellPhone] = useState('');
  const [id_gender, setId_gender] = useState(null);
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [complement, setComplement] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [id_state, setId_state] = useState(null);
  const [id_city, setId_city] = useState(null);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const [fontsLoaded] = useFonts({
    'fontuda': require('../../../assets/fonts/SpaceGrotesk-Regular.ttf'),
    'fontudo': require('../../../assets/fonts/SpaceGrotesk-Bold.ttf'),
    'fontai': require('../../../assets/fonts/SpaceGrotesk-Regular.ttf'),
  });

  // --- ATENÇÃO: As duas funções 'useEffect' abaixo buscam dados da API do IBGE.
  // Elas precisarão ser substituídas por chamadas aos novos endpoints da API do seu cliente
  // assim que eles forem disponibilizados, pois os IDs de estado e cidade são diferentes.
  useEffect(() => {
    async function fetchStates() {
      setLoadingStates(true);
      try {
        const response = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome');
        const data = await response.json();
        setStates(data);
      } catch (error) {
        console.error('Erro ao buscar estados:', error);
        Alert.alert('Erro', 'Não foi possível carregar a lista de estados.');
      } finally {
        setLoadingStates(false);
      }
    }
    fetchStates();
  }, []);

  useEffect(() => {
    if (id_state) {
      async function fetchCities() {
        setLoadingCities(true);
        try {
          const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${id_state}/municipios?orderBy=nome`);
          const data = await response.json();
          setCities(data);
          setId_city(null);
          setCity('');
        } catch (error) {
          console.error('Erro ao buscar cidades:', error);
          Alert.alert('Erro', 'Não foi possível carregar a lista de cidades.');
        } finally {
          setLoadingCities(false);
        }
      }
      fetchCities();
    } else {
      setCities([]);
      setId_city(null);
      setCity('');
    }
  }, [id_state]);

  const fetchCepData = async (cep) => {
    const cleanedCep = cep.replace(/\D/g, '');
    if (cleanedCep.length !== 8) {
      return;
    }

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanedCep}/json/`);
      const data = await response.json();

      if (data.erro) {
        Alert.alert('CEP Não Encontrado', 'O CEP digitado não foi encontrado.');
        return;
      }

      setStreet(data.logradouro);
      setNeighborhood(data.bairro);
      setCity(data.localidade);
      setState(data.uf);

      const foundState = states.find(s => s.sigla === data.uf);
      if (foundState) {
        setId_state(foundState.id);
      } else {
        setId_state(null);
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      Alert.alert('Erro', 'Não foi possível buscar os dados do CEP.');
    }
  };

  if (!fontsLoaded) {
    return <Text>Carregando...</Text>;
  }

  const isStep1Valid = fullName.trim() !== '' &&
    cpf.replace(/\D/g, '').length === 11 &&
    validateEmail(email) &&
    dateOfBirth !== null &&
    cellPhone.replace(/\D/g, '').length >= 10 &&
    id_gender !== null;

  const isStep2Valid = street.trim() !== '' &&
    number.trim() !== '' &&
    neighborhood.trim() !== '' &&
    city.trim() !== '' &&
    state.trim() !== '' &&
    id_state !== null &&
    id_city !== null &&
    zipCode.replace(/\D/g, '').length === 8;

  const isStep3Valid = password.length >= 6 && password === confirmPassword;

  const nextStepHandler = () => {
    if (step === 1 && !isStep1Valid) {
      return;
    }
    if (step === 2 && !isStep2Valid) {
      return;
    }
    setStep(currentStep => currentStep + 1);
  };

  const prevStepHandler = () => setStep(currentStep => currentStep - 1);

  const handleRegister = async () => {
    if (!isStep3Valid) {
      return;
    }

    setIsRegistering(true);

    const userData = {
      name: fullName,
      cpf: cpf.replace(/\D/g, ''),
      // --- MUDANÇA 1: Formato da data alterado para AAAA-MM-DD ---
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
    
    console.log('Enviando dados do usuário (formato de data e URL atualizados):', JSON.stringify(userData, null, 2));

    try {
      // --- MUDANÇA 2: URL do endpoint de cadastro atualizada ---
      const API_URL = 'https://www.resolvevereador.com.br/api/users-app/store';
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro do servidor: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();

      if (data.code === 201) {
        Alert.alert('Sucesso', data.message || 'Usuário cadastrado com sucesso!');
        router.replace('/login');
      } else {
        // Se a API retornar um erro de validação, mostra a mensagem específica
        if (data.errors) {
            const errorMessages = Object.values(data.errors).flat().join('\n');
            Alert.alert('Erro no Cadastro', errorMessages);
        } else {
            Alert.alert('Erro no Cadastro', data.message || 'Ocorreu um erro no cadastro. Verifique os dados.');
        }
        console.error('Erro da API:', data);
      }
    } catch (error) {
      console.error('Erro na requisição de cadastro:', error);
      Alert.alert('Erro de Conexão', 'Não foi possível se conectar ao servidor. Verifique sua internet ou tente novamente mais tarde.');
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
                isNextDisabled={!isStep3Valid || isRegistering}
                isRegistering={isRegistering}
              />}
              {isRegistering && (
                <View style={styles.loadingOverlay}>
                  <ActivityIndicator size="large" color="#007bff" />
                  <Text style={styles.loadingText}>Cadastrando...</Text>
                </View>
              )}
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
  inputDate: {
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
  loadingOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
});

