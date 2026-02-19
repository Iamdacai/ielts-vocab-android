/**
 * 发音评分工具函数
 * 与后端发音分析 API 集成
 */

import axios from 'axios';
import { Platform } from 'react-native';

// 后端API基础URL
const API_BASE_URL = 'https://ielts.caiyuyang.cn/api';

// 创建axios实例
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30秒超时
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

// 获取存储的token
const getStoredToken = async () => {
  try {
    // 在React Native中，可以使用AsyncStorage
    const AsyncStorage = require('@react-native-async-storage/async-storage');
    const token = await AsyncStorage.getItem('authToken');
    return token;
  } catch (error) {
    console.error('获取token失败:', error);
    return null;
  }
};

/**
 * 分析用户发音并获取评分
 * @param {string} audioFilePath - 录音文件路径
 * @param {string} targetWord - 目标单词
 * @returns {Promise<Object>} - 包含评分和反馈的对象
 */
export const analyzePronunciation = async (audioFilePath, targetWord) => {
  try {
    // 获取认证token
    const token = await getStoredToken();
    if (!token) {
      throw new Error('未登录，请先登录');
    }

    // 创建表单数据
    const formData = new FormData();
    formData.append('word', targetWord);
    
    // 添加音频文件
    const fileUri = Platform.OS === 'ios' 
      ? audioFilePath.replace('file://', '') 
      : audioFilePath;
    
    formData.append('audio', {
      uri: fileUri,
      type: 'audio/mpeg', // 或根据实际格式调整
      name: 'recording.mp3',
    });

    // 调用后端API
    const response = await apiClient.post('/pronunciation/analyze', formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        ...formData.getHeaders?.(), // 如果存在的话
      },
    });

    if (response.status === 200) {
      return {
        score: response.data.score,
        feedback: response.data.feedback,
        word: response.data.word,
        timestamp: response.data.timestamp,
      };
    } else {
      throw new Error(`API返回错误: ${response.status}`);
    }
  } catch (error) {
    console.error('发音分析失败:', error);
    
    // 处理不同类型的错误
    if (error.response) {
      // 服务器返回了错误状态码
      if (error.response.status === 401) {
        throw new Error('登录已过期，请重新登录');
      } else if (error.response.status === 400) {
        throw new Error('请求参数错误');
      } else {
        throw new Error(`服务器错误: ${error.response.status}`);
      }
    } else if (error.request) {
      // 网络请求失败
      throw new Error('网络连接失败，请检查网络');
    } else {
      // 其他错误
      throw new Error('发音分析失败');
    }
  }
};

/**
 * 获取单词发音音频
 * @param {string} word - 单词
 * @returns {Promise<string>} - 音频URL
 */
export const getWordPronunciationAudio = async (word) => {
  try {
    const token = await getStoredToken();
    if (!token) {
      throw new Error('未登录，请先登录');
    }

    const response = await apiClient.get(`/pronunciation/word-audio/${encodeURIComponent(word)}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      return response.data.audioUrl;
    } else {
      throw new Error(`获取发音失败: ${response.status}`);
    }
  } catch (error) {
    console.error('获取单词发音失败:', error);
    throw error;
  }
};

/**
 * 获取发音练习历史
 * @returns {Promise<Array>} - 发音练习历史记录
 */
export const getPronunciationHistory = async () => {
  try {
    const token = await getStoredToken();
    if (!token) {
      throw new Error('未登录，请先登录');
    }

    const response = await apiClient.get('/pronunciation/history', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      return response.data.history;
    } else {
      throw new Error(`获取历史记录失败: ${response.status}`);
    }
  } catch (error) {
    console.error('获取发音历史失败:', error);
    throw error;
  }
};

/**
 * 获取发音统计信息
 * @returns {Promise<Object>} - 发音统计信息
 */
export const getPronunciationStats = async () => {
  try {
    const token = await getStoredToken();
    if (!token) {
      throw new Error('未登录，请先登录');
    }

    const response = await apiClient.get('/pronunciation/stats', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(`获取统计信息失败: ${response.status}`);
    }
  } catch (error) {
    console.error('获取发音统计失败:', error);
    throw error;
  }
};

export default {
  analyzePronunciation,
  getWordPronunciationAudio,
  getPronunciationHistory,
  getPronunciationStats,
};