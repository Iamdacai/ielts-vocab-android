/**
 * 应用导航器
 * 管理应用的页面路由
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WordLearningScreen from './WordLearningScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="WordLearning">
        <Stack.Screen 
          name="WordLearning" 
          component={WordLearningScreen}
          options={{ title: '雅思背单词' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;