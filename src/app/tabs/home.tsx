import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  FlatList,
} from 'react-native';
// A importação do 'Link' foi trocada pelo 'useRouter' para navegação programática
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

// Dados de exemplo para as ocorrências
const DUMMY_OCCURRENCES = [
  {
    id: '2',
    title: 'Alagamento na Rua XV',
    timeAgo: 'Há 1 dia',
    severity: 'Moderado',
    description: 'It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
    iconName: 'cloud-rain',
  },
  {
    id: '3',
    title: 'Acidente na Rodovia',
    timeAgo: 'Há 2 dias',
    severity: 'Crítico',
    description: 'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source.',
    iconName: 'alert-triangle',
  },
];

// --- MUDANÇA 1: Componente OccurrenceItem atualizado ---
const OccurrenceItem = ({ item }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter(); // Hook para navegação

  const handleDetailsPress = () => {
    // Navega para a tela de detalhes, passando o ID da ocorrência como parâmetro
    // A tela de detalhes poderá usar esse ID para buscar os dados completos na API
    router.push({
      pathname: '/tabs/actions/detalhesOcorrencia',
      params: { id: item.id }
    });
  };

  return (
    <View style={styles.occurrenceCard}>
      <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)} style={styles.cardHeader}>
        <View style={styles.iconCircle}>
          <Feather name={item.iconName} size={24} color="white" />
        </View>
        <View style={styles.headerTextContainer}>
          <Text style={styles.occurrenceTitle}>{item.title}</Text>
          <View style={styles.detailsRow}>
            <Feather name="clock" size={14} color="#666" />
            <Text style={styles.detailText}>{item.timeAgo}</Text>
            <Text style={styles.detailSeparator}>|</Text>
            <Feather name="alert-circle" size={14} color="#666" />
            <Text style={styles.detailText}>{item.severity}</Text>
          </View>
        </View>
        <Feather
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          size={24}
          color="#666"
        />
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.expandedContent}>
          <Text style={styles.descriptionText} numberOfLines={3}>{item.description}</Text>
          {/* O botão agora chama a função de navegação */}
          <TouchableOpacity style={styles.detailsButton} onPress={handleDetailsPress}>
            <Text style={styles.detailsButtonText}>Ver mais detalhes</Text>
            <Feather name="arrow-right" size={18} color="white" style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};


export default function Home() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Ocorrências Recentes</Text>
          <TouchableOpacity>
            <Feather name="settings" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={DUMMY_OCCURRENCES}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <OccurrenceItem item={item} />}
          contentContainerStyle={styles.flatListContent}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f4f6f8',
  },
  container: {
    flex: 1,
    backgroundColor: '#f4f6f8',
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  flatListContent: {
    paddingHorizontal: 15,
    paddingBottom: 100, // Espaço para o menu inferior
  },
  occurrenceCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginVertical: 8,
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
  expandedContent: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  descriptionText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 15,
    lineHeight: 20,
  },
  detailsButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
    width: "100%"
  },
  detailsButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
