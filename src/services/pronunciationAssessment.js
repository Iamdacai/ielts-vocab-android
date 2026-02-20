import axios from 'axios';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * 发音评分服务 - 集成 Azure Cognitive Services
 * 用于分析用户录音并提供发音评分和反馈
 */

class PronunciationAssessmentService {
  constructor() {
    this.apiKey = process.env.AZURE_SPEECH_KEY || '';
    this.region = process.env.AZURE_SPEECH_REGION || 'eastasia';
    this.language = 'en-US';
    this.baseUrl = `https://${this.region}.stt.speech.microsoft.com`;
  }

  /**
   * 分析用户发音录音
   * @param {string} audioFilePath - 录音文件路径
   * @param {string} targetWord - 目标单词
   * @returns {Promise<Object>} 评分结果
   */
  async analyzePronunciation(audioFilePath, targetWord) {
    try {
      // 检查API密钥是否配置
      if (!this.apiKey) {
        console.warn('Azure Speech API key not configured. Using mock analysis.');
        return this.mockAnalysis(targetWord);
      }

      // 读取音频文件
      const audioBuffer = await this.readAudioFile(audioFilePath);
      
      // 调用Azure发音评估API
      const result = await this.callAzurePronunciationAssessment(
        audioBuffer, 
        targetWord
      );
      
      // 解析和格式化结果
      return this.formatAssessmentResult(result, targetWord);
      
    } catch (error) {
      console.error('Pronunciation assessment error:', error);
      // 如果API调用失败，使用模拟评分
      return this.mockAnalysis(targetWord);
    }
  }

