import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { initDatabase } from './services/initDatabase';

// Screens
import HomeScreen from './screens/HomeScreen';
import VocabularyScreen from './screens/VocabularyScreen';
import PracticeScreen from './screens/PracticeScreen';
import SettingsScreen from './screens/SettingsScreen';
import WordDetailScreen from './screens/WordDetailScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="WordDetail" 
        component={WordDetailScreen} 
        options={{ title: '单词详情' }}
      />
    </Stack.Navigator>
  );
}

function App() {
  // Initialize database on app startup
  useEffect(() => {
    initDatabase();
  }, []);

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Home') {
              iconName = 'home';
            } else if (route.name === 'Vocabulary') {
              iconName = 'book';
            } else if (route.name === 'Practice') {
              iconName = 'quiz';
            } else if (route.name === 'Settings') {
              iconName = 'settings';
            }
            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen 
          name="Home" 
          component={HomeStack} 
          options={{ title: '首页' }}
        />
        <Tab.Screen 
          name="Vocabulary" 
          component={VocabularyScreen} 
          options={{ title: '词汇库' }}
        />
        <Tab.Screen 
          name="Practice" 
          component={PracticeScreen} 
          options={{ title: '练习' }}
        />
        <Tab.Screen 
          name="Settings" 
          component={SettingsScreen} 
          options={{ title: '设置' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;