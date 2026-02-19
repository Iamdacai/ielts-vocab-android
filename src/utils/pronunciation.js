/**
 * 发音相关工具函数
 * 使用后端 API 进行发音播放和评分
 */

import axios from 'axios';
import { Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Audio from 'expo-av';

// 获取后端 API 基础 URL
const API_BASE_URL = 'https://ielts.caiyuyang.cn/api';

// 播放单词发音
export const playWordPronunciation = async (word) => {
  try {
    // 调用后端 TTS 服务获取音频
    const response = await axios.get(
      `${API_BASE_URL}/pronunciation/word-audio/${encodeURIComponent(word)}`,
      {
        responseType: 'arraybuffer',
        headers: {
          'Authorization': `Bearer ${getStoredToken()}`
        }
      }
    );

    if (response.status === 200) {
      // 将音频数据保存为临时文件
      const audioData = response.data;
      const tempFilePath = `${FileSystem.documentDirectory}${word}.mp3`;
      
      await FileSystem.writeAsStringAsync(tempFilePath, Buffer.from(audioData).toString('base64'), {
        encoding: FileSystem.EncodingType.Base64,
      });

      // 使用 Expo Audio 播放
      const soundObject = new Audio.Sound();
      try {
        await soundObject.loadAsync({ uri: tempFilePath });
        await soundObject.playAsync();
        
        // 等待播放完成
        await new Promise((resolve) => {
          const subscription = soundObject.setOnPlaybackStatusUpdate((status) => {
            if (status.didJustFinish) {
              subscription.remove();
              resolve();
            }
          });
        });
      } finally {
        await soundObject.unloadAsync();
      }
    } else {
      throw new Error('TTS 服务返回错误');
    }
  } catch (error) {
    console.error('播放发音失败:', error);
    throw error;
  }
};

// 分析发音并获取评分
export const analyzePronunciation = async (word) => {
  try {
    // 由于移动端录音实现复杂，这里模拟调用后端分析
    // 实际项目中需要实现录音功能
    const mockScore = Math.floor(Math.random() * 40) + 60; // 60-100分
    
    let feedback = '';
    if (mockScore >= 90) {
      feedback = '发音非常标准！继续保持！';
    } else if (mockScore >= 80) {
      feedback = '发音很好，注意个别音节的重音位置。';
    } else if (mockScore >= 70) {
      feedback = '发音基本正确，但某些音素需要改进。';
    } else {
      feedback = '发音需要更多练习，建议多听标准发音并跟读。';
    }

    return {
      score: mockScore,
      feedback: feedback
    };
  } catch (error) {
    console.error('发音分析失败:', error);
    throw error;
  }
};

// 获取存储的 token
const getStoredToken = () => {
  // 在实际项目中，这里应该从 AsyncStorage 或其他存储中获取 token
  // 为了简化，这里返回一个占位符
  return 'your-auth-token';
};