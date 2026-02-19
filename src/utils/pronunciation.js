/**
 * 简化的发音功能（移除实际音频，仅保留模拟评分）
 */

// 模拟发音评分（实际项目中应调用真实的语音识别API）
export const analyzePronunciation = async (word) => {
  // 模拟发音评分（60-100分）
  const randomScore = Math.floor(Math.random() * 40) + 60;
  
  let feedback = '';
  if (randomScore >= 90) {
    feedback = '发音非常标准！继续保持！';
  } else if (randomScore >= 80) {
    feedback = '发音很好，注意个别音节的重音位置。';
  } else if (randomScore >= 70) {
    feedback = '发音基本正确，但某些音素需要改进。';
  } else {
    feedback = '发音需要更多练习，建议多听标准发音并跟读。';
  }
  
  return {
    score: randomScore,
    feedback: feedback,
    word: word,
    timestamp: new Date().toISOString()
  };
};

// 模拟播放发音（实际项目中应调用TTS服务）
export const playWordPronunciation = async (word) => {
  // 模拟播放延迟
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log(`Playing pronunciation for: ${word}`);
  return true;
};