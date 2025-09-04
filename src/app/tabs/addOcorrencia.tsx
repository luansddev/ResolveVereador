import React, { useState, useEffect, useRef } from 'react';
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
  ActivityIndicator,
  Image,
} from 'react-native';
import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';

// --- Funções de formatação ---
const formatInputDate = (dateString) => {
  const cleaned = dateString.replace(/\D/g, '');
  if (cleaned.length > 8) return cleaned.substring(0, 8).replace(/(\d{2})(\d{2})(\d{4})/, '$1/$2/$3');
  if (cleaned.length > 4) return cleaned.replace(/(\d{2})(\d{2})(\d{1,4})/, '$1/$2/$3');
  if (cleaned.length > 2) return cleaned.replace(/(\d{2})(\d{1,2})/, '$1/$2');
  return cleaned;
};
const isValidDate = (dateString) => {
  const regex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!regex.test(dateString)) return false;
  const [day, month, year] = dateString.split('/').map(Number);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day && date <= new Date();
};
const formatInputTime = (timeString) => {
  const cleaned = timeString.replace(/\D/g, '');
  if (cleaned.length > 4) return cleaned.substring(0, 4).replace(/(\d{2})(\d{2})/, '$1:$2');
  if (cleaned.length > 2) return cleaned.replace(/(\d{2})(\d{1,2})/, '$1:$2');
  return cleaned;
};
const isValidTime = (timeString) => {
  const regex = /^\d{2}:\d{2}$/;
  if (!regex.test(timeString)) return false;
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
};

// --- COMPONENTES DAS ETAPAS ---

