import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator
} from 'react-native';
import Sound from 'react-native-sound';

// 配置Sound
Sound.setCategory('Playback');

const AudioPlayer = ({ audioPath, word, onPlayComplete }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    return () => {
      // 清理音频资源
      if (Sound) {
        Sound.release();
      }
    };
  }, []);

  const playAudio = async () => {
    if (!audioPath) {
      Alert.alert('错误', '音频文件不存在');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 检查音频文件是否存在
      const sound = new Sound(audioPath, Sound.MAIN_BUNDLE, (error) => {
        if (error) {
          console.error('Failed to load sound', error);
          setError('无法加载音频文件');
          setIsLoading(false);
          return;
        }

        setIsPlaying(true);
        sound.play((success) => {
          setIsPlaying(false);
          setIsLoading(false);
          
          if (success) {
            if (onPlayComplete) {
              onPlayComplete();
            }
          } else {
            setError('播放失败');
          }
          
          // 释放音频资源
          sound.release();
        });
      });
    } catch (err) {
      console.error('Audio play error:', err);
      setError('播放出错');
      setIsLoading(false);
    }
  };

  const handlePress = () => {
    if (isPlaying) {
      // 如果正在播放，可以添加暂停功能
      // 目前简单处理为重新播放
      playAudio();
    } else {
      playAudio();
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, isPlaying && styles.playingButton]}
        onPress={handlePress}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#007AFF" />
        ) : (
          <Text style={styles.buttonText}>
            {isPlaying ? '🔊 播放中...' : `🔊 ${word || '发音'}`}
          </Text>
        )}
      </TouchableOpacity>
      
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    minWidth: 100,
    alignItems: 'center',
  },
  playingButton: {
    backgroundColor: '#0056b3',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
});

export default AudioPlayer;