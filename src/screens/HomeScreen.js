import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>雅思智能背单词</Text>
        <Text style={styles.subtitle}>IELTS Vocabulary Master</Text>
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