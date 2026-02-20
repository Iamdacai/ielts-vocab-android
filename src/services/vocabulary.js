import Database from './database';
import vocabularyData from '../assets/data/ielts-vocabulary.json';

class VocabularyService {
  constructor() {
    this.db = new Database();
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;
    
    try {
      await this.db.init();
      
      // Check if vocabulary table exists and has data
      const wordCount = await this.db.getWordCount();
      if (wordCount === 0) {
        console.log('Vocabulary table is empty, seeding data...');
        await this.seedVocabularyData();
      }
      
      this.initialized = true;
      console.log('Vocabulary service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize vocabulary service:', error);
      throw error;
    }
  }

  async seedVocabularyData() {
    try {
      const wordsToInsert = vocabularyData.map(word => ({
        word: word.word,
        phonetic: word.phonetic || '',
        part_of_speech: word.part_of_speech || '',
        definition: word.definition || '',
        example_sentences: Array.isArray(word.example_sentences) 
          ? JSON.stringify(word.example_sentences) 
          : word.example_sentences || '[]',
        frequency_level: word.frequency_level || 'medium',
        cambridge_book: word.cambridge_book || 1
      }));

      await this.db.batchInsertWords(wordsToInsert);
      console.log(`Seeded ${wordsToInsert.length} words into database`);
    } catch (error) {
      console.error('Failed to seed vocabulary data:', error);
      throw error;
    }
  }

  async getNewWords(limit = 20) {
    try {
      await this.initialize();
      const words = await this.db.getNewWords(limit);
      return words.map(word => ({
        ...word,
        example_sentences: word.example_sentences ? JSON.parse(word.example_sentences) : []
      }));
    } catch (error) {
      console.error('Failed to get new words:', error);
      throw error;
    }
  }

  async getReviewWords(limit = 20) {
    try {
      await this.initialize();
      const words = await this.db.getReviewWords(limit);
      return words.map(word => ({
        ...word,
        example_sentences: word.example_sentences ? JSON.parse(word.example_sentences) : []
      }));
    } catch (error) {
      console.error('Failed to get review words:', error);
      throw error;
    }
  }

  async searchWords(query) {
    try {
      await this.initialize();
      if (!query || query.trim().length === 0) {
        return [];
      }
      
      const words = await this.db.searchWords(query.trim());
      return words.map(word => ({
        ...word,
        example_sentences: word.example_sentences ? JSON.parse(word.example_sentences) : []
      }));
    } catch (error) {
      console.error('Failed to search words:', error);
      throw error;
    }
  }

  async getWordById(id) {
    try {
      await this.initialize();
      const word = await this.db.getWordById(id);
      if (word) {
        return {
          ...word,
          example_sentences: word.example_sentences ? JSON.parse(word.example_sentences) : []
        };
      }
      return null;
    } catch (error) {
      console.error('Failed to get word by ID:', error);
      throw error;
    }
  }

  async getWordByWord(wordText) {
    try {
      await this.initialize();
      const word = await this.db.getWordByWord(wordText);
      if (word) {
        return {
          ...word,
          example_sentences: word.example_sentences ? JSON.parse(word.example_sentences) : []
        };
      }
      return null;
    } catch (error) {
      console.error('Failed to get word by text:', error);
      throw error;
    }
  }

  async getAllWords() {
    try {
      await this.initialize();
      const words = await this.db.getAllWords();
      return words.map(word => ({
        ...word,
        example_sentences: word.example_sentences ? JSON.parse(word.example_sentences) : []
      }));
    } catch (error) {
      console.error('Failed to get all words:', error);
      throw error;
    }
  }

  async getWordCount() {
    try {
      await this.initialize();
      return await this.db.getWordCount();
    } catch (error) {
      console.error('Failed to get word count:', error);
      throw error;
    }
  }
}

export default new VocabularyService();