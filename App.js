/**
 * 雅思智能背单词 - Android版本
 * React Native跨平台应用（基于微信小程序版本重构）
 * 第二阶段：真实API集成（简化版，移除音频功能）
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
  ActivityIndicator,
  ProgressBarAndroid,
} from 'react-native';
import { getNewWords, recordProgress } from './src/utils/wordData';

// 单词学习主组件
const App = () => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAnswer, setShowAnswer] = useState(false);
  const [progress, setProgress] = useState(0);

  // 加载新词
  useEffect(() => {
    loadNewWords();
  }, []);

  const loadNewWords = async () => {
    try {
      setLoading(true);
      const newWords = await getNewWords();
      if (newWords && newWords.length > 0) {
        setWords(newWords);
        setProgress((1 / newWords.length) * 100);
      } else {
        Alert.alert('提示', '暂无新词可学习');
      }
    } catch (error) {
      console.error('加载新词失败:', error);
      Alert.alert('错误', '加载新词失败，请检查网络连接');
    } finally {
      setLoading(false);
    }
  };

  const currentWord = words[currentWordIndex];

  const showNextWord = () => {
    if (currentWordIndex < words.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
      setShowAnswer(false);
      setProgress(((currentWordIndex + 2) / words.length) * 100);
    } else {
      Alert.alert('完成', '今日新词学习完成！');
    }
  };

  const handleKnow = async () => {
    try {
      await recordProgress(currentWord.id, 'know', 75);
      showNextWord();
    } catch (error) {
      console.error('记录进度失败:', error);
      Alert.alert('错误', '记录进度失败');
    }
  };

  const handleHard = async () => {
    try {
      await recordProgress(currentWord.id, 'hard', 50);
      showNextWord();
    } catch (error) {
      console.error('记录进度失败:', error);
      Alert.alert('错误', '记录进度失败');
    }
  };

  const handleForgot = async () => {
    try {
      await recordProgress(currentWord.id, 'forgot', 25);
      showNextWord();
    } catch (error) {
      console.error('记录进度失败:', error);
      Alert.alert('错误', '记录进度失败');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#4a6cf7" />
        <Text style={styles.loadingText}>加载中...</Text>
      </SafeAreaView>
    );
  }

  if (!currentWord) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.noWordsText}>暂无单词可学习</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
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
        <Text style={styles.progressText}>{currentWordIndex + 1}/{words.length}</Text>
      </View>

      <ScrollView style={styles.wordSection}>
        {/* 英文单词 */}
        <View style={styles.englishSection}>
          <Text style={styles.englishWord}>{currentWord.word}</Text>
        </View>

        {/* 音标 */}
        {currentWord.phonetic && (
          <Text style={styles.phonetic}>{currentWord.phonetic}</Text>
        )}

        {/* 中文释义 */}
        {showAnswer && (
          <View style={styles.chineseSection}>
            <Text style={styles.chineseMeaning}>{currentWord.definition}</Text>
            {currentWord.part_of_speech && (
              <Text style={styles.partOfSpeech}>{currentWord.part_of_speech}</Text>
            )}
            {currentWord.example_sentences && currentWord.example_sentences.length > 0 && (
              <Text style={styles.example}>{currentWord.example_sentences[0]}</Text>
            )}
          </View>
        )}

        {/* 答案切换按钮 */}
        <TouchableOpacity 
          style={styles.toggleBtn} 
          onPress={() => setShowAnswer(!showAnswer)}
        >
          <Text style={styles.toggleBtnText}>
            {showAnswer ? '隐藏答案' : '显示答案'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* 操作按钮区域 */}
      <View style={styles.actionSection}>
        <View style={styles.masterySection}>
          <TouchableOpacity style={[styles.masteryBtn, styles.knowBtn]} onPress={handleKnow}>
            <Text style={styles.masteryBtnText}>认识 ✓</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.masteryBtn, styles.hardBtn]} onPress={handleHard}>
            <Text style={styles.masteryBtnText}>不确定 ?</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.masteryBtn, styles.forgotBtn]} onPress={handleForgot}>
            <Text style={styles.masteryBtnText}>不认识 ✗</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  noWordsText: {
    marginTop: 50,
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
  progressSection: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  progressBar: {
    height: 8,
    marginBottom: 8,
  },
  progressText: {
    textAlign: 'right',
    fontSize: 14,
    color: '#666',
  },
  wordSection: {
    flex: 1,
    padding: 16,
  },
  englishSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  englishWord: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  phonetic: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 16,
  },
  chineseSection: {
    backgroundColor: '#f0f8ff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  chineseMeaning: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  partOfSpeech: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  example: {
    fontSize: 14,
    color: '#555',
    fontStyle: 'italic',
  },
  toggleBtn: {
    backgroundColor: '#e9ecef',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
  },
  toggleBtnText: {
    fontSize: 16,
    color: '#495057',
  },
  actionSection: {
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  masterySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  masteryBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
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
    fontWeight: '600',
  },
});

export default App;