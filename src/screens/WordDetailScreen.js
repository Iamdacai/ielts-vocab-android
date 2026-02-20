import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert
} from 'react-native';
import { useRoute } from '@react-navigation/native';

const WordDetailScreen = () => {
  const route = useRoute();
  const { word } = route.params;

  const handlePronunciation = () => {
    // TODO: Play pronunciation audio
    Alert.alert('发音功能', '播放单词发音');
  };

  const handlePractice = () => {
    // TODO: Start pronunciation practice
    Alert.alert('发音练习', '开始发音练习');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.wordText}>{word.word}</Text>
        <Text style={styles.phoneticText}>{word.phonetic}</Text>
        <Text style={styles.partOfSpeechText}>{word.part_of_speech || 'n.'}</Text>
        
        <View style={styles.definitionContainer}>
          <Text style={styles.definitionTitle}>释义:</Text>
          <Text style={styles.definitionText}>{word.definition}</Text>
        </View>

        {word.example_sentences && (
          <View style={styles.examplesContainer}>
            <Text style={styles.examplesTitle}>例句:</Text>
            {Array.isArray(word.example_sentences) ? (
              word.example_sentences.map((example, index) => (
                <Text key={index} style={styles.exampleText}>{example}</Text>
              ))
            ) : (
              <Text style={styles.exampleText}>{word.example_sentences}</Text>
            )}
          </View>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.pronunciationButton} onPress={handlePronunciation}>
            <Text style={styles.buttonText}>🔊 发音</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.practiceButton} onPress={handlePractice}>
            <Text style={styles.buttonText}>🎤 练习</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  wordText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  phoneticText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 12,
  },
  partOfSpeechText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginBottom: 20,
  },
  definitionContainer: {
    marginBottom: 20,
  },
  definitionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  definitionText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  examplesContainer: {
    marginBottom: 30,
  },
  examplesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  exampleText: {
    fontSize: 15,
    color: '#777',
    lineHeight: 22,
    fontStyle: 'italic',
    marginBottom: 6,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  pronunciationButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  practiceButton: {
    backgroundColor: '#34C759',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default WordDetailScreen;