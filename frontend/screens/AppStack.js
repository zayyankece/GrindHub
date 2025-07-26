import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeTabNavigator from './HomeTabNavigator';

const App = createNativeStackNavigator();

const AppStack = () => {
  return (
    <App.Navigator screenOptions={{ headerShown: false }}>
      {/* This is the single entry point for your tabbed home section */}
      <App.Screen name="MainTabs" component={HomeTabNavigator} />

      {/* Only add other screens here if they should *not* have the tab bar visible
          and are not part of any tab's internal stack. */}
    </App.Navigator>
  );
};

export default AppStack;