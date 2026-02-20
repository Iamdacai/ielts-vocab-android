import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  PermissionsAndroid,
  Platform
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import PronunciationService from '../services/pronunciation';
import PronunciationAssessmentService from '../services/pronunciationAssessment';

const PronunciationPracticeScreen = () => {
  const route = useRoute();
  const { word } = route.params;
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  const requestAudioPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: '麦克风权限',
            message: '需要麦克风权限来录制您的发音',
            buttonNeutral: '稍后询问',
            buttonNegative: '取消',
            buttonPositive: '确定',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const startRecording = async () => {
    const hasPermission = await requestAudioPermission();
    if (!hasPermission) {
      Alert.alert('权限错误', '需要麦克风权限才能录制发音');
      return;
    }

    setIsRecording(true);
    setScore(null);
    setFeedback('');

    try {
      // Start recording
      await PronunciationAssessmentService.startRecording(word.word);
    } catch (error) {
      console.error('Start recording error:', error);
      Alert.alert('录音错误', '无法开始录音');
      setIsRecording(false);
    }
  };

  const stopRecording = async () => {
    setIsRecording(false);
    setLoading(true);

    try {
      // Stop recording and analyze
      const result = await PronunciationAssessmentService.stopRecordingAndAnalyze();
      
      if (result) {
        setScore(result.score);
        setFeedback(result.feedback);
      } else {
        Alert.alert('分析失败', '无法分析您的发音');
      }
    } catch (error) {
      console.error('Stop recording error:', error);
      Alert.alert('分析错误', '发音分析失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const playReferenceAudio = async () => {
    try {
      setIsPlaying(true);
      await PronunciationService.playWordAudio(word.word);
    } catch (error) {
      console.error('Play audio error:', error);
      Alert.alert('播放错误', '无法播放参考发音');
    } finally {
      setIsPlaying(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.wordText}>{word.word}</Text>
        <Text style={styles.phoneticText}>{word.phonetic}</Text>
      </View>

      <View style={styles.content}>
        <TouchableOpacity 
          style={[styles.audioButton, isPlaying && styles.audioButtonActive]}
          onPress={playReferenceAudio}
          disabled={isPlaying}
        >
          <Text style={styles.audioButtonText}>
            {isPlaying ? '🔊 播放中...' : '🔊 听标准发音'}
          </Text>
        </TouchableOpacity>

        <View style={styles.recordingSection}>
          {!isRecording ? (
            <TouchableOpacity 
              style={styles.recordButton}
              onPress={startRecording}
              disabled={loading}
            >
              <Text style={styles.recordButtonText}>🎤 开始录音</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={[styles.recordButton, styles.stopButton]}
              onPress={stopRecording}
            >
              <Text style={styles.recordButtonText}>⏹️ 停止录音</Text>
            </TouchableOpacity>
          )}
        </View>

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>正在分析您的发音...</Text>
          </View>
        )}

        {score !== null && (
          <View style={styles.resultContainer}>
            <Text style={styles.scoreTitle}>发音评分</Text>
            <Text style={styles.scoreText}>{score} 分</Text>
            <Text style={styles.feedbackText}>{feedback}</Text>
          </View>
        )}

        <View style={styles.instructions}>
          <Text style={styles.instructionsTitle}>练习说明:</Text>
          <Text style={styles.instructionsText}>
            1. 先听标准发音{'\n'}
            2. 点击"开始录音"说出单词{'\n'}
            3. 系统会自动分析您的发音准确度
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#4a90e2',
  },
  wordText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  phoneticText: {
    fontSize: 18,
    color: 'white',
    opacity: 0.9,
  },
  content: {
    padding: 20,
  },
  audioButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 30,
  },
  audioButtonActive: {
    backgroundColor: '#0056b3',
  },
  audioButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  recordingSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  recordButton: {
    backgroundColor: '#ff3b30',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignItems: 'center',
  },
  stopButton: {
    backgroundColor: '#34c759',
  },
  recordButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  resultContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 30,
  },
  scoreTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  scoreText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#007AFF',
    textAlign: 'center',
    marginBottom: 10,
  },
  feedbackText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  instructions: {
    backgroundColor: '#e8f4fd',
    padding: 16,
    borderRadius: 12,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 8,
  },
  instructionsText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default PronunciationPracticeScreen;