const Step1 = ({ date, setDate, time, setTime, nextStep, isNextDisabled }) => (
  <>
    <Text style={styles.sectionTitle}>Quando ocorreu?</Text>
    <Text style={styles.label}>Data:</Text>
    <View style={styles.inputContainer}>
      <Feather name="calendar" size={20} color="#666" style={styles.inputIcon} />
      <TextInput
        style={[styles.input, styles.inputWithIcon]}
        placeholder="DD/MM/AAAA"
        value={date}
        onChangeText={(text) => setDate(formatInputDate(text))}
        keyboardType="numeric"
        maxLength={10}
        placeholderTextColor="#a0a0a0"
      />
    </View>
    <Text style={styles.label}>Hora:</Text>
    <View style={styles.inputContainer}>
      <Feather name="clock" size={20} color="#666" style={styles.inputIcon} />
      <TextInput
        style={[styles.input, styles.inputWithIcon]}
        placeholder="HH:MM"
        value={time}
        onChangeText={(text) => setTime(formatInputTime(text))}
        keyboardType="numeric"
        maxLength={5}
        placeholderTextColor="#a0a0a0"
      />
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

const Step2 = ({
  locationText,
  setLocationText,
  mapRegion,
  markerCoordinate,
  setMarkerCoordinate,
  isMapLoading,
  mapRef,
  handleSearchAddress,
  isGeocoding,
  nextStep,
  prevStep,
  isNextDisabled,
}) => {
  const handleMapPress = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setMarkerCoordinate({ latitude, longitude });
  };

  return (
    <>
      <Text style={styles.sectionTitle}>Localização</Text>
      <Text style={styles.label}>Pesquise o endereço:</Text>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Digite um endereço..."
          value={locationText}
          onChangeText={setLocationText}
          autoCapitalize="words"
          placeholderTextColor="#a0a0a0"
          returnKeyType="search"
          onSubmitEditing={() => handleSearchAddress(locationText)}
        />
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => handleSearchAddress(locationText)}
          disabled={isGeocoding}
        >
          {isGeocoding ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Feather name="search" size={20} color="#fff" />
          )}
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Ajuste o local exato no mapa:</Text>

      <View style={styles.mapContainer}>
        {isMapLoading ? (
          <ActivityIndicator size="large" color="#007bff" />
        ) : (
          mapRegion && (
            <MapView
              ref={mapRef}
              style={styles.map}
              initialRegion={mapRegion}
              onPress={handleMapPress}
            >
              {markerCoordinate && (
                <Marker coordinate={markerCoordinate} title="Local da Ocorrência" />
              )}
            </MapView>
          )
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

const Step3 = ({
  description,
  setDescription,
  prevStep,
  handlePublish,
  isNextDisabled,
  images,
  pickImage,
}) => (
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
    <Text style={styles.label}>Adicione fotos (opcional):</Text>
    <View style={styles.photoUploadContainer}>
      {images.map((img, index) => (
        <TouchableOpacity
          key={index}
          style={styles.photoPlaceholder}
          onPress={() => pickImage(index)}
        >
          {img ? (
            <Image source={{ uri: img }} style={styles.photoPreview} />
          ) : (
            <Text style={styles.photoPlaceholderText}>🖼️ +</Text>
          )}
        </TouchableOpacity>
      ))}
    </View>
    <View style={styles.buttonGroup}>
      <TouchableOpacity style={[styles.button, styles.buttonSecondary]} onPress={prevStep}>
        <Text style={[styles.buttonText, styles.buttonTextSecondary]}>Voltar</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.buttonPrimary, isNextDisabled && styles.buttonDisabled]}
        onPress={handlePublish}
        disabled={isNextDisabled}
      >
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
  const [images, setImages] = useState([null, null]);

  const [mapRegion, setMapRegion] = useState(null);
  const [markerCoordinate, setMarkerCoordinate] = useState(null);
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [isGeocoding, setIsGeocoding] = useState(false);

  const mapRef = useRef(null);

  useEffect(() => {
    const requestLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permissão Negada',
          'Para adicionar uma ocorrência, precisamos da sua permissão para acessar a localização.'
        );
        setIsMapLoading(false);
        return;
      }

      try {
        let location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;
        const region = {
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        setMapRegion(region);
        setMarkerCoordinate({ latitude, longitude });
      } catch (error) {
        Alert.alert('Erro de Localização', 'Não foi possível obter sua localização atual.');
      } finally {
        setIsMapLoading(false);
      }
    };

    requestLocation();
  }, []);

  const handleSearchAddress = async (address) => {
    if (!address.trim()) {
      Alert.alert('Busca Inválida', 'Por favor, digite um endereço para pesquisar.');
      return;
    }
    setIsGeocoding(true);
    try {
      const geocodedLocations = await Location.geocodeAsync(address);
      if (geocodedLocations.length > 0) {
        const { latitude, longitude } = geocodedLocations[0];
        const newRegion = {
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        mapRef.current?.animateToRegion(newRegion, 1000);
        setMarkerCoordinate({ latitude, longitude });
      } else {
        Alert.alert(
          'Endereço não encontrado',
          'Não foi possível encontrar o endereço especificado. Tente ser mais específico.'
        );
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro na Busca', 'Ocorreu um erro ao buscar o endereço.');
    } finally {
      setIsGeocoding(false);
    }
  };

  const pickImage = async (index) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão Negada', 'Precisamos de acesso à sua galeria para selecionar imagens.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsEditing: true,
    });

    if (!result.canceled) {
      const newImages = [...images];
      newImages[index] = result.assets[0].uri;
      setImages(newImages);
    }
  };

  const isStep1Valid = isValidDate(date) && isValidTime(time);
  const isStep2Valid = markerCoordinate !== null;
  const isStep3Valid = description.trim() !== '';

  const nextStepHandler = () => {
    if (step === 1 && !isStep1Valid) return;
    if (step === 2 && !isStep2Valid) return;
    setStep((s) => s + 1);
  };

  const prevStepHandler = () => {
    setStep((s) => s - 1);
  };

  const handlePublish = async () => {
    if (!isStep3Valid) return;

    const formatDateTimeForAPI = (dateStr, timeStr) => {
      const [day, month, year] = dateStr.split('/');
      return `${year}-${month}-${day} ${timeStr}:00`;
    };

    const formattedDateTime = formatDateTimeForAPI(date, time);
    const formData = new FormData();

    formData.append('datetime', formattedDateTime);
    formData.append('latitude', String(markerCoordinate.latitude));
    formData.append('longitude', String(markerCoordinate.longitude));
    formData.append('description', description);
    formData.append('status', 'true');
    formData.append('id_situation', '1');
    formData.append('id_user', '1'); // Placeholder

    images.forEach((img, index) => {
      if (img) {
        const uriParts = img.split('.');
        const fileType = uriParts[uriParts.length - 1];
        formData.append('photo' + (index + 1), {
          uri: img,
          name: `photo${index + 1}.${fileType}`,
          type: `image/${fileType}`,
        });
      }
    });

    console.log('--- Preparando para enviar FormData ---');
    try {
      for (let pair of formData._parts) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }
    } catch (e) {
      console.log('Não foi possível logar o FormData diretamente.');
    }

    Alert.alert(
      'Dados Prontos para Envio',
      'Os dados foram formatados corretamente. Verifique o console para ver os detalhes.'
    );
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
          <ScrollView
            contentContainerStyle={styles.scrollViewContent}
            style={styles.scrollViewFlex}
          >
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

              {step === 1 && (
                <Step1
                  date={date}
                  setDate={setDate}
                  time={time}
                  setTime={setTime}
                  nextStep={nextStepHandler}
                  isNextDisabled={!isStep1Valid}
                />
              )}
              {step === 2 && (
                <Step2
                  locationText={locationText}
                  setLocationText={setLocationText}
                  mapRegion={mapRegion}
                  markerCoordinate={markerCoordinate}
                  setMarkerCoordinate={setMarkerCoordinate}
                  isMapLoading={isMapLoading}
                  mapRef={mapRef}
                  handleSearchAddress={handleSearchAddress}
                  isGeocoding={isGeocoding}
                  nextStep={nextStepHandler}
                  prevStep={prevStepHandler}
                  isNextDisabled={!isStep2Valid}
                />
              )}
              {step === 3 && (
                <Step3
                  description={description}
                  setDescription={setDescription}
                  prevStep={prevStepHandler}
                  handlePublish={handlePublish}
                  isNextDisabled={!isStep3Valid}
                  images={images}
                  pickImage={pickImage}
                />
              )}
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
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 20,
    left: 20,
    zIndex: 1,
    padding: 10,
  },
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#316996',
    marginBottom: 15,
    textAlign: 'center',
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
  progressStepActive: { backgroundColor: '#0090a9ff' },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#04588F',
    marginBottom: 12,
    textAlign: 'center',
  },
  label: { fontSize: 16, color: '#333', marginBottom: 6 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  inputIcon: { position: 'absolute', left: 10, zIndex: 1 },
  input: {
    flex: 1,
    height: 48,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 40,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputWithIcon: { paddingLeft: 40 },
  button: {
    backgroundColor: '#04588F',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
    elevation: 4,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  buttonDisabled: { opacity: 0.6 },
  buttonGroup: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  buttonSecondary: { backgroundColor: '#e0e0e0', flex: 1, marginRight: 8 },
  buttonPrimary: { flex: 1, marginLeft: 8 },
  buttonTextSecondary: { color: '#333' },
  searchContainer: { flexDirection: 'row', marginBottom: 10 },
  searchInput: {
    flex: 1,
    height: 45,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: '#04588F',
    padding: 10,
    borderRadius: 8,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapContainer: { height: 250, borderRadius: 10, overflow: 'hidden', marginVertical: 15 },
  map: { flex: 1 },
  descriptionInput: { height: 120, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 15 },
  photoUploadContainer: { flexDirection: 'row', marginBottom: 15 },
  photoPlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  photoPlaceholderText: { color: '#888', fontSize: 28 },
  photoPreview: { width: '100%', height: '100%', borderRadius: 8 },
});