  /**
   * 读取音频文件
   * @param {string} filePath - 文件路径
   * @returns {Promise<Buffer>} 音频数据
   */
  async readAudioFile(filePath) {
    // 在React Native中，需要使用特定的文件读取方法
    // 这里简化处理，实际项目中需要根据平台选择合适的读取方式
    const response = await fetch(filePath);
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  /**
   * 调用Azure发音评估API
   * @param {Buffer} audioBuffer - 音频数据
   * @param {string} referenceText - 参考文本（目标单词）
   * @returns {Promise<Object>} API响应
   */
  async callAzurePronunciationAssessment(audioBuffer, referenceText) {
    const endpoint = `${this.baseUrl}/speech/recognition/conversation/cognitiveservices/v1`;
    const params = new URLSearchParams({
      'language': this.language,
      'format': 'detailed'
    });

    const headers = {
      'Ocp-Apim-Subscription-Key': this.apiKey,
      'Content-Type': 'audio/wav; codecs=audio/pcm; samplerate=16000',
      'Accept': 'application/json',
      'SpeechContext': JSON.stringify({
        'pronunciationAssessment': {
          'referenceText': referenceText,
          'gradingSystem': 'HundredMark',
          'dimension': 'Comprehensive',
          'enableMiscue': true
        }
      })
    };

    const response = await axios.post(
      `${endpoint}?${params.toString()}`, 
      audioBuffer, 
      { headers }
    );

    return response.data;
  }

  /**
   * 格式化评估结果
   * @param {Object} azureResult - Azure API响应
   * @param {string} targetWord - 目标单词
   * @returns {Object} 格式化结果
   */
  formatAssessmentResult(azureResult, targetWord) {
    const nbest = azureResult.NBest?.[0];
    const pronunciationAssessment = nbest?.PronunciationAssessment;

    if (!pronunciationAssessment) {
      return this.mockAnalysis(targetWord);
    }

    const score = Math.round(pronunciationAssessment.PronScore || 0);
    const accuracy = Math.round(pronunciationAssessment.AccuracyScore || 0);
    const fluency = Math.round(pronunciationAssessment.FluencyScore || 0);
    const completeness = Math.round(pronunciationAssessment.CompletenessScore || 0);

    // 生成反馈信息
    let feedback = '';
    if (score >= 90) {
      feedback = '发音非常标准！继续保持！';
    } else if (score >= 80) {
      feedback = '发音很好，注意个别音节的重音位置。';
    } else if (score >= 70) {
      feedback = '发音基本正确，但某些音素需要改进。';
    } else {
      feedback = '发音需要更多练习，建议多听标准发音并跟读。';
    }

    return {
      score,
      accuracy,
      fluency,
      completeness,
      feedback,
      word: targetWord,
      timestamp: new Date().toISOString(),
      detailedResult: azureResult
    };
  }

  /**
   * 模拟发音评分（当API不可用时）
   * @param {string} targetWord - 目标单词
   * @returns {Object} 模拟评分结果
   */
  mockAnalysis(targetWord) {
    // 生成随机评分（60-100分）
    const score = Math.floor(Math.random() * 41) + 60;
    const accuracy = Math.floor(score * 0.9);
    const fluency = Math.floor(score * 0.85);
    const completeness = Math.floor(score * 0.95);

    let feedback = '';
    if (score >= 90) {
      feedback = '发音非常标准！继续保持！';
    } else if (score >= 80) {
      feedback = '发音很好，注意个别音节的重音位置。';
    } else if (score >= 70) {
      feedback = '发音基本正确，但某些音素需要改进。';
    } else {
      feedback = '发音需要更多练习，建议多听标准发音并跟读。';
    }

    return {
      score,
      accuracy,
      fluency,
      completeness,
      feedback,
      word: targetWord,
      timestamp: new Date().toISOString(),
      isMock: true
    };
  }

  /**
   * 保存发音评分结果到本地存储
   * @param {Object} assessmentResult - 评分结果
   * @param {number} userId - 用户ID
   */
  async saveAssessmentResult(assessmentResult, userId = 1) {
    try {
      const key = `pronunciation_records_${userId}`;
      const existingRecords = await AsyncStorage.getItem(key);
      const records = existingRecords ? JSON.parse(existingRecords) : [];
      
      records.push(assessmentResult);
      
      // 限制保存最近100条记录
      if (records.length > 100) {
        records.shift();
      }
      
      await AsyncStorage.setItem(key, JSON.stringify(records));
    } catch (error) {
      console.error('Failed to save pronunciation assessment result:', error);
    }
  }

  /**
   * 获取发音评分历史
   * @param {number} userId - 用户ID
   * @returns {Promise<Array>} 评分历史
   */
  async getAssessmentHistory(userId = 1) {
    try {
      const key = `pronunciation_records_${userId}`;
      const records = await AsyncStorage.getItem(key);
      return records ? JSON.parse(records) : [];
    } catch (error) {
      console.error('Failed to get pronunciation assessment history:', error);
      return [];
    }
  }

  /**
   * 获取发音统计信息
   * @param {number} userId - 用户ID
   * @returns {Promise<Object>} 统计信息
   */
  async getAssessmentStats(userId = 1) {
    try {
      const history = await this.getAssessmentHistory(userId);
      if (history.length === 0) {
        return {
          totalPractices: 0,
          averageScore: 0,
          bestWord: '',
          bestScore: 0
        };
      }

      const totalScore = history.reduce((sum, record) => sum + record.score, 0);
      const averageScore = Math.round(totalScore / history.length);
      
      const bestRecord = history.reduce((best, current) => 
        current.score > best.score ? current : best
      , { score: 0 });

      return {
        totalPractices: history.length,
        averageScore,
        bestWord: bestRecord.word,
        bestScore: bestRecord.score
      };
    } catch (error) {
      console.error('Failed to get pronunciation assessment stats:', error);
      return {
        totalPractices: 0,
        averageScore: 0,
        bestWord: '',
        bestScore: 0
      };
    }
  }
}

// 导出单例实例
const pronunciationAssessmentService = new PronunciationAssessmentService();
export default pronunciationAssessmentService;