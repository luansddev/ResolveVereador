import React, { useState } from 'react';
import {
  View,
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
import { LinearGradient } from 'expo-linear-gradient'; // Reintroduzindo para o degradê
import { Feather } from '@expo/vector-icons'; // Importando Feather icons

// --- COMPONENTES DAS ETAPAS ---
// Definidos fora do componente principal para otimizar a performance e evitar problemas com o teclado.

// ETAPA 1: Data e Hora
const Step1 = ({ date, setDate, time, setTime, nextStep }) => (
  <>
    <Text style={styles.sectionTitle}>Quando ocorreu?</Text>
    <View style={styles.dateTimeContainer}>
      {/* Input de Data com Ícone */}
      <View style={[styles.inputContainer, styles.dateInputContainer]}>
        <Feather name="calendar" size={20} color="#666" style={styles.inputIcon} />
        <TextInput
          style={[styles.input, styles.inputWithIcon]}
          placeholder="DD/MM/AAAA"
          value={date}
          onChangeText={setDate}
          keyboardType="numeric"
          maxLength={10}
          placeholderTextColor="#a0a0a0"
        />
      </View>
      {/* Input de Hora com Ícone */}
      <View style={[styles.inputContainer, styles.timeInputContainer]}>
        <Feather name="clock" size={20} color="#666" style={styles.inputIcon} />
        <TextInput
          style={[styles.input, styles.inputWithIcon]}
          placeholder="HH:MM"
          value={time}
          onChangeText={setTime}
          keyboardType="numeric"
          maxLength={5}
          placeholderTextColor="#a0a0a0"
        />
      </View>
    </View>
    <TouchableOpacity style={styles.button} onPress={nextStep}>
      <Text style={styles.buttonText}>Próximo</Text>
    </TouchableOpacity>
  </>
);

// ETAPA 2: Localização
const Step2 = ({ locationText, setLocationText, nextStep, prevStep }) => (
  <>
    <Text style={styles.sectionTitle}>Localização</Text>
    <Text style={styles.label}>Local da ocorrência:</Text>
    <TextInput
      style={styles.input}
      placeholder="Digite o nome do local ou endereço"
      value={locationText}
      onChangeText={setLocationText}
      autoCapitalize="words"
      placeholderTextColor="#a0a0a0"
    />
    <Text style={styles.label}>Defina a localização no mapa:</Text>
    <View style={styles.mapPlaceholder}>
      <Text style={styles.mapPlaceholderText}>Mapa</Text>
      <Text style={styles.mapPinText}>📍</Text>
    </View>
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

// ETAPA 3: Descrição e Fotos
const Step3 = ({ description, setDescription, prevStep, handlePublish }) => (
  <>
    <Text style={styles.sectionTitle}>Descrição e Fotos</Text>
    <Text style={styles.label}>Faça a descrição da ocorrência:</Text>
    <TextInput
      style={[styles.input, styles.descriptionInput]}
      placeholder="Descreva o que aconteceu..."
      value={description}
      onChangeText={setDescription}
      multiline
      numberOfLines={4}
      textAlignVertical="top"
      placeholderTextColor="#a0a0a0"
    />
    <Text style={styles.label}>Adicione até 2 fotos:</Text>
    <View style={styles.photoUploadContainer}>
      <TouchableOpacity style={styles.photoPlaceholder}>
        <Text style={styles.photoPlaceholderText}>🖼️ +</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.photoPlaceholder}>
        <Text style={styles.photoPlaceholderText}>🖼️ +</Text>
      </TouchableOpacity>
    </View>
    <View style={styles.buttonGroup}>
      <TouchableOpacity style={[styles.button, styles.buttonSecondary]} onPress={prevStep}>
        <Text style={[styles.buttonText, styles.buttonTextSecondary]}>Voltar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.buttonPrimary]} onPress={handlePublish}>
        <Text style={styles.buttonText}>Publicar</Text>
      </TouchableOpacity>
    </View>
  </>
);


