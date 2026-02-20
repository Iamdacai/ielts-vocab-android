import { openDatabase } from './database';
import vocabularyData from '../assets/data/ielts-vocabulary.json';

/**
 * 初始化数据库并导入词汇数据
 */
export const initializeDatabase = async () => {
  try {
    const db = await openDatabase();
    
    // 创建词汇表
    await db.executeSql(`
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
    
    // 创建用户进度表
    await db.executeSql(`
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
    
    // 创建用户配置表
    await db.executeSql(`
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
    await db.executeSql(`
      INSERT OR IGNORE INTO user_config (id) VALUES (1);
    `);
    
    // 检查是否已经有词汇数据
    const result = await db.executeSql('SELECT COUNT(*) as count FROM vocabulary');
    const count = result[0].rows.item(0).count;
    
    if (count === 0) {
      console.log('正在导入词汇数据...');
      // 批量插入词汇数据
      const batchSize = 50;
      for (let i = 0; i < vocabularyData.length; i += batchSize) {
        const batch = vocabularyData.slice(i, i + batchSize);
        const placeholders = batch.map(() => '(?, ?, ?, ?, ?, ?, ?)').join(', ');
        const values = [];
        
        batch.forEach(word => {
          values.push(
            word.word,
            word.phonetic || '',
            word.part_of_speech || '',
            word.definition,
            JSON.stringify(word.example_sentences || []),
            word.frequency_level || 'medium',
            word.cambridge_book || 1
          );
        });
        
        await db.executeSql(
          `INSERT INTO vocabulary (word, phonetic, part_of_speech, definition, example_sentences, frequency_level, cambridge_book) VALUES ${placeholders}`,
          values
        );
      }
      
      console.log(`成功导入 ${vocabularyData.length} 个词汇`);
    } else {
      console.log(`数据库中已有 ${count} 个词汇，跳过导入`);
    }
    
    return true;
  } catch (error) {
    console.error('数据库初始化失败:', error);
    throw error;
  }
};