import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Screens
import HomeScreen from '../screens/HomeScreen';
import VocabularyScreen from '../screens/VocabularyScreen';
import PronunciationScreen from '../screens/PronunciationScreen';
import SettingsScreen from '../screens/SettingsScreen';
import WordDetailScreen from '../screens/WordDetailScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HomeStack = () => {
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
};

const AppNavigator = () => {
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
            } else if (route.name === 'Pronunciation') {
              iconName = 'mic';
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
          options={{ title: '词汇' }}
        />
        <Tab.Screen 
          name="Pronunciation" 
          component={PronunciationScreen} 
          options={{ title: '发音' }}
        />
        <Tab.Screen 
          name="Settings" 
          component={SettingsScreen} 
          options={{ title: '设置' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;