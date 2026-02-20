// src/services/errorHandler.js
import { Alert } from 'react-native';

class ErrorHandler {
  static handleError(error, context = '') {
    console.error(`Error in ${context}:`, error);
    
    // Show user-friendly error message
    let message = '发生了一个错误';
    if (error.message) {
      if (error.message.includes('network')) {
        message = '网络连接失败，请检查网络设置';
      } else if (error.message.includes('database')) {
        message = '数据库操作失败，请重启应用';
      } else if (error.message.includes('audio')) {
        message = '音频播放失败，请检查设备权限';
      }
    }
    
    Alert.alert('错误', message);
  }

  static handleWarning(warning, context = '') {
    console.warn(`Warning in ${context}:`, warning);
  }

  static async logError(error, context = '') {
    // In production, you might want to send this to a logging service
    const errorLog = {
      timestamp: new Date().toISOString(),
      context,
      error: error.message || 'Unknown error',
      stack: error.stack || null
    };
    
    console.log('Error logged:', JSON.stringify(errorLog, null, 2));
  }
}

export default ErrorHandler;