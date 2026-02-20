import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import { getLearningStats } from '../services/learningProgress';

const HomeScreen = ({ navigation }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const statsData = await getLearningStats();
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load stats:', error);
      Alert.alert('错误', '加载学习统计失败');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" style={styles.loading} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>雅思智能背单词</Text>
        <Text style={styles.subtitle}>IELTS Vocabulary Master</Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats?.totalWords || 0}</Text>
            <Text style={styles.statLabel}>总词汇</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats?.masteredWords || 0}</Text>
            <Text style={styles.statLabel}>已掌握</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats?.learningWords || 0}</Text>
            <Text style={styles.statLabel}>学习中</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.content}>
        <TouchableOpacity 
          style={styles.card}
          onPress={() => navigation.navigate('Vocabulary')}
        >
          <Text style={styles.cardTitle}>📚 新词学习</Text>
          <Text style={styles.cardSubtitle}>开始今日学习计划</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.card}
          onPress={() => navigation.navigate('Review')}
        >
          <Text style={styles.cardTitle}>🔄 复习单词</Text>
          <Text style={styles.cardSubtitle}>巩固已学词汇</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.card}
          onPress={() => navigation.navigate('Pronunciation')}
        >
          <Text style={styles.cardTitle}>🎤 发音练习</Text>
          <Text style={styles.cardSubtitle}>提升口语发音</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.card}
          onPress={() => navigation.navigate('Settings')}
        >
          <Text style={styles.cardTitle}>⚙️ 学习设置</Text>
          <Text style={styles.cardSubtitle}>个性化学习计划</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    backgroundColor: '#4a90e2',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
    marginBottom: 15,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 10,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'white',
    opacity: 0.9,
  },
  content: {
    padding: 20,
  },
  card: {
    backgroundColor: 'white',
    padding: 20,
    marginVertical: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
  },
});

export default HomeScreen;