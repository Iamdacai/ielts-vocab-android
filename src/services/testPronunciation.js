// Test script for pronunciation functionality
import PronunciationService from './pronunciation';
import PronunciationAssessment from './pronunciationAssessment';

async function testPronunciation() {
  try {
    console.log('Testing pronunciation services...');
    
    // Test TTS
    const ttsResult = await PronunciationService.speakWord('hello');
    console.log('TTS test result:', ttsResult);
    
    // Test assessment (mock)
    const assessmentResult = await PronunciationAssessment.assessPronunciation(
      'hello',
      'en-US'
    );
    console.log('Assessment test result:', assessmentResult);
    
    console.log('All pronunciation tests passed!');
  } catch (error) {
    console.error('Pronunciation test failed:', error);
  }
}

// Run test if called directly
if (require.main === module) {
  testPronunciation();
}

export default testPronunciation;