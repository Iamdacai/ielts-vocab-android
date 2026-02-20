import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const VocabularyScreen = () => {
  const navigation = useNavigation();
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Load vocabulary data from local database
    // For now, show placeholder
    setTimeout(() => {
      setWords([
        { id: 1, word: 'abandon', phonetic: '/əˈbændən/', definition: '放弃，抛弃' },
        { id: 2, word: 'benefit', phonetic: '/ˈbenɪfɪt/', definition: '利益，好处' },
        { id: 3, word: 'crucial', phonetic: '/ˈkruːʃl/', definition: '至关重要的' }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const renderWordItem = ({ item }) => (
    <TouchableOpacity
      style={styles.wordItem}
      onPress={() => navigation.navigate('WordDetail', { word: item })}
    >
      <Text style={styles.wordText}>{item.word}</Text>
      <Text style={styles.phoneticText}>{item.phonetic}</Text>
      <Text style={styles.definitionText}>{item.definition}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={words}
        renderItem={renderWordItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    padding: 16,
  },
  wordItem: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  wordText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  phoneticText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  definitionText: {
    fontSize: 14,
    color: '#888',
  },
});

export default VocabularyScreen;