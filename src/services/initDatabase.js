import AsyncStorage from '@react-native-async-storage/async-storage';
import { openDatabase } from './database';
import vocabularyData from '../assets/data/ielts-vocabulary.json';

const DB_INITIALIZED_KEY = 'db_initialized_v2';

export const initializeDatabase = async () => {
  try {
    // Check if database is already initialized
    const isInitialized = await AsyncStorage.getItem(DB_INITIALIZED_KEY);
    if (isInitialized === 'true') {
      console.log('✅ Database already initialized');
      return;
    }

    console.log('🔄 Initializing database...');
    const db = await openDatabase();

    // Create vocabulary table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS vocabulary (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        word TEXT NOT NULL UNIQUE,
        phonetic TEXT,
        part_of_speech TEXT,
        definition TEXT NOT NULL,
        example_sentences TEXT,
        frequency_level TEXT CHECK(frequency_level IN ('high', 'medium', 'low')),
        cambridge_book INTEGER CHECK(cambridge_book BETWEEN 1 AND 18),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create user progress table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS user_progress (
        word_id INTEGER PRIMARY KEY,
        status TEXT CHECK(status IN ('new', 'learning', 'mastered', 'forgotten')) DEFAULT 'new',
        next_review_at DATETIME,
        review_count INTEGER DEFAULT 0,
        mastery_score REAL DEFAULT 0.00,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (word_id) REFERENCES vocabulary(id) ON DELETE CASCADE
      );
    `);

    // Create user config table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS user_config (
        id INTEGER PRIMARY KEY DEFAULT 1,
        daily_new_words_count INTEGER DEFAULT 20,
        review_time TEXT DEFAULT '20:00',
        weekly_new_words_days TEXT DEFAULT '[1,2,3,4,5,6,7]',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Insert default user config
    await db.execAsync(`
      INSERT OR IGNORE INTO user_config (id) VALUES (1);
    `);

    // Insert vocabulary data
    console.log('📥 Importing vocabulary data...');
    const insertPromises = vocabularyData.map(async (word) => {
      try {
        await db.execAsync(`
          INSERT OR IGNORE INTO vocabulary 
          (word, phonetic, part_of_speech, definition, example_sentences, frequency_level, cambridge_book)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [
          word.word,
          word.phonetic || '',
          word.part_of_speech || '',
          word.definition,
          JSON.stringify(word.example_sentences || []),
          word.frequency_level || 'medium',
          word.cambridge_book || 10
        ]);
      } catch (error) {
        console.error('Error inserting word:', word.word, error);
      }
    });

    await Promise.all(insertPromises);
    
    // Mark database as initialized
    await AsyncStorage.setItem(DB_INITIALIZED_KEY, 'true');
    console.log('✅ Database initialization completed successfully!');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
};