import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';

// Dados de exemplo baseados na documentação e no ID recebido
// Em um app real, você usaria o 'id' para fazer um fetch na API
const getDummyDetails = (id) => ({
  id: id,
  title: 'Alagamento na Rua XV',
  timeAgo: 'Há 1 dia',
  severity: 'Moderado',
  iconName: 'cloud-rain',
  description: 'It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
  location: {
    address: 'Avenida ABC',
    latitude: -24.0054, // Coordenadas de exemplo
    longitude: -46.4022,
  },
  images: [
    { id: '1', url: 'https://placehold.co/400x400/e2e8f0/4a5568?text=Foto+1' },
    { id: '2', url: 'https://placehold.co/400x400/e2e8f0/4a5568?text=Foto+2' },
  ]
});


export default function DetalhesOcorrencia() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); // Pega o ID passado como parâmetro
  const occurrence = getDummyDetails(id); // Busca os dados (mock) com base no ID

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
              <Feather name={occurrence.iconName} size={24} color="white" />
            </View>
            <View style={styles.headerTextContainer}>
              <Text style={styles.occurrenceTitle}>{occurrence.title}</Text>
              <View style={styles.detailsRow}>
                <Feather name="clock" size={14} color="#666" />
                <Text style={styles.detailText}>{occurrence.timeAgo}</Text>
                <Text style={styles.detailSeparator}>|</Text>
                <Feather name="alert-circle" size={14} color="#666" />
                <Text style={styles.detailText}>{occurrence.severity}</Text>
              </View>
            </View>
          </View>
          <View style={styles.cardBody}>
            <Text style={styles.descriptionText}>{occurrence.description}</Text>
            
            <View style={styles.imageGallery}>
              {occurrence.images.map(image => (
                <Image key={image.id} source={{ uri: image.url }} style={styles.galleryImage} />
              ))}
            </View>

            <View style={styles.locationSection}>
                <Feather name="map-pin" size={16} color="#333" style={{ marginRight: 8 }}/>
                <Text style={styles.locationAddress}>{occurrence.location.address}</Text>
            </View>

            <View style={styles.mapContainer}>
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: occurrence.location.latitude,
                  longitude: occurrence.location.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
                scrollEnabled={false} // Trava o mapa
                zoomEnabled={false}   // Trava o zoom
              >
                <Marker
                  coordinate={{
                    latitude: occurrence.location.latitude,
                    longitude: occurrence.location.longitude,
                  }}
                />
              </MapView>
            </View>
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
    fontWeight: 'bold',
    color: '#333',
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
    fontSize: 17,
    fontWeight: '700',
    color: '#333',
    marginBottom: 5,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 5,
  },
  detailSeparator: {
    fontSize: 13,
    color: '#ccc',
    marginHorizontal: 8,
  },
  cardBody: {
    padding: 15,
  },
  descriptionText: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
    marginBottom: 20,
  },
  imageGallery: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 15,
    marginBottom: 20,
  },
  galleryImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: '#e0e0e0'
  },
  locationSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  locationAddress: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  mapContainer: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#e9e9e9',
    borderWidth: 1,
    borderColor: '#ddd'
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
