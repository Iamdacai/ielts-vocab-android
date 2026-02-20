import { initDatabase, getVocabularyDB } from './database';
import { importVocabularyData } from './vocabulary';

export const testDatabase = async () => {
  try {
    console.log('🧪 开始数据库测试...');
    
    // 初始化数据库
    await initDatabase();
    console.log('✅ 数据库初始化成功');
    
    // 获取数据库实例
    const db = await getVocabularyDB();
    console.log('✅ 获取数据库实例成功');
    
    // 测试词汇表是否存在
    const tables = await db.executeSql('SELECT name FROM sqlite_master WHERE type="table" AND name="ielts_words"');
    if (tables.rows.length > 0) {
      console.log('✅ 词汇表存在');
    } else {
      console.log('❌ 词汇表不存在，需要导入数据');
      // 导入词汇数据
      await importVocabularyData();
      console.log('✅ 词汇数据导入成功');
    }
    
    // 测试查询功能
    const words = await db.executeSql('SELECT * FROM ielts_words LIMIT 5');
    console.log(`✅ 查询到 ${words.rows.length} 个词汇`);
    for (let i = 0; i < words.rows.length; i++) {
      console.log(`   - ${words.rows.item(i).word}: ${words.rows.item(i).definition}`);
    }
    
    console.log('🎉 数据库测试完成！');
    return true;
  } catch (error) {
    console.error('❌ 数据库测试失败:', error);
    return false;
  }
};