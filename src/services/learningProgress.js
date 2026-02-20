import { openDatabase } from './database';
import { calculateNextReviewDate } from '../utils/spacedRepetition';

/**
 * 学习进度管理服务
 * 负责管理用户的学习进度、复习计划和掌握度评分
 */

class LearningProgressService {
  constructor() {
    this.db = null;
  }

  async init() {
    if (!this.db) {
      this.db = await openDatabase();
    }
  }

  /**
   * 获取用户配置
   */
  async getUserConfig() {
    await this.init();
    const config = await this.db.getFirstAsync(
      'SELECT * FROM user_config LIMIT 1'
    );
    
    if (!config) {
      // 返回默认配置
      return {
        daily_new_words_count: 20,
        review_time: '20:00',
        weekly_new_words_days: JSON.stringify([1, 2, 3, 4, 5, 6, 7])
      };
    }
    
    return config;
  }

  /**
   * 更新用户配置
   */
  async updateUserConfig(config) {
    await this.init();
    const existingConfig = await this.getUserConfig();
    
    if (existingConfig.id) {
      // 更新现有配置
      await this.db.executeAsync(
        'UPDATE user_config SET daily_new_words_count = ?, review_time = ?, weekly_new_words_days = ? WHERE id = ?',
        [config.daily_new_words_count, config.review_time, JSON.stringify(config.weekly_new_words_days), existingConfig.id]
      );
    } else {
      // 插入新配置
      await this.db.executeAsync(
        'INSERT INTO user_config (daily_new_words_count, review_time, weekly_new_words_days) VALUES (?, ?, ?)',
        [config.daily_new_words_count, config.review_time, JSON.stringify(config.weekly_new_words_days)]
      );
    }
    
    return await this.getUserConfig();
  }

  /**
   * 获取今日新词
   */
  async getTodayNewWords(count = 20) {
    await this.init();
    const today = new Date().toISOString().split('T')[0];
    
    // 获取今天还没有学习的新词
    const words = await this.db.getAllAsync(`
      SELECT v.*, wp.status, wp.mastery_score, wp.next_review_at
      FROM vocabulary v
      LEFT JOIN word_progress wp ON v.id = wp.word_id
      WHERE wp.status IS NULL OR wp.status = 'new'
      ORDER BY v.frequency_level DESC, v.cambridge_book ASC
      LIMIT ?
    `, [count]);
    
    return words;
  }

  /**
   * 获取需要复习的单词
   */
  async getReviewWords() {
    await this.init();
    const now = new Date().toISOString();
    
    const words = await this.db.getAllAsync(`
      SELECT v.*, wp.status, wp.mastery_score, wp.next_review_at, wp.review_count
      FROM vocabulary v
      INNER JOIN word_progress wp ON v.id = wp.word_id
      WHERE wp.next_review_at <= ? 
      AND wp.status IN ('learning', 'mastered')
      ORDER BY wp.next_review_at ASC
    `, [now]);
    
    return words;
  }

  /**
   * 更新单词学习进度
   */
  async updateWordProgress(wordId, result) {
    await this.init();
    
    const { masteryScore, isCorrect, reviewType } = result;
    const now = new Date().toISOString();
    
    // 获取当前进度
    const currentProgress = await this.db.getFirstAsync(
      'SELECT * FROM word_progress WHERE word_id = ?',
      [wordId]
    );
    
    let status = 'learning';
    let reviewCount = currentProgress ? currentProgress.review_count + 1 : 1;
    let nextReviewAt = calculateNextReviewDate(reviewCount, masteryScore, isCorrect);
    
    // 如果掌握度很高，标记为已掌握
    if (masteryScore >= 90 && reviewCount >= 3) {
      status = 'mastered';
      // 已掌握的单词很久以后才需要复习
      const masteredDate = new Date();
      masteredDate.setDate(masteredDate.getDate() + 30); // 30天后
      nextReviewAt = masteredDate.toISOString();
    }
    
    if (currentProgress) {
      // 更新现有记录
      await this.db.executeAsync(
        'UPDATE word_progress SET status = ?, mastery_score = ?, next_review_at = ?, review_count = ?, updated_at = ? WHERE word_id = ?',
        [status, masteryScore, nextReviewAt, reviewCount, now, wordId]
      );
    } else {
      // 插入新记录
      await this.db.executeAsync(
        'INSERT INTO word_progress (word_id, status, mastery_score, next_review_at, review_count, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [wordId, status, masteryScore, nextReviewAt, reviewCount, now, now]
      );
    }
    
    return { status, masteryScore, nextReviewAt, reviewCount };
  }

  /**
   * 获取学习统计
   */
  async getLearningStats() {
    await this.init();
    
    const stats = await this.db.getFirstAsync(`
      SELECT 
        COUNT(*) as total_words,
        SUM(CASE WHEN status = 'mastered' THEN 1 ELSE 0 END) as mastered_words,
        SUM(CASE WHEN status = 'learning' THEN 1 ELSE 0 END) as learning_words,
        AVG(mastery_score) as avg_mastery_score,
        SUM(CASE WHEN DATE(created_at) = DATE('now') THEN 1 ELSE 0 END) as today_learning_count
      FROM word_progress
    `);
    
    return {
      total_words: stats.total_words || 0,
      mastered_words: stats.mastered_words || 0,
      learning_words: stats.learning_words || 0,
      avg_mastery_score: stats.avg_mastery_score ? parseFloat(stats.avg_mastery_score.toFixed(2)) : 0,
      today_learning_count: stats.today_learning_count || 0
    };
  }

  /**
   * 重置所有学习进度（用于测试）
   */
  async resetAllProgress() {
    await this.init();
    await this.db.executeAsync('DELETE FROM word_progress');
    return true;
  }
}

export default new LearningProgressService();