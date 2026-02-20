import DatabaseService from './database';
import VocabularyService from './vocabulary';
import LearningProgressService from './learningProgress';
import PronunciationService from './pronunciation';

/**
 * 综合测试脚本 - 验证所有核心功能
 */
const ComprehensiveTest = {
  async runAllTests() {
    console.log('🚀 开始综合测试...');
    
    try {
      // 测试1: 数据库初始化
      console.log('🧪 测试数据库初始化...');
      await DatabaseService.initDatabase();
      console.log('✅ 数据库初始化成功');
      
      // 测试2: 词汇服务
      console.log('📚 测试词汇服务...');
      const words = await VocabularyService.getNewWords(5);
      console.log(`✅ 获取新词成功，共 ${words.length} 个单词`);
      
      if (words.length > 0) {
        const wordDetail = await VocabularyService.getWordById(words[0].id);
        console.log(`✅ 单词详情获取成功: ${wordDetail.word}`);
      }
      
      // 测试3: 学习进度
      console.log('📈 测试学习进度服务...');
      const progress = await LearningProgressService.getLearningStats();
      console.log(`✅ 学习统计获取成功: 掌握 ${progress.masteredCount} 个单词`);
      
      // 测试4: 发音服务
      console.log('🔊 测试发音服务...');
      if (words.length > 0) {
        const audioPath = await PronunciationService.generatePronunciation(words[0].word);
        console.log(`✅ 发音生成成功: ${audioPath}`);
      }
      
      console.log('🎉 所有测试通过！');
      return true;
    } catch (error) {
      console.error('❌ 测试失败:', error);
      return false;
    }
  }
};

export default ComprehensiveTest;