// --- COMPONENTE PRINCIPAL ---
export default function AddOcorrencia() {
  const [step, setStep] = useState(1);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [locationText, setLocationText] = useState('');
  const [description, setDescription] = useState('');

  const nextStep = () => {
    if (step === 1 && (!date.trim() || !time.trim())) {
      Alert.alert('Atenção', 'Por favor, preencha a data e a hora.');
      return;
    }
    if (step === 2 && !locationText.trim()) {
      Alert.alert('Atenção', 'Por favor, preencha o local da ocorrência.');
      return;
    }
    setStep(s => s + 1);
  };

  const prevStep = () => {
    setStep(s => s - 1);
  };

  const handlePublish = () => {
    if (!description.trim()) {
      Alert.alert('Atenção', 'A descrição é obrigatória.');
      return;
    }
    
    Alert.alert(
      'Ocorrência Publicada!',
      `Data: ${date}\nHora: ${time}\nLocal: ${locationText}\nDescrição: ${description}`
    );
    console.log('Dados da Ocorrência:', { date, time, locationText, description });
    // Aqui você pode adicionar a lógica para limpar os campos ou navegar para outra tela
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
          <ScrollView contentContainerStyle={styles.scrollViewContent} style={styles.scrollViewFlex}>
            <Link href="/tabs/home" asChild>
              <TouchableOpacity style={styles.backButton}>
                <Text style={styles.backButtonText}>{'<'}</Text>
              </TouchableOpacity>
            </Link>

            <View style={styles.contentWrapper}>
              <Text style={styles.title}>Adicione uma Ocorrência</Text>

              <View style={styles.progressContainer}>
                <View style={[styles.progressStep, step >= 1 && styles.progressStepActive]} />
                <View style={[styles.progressStep, step >= 2 && styles.progressStepActive]} />
                <View style={[styles.progressStep, step >= 3 && styles.progressStepActive]} />
              </View>

              {step === 1 && <Step1 date={date} setDate={setDate} time={time} setTime={setTime} nextStep={nextStep} />}
              {step === 2 && <Step2 locationText={locationText} setLocationText={setLocationText} nextStep={nextStep} prevStep={prevStep} />}
              {step === 3 && <Step3 description={description} setDescription={setDescription} prevStep={prevStep} handlePublish={handlePublish} />}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fullScreenGradient: { flex: 1, backgroundColor: '#04588F' },
  safeArea: { flex: 1 },
  keyboardAvoidingView: { flex: 1 },
  scrollViewFlex: { flex: 1 },
  scrollViewContent: { flexGrow: 1, justifyContent: 'center', paddingVertical: 20 },
  backButton: { position: 'absolute', top: Platform.OS === 'ios' ? 60 : 20, left: 20, zIndex: 1, padding: 10 },
  backButtonText: { fontSize: 24, color: '#fff', fontWeight: 'bold' },
  contentWrapper: {
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 15,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
    marginTop: Platform.OS === 'ios' ? 80 : 60,
    marginBottom: 20,
  },
  title: { fontSize: 28, fontWeight: 'bold', color: '#316996', marginBottom: 15, textAlign: 'center' },
  progressContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '50%', alignSelf: 'center', marginBottom: 25 },
  progressStep: { flex: 1, height: 8, backgroundColor: '#ddd', borderRadius: 4, marginHorizontal: 4 },
  progressStepActive: { backgroundColor: '#0090a9ff' },
  sectionTitle: { fontSize: 22, fontWeight: 'bold', color: '#333', textAlign: 'center', marginBottom: 20 },
  label: { fontSize: 16, color: '#555', marginBottom: 8, marginTop: 15, fontWeight: '600' },
  // Estilo base do TextInput
  input: {
    flex: 1, // Para ocupar o restante do espaço no inputContainer
    height: 50,
    borderColor: '#dcdcdc', // Será substituído pelo inputContainer
    borderWidth: 1, // Removido para o inputContainer gerenciar a borda
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#333',
    backgroundColor: 'transparent', // Fundo transparente
  },
  // Novo estilo para o container do input com ícone
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#f8f8f8',
    height: 50,
    position: 'relative', // Necessário para posicionar o ícone absoluto
    paddingRight: 15, // Espaço para o ícone (se fosse à direita)
  },
  inputIcon: {
    position: 'absolute',
    left: 15, // Posição do ícone dentro do input
    zIndex: 1,
    color: '#666',
  },
  inputWithIcon: {
    paddingLeft: 45, // Adiciona padding para o texto não sobrepor o ícone
    // Outros estilos do input já estão no 'input' base
  },
  dateTimeContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, gap: 10 }, // Adicionado gap
  dateInputContainer: { width: '55%' },
  timeInputContainer: { width: '40%' }, // Ajustado para 40%
  mapPlaceholder: { width: '100%', height: 180, backgroundColor: '#e9e9e9', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginBottom: 15, borderWidth: 1, borderColor: '#ccc', position: 'relative' },
  mapPlaceholderText: { color: '#666', fontSize: 16 },
  mapPinText: { position: 'absolute', fontSize: 40 },
  descriptionInput: { height: 120, paddingTop: 15, textAlignVertical: 'top' },
  photoUploadContainer: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 10, marginBottom: 20 },
  photoPlaceholder: { width: 100, height: 100, backgroundColor: '#e9e9e9', borderRadius: 8, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#ccc', borderStyle: 'dashed' },
  photoPlaceholderText: { fontSize: 30, color: '#aaa' },
  button: {
    backgroundColor: '#316996',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    fontFamily: "fontudo"
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  buttonGroup: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 30, gap: 10 },
  buttonPrimary: { backgroundColor: '#007bff', flex: 1 }, // Adicionado flex: 1
  buttonSecondary: { backgroundColor: 'transparent', borderWidth: 2, borderColor: '#007bff', flex: 1 }, // Adicionado flex: 1
  buttonTextSecondary: { color: '#007bff' },
});
