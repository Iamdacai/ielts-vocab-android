import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert
} from 'react-native';

const SettingsScreen = () => {
  const [dailyNewWords, setDailyNewWords] = useState(20);
  const [reviewTime, setReviewTime] = useState('20:00');
  const [learningDays, setLearningDays] = useState([1,2,3,4,5,6,7]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleSaveSettings = () => {
    // TODO: Save settings to local storage
    Alert.alert('设置已保存', '学习设置已成功保存');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>学习设置</Text>
        
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>每日新词数量</Text>
          <Text style={styles.settingValue}>{dailyNewWords} 个</Text>
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>复习时间</Text>
          <Text style={styles.settingValue}>{reviewTime}</Text>
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>学习天数</Text>
          <Text style={styles.settingValue}>每天</Text>
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>通知提醒</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={notificationsEnabled ? '#007AFF' : '#f4f3f4'}
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSaveSettings}>
          <Text style={styles.saveButtonText}>保存设置</Text>
        </TouchableOpacity>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
  },
  settingValue: {
    fontSize: 16,
    color: '#666',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    marginTop: 30,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SettingsScreen;