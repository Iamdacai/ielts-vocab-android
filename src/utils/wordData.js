import axios from 'axios';

// 后端API基础URL
const API_BASE_URL = 'https://ielts.caiyuyang.cn/api';

// 获取认证token
const getAuthToken = () => {
  // 从本地存储获取token（实际项目中需要实现登录逻辑）
  return localStorage.getItem('authToken') || null;
};

// 创建axios实例
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器 - 添加认证token
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器 - 处理认证错误
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      // token过期或无效，清除本地存储并跳转到登录页
      localStorage.removeItem('authToken');
      localStorage.removeItem('userInfo');
      // 这里应该触发导航到登录页面
      console.log('Token expired, redirect to login');
    }
    return Promise.reject(error);
  }
);

/**
 * 获取新单词列表
 * @returns {Promise<Array>} 单词数组
 */
export const getNewWords = async () => {
  try {
    const response = await apiClient.get('/words/new');
    return response.data;
  } catch (error) {
    console.error('获取新单词失败:', error);
    throw error;
  }
};

/**
 * 获取复习单词列表
 * @returns {Promise<Array>} 单词数组
 */
export const getReviewWords = async () => {
  try {
    const response = await apiClient.get('/words/review');
    return response.data;
  } catch (error) {
    console.error('获取复习单词失败:', error);
    throw error;
  }
};

/**
 * 记录单词学习进度
 * @param {number} wordId - 单词ID
 * @param {string} result - 学习结果 ('know', 'hard', 'forgot')
 * @param {number} masteryScore - 掌握分数 (25, 50, 75)
 * @returns {Promise<Object>} 进度记录结果
 */
export const recordProgress = async (wordId, result, masteryScore) => {
  try {
    const response = await apiClient.post('/words/progress', {
      wordId,
      result,
      masteryScore
    });
    return response.data;
  } catch (error) {
    console.error('记录进度失败:', error);
    throw error;
  }
};

/**
 * 获取用户统计信息
 * @returns {Promise<Object>} 统计信息
 */
export const getUserStats = async () => {
  try {
    const response = await apiClient.get('/stats');
    return response.data;
  } catch (error) {
    console.error('获取统计信息失败:', error);
    throw error;
  }
};

/**
 * 用户登录
 * @param {Object} credentials - 登录凭证
 * @returns {Promise<Object>} 登录结果
 */
export const login = async (credentials) => {
  try {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    console.error('登录失败:', error);
    throw error;
  }
};

/**
 * 获取用户配置
 * @returns {Promise<Object>} 用户配置
 */
export const getUserConfig = async () => {
  try {
    const response = await apiClient.get('/config');
    return response.data;
  } catch (error) {
    console.error('获取配置失败:', error);
    throw error;
  }
};

/**
 * 更新用户配置
 * @param {Object} config - 新的配置
 * @returns {Promise<Object>} 更新结果
 */
export const updateUserConfig = async (config) => {
  try {
    const response = await apiClient.post('/config', config);
    return response.data;
  } catch (error) {
    console.error('更新配置失败:', error);
    throw error;
  }
};