/**
 * 发音功能工具
 * 处理单词发音播放和用户录音分析
 */

import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../api';

// 存储 token
let authToken = null;

/**
 * 设置认证 token
 */
export const setPronunciationToken = (token) => {
  authToken = token;
};

/**
 * 获取单词发音音频 URL
 */
export const getWordAudioUrl = async (word) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}${API_ENDPOINTS.WORD_AUDIO(word)}`,
      {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      }
    );
    
    // 如果后端返回音频 URL，直接使用
    if (response.data.audioUrl) {
      return response.data.audioUrl.startsWith('http') 
        ? response.data.audioUrl 
        : `${API_BASE_URL}${response.data.audioUrl}`;
    }
    
    // 如果后端直接返回音频数据，需要特殊处理
    return null;
  } catch (error) {
    console.error('获取单词发音失败:', error);
    throw error;
  }
};

/**
 * 分析用户发音并获取评分
 * @param {string} audioPath - 录音文件路径
 * @param {string} word - 目标单词
 */
export const analyzePronunciation = async (audioPath, word) => {
  try {
    const formData = new FormData();
    formData.append('audio', {
      uri: audioPath,
      type: 'audio/mpeg',
      name: 'recording.mp3'
    });
    formData.append('word', word);

    const response = await axios.post(
      `${API_BASE_URL}${API_ENDPOINTS.ANALYZE_PRONUNCIATION}`,
      formData,
      {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('发音分析失败:', error);
    throw error;
  }
};

/**
 * 获取发音练习历史
 */
export const getPronunciationHistory = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}${API_ENDPOINTS.PRONUNCIATION_HISTORY}`,
      {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('获取发音历史失败:', error);
    throw error;
  }
};

/**
 * 获取发音统计信息
 */
export const getPronunciationStats = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}${API_ENDPOINTS.PRONUNCIATION_STATS}`,
      {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('获取发音统计失败:', error);
    throw error;
  }
};