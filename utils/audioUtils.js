// Audio utilities for Android React Native app
import Sound from 'react-native-sound';
import {AudioRecorder, AudioSource} from 'react-native-audio-recorder-player';

// Initialize audio recorder
const audioRecorder = new AudioRecorder();

// Configure audio settings for Android
export const initAudio = async () => {
  try {
    // Request audio permissions on Android
    await audioRecorder.startRecorder(
      null,
      AudioSource.MIC,
      // Audio settings optimized for speech
      {
        sampleRate: 16000,
        channels: 1,
        bitsPerSample: 16,
        wavFile: false,
      }
    );
    await audioRecorder.stopRecorder();
  } catch (error) {
    console.error('Audio initialization failed:', error);
  }
};

// Play pronunciation audio
export const playPronunciation = async (audioUrl) => {
  return new Promise((resolve, reject) => {
    const sound = new Sound(audioUrl, null, (error) => {
      if (error) {
        console.error('Failed to load sound', error);
        reject(error);
        return;
      }
      sound.play((success) => {
        sound.release();
        if (success) {
          resolve();
        } else {
          reject(new Error('Playback failed'));
        }
      });
    });
  });
};

// Record user pronunciation
export const recordPronunciation = async (duration = 5000) => {
  return new Promise(async (resolve, reject) => {
    try {
      const uri = await audioRecorder.startRecorder();
      
      // Stop recording after specified duration
      setTimeout(async () => {
        try {
          const result = await audioRecorder.stopRecorder();
          resolve(result);
        } catch (stopError) {
          reject(stopError);
        }
      }, duration);
    } catch (error) {
      reject(error);
    }
  });
};

export default {
  initAudio,
  playPronunciation,
  recordPronunciation,
};