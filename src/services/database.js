import SQLite from 'react-native-sqlite-storage';
import { DATABASE_NAME } from '../utils/constants';

// 配置SQLite
SQLite.enablePromise(true);
SQLite.DEBUG(true);

class DatabaseService {
  constructor() {
    this.db = null;
  }

  async initializeDatabase() {
    try {
      // 打开数据库
      this.db = await SQLite.openDatabase({
        name: DATABASE_NAME,
        location: 'default',
      });

      console.log('✅ 数据库初始化成功');

      // 创建表
      await this.createTables();
      
      // 检查是否需要初始化词汇数据
      await this.initializeVocabularyData();
      
      return this.db;
    } catch (error) {
      console.error('❌ 数据库初始化失败:', error);
      throw error;
    }
  }

  async createTables() {
    try {
      // 词汇表（只读）
      await this.db.executeSql(`
        CREATE TABLE IF NOT EXISTS vocabulary (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          word TEXT NOT NULL,
          phonetic TEXT,
          part_of_speech TEXT,
          definition TEXT NOT NULL,
          example_sentences TEXT,
          frequency_level TEXT CHECK(frequency_level IN ('high', 'medium', 'low')),
          cambridge_book INTEGER CHECK(cambridge_book BETWEEN 1 AND 18),
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(word, cambridge_book)
        );
      `);

      // 用户学习进度表
      await this.db.executeSql(`
        CREATE TABLE IF NOT EXISTS user_progress (
          word_id INTEGER,
          status TEXT CHECK(status IN ('new', 'learning', 'mastered', 'forgotten')),
          next_review_at DATETIME,
          review_count INTEGER DEFAULT 0,
          mastery_score REAL DEFAULT 0.00,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (word_id),
          FOREIGN KEY (word_id) REFERENCES vocabulary(id) ON DELETE CASCADE
        );
      `);

      // 用户配置表
      await this.db.executeSql(`
        CREATE TABLE IF NOT EXISTS user_config (
          id INTEGER PRIMARY KEY DEFAULT 1,
          daily_new_words_count INTEGER DEFAULT 20,
          review_time TEXT DEFAULT '20:00',
          weekly_new_words_days TEXT DEFAULT '[1,2,3,4,5,6,7]',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // 插入默认配置
      await this.db.executeSql(`
        INSERT OR IGNORE INTO user_config (id) VALUES (1);
      `);

      console.log('✅ 数据表创建成功');
    } catch (error) {
      console.error('❌ 创建数据表失败:', error);
      throw error;
    }
  }

  async initializeVocabularyData() {
    try {
      // 检查词汇表是否为空
      const [result] = await this.db.executeSql('SELECT COUNT(*) as count FROM vocabulary');
      const count = result.rows.item(0).count;

      if (count === 0) {
        console.log('🔄 正在初始化词汇数据...');
        // 导入词汇数据
        await this.importVocabularyData();
        console.log('✅ 词汇数据初始化完成');
      } else {
        console.log(`📊 词汇表已包含 ${count} 个单词`);
      }
    } catch (error) {
      console.error('❌ 词汇数据初始化失败:', error);
      throw error;
    }
  }

  async importVocabularyData() {
    try {
      // 从本地JSON文件导入词汇数据
      const vocabularyData = require('../assets/data/ielts-vocabulary.json');
      
      // 开始事务
      await this.db.executeSql('BEGIN TRANSACTION;');
      
      for (const word of vocabularyData) {
        await this.db.executeSql(
          `INSERT INTO vocabulary (
            word, phonetic, part_of_speech, definition, 
            example_sentences, frequency_level, cambridge_book
          ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            word.word,
            word.phonetic || '',
            word.part_of_speech || '',
            word.definition,
            JSON.stringify(word.example_sentences || []),
            word.frequency_level || 'medium',
            word.cambridge_book || 10
          ]
        );
      }
      
      // 提交事务
      await this.db.executeSql('COMMIT;');
      
      console.log(`✅ 成功导入 ${vocabularyData.length} 个词汇`);
    } catch (error) {
      // 回滚事务
      await this.db.executeSql('ROLLBACK;');
      console.error('❌ 词汇数据导入失败:', error);
      throw error;
    }
  }

  // 查询所有词汇
  async getAllVocabulary() {
    try {
      const [result] = await this.db.executeSql(
        'SELECT * FROM vocabulary ORDER BY word ASC'
      );
      
      const words = [];
      for (let i = 0; i < result.rows.length; i++) {
        const row = result.rows.item(i);
        words.push({
          ...row,
          example_sentences: JSON.parse(row.example_sentences || '[]')
        });
      }
      
      return words;
    } catch (error) {
      console.error('❌ 查询词汇失败:', error);
      throw error;
    }
  }

  // 根据ID查询词汇
  async getVocabularyById(id) {
    try {
      const [result] = await this.db.executeSql(
        'SELECT * FROM vocabulary WHERE id = ?',
        [id]
      );
      
      if (result.rows.length > 0) {
        const row = result.rows.item(0);
        return {
          ...row,
          example_sentences: JSON.parse(row.example_sentences || '[]')
        };
      }
      
      return null;
    } catch (error) {
      console.error('❌ 查询词汇失败:', error);
      throw error;
    }
  }

  // 获取新词（未学习的词汇）
  async getNewWords(count = 20) {
    try {
      const [result] = await this.db.executeSql(`
        SELECT v.* 
        FROM vocabulary v 
        LEFT JOIN user_progress up ON v.id = up.word_id 
        WHERE up.word_id IS NULL 
        ORDER BY v.frequency_level DESC, v.cambridge_book ASC 
        LIMIT ?
      `, [count]);
      
      const words = [];
      for (let i = 0; i < result.rows.length; i++) {
        const row = result.rows.item(i);
        words.push({
          ...row,
          example_sentences: JSON.parse(row.example_sentences || '[]')
        });
      }
      
      return words;
    } catch (error) {
      console.error('❌ 获取新词失败:', error);
      throw error;
    }
  }

  // 获取需要复习的词汇
  async getReviewWords() {
    try {
      const now = new Date().toISOString();
      const [result] = await this.db.executeSql(`
        SELECT v.*, up.mastery_score, up.next_review_at
        FROM vocabulary v 
        INNER JOIN user_progress up ON v.id = up.word_id 
        WHERE up.status = 'learning' 
        AND up.next_review_at <= ?
        ORDER BY up.next_review_at ASC
      `, [now]);
      
      const words = [];
      for (let i = 0; i < result.rows.length; i++) {
        const row = result.rows.item(i);
        words.push({
          ...row,
          example_sentences: JSON.parse(row.example_sentences || '[]')
        });
      }
      
      return words;
    } catch (error) {
      console.error('❌ 获取复习词汇失败:', error);
      throw error;
    }
  }

  // 更新用户学习进度
  async updateUserProgress(wordId, progressData) {
    try {
      const { status, mastery_score, next_review_at } = progressData;
      
      // 检查记录是否存在
      const [checkResult] = await this.db.executeSql(
        'SELECT word_id FROM user_progress WHERE word_id = ?',
        [wordId]
      );
      
      if (checkResult.rows.length > 0) {
        // 更新现有记录
        await this.db.executeSql(
          `UPDATE user_progress 
           SET status = ?, mastery_score = ?, next_review_at = ?, updated_at = CURRENT_TIMESTAMP
           WHERE word_id = ?`,
          [status, mastery_score, next_review_at, wordId]
        );
      } else {
        // 插入新记录
        await this.db.executeSql(
          `INSERT INTO user_progress (word_id, status, mastery_score, next_review_at)
           VALUES (?, ?, ?, ?)`,
          [wordId, status, mastery_score, next_review_at]
        );
      }
      
      console.log(`✅ 更新词汇 ${wordId} 的学习进度`);
    } catch (error) {
      console.error('❌ 更新学习进度失败:', error);
      throw error;
    }
  }

  // 获取用户配置
  async getUserConfig() {
    try {
      const [result] = await this.db.executeSql(
        'SELECT * FROM user_config WHERE id = 1'
      );
      
      if (result.rows.length > 0) {
        const config = result.rows.item(0);
        return {
          ...config,
          weekly_new_words_days: JSON.parse(config.weekly_new_words_days)
        };
      }
      
      return null;
    } catch (error) {
      console.error('❌ 获取用户配置失败:', error);
      throw error;
    }
  }

  // 更新用户配置
  async updateUserConfig(config) {
    try {
      const { daily_new_words_count, review_time, weekly_new_words_days } = config;
      
      await this.db.executeSql(
        `UPDATE user_config 
         SET daily_new_words_count = ?, review_time = ?, weekly_new_words_days = ?, updated_at = CURRENT_TIMESTAMP
         WHERE id = 1`,
        [daily_new_words_count, review_time, JSON.stringify(weekly_new_words_days)]
      );
      
      console.log('✅ 用户配置更新成功');
    } catch (error) {
      console.error('❌ 更新用户配置失败:', error);
      throw error;
    }
  }

  // 关闭数据库连接
  async closeDatabase() {
    if (this.db) {
      await this.db.close();
      this.db = null;
      console.log('✅ 数据库连接已关闭');
    }
  }
}

export default new DatabaseService();