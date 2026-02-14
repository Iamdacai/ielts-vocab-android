/**
 * 雅思单词数据工具
 * 从后端 API 获取单词数据
 */

import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../api';

// 存储 token
let authToken = null;

/**
 * 设置认证 token
 */
export const setAuthToken = (token) => {
  authToken = token;
};

/**
 * 获取今日新词
 */
export const getNewWords = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.NEW_WORDS}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('获取新词失败:', error);
    throw error;
  }
};

/**
 * 获取今日复习词
 */
export const getReviewWords = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.REVIEW_WORDS}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('获取复习词失败:', error);
    throw error;
  }
};

/**
 * 记录学习进度
 */
export const recordProgress = async (wordId, result, masteryScore) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}${API_ENDPOINTS.RECORD_PROGRESS}`,
      {
        wordId,
        result,
        masteryScore
      },
      {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('记录进度失败:', error);
    throw error;
  }
};

/**
 * 获取用户统计信息
 */
export const getUserStats = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.STATS}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('获取统计信息失败:', error);
    throw error;
  }
};