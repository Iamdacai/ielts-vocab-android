import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_CONFIG_KEY = 'user_config';

// 默认配置
const DEFAULT_CONFIG = {
  dailyNewWordsCount: 20,
  reviewTime: '20:00',
  weeklyNewWordsDays: [1, 2, 3, 4, 5, 6, 7], // 1=周一, 7=周日
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

class UserConfigService {
  constructor() {
    this.config = null;
  }

  // 获取用户配置（从AsyncStorage加载）
  async getConfig() {
    if (this.config) {
      return this.config;
    }

    try {
      const configStr = await AsyncStorage.getItem(USER_CONFIG_KEY);
      if (configStr) {
        this.config = JSON.parse(configStr);
        return this.config;
      } else {
        // 首次使用，保存默认配置
        await this.saveConfig(DEFAULT_CONFIG);
        this.config = DEFAULT_CONFIG;
        return DEFAULT_CONFIG;
      }
    } catch (error) {
      console.error('Failed to load user config:', error);
      // 返回默认配置
      this.config = DEFAULT_CONFIG;
      return DEFAULT_CONFIG;
    }
  }

  // 保存用户配置
  async saveConfig(config) {
    try {
      const configToSave = {
        ...config,
        updatedAt: new Date().toISOString()
      };
      await AsyncStorage.setItem(USER_CONFIG_KEY, JSON.stringify(configToSave));
      this.config = configToSave;
      return configToSave;
    } catch (error) {
      console.error('Failed to save user config:', error);
      throw error;
    }
  }

  // 更新特定配置项
  async updateConfig(updates) {
    const currentConfig = await this.getConfig();
    const newConfig = { ...currentConfig, ...updates };
    return await this.saveConfig(newConfig);
  }

  // 重置为默认配置
  async resetToDefault() {
    await this.saveConfig(DEFAULT_CONFIG);
    this.config = DEFAULT_CONFIG;
    return DEFAULT_CONFIG;
  }

  // 检查今天是否是学习日
  async isTodayLearningDay() {
    const config = await this.getConfig();
    const today = new Date().getDay(); // 0=周日, 1=周一, ..., 6=周六
    const dayMap = [7, 1, 2, 3, 4, 5, 6]; // 转换为 1=周一, 7=周日
    const todayMapped = dayMap[today];
    return config.weeklyNewWordsDays.includes(todayMapped);
  }

  // 获取今日新词数量
  async getTodayNewWordsCount() {
    const isLearningDay = await this.isTodayLearningDay();
    if (!isLearningDay) {
      return 0;
    }
    
    const config = await this.getConfig();
    return config.dailyNewWordsCount;
  }

  // 获取复习时间
  async getReviewTime() {
    const config = await this.getConfig();
    return config.reviewTime;
  }
}

export default new UserConfigService();