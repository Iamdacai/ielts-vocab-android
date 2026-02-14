import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  ProgressBarAndroid,
  Platform
} from 'react-native';
import Sound from 'react-native-sound';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import axios from 'axios';

const WordLearningScreen = ({ route, navigation }) => {
  const [currentWord, setCurrentWord] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [pronunciationScore, setPronunciationScore] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [totalWords, setTotalWords] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  // 音频录制播放器实例
  const audioRecorderPlayer = new AudioRecorderPlayer();

  // 模拟单词数据（实际项目中从API获取）
  const sampleWords = [
    {
      id: 1,
      word: "abandon",
      phonetic: "/əˈbændən/",
      meaning: "放弃，抛弃",
      example: "The baby was abandoned by its mother."
    },
    {
      id: 2,
      word: "benefit",
      phonetic: "/ˈbenɪfɪt/",
      meaning: "利益，好处；受益",
      example: "Regular exercise has many health benefits."
    }
  ];

  useEffect(() => {
    // 模拟加载单词数据
    setTimeout(() => {
      setCurrentWord(sampleWords[0]);
      setTotalWords(sampleWords.length);
      setLoading(false);
      setProgress(50);
    }, 1000);
  }, []);

  // 播放单词发音
  const playWordPronunciation = async () => {
    if (!currentWord) return;
    
    setIsPlaying(true);
    
    try {
      // 这里应该调用TTS服务或播放预存音频
      // 由于是演示，我们使用系统提示音
      const sound = new Sound('beep.mp3', Sound.MAIN_BUNDLE, (error) => {
        if (error) {
          console.log('Failed to load the sound', error);
          Alert.alert('发音播放失败');
        } else {
          sound.play((success) => {
            if (success) {
              console.log('Successfully finished playing');
            } else {
              console.log('Playback failed due to audio decoding errors');
            }
            setIsPlaying(false);
          });
        }
      });
    } catch (error) {
      console.error('播放错误:', error);
      Alert.alert('发音播放失败');
      setIsPlaying(false);
    }
  };

  // 开始跟读录音
  const startPronunciationPractice = async () => {
    if (isRecording) return;
    
    setIsRecording(true);
    setPronunciationScore(null);
    setFeedback('');
    
    try {
      // 开始录音
      const uri = await audioRecorderPlayer.startRecorder();
      console.log('录音开始:', uri);
      
      // 5秒后自动停止
      setTimeout(async () => {
        await stopRecordingAndAnalyze();
      }, 5000);
      
    } catch (error) {
      console.error('录音启动失败:', error);
      Alert.alert('录音启动失败');
      setIsRecording(false);
    }
  };

  // 停止录音并分析
  const stopRecordingAndAnalyze = async () => {
    try {
      const result = await audioRecorderPlayer.stopRecorder();
      console.log('录音停止:', result);
      
      // 模拟发音评分（实际项目中调用API）
      const score = Math.floor(Math.random() * 40) + 60; // 60-100分
      let feedbackText = '';
      
      if (score >= 90) {
        feedbackText = '发音非常标准！继续保持！';
      } else if (score >= 80) {
        feedbackText = '发音很好，注意个别音节的重音位置。';
      } else if (score >= 70) {
        feedbackText = '发音基本正确，但某些音素需要改进。';
      } else {
        feedbackText = '发音需要更多练习，建议多听标准发音并跟读。';
      }
      
      setPronunciationScore(score);
      setFeedback(feedbackText);
      
      Alert.alert(`发音得分: ${score}/100`);
      
    } catch (error) {
      console.error('录音处理失败:', error);
      Alert.alert('录音处理失败');
    } finally {
      setIsRecording(false);
    }
  };

  // 切换答案显示
  const toggleAnswer = () => {
    setShowAnswer(!showAnswer);
  };

  // 处理掌握程度选择
  const handleMasterySelection = (masteryLevel) => {
    let masteryScore = 0;
    switch(masteryLevel) {
      case 'know':
        masteryScore = 75;
        break;
      case 'hard':
        masteryScore = 50;
        break;
      case 'forgot':
        masteryScore = 25;
        break;
    }
    
    // 这里应该调用API记录进度
    console.log('记录掌握度:', masteryLevel, masteryScore);
    
    // 移动到下一个单词
    if (currentWordIndex < totalWords - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
      setCurrentWord(sampleWords[currentWordIndex + 1]);
      setShowAnswer(false);
      setPronunciationScore(null);
      setFeedback('');
    } else {
      Alert.alert('今日学习完成！');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4a6cf7" />
        <Text style={styles.loadingText}>加载中...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* 进度条 */}
      <View style={styles.progressSection}>
        {Platform.OS === 'android' ? (
          <ProgressBarAndroid 
            styleAttr="Horizontal" 
            indeterminate={false} 
            progress={progress / 100}
            color="#4a6cf7"
            style={styles.progressBar}
          />
        ) : null}
        <Text style={styles.progressText}>{currentWordIndex + 1}/{totalWords}</Text>
      </View>

      {/* 单词显示区域 */}
      <View style={styles.wordSection}>
        {/* 英文单词 */}
        <View style={styles.englishSection}>
          <Text style={styles.englishWord}>
            {currentWord?.word || '---'}
          </Text>
          <TouchableOpacity 
            style={styles.pronunciationBtn}
            onPress={playWordPronunciation}
            disabled={isPlaying}
          >
            <Text style={styles.btnText}>
              {isPlaying ? '播放中...' : '🔊'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* 中文释义 */}
        {showAnswer && currentWord && (
          <View style={styles.chineseSection}>
            <Text style={styles.chineseMeaning}>
              {currentWord.meaning || '---'}
            </Text>
            {currentWord.phonetic && (
              <View style={styles.phoneticSection}>
                <Text style={styles.phonetic}>
                  {currentWord.phonetic}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* 跟读练习区域 */}
        <View style={styles.pronunciationPracticeSection}>
          <Text style={styles.practiceTitle}>发音练习</Text>
          
          <TouchableOpacity 
            style={[
              styles.recordBtn, 
              isRecording && styles.recordingBtn
            ]}
            onPress={startPronunciationPractice}
            disabled={isRecording || !currentWord}
          >
            <Text style={styles.recordBtnText}>
              {isRecording ? '录音中...' : '🎤 跟读练习'}
            </Text>
          </TouchableOpacity>
          
          {/* 评分结果显示 */}
          {pronunciationScore !== null && (
            <View style={styles.scoreSection}>
              <Text style={styles.scoreText}>
                发音得分: {pronunciationScore}/100
              </Text>
              <Text style={styles.feedbackText}>
                {feedback}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* 答案切换按钮 */}
      <TouchableOpacity 
        style={styles.toggleBtn}
        onPress={toggleAnswer}
      >
        <Text style={styles.toggleBtnText}>
          {showAnswer ? '隐藏答案' : '显示答案'}
        </Text>
      </TouchableOpacity>

      {/* 掌握程度选择 */}
      <View style={styles.masterySection}>
        <TouchableOpacity 
          style={[styles.masteryBtn, styles.knowBtn]}
          onPress={() => handleMasterySelection('know')}
        >
          <Text style={styles.masteryBtnText}>认识 ✓</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.masteryBtn, styles.hardBtn]}
          onPress={() => handleMasterySelection('hard')}
        >
          <Text style={styles.masteryBtnText}>不确定 ?</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.masteryBtn, styles.forgotBtn]}
          onPress={() => handleMasterySelection('forgot')}
        >
          <Text style={styles.masteryBtnText}>不认识 ✗</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  progressSection: {
    marginBottom: 20,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
  },
  progressText: {
    textAlign: 'right',
    marginTop: 4,
    fontSize: 14,
    color: '#666',
  },
  wordSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    flex: 1,
  },
  pronunciationBtn: {
    backgroundColor: '#4a6cf7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginLeft: 10,
  },
  btnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  chineseSection: {
    marginBottom: 15,
  },
  chineseMeaning: {
    fontSize: 18,
    color: '#666',
    lineHeight: 24,
  },
  phoneticSection: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#e8f5e8',
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  phonetic: {
    fontSize: 16,
    color: '#2E8B57',
    fontWeight: '500',
  },
  pronunciationPracticeSection: {
    alignItems: 'center',
  },
  practiceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  recordBtn: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 120,
  },
  recordingBtn: {
    backgroundColor: '#FF4757',
  },
  recordBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scoreSection: {
    marginTop: 15,
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
    paddingHorizontal: 20,
  },
  toggleBtn: {
    backgroundColor: '#6c757d',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    alignSelf: 'center',
    marginBottom: 20,
  },
  toggleBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  masterySection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  masteryBtn: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 80,
    alignItems: 'center',
  },
  knowBtn: {
    backgroundColor: '#28a745',
  },
  hardBtn: {
    backgroundColor: '#ffc107',
  },
  forgotBtn: {
    backgroundColor: '#dc3545',
  },
  masteryBtnText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default WordLearningScreen;