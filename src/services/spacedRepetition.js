/**
 * 间隔重复算法实现
 * 基于SM-2算法的改进版本
 */

class SpacedRepetitionAlgorithm {
  constructor() {
    // 复习间隔倍数（基于用户评分）
    this.easeFactors = {
      0: 0.5,   // 完全忘记
      1: 0.8,   // 困难
      2: 1.0,   // 正确但犹豫
      3: 1.3,   // 正确且轻松
      4: 1.5,   // 完美回忆
      5: 2.0    // 超级完美
    };
    
    // 初始复习间隔（天数）
    this.initialIntervals = [1, 3, 7, 14, 30, 90, 180, 365];
  }

  /**
   * 计算下一次复习时间
   * @param {Object} wordProgress - 单词进度数据
   * @param {number} quality - 用户评分 (0-5)
   * @returns {Object} 更新后的进度数据
   */
  calculateNextReview(wordProgress, quality) {
    const now = new Date();
    let nextReviewAt;
    let interval;
    let easeFactor;
    let reviewCount = wordProgress.review_count || 0;

    if (quality === 0) {
      // 完全忘记，重置为新词
      interval = 1;
      easeFactor = 2.5;
      reviewCount = 0;
    } else if (reviewCount === 0) {
      // 第一次学习
      interval = this.initialIntervals[0];
      easeFactor = 2.5 + (quality - 3) * 0.1;
    } else {
      // 后续复习
      const currentInterval = wordProgress.interval || 1;
      const currentEaseFactor = wordProgress.ease_factor || 2.5;
      
      easeFactor = currentEaseFactor + (quality - 3) * 0.15;
      // 限制easeFactor范围
      easeFactor = Math.max(1.3, Math.min(3.0, easeFactor));
      
      interval = Math.round(currentInterval * easeFactor);
      
      // 确保间隔不会太短
      if (interval < currentInterval + 1) {
        interval = currentInterval + 1;
      }
    }

    // 计算下次复习时间
    nextReviewAt = new Date(now.getTime() + interval * 24 * 60 * 60 * 1000);

    return {
      ...wordProgress,
      interval: interval,
      ease_factor: easeFactor,
      next_review_at: nextReviewAt.toISOString(),
      review_count: reviewCount + 1,
      last_reviewed_at: now.toISOString(),
      quality: quality,
      mastery_score: this.calculateMasteryScore(reviewCount + 1, quality, easeFactor)
    };
  }

  /**
   * 计算掌握度评分 (0-100)
   */
  calculateMasteryScore(reviewCount, quality, easeFactor) {
    if (reviewCount === 0) {
      return 0;
    }
    
    // 基础分值
    let baseScore = quality * 20; // 0-100
    
    // 根据复习次数和easeFactor调整
    const consistencyBonus = Math.min(20, (reviewCount - 1) * 2);
    const easeBonus = Math.min(10, (easeFactor - 2.5) * 10);
    
    let finalScore = baseScore + consistencyBonus + easeBonus;
    return Math.min(100, Math.max(0, Math.round(finalScore)));
  }

  /**
   * 获取今日需要复习的单词
   * @param {Array} allWords - 所有单词进度数据
   * @returns {Array} 需要复习的单词
   */
  getWordsForReview(allWords) {
    const now = new Date();
    return allWords.filter(word => {
      if (!word.next_review_at) return false;
      const nextReview = new Date(word.next_review_at);
      return nextReview <= now;
    });
  }

  /**
   * 获取今日新词数量
   * @param {number} dailyNewWordsCount - 每日新词数量设置
   * @param {Array} learnedWords - 已学习的单词
   * @returns {number} 今日可学习的新词数量
   */
  getNewWordsCount(dailyNewWordsCount, learnedWords) {
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    const todayLearned = learnedWords.filter(word => {
      const createdAt = new Date(word.created_at);
      return createdAt >= todayStart;
    });
    
    return Math.max(0, dailyNewWordsCount - todayLearned.length);
  }

  /**
   * 更新单词状态
   * @param {string} status - 'new', 'learning', 'mastered', 'forgotten'
   * @param {number} masteryScore - 掌握度评分
   * @returns {string} 更新后的状态
   */
  updateWordStatus(status, masteryScore) {
    if (masteryScore >= 90) {
      return 'mastered';
    } else if (masteryScore >= 70) {
      return 'learning';
    } else if (status === 'mastered' && masteryScore < 70) {
      return 'forgotten';
    }
    return status || 'new';
  }
}

export default new SpacedRepetitionAlgorithm();