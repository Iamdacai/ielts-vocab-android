/**
 * 雅思智能背单词 - Android版本
 * React Native跨平台应用
 */

import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import Sound from 'react-native-sound';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';

// 音频播放工具
const playWordPronunciation = async (word) => {
  try {
    // 检查音频权限（Android需要）
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: '麦克风权限',
          message: '需要麦克风权限来播放和录制发音',
          buttonNeutral: '稍后询问',
          buttonNegative: '取消',
          buttonPositive: '确定',
        }
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert('权限被拒绝', '请在设置中开启麦克风权限');
        return;
      }
    }

    // 创建音频播放器
    const audioUrl = `https://your-backend-server.com/api/audio/${encodeURIComponent(word)}.mp3`;
    
    // 使用Sound库播放音频
    const sound = new Sound(audioUrl, null, (error) => {
      if (error) {
        console.log('播放失败:', error);
        Alert.alert('播放失败', '无法加载发音音频');
        return;
      }
      sound.play((success) => {
        if (success) {
          console.log('播放完成');
        } else {
          console.log('播放失败');
        }
        sound.release();
      });
    });
  } catch (error) {
    console.error('播放错误:', error);
    Alert.alert('播放错误', '发音播放失败');
  }
};

// 录音工具
const startPronunciationPractice = async (word, onRecordingComplete) => {
  try {
    // 请求录音权限
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: '录音权限',
          message: '需要录音权限来进行发音练习',
          buttonNeutral: '稍后询问',
          buttonNegative: '取消',
          buttonPositive: '确定',
        }
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert('权限被拒绝', '请在设置中开启录音权限');
        return;
      }
    }

    const audioRecorderPlayer = new AudioRecorderPlayer();
    
    // 设置录音配置
    const uri = await audioRecorderPlayer.startRecorder();
    
    // 5秒后自动停止
    setTimeout(async () => {
      const result = await audioRecorderPlayer.stopRecorder();
      onRecordingComplete(result, word);
    }, 5000);

    return () => {
      audioRecorderPlayer.stopRecorder();
    };
  } catch (error) {
    console.error('录音错误:', error);
    Alert.alert('录音错误', '无法开始录音');
  }
};

// 单词学习组件
const WordLearningScreen = ({ route }) => {
  const { currentWord, totalWords, currentWordIndex } = route.params || {};
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [pronunciationScore, setPronunciationScore] = useState(null);
  const [feedback, setFeedback] = useState('');

  const handlePlayPronunciation = () => {
    if (!currentWord) return;
    setIsPlaying(true);
    playWordPronunciation(currentWord.word)
      .finally(() => setIsPlaying(false));
  };

  const handleStartPronunciationPractice = () => {
    if (!currentWord || isRecording) return;
    setIsRecording(true);
    startPronunciationPractice(currentWord.word, (audioPath, word) => {
      // 这里调用后端API进行发音分析
      analyzePronunciation(audioPath, word);
    });
  };

  const analyzePronunciation = async (audioPath, word) => {
    try {
      // 模拟API调用
      const mockScore = Math.floor(Math.random() * 40) + 60;
      const feedbackText = 
        mockScore >= 90 ? '发音非常标准！继续保持！' :
        mockScore >= 80 ? '发音很好，注意个别音节的重音位置。' :
        mockScore >= 70 ? '发音基本正确，但某些音素需要改进。' :
        '发音需要更多练习，建议多听标准发音并跟读。';
      
      setPronunciationScore(mockScore);
      setFeedback(feedbackText);
      setIsRecording(false);
    } catch (error) {
      console.error('分析失败:', error);
      Alert.alert('分析失败', '发音分析服务不可用');
      setIsRecording(false);
    }
  };

  if (!currentWord) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>加载中...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* 进度条 */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            {currentWordIndex + 1}/{totalWords}
          </Text>
        </View>

        {/* 单词显示区域 */}
        <View style={styles.wordSection}>
          <View style={styles.englishSection}>
            <Text style={styles.englishWord}>{currentWord.word}</Text>
            <TouchableOpacity 
              style={styles.pronunciationButton}
              onPress={handlePlayPronunciation}
              disabled={isPlaying}
            >
              <Text style={styles.buttonText}>
                {isPlaying ? '播放中...' : '🔊'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* 中文释义 */}
          <View style={styles.chineseSection}>
            <Text style={styles.chineseMeaning}>{currentWord.meaning}</Text>
            {currentWord.phonetic && (
              <Text style={styles.phonetic}>{currentWord.phonetic}</Text>
            )}
          </View>

          {/* 发音练习区域 */}
          <View style={styles.pronunciationPracticeSection}>
            <Text style={styles.practiceTitle}>发音练习</Text>
            
            <TouchableOpacity 
              style={[
                styles.recordButton,
                isRecording && styles.recordingButton
              ]}
              onPress={handleStartPronunciationPractice}
              disabled={isRecording}
            >
              <Text style={styles.recordButtonText}>
                {isRecording ? '录音中...' : '🎤 跟读练习'}
              </Text>
            </TouchableOpacity>
            
            {pronunciationScore !== null && (
              <View style={styles.scoreSection}>
                <Text style={styles.scoreText}>
                  发音得分: {pronunciationScore}/100
                </Text>
                <Text style={styles.feedbackText}>{feedback}</Text>
              </View>
            )}
          </View>
        </View>

        {/* 操作按钮 */}
        <View style={styles.actionSection}>
          <TouchableOpacity style={styles.masteryButton}>
            <Text style={styles.masteryButtonText}>认识 ✓</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.masteryButton}>
            <Text style={styles.masteryButtonText}>不确定 ?</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.masteryButton}>
            <Text style={styles.masteryButtonText}>不认识 ✗</Text>
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
  scrollView: {
    flex: 1,
  },
  progressContainer: {
    padding: 20,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  wordSection: {
    padding: 20,
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 12,
  },
  englishSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  englishWord: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  pronunciationButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  chineseSection: {
    marginBottom: 20,
  },
  chineseMeaning: {
    fontSize: 18,
    color: '#666',
    lineHeight: 24,
  },
  phonetic: {
    fontSize: 16,
    color: '#888',
    fontStyle: 'italic',
    marginTop: 5,
  },
  pronunciationPracticeSection: {
    alignItems: 'center',
  },
  practiceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  recordButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    minWidth: 200,
    alignItems: 'center',
  },
  recordingButton: {
    backgroundColor: '#FF4757',
  },
  recordButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scoreSection: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#e8f5e8',
    borderRadius: 10,
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E8B57',
    marginBottom: 5,
  },
  feedbackText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  actionSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 12,
  },
  masteryButton: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: '#4ECDC4',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  masteryButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default WordLearningScreen;