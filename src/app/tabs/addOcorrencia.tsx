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
import { Link, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../context/AuthContext';

// --- Funções de formatação (sem alterações) ---
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
      <TextInput style={[styles.input, styles.inputWithIcon]} placeholder="DD/MM/AAAA" value={date} onChangeText={(text) => setDate(formatInputDate(text))} keyboardType="numeric" maxLength={10} placeholderTextColor="#a0a0a0" />
    </View>
    <Text style={styles.label}>Hora:</Text>
    <View style={styles.inputContainer}>
      <Feather name="clock" size={20} color="#666" style={styles.inputIcon} />
      <TextInput style={[styles.input, styles.inputWithIcon]} placeholder="HH:MM" value={time} onChangeText={(text) => setTime(formatInputTime(text))} keyboardType="numeric" maxLength={5} placeholderTextColor="#a0a0a0" />
    </View>
    <TouchableOpacity style={[styles.button, styles.buttonPrimary, { alignSelf: 'stretch' }, isNextDisabled && styles.buttonDisabled]} onPress={nextStep} disabled={isNextDisabled}>
      <Text style={styles.buttonText}>Próximo</Text>
    </TouchableOpacity>
  </>
);

const Step2 = ({
  locationText, setLocationText,
  mapRegion, markerCoordinate, setMarkerCoordinate,
  isMapLoading, mapRef, handleSearchAddress, isGeocoding,
  nextStep, prevStep, isNextDisabled
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
        <TouchableOpacity style={styles.searchButton} onPress={() => handleSearchAddress(locationText)} disabled={isGeocoding}>
          {isGeocoding ? <ActivityIndicator size="small" color="#fff" /> : <Feather name="search" size={20} color="#fff" />}
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
                <Marker
                  coordinate={markerCoordinate}
                  title="Local da Ocorrência"
                />
              )}
            </MapView>
          )
        )}
      </View>
      
      <View style={styles.buttonGroup}>
        <TouchableOpacity style={[styles.button, styles.buttonSecondary]} onPress={prevStep}>
          <Text style={[styles.buttonText, styles.buttonTextSecondary]}>Voltar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.buttonPrimary, isNextDisabled && styles.buttonDisabled]} onPress={nextStep} disabled={isNextDisabled}>
          <Text style={styles.buttonText}>Próximo</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const Step3 = ({
  description, setDescription,
  prevStep, handlePublish,
  isNextDisabled, isPublishing,
  images, pickImage,
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
    <Text style={styles.label}>Adicione até 4 fotos (opcional):</Text>
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
        style={[styles.button, styles.buttonPrimary, (isNextDisabled || isPublishing) && styles.buttonDisabled]}
        onPress={handlePublish}
        disabled={isNextDisabled || isPublishing}
      >
        {isPublishing ? (
            <ActivityIndicator size="small" color="#fff"/>
        ) : (
            <Text style={styles.buttonText}>Publicar</Text>
        )}
      </TouchableOpacity>
    </View>
  </>
);


// --- COMPONENTE PRINCIPAL ---
export default function AddOcorrencia() {
  const router = useRouter();
  const { user, token } = useAuth(); 

  const [step, setStep] = useState(1);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [locationText, setLocationText] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([null, null, null, null]); 

  const [mapRegion, setMapRegion] = useState(null);
  const [markerCoordinate, setMarkerCoordinate] = useState(null);
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const mapRef = useRef(null);

  useEffect(() => {
    const requestLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão Negada', 'Para adicionar uma ocorrência, precisamos da sua permissão para acessar a localização.');
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
        Alert.alert('Endereço não encontrado', 'Não foi possível encontrar o endereço especificado.');
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
    
    if (!user || !token) {
        Alert.alert('Erro de Autenticação', 'Você precisa estar logado para publicar uma ocorrência.');
        return;
    }

    setIsPublishing(true);

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
    formData.append('status', '1');
    formData.append('id_situation', '1');
    formData.append('id_user', String(user.id));

    // --- MUDANÇA APLICADA AQUI ---
    const selectedImages = images.filter(img => img !== null);

    if (selectedImages.length > 0) {
        selectedImages.forEach((img) => {
            const uriParts = img.split('.');
            const fileType = uriParts[uriParts.length - 1];
            const mimeType = `image/${fileType === 'jpg' ? 'jpeg' : fileType}`;
            
            formData.append('image[]', {
                uri: img,
                name: `occurrence_image.${fileType}`,
                type: mimeType,
            });
        });
    } else {
        // Se nenhuma imagem for selecionada, envia o campo 'image[]' vazio para a API
        formData.append('image[]', '');
    }

    try {
      const API_URL = 'https://www.resolvevereador.com.br/api/occurrences/store';
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.code === 201) {
        Alert.alert('Sucesso!', 'Sua ocorrência foi publicada.');
        router.replace('/tabs/home');
      } else {
        throw new Error(data.message || 'Ocorreu um erro ao publicar a ocorrência.');
      }

    } catch (error: any) {
      console.error('Erro ao publicar ocorrência:', error);
      Alert.alert('Erro', error.message);
    } finally {
        setIsPublishing(false);
    }
  };

  return (
    <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.fullScreenGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView style={styles.keyboardAvoidingView} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
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
                  isPublishing={isPublishing}
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
  fullScreenGradient: { flex: 1 },
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
  label: { fontSize: 16, color: '#333', marginBottom: 8, marginTop: 15, fontWeight: '500' },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#f8f8f8',
    height: 50,
    position: 'relative',
  },
  inputIcon: { position: 'absolute', left: 15, zIndex: 1, color: '#666' },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
    backgroundColor: 'transparent',
  },
  inputWithIcon: { paddingLeft: 45 },
  button: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    elevation: 2,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  buttonDisabled: { opacity: 0.6, backgroundColor: '#cccccc' },
  buttonGroup: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, gap: 10 },
  buttonSecondary: { 
    backgroundColor: 'transparent', 
    borderWidth: 2, 
    borderColor: '#007bff', 
    flex: 1 
  },
  buttonPrimary: { 
    backgroundColor: '#007bff', 
    flex: 1 
  },
  buttonTextSecondary: { color: '#007bff', fontWeight: 'bold' },
  searchContainer: { flexDirection: 'row', marginBottom: 10 },
  searchInput: {
    flex: 1,
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#f8f8f8',
  },
  searchButton: {
    width: 60,
    height: 50,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  mapContainer: { 
    height: 250, 
    borderRadius: 10, 
    overflow: 'hidden', 
    marginVertical: 15, 
    borderWidth: 1, 
    borderColor: '#ccc', 
    justifyContent: 'center', 
    alignItems: 'center',
  },
  map: { ...StyleSheet.absoluteFillObject },
  descriptionInput: {
    height: 120,
    padding: 15,
    textAlignVertical: 'top',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#f8f8f8',
    fontSize: 16
  },
  photoUploadContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    flexWrap: 'wrap',
    marginTop: 10, 
    marginBottom: 20 
  },
  photoPlaceholder: {
    width: '48%',
    aspectRatio: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#ddd',
    borderWidth: 2,
    borderStyle: 'dashed',
    overflow: 'hidden',
    marginBottom: '4%',
  },
  photoPlaceholderText: { color: '#888', fontSize: 40 },
  photoPreview: { width: '100%', height: '100%' },
});

