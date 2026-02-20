import React, { useEffect } from 'react';
import { SafeAreaView, StatusBar, LogBox } from 'react-native';
import AppNavigator from './navigation/AppNavigator';
import { initDatabase } from './services/initDatabase';
import PronunciationService from './services/pronunciation';

// Ignore specific warnings that are not critical
LogBox.ignoreLogs([
  'AsyncStorage has been extracted from react-native core',
  'Warning: componentWillMount is deprecated',
  'Warning: componentWillReceiveProps is deprecated',
]);

const App = () => {
  useEffect(() => {
    // Initialize database on app startup
    initDatabase().catch(console.error);
    
    // Initialize pronunciation service
    PronunciationService.initialize().catch(console.error);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <AppNavigator />
    </SafeAreaView>
  );
};

export default App;