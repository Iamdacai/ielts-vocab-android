/**
 * 雅思背单词 Android 应用 API 配置
 * 与微信小程序版本共享同一后端服务
 */

// 开发环境使用本地后端 (需先运行 backend/simple-server.js)
const DEV_API_URL = 'http://10.0.2.2:3001'; // Android 模拟器访问宿主机的特殊地址

// 生产环境使用正式域名
const PROD_API_URL = 'https://ielts.caiyuyang.cn';

// 根据构建环境选择 API 地址
export const API_BASE_URL = __DEV__ ? DEV_API_URL : PROD_API_URL;

// API 端点
export const API_ENDPOINTS = {
  // 认证
  LOGIN: '/api/auth/login',
  
  // 配置
  CONFIG: '/api/config',
  
  // 单词学习
  NEW_WORDS: '/api/words/new',
  REVIEW_WORDS: '/api/words/review',
  RECORD_PROGRESS: '/api/words/progress',
  
  // 统计
  STATS: '/api/stats',
  
  // 发音
  WORD_AUDIO: (word) => `/api/pronunciation/word-audio/${encodeURIComponent(word)}`,
  ANALYZE_PRONUNCIATION: '/api/pronunciation/analyze',
  PRONUNCIATION_HISTORY: '/api/pronunciation/history',
  PRONUNCIATION_STATS: '/api/pronunciation/stats',
  
  // 健康检查
  HEALTH: '/health'
};