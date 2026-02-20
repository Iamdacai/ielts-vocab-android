import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import learningProgressService from '../services/learningProgress';
import userConfigService from '../services/userConfig';

const LearningProgressScreen = () => {
  const navigation = useNavigation();
  const [progress, setProgress] = useState(null);
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const progressData = await learningProgressService.getLearningStats();
        const configData = await userConfigService.getConfig();
        
        setProgress(progressData);
        setConfig(configData);
      } catch (error) {
        console.error('Failed to load progress:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProgress();
  }, []);

  const handleStartNewWords = () => {
    navigation.navigate('Vocabulary', { filter: 'new' });
  };

  const handleStartReview = () => {
    navigation.navigate('Vocabulary', { filter: 'review' });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>学习统计</Text>
          
          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{progress?.totalWords || 0}</Text>
              <Text style={styles.statLabel}>总词汇</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{progress?.masteredWords || 0}</Text>
              <Text style={styles.statLabel}>已掌握</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{progress?.learningWords || 0}</Text>
              <Text style={styles.statLabel}>学习中</Text>
            </View>
          </View>
          
          <View style={styles.progressInfo}>
            <Text style={styles.progressLabel}>平均掌握度</Text>
            <Text style={styles.progressValue}>{progress?.averageMasteryScore || 0}%</Text>
          </View>
        </View>

        <View style={styles.configContainer}>
          <Text style={styles.sectionTitle}>学习计划</Text>
          
          <View style={styles.configRow}>
            <Text style={styles.configLabel}>每日新词数量</Text>
            <Text style={styles.configValue}>{config?.dailyNewWordsCount || 20} 个</Text>
          </View>
          
          <View style={styles.configRow}>
            <Text style={styles.configLabel}>复习时间</Text>
            <Text style={styles.configValue}>{config?.reviewTime || '20:00'}</Text>
          </View>
          
          <View style={styles.configRow}>
            <Text style={styles.configLabel}>学习天数</Text>
            <Text style={styles.configValue}>
              {config?.weeklyNewWordsDays ? 
                `${config.weeklyNewWordsDays.length} 天/周` : '每天'}
            </Text>
          </View>
        </View>

        <View style={styles.actionContainer}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.newWordsButton]}
            onPress={handleStartNewWords}
          >
            <Text style={styles.actionButtonText}>📚 学习新词</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.reviewButton]}
            onPress={handleStartReview}
          >
            <Text style={styles.actionButtonText}>🔄 复习单词</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  statsContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 16,
    color: '#333',
  },
  progressValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  configContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  configRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  configLabel: {
    fontSize: 16,
    color: '#333',
  },
  configValue: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  actionContainer: {
    marginTop: 20,
  },
  actionButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  newWordsButton: {
    backgroundColor: '#007AFF',
  },
  reviewButton: {
    backgroundColor: '#34C759',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LearningProgressScreen;