import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Animated,
  Easing,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { encode } from 'base-64';

// Componente individual para cada item da ocorrência
const OccurrenceItem = ({ item }: { item: any }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();

  const handleDetailsPress = () => {
    router.push({
      pathname: '/tabs/actions/detalhesOcorrencia',
      params: { id: item.id }
    });
  };

  const formatApiDateTime = (datetime: string) => {
    if (!datetime) return 'Data indisponível';
    try {
      const parts = datetime.split(' ');
      const datePart = parts[0];
      const timePart = parts[1].substring(0, 5);
      return `${datePart} às ${timePart}`;
    } catch (e) {
      return 'Data inválida';
    }
  };

  const formattedDate = formatApiDateTime(item.datetime);

  return (
    <View style={styles.occurrenceCard}>
      <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)} style={styles.cardHeader}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.occurrenceTitle} numberOfLines={1}>
            {item.description || 'Ocorrência sem descrição'}
          </Text>
          <View style={styles.detailsRow}>
            <Feather name="clock" size={14} color="#666" />
            <Text style={styles.detailText}>{formattedDate}</Text>
            {item.situation?.situation_title && (
              <>
                <Text style={styles.detailSeparator}>|</Text>
                <Feather name="alert-circle" size={14} color="#666" />
                <Text style={styles.detailText}>{item.situation.situation_title}</Text>
              </>
            )}
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
          <Text style={styles.descriptionText}>{item.description}</Text>
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
  const { user, token } = useAuth();
  const [occurrences, setOccurrences] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const spinValue = useRef(new Animated.Value(0)).current;
  
  const spinAnimation = Animated.loop(
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 1000,
      easing: Easing.linear,
      useNativeDriver: true,
    })
  );

  useEffect(() => {
    if (isLoading) {
      spinAnimation.start();
    } else {
      spinAnimation.stop();
      spinValue.setValue(0);
    }
    return () => spinAnimation.stop();
  }, [isLoading]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const fetchOccurrences = async () => {
    if (!user || !token) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const filters = [
        { "field": "id_user", "operator": "=", "value": user.id },
        { "field": "status", "operator": "=", "value": true }
      ];
      const order = [
        { "field": "datetime", "ordination": "desc" }
      ];

      const encodedFilters = encode(JSON.stringify(filters));
      const encodedOrder = encode(JSON.stringify(order));
      
      const API_URL = `https://www.resolvevereador.com.br/api/occurrences/fetchbyfilter/${encodedFilters}/${encodedOrder}`;

      const response = await fetch(API_URL, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Não foi possível carregar as ocorrências.');
      }

      const data = await response.json();
      setOccurrences(data);

    } catch (err: any) {
      setError(err.message);
      console.error("Erro ao buscar ocorrências:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchOccurrences();
    }, [user, token])
  );

  const renderContent = () => {
    if (isLoading && occurrences.length === 0) {
      return <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 50 }} />;
    }
    if (error) {
      return <Text style={styles.infoText}>Erro ao carregar ocorrências: {error}</Text>;
    }
    if (!isLoading && occurrences.length === 0) {
      return <Text style={styles.infoText}>Nenhuma ocorrência encontrada.</Text>;
    }
    return (
      <FlatList
        data={occurrences}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <OccurrenceItem item={item} />}
        contentContainerStyle={styles.flatListContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={fetchOccurrences} />
        }
      />
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Ocorrências</Text>
          <TouchableOpacity onPress={fetchOccurrences} disabled={isLoading}>
            <Animated.View style={{ transform: [{ rotate: spin }] }}>
              <Feather name="refresh-cw" size={24} color="#333" />
            </Animated.View>
          </TouchableOpacity>
        </View>
        {renderContent()}
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
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#f4f4f4ff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 22,
    // fontWeight: 'bold', // Removido
    fontFamily: 'fontudo', // <-- ADICIONADO
    color: '#333',
  },
  flatListContent: {
    paddingHorizontal: 15,
    paddingBottom: 100,
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
  headerTextContainer: {
    flex: 1,
  },
  occurrenceTitle: {
    fontSize: 17,
    // fontWeight: '700', // Removido
    fontFamily: 'fontudo', // <-- ADICIONADO
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
    fontFamily: 'fontuda', // <-- ADICIONADO
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
    fontFamily: 'fontuda', // <-- ADICIONADO
  },
  detailsButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  detailsButtonText: {
    color: 'white',
    fontSize: 14,
    // fontWeight: 'bold', // Removido
    fontFamily: 'fontudo', // <-- ADICIONADO
  },
  infoText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666',
    fontFamily: 'fontuda', // <-- ADICIONADO
  }
});