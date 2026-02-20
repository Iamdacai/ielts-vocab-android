import { Platform } from 'react-native';
import Sound from 'react-native-sound';

// 预生成的音频文件路径
const AUDIO_BASE_PATH = 'audio/';

/**
 * 发音服务 - 处理单词发音播放和录音分析
 */
class PronunciationService {
  constructor() {
    // 初始化音频播放器
    this.sound = null;
    this.isInitialized = false;
  }

  /**
   * 播放单词发音
   * @param {string} word - 要播放的单词
   * @returns {Promise<boolean>} - 播放是否成功
   */
  async playWordPronunciation(word) {
    try {
      // 清理之前的音频
      if (this.sound) {
        this.sound.release();
        this.sound = null;
      }

      // 尝试播放预生成的音频文件
      const audioFile = `${word.toLowerCase()}.mp3`;
      const success = await this.playLocalAudio(audioFile);
      
      if (!success) {
        console.warn(`Local audio not found for word: ${word}, falling back to system TTS`);
        // 如果本地音频不存在，使用系统TTS（仅Android）
        if (Platform.OS === 'android') {
          return this.playSystemTTS(word);
        }
      }
      
      return success;
    } catch (error) {
      console.error('Error playing word pronunciation:', error);
      return false;
    }
  }

  /**
   * 播放本地音频文件
   * @param {string} filename - 音频文件名
   * @returns {Promise<boolean>}
   */
  async playLocalAudio(filename) {
    return new Promise((resolve) => {
      try {
        // 创建Sound实例
        this.sound = new Sound(filename, Sound.MAIN_BUNDLE, (error) => {
          if (error) {
            console.warn('Failed to load sound:', error);
            resolve(false);
            return;
          }
          
          // 播放音频
          this.sound.play((success) => {
            this.sound.release();
            this.sound = null;
            resolve(success);
          });
        });
      } catch (error) {
        console.error('Error creating sound:', error);
        resolve(false);
      }
    });
  }

  /**
   * 使用系统TTS播放（仅Android）
   * @param {string} text - 要播放的文本
   * @returns {Promise<boolean>}
   */
  async playSystemTTS(text) {
    if (Platform.OS !== 'android') {
      return false;
    }

    try {
      // 使用react-native-tts库
      const Tts = require('react-native-tts');
      Tts.setDefaultLanguage('en-US');
      Tts.setDefaultRate(0.5); // 语速
      Tts.speak(text);
      return true;
    } catch (error) {
      console.error('System TTS error:', error);
      return false;
    }
  }

  /**
   * 录制用户发音
   * @param {string} word - 目标单词
   * @returns {Promise<string>} - 录音文件路径
   */
  async recordUserPronunciation(word) {
    try {
      // 使用react-native-audio-record库
      const AudioRecorder = require('react-native-audio-record');
      
      const options = {
        sampleRate: 16000,
        channels: 1,
        bitsPerSample: 16,
        wavFile: `pronunciation_${word}_${Date.now()}.wav`,
      };

      AudioRecorder.prepare(options);
      await AudioRecorder.start();
      
      // 返回录音文件路径
      return options.wavFile;
    } catch (error) {
      console.error('Recording error:', error);
      throw error;
    }
  }

  /**
   * 分析用户发音（调用云端API）
   * @param {string} audioFilePath - 录音文件路径
   * @param {string} targetWord - 目标单词
   * @returns {Promise<Object>} - 分析结果
   */
  async analyzePronunciation(audioFilePath, targetWord) {
    try {
      // TODO: 调用Azure发音评分API
      // 这里先返回模拟结果
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
        accuracy: mockScore,
        fluency: mockScore,
        completeness: mockScore,
        feedback: feedback,
        word: targetWord,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Pronunciation analysis error:', error);
      throw error;
    }
  }

  /**
   * 保存发音练习记录
   * @param {Object} record - 发音记录
   */
  async savePronunciationRecord(record) {
    try {
      // 保存到本地数据库
      // TODO: 实现数据库保存逻辑
      console.log('Saving pronunciation record:', record);
      return true;
    } catch (error) {
      console.error('Save pronunciation record error:', error);
      return false;
    }
  }

  /**
   * 获取发音练习历史
   * @returns {Promise<Array>} - 发音记录列表
   */
  async getPronunciationHistory() {
    try {
      // 从本地数据库获取
      // TODO: 实现数据库查询逻辑
      return [];
    } catch (error) {
      console.error('Get pronunciation history error:', error);
      return [];
    }
  }

  /**
   * 清理资源
   */
  cleanup() {
    if (this.sound) {
      this.sound.release();
      this.sound = null;
    }
  }
}

// 导出单例实例
const pronunciationService = new PronunciationService();
export default pronunciationService;