/**
 * 雅思智能背单词 - Android版本入口文件
 * 基于微信小程序版本重构
 */

import React from 'react';
import { AppRegistry } from 'react-native';
import AppNavigator from './src/AppNavigator';

const App = () => {
  return <AppNavigator />;
};

AppRegistry.registerComponent('ielts-vocab-android', () => App);