#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 读取原始词汇文件
const rawData = fs.readFileSync('/home/admin/clawd/ielts-vocab-system/vocabulary/ielts-materials/vocabulary.md', 'utf8');

// 解析词汇数据
function parseVocabularyData(content) {
  const words = [];
  const lines = content.split('\n');
  
  let currentWord = null;
  let currentSection = '';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // 跳过标题行
    if (line.startsWith('#') || line.startsWith('##') || line.includes('back to top')) {
      continue;
    }
    
    // 检测新单词（以 * ** 开头）
    if (line.startsWith('* **')) {
      if (currentWord) {
        words.push(currentWord);
      }
      
      const wordMatch = line.match(/\*\*\s*(.+?)\s*\*\*/);
      if (wordMatch) {
        currentWord = {
          word: wordMatch[1].trim(),
          phonetic: '',
          part_of_speech: '',
          definition: '',
          example_sentences: [],
          frequency_level: 'medium',
          cambridge_book: 10
        };
        currentSection = 'word';
      }
    } 
    // 处理音标和释义
    else if (currentWord && line.startsWith('```')) {
      // 音标和释义块
      const blockEnd = lines.indexOf('```', i + 1);
      if (blockEnd > i) {
        const blockContent = lines.slice(i + 1, blockEnd).join('\n').trim();
        
        // 简单解析：第一行是音标，其余是释义
        const blockLines = blockContent.split('\n').filter(l => l.trim());
        if (blockLines.length > 0) {
          // 检查是否包含音标（包含 / 或 ˈ 符号）
          if (blockLines[0].includes('/') || blockLines[0].includes('ˈ')) {
            currentWord.phonetic = blockLines[0].trim();
            currentWord.definition = blockLines.slice(1).join('\n').trim();
          } else {
            currentWord.definition = blockContent;
          }
        }
        
        i = blockEnd; // 跳过整个代码块
      }
    }
  }
  
  if (currentWord) {
    words.push(currentWord);
  }
  
  return words;
}

try {
  const vocabularyData = parseVocabularyData(rawData);
  
  // 保存为JSON格式
  const outputDir = path.join(__dirname, '../src/assets/data');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  fs.writeFileSync(
    path.join(outputDir, 'ielts-vocabulary.json'),
    JSON.stringify(vocabularyData, null, 2),
    'utf8'
  );
  
  console.log(`✅ 成功转换 ${vocabularyData.length} 个词汇`);
  console.log('📁 输出文件: src/assets/data/ielts-vocabulary.json');
  
} catch (error) {
  console.error('❌ 转换失败:', error.message);
  process.exit(1);
}