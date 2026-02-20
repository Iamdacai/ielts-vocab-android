import React, { useEffect } from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import AppNavigator from './navigation/AppNavigator';
import { initDatabase } from './services/initDatabase';

const App = () => {
  useEffect(() => {
    // Initialize database on app startup
    initDatabase().catch(console.error);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <AppNavigator />
    </SafeAreaView>
  );
};

export default App;