import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
  PermissionsAndroid,
  Platform
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import VocabularyService from '../services/vocabulary';
import PronunciationService from '../services/pronunciation';
import PronunciationAssessmentService from '../services/pronunciationAssessment';
import AudioPlayer from '../components/AudioPlayer';

const WordDetailScreen = () => {
  const route = useRoute();
  const { wordId } = route.params;
  const [word, setWord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [pronunciationScore, setPronunciationScore] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    const loadWord = async () => {
      try {
        const wordData = await VocabularyService.getWordById(wordId);
        setWord(wordData);
      } catch (error) {
        console.error('Failed to load word:', error);
        Alert.alert('错误', '加载单词失败');
      } finally {
        setLoading(false);
      }
    };

    loadWord();
  }, [wordId]);

  const handlePronunciation = async () => {
    if (!word) return;
    
    try {
      setIsPlaying(true);
      await PronunciationService.playWordPronunciation(word.word);
    } catch (error) {
      console.error('Pronunciation error:', error);
      Alert.alert('发音错误', '无法播放发音，请检查网络连接');
    } finally {
      setIsPlaying(false);
    }
  };

  const handlePractice = async () => {
    if (!word) return;
    
    // Request microphone permission on Android
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: '麦克风权限',
            message: '需要麦克风权限来进行发音练习',
            buttonNeutral: '稍后询问',
            buttonNegative: '取消',
            buttonPositive: '确定',
          }
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert('权限被拒绝', '需要麦克风权限才能进行发音练习');
          return;
        }
      } catch (err) {
        console.warn(err);
        return;
      }
    }

    try {
      setIsRecording(true);
      Alert.alert('开始练习', `请朗读单词: ${word.word}`, [
        { text: '开始录音', onPress: startRecording },
        { text: '取消', style: 'cancel' }
      ]);
    } catch (error) {
      console.error('Practice error:', error);
      Alert.alert('练习错误', '无法开始发音练习');
    } finally {
      setIsRecording(false);
    }
  };

  const startRecording = async () => {
    try {
      const score = await PronunciationAssessmentService.analyzePronunciation(word.word);
      setPronunciationScore(score);
      Alert.alert('发音评分', `您的发音得分为: ${score.score}分\n${score.feedback}`);
    } catch (error) {
      console.error('Recording error:', error);
      Alert.alert('录音错误', '录音过程中出现错误');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </SafeAreaView>
    );
  }

  if (!word) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>单词未找到</Text>
      </SafeAreaView>
    );
  }

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

        {pronunciationScore && (
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreTitle}>最近发音评分:</Text>
            <Text style={styles.scoreText}>{pronunciationScore.score}分</Text>
            <Text style={styles.feedbackText}>{pronunciationScore.feedback}</Text>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.pronunciationButton, isPlaying && styles.buttonDisabled]} 
            onPress={handlePronunciation}
            disabled={isPlaying}
          >
            {isPlaying ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>🔊 发音</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.practiceButton, isRecording && styles.buttonDisabled]} 
            onPress={handlePractice}
            disabled={isRecording}
          >
            {isRecording ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>🎤 练习</Text>
            )}
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
  errorText: {
    fontSize: 18,
    color: '#ff0000',
    textAlign: 'center',
    marginTop: 50,
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
  scoreContainer: {
    backgroundColor: '#e8f5e8',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  scoreTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 4,
  },
  scoreText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 8,
  },
  feedbackText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
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
  buttonDisabled: {
    opacity: 0.6,
  },
});

export default WordDetailScreen;