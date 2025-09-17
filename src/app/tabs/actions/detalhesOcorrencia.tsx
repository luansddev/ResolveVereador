import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import { useAuth } from '../../../context/AuthContext';

interface Occurrence {
  id: number;
  description: string;
  datetime: string;
  latitude: string;
  longitude: string;
  situation: {
    situation_title: string | null;
  } | null;
  image: any; // pode ser array ou objeto
}

export default function DetalhesOcorrencia() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { token } = useAuth();

  const [occurrence, setOccurrence] = useState<Occurrence | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [failedImages, setFailedImages] = useState<{ [key: string]: boolean }>({});
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);

  // Função para extrair data e hora separadamente
  const getOccurrenceTimeInfo = (datetime: string | undefined): { date: string; time: string } => {
    if (!datetime) return { date: 'Data indisponível', time: 'hora indisponível' };
    try {
      const parts = datetime.split(' ');
      const datePart = parts[0];
      const timePart = parts[1].substring(0, 5);
      return { date: datePart, time: timePart };
    } catch (e) {
      return { date: 'Data inválida', time: 'hora inválida' };
    }
  };

  useEffect(() => {
    const fetchOccurrenceDetails = async () => {
      if (!id || !token) {
        setError('ID da ocorrência ou token de autenticação não encontrado.');
        setIsLoading(false);
        return;
      }

      try {
        const API_URL = `https://www.resolvevereador.com.br/api/occurrences/show/${id}`;

        const response = await fetch(API_URL, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Falha ao buscar os detalhes da ocorrência.');
        }

        const data = await response.json();
        setOccurrence(data);
      } catch (err: any) {
        setError(err.message);
        console.error('Erro ao buscar detalhes:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOccurrenceDetails();
  }, [id, token]);

  // Buscar endereço (geocodificação reversa)
  useEffect(() => {
    if (occurrence) {
      const lat = parseFloat(occurrence.latitude);
      const lon = parseFloat(occurrence.longitude);

      if (!isNaN(lat) && !isNaN(lon)) {
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`, {
          headers: {
            'User-Agent': 'SeuApp/1.0 (contato@exemplo.com)',
            'Accept': 'application/json',
          },
        })
          .then((res) => res.json())
          .then((json) => {
            if (json?.address) {
              const { road, suburb, neighbourhood, city, town, village, postcode } = json.address;

              const street = road || '';
              const district = suburb || neighbourhood || '';
              const locality = city || town || village || '';
              const cep = postcode || '';

              const formatted = [street, district, locality, cep].filter(Boolean).join(', ');

              setAddress(formatted || 'Endereço não encontrado');
            } else {
              setAddress('Endereço não encontrado');
            }
          })
          .catch(() => setAddress('Erro ao buscar endereço'));
      }
    }
  }, [occurrence]);

  // Lógica para imagens
  const imageList: { id: number; url: string }[] = [];
  if (occurrence?.image && Array.isArray(occurrence.image)) {
    occurrence.image.forEach((group: any) => {
      if (Array.isArray(group)) {
        const best = group.find((img: any) => img.url.includes('-100.jpg')) || group[0];
        if (best) imageList.push(best);
      } else if (group.url) {
        imageList.push(group);
      }
    });
  }

  const { date, time } = getOccurrenceTimeInfo(occurrence?.datetime);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detalhes da Ocorrência</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={{ marginTop: 10, color: '#666', fontFamily: 'fontuda' }}>Carregando...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !occurrence) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detalhes da Ocorrência</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.centered}>
          <Feather name="alert-triangle" size={40} color="#d9534f" />
          <Text style={styles.errorText}>
            {error || 'Não foi possível carregar os dados da ocorrência.'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const lat = parseFloat(occurrence.latitude);
  const lon = parseFloat(occurrence.longitude);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalhes da Ocorrência</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.iconCircle}>
              <Feather name="alert-triangle" size={24} color="white" />
            </View>
            <View style={styles.headerTextContainer}>
              <Text style={styles.occurrenceTitle}>
                Ocorrência de {date} às {time}
              </Text>
              {occurrence.situation?.situation_title && (
                <View style={styles.detailsRow}>
                  <Feather name="alert-circle" size={14} color="#666" />
                  <Text style={styles.detailText}>
                    {occurrence.situation.situation_title}
                  </Text>
                </View>
              )}
            </View>
          </View>
          <View style={styles.cardBody}>
            <Text style={styles.descriptionText}>{occurrence.description}</Text>

            {imageList.length > 0 ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.imageGallery}
              >
                {imageList.map((img, index) => {
                  const key = `${index}-${img.id}`;
                  const failed = failedImages[key];

                  return (
                    <TouchableOpacity
                      key={key}
                      style={styles.imageWrapper}
                      onPress={() => !failed && setSelectedImage(img.url)}
                    >
                      {!failed ? (
                        <Image
                          source={{ uri: img.url }}
                          style={styles.galleryImage}
                          resizeMode="cover"
                          onError={() => {
                            setFailedImages((prev) => ({ ...prev, [key]: true }));
                          }}
                        />
                      ) : (
                        <View style={[styles.galleryImage, styles.errorImage]}>
                          <Feather name="camera-off" size={30} color="#999" />
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            ) : (
              <Text style={styles.infoText}>
                Nenhuma imagem encontrada para esta ocorrência.
              </Text>
            )}

            <Modal visible={!!selectedImage} transparent={true} onRequestClose={() => setSelectedImage(null)}>
              <View style={styles.modalBackground}>
                <TouchableOpacity
                  style={styles.modalCloseButton}
                  onPress={() => setSelectedImage(null)}
                >
                  <Feather name="x" size={30} color="white" />
                </TouchableOpacity>
                {selectedImage && (
                  <Image
                    source={{ uri: selectedImage }}
                    style={styles.fullscreenImage}
                    resizeMode="contain"
                  />
                )}
              </View>
            </Modal>

            <View style={styles.locationSection}>
              <Feather name="map-pin" size={16} color="#333" style={{ marginRight: 8 }} />
              <Text style={styles.locationAddress}>
                {address || 'Carregando endereço...'}
              </Text>
            </View>

            {!isNaN(lat) && !isNaN(lon) && (
              <View style={styles.mapContainer}>
                <MapView
                  style={styles.map}
                  region={{
                    latitude: lat,
                    longitude: lon,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  }}
                >
                  <Marker coordinate={{ latitude: lat, longitude: lon }} />
                </MapView>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f4f6f8',
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    color: '#333',
    fontFamily: 'fontudo',
  },
  backButton: {
    padding: 5,
  },
  container: {
    padding: 15,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    backgroundColor: '#00BCD4',
  },
  headerTextContainer: {
    flex: 1,
  },
  occurrenceTitle: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
    fontFamily: 'fontudo',
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  detailText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 5,
    fontFamily: 'fontuda',
  },
  cardBody: {
    padding: 15,
  },
  descriptionText: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
    marginBottom: 20,
    fontFamily: 'fontai',
  },
  imageGallery: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  imageWrapper: {
    width: 150,
    height: 150,
    borderRadius: 12,
    marginRight: 12,
    overflow: 'hidden',
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  galleryImage: {
    width: '100%',
    height: '100%',
  },
  errorImage: {
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
  },
  fullscreenImage: {
    width: '100%',
    height: '100%',
  },
  locationSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  locationAddress: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    fontFamily: 'fontudo',
  },
  mapContainer: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#e9e9e9',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    marginTop: 15,
    fontSize: 16,
    color: '#d9534f',
    textAlign: 'center',
    fontFamily: 'fontuda',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 20,
    fontFamily: 'fontuda',
  },
});
