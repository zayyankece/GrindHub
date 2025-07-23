import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeTabNavigator from './HomeTabNavigator';

// REMOVE these imports from AppStack.js if they are now within HomeTabNavigator's stacks
// import GroupChat from './homepageScreens/groupChat/GroupChat';
// import ChatScreen from './homepageScreens/groupChat/ChatScreen';
// import GroupDescription from './homepageScreens/groupChat/GroupDescription';
// import CreateGroup from './homepageScreens/groupChat/CreateGroup';
// import JoinGroup from './homepageScreens/groupChat/JoinGroup';

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