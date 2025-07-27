import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

// Import all screens that will be directly accessible via a tab
import HomePage from './homepageScreens/HomePage';
import Timetable from './homepageScreens/Timetable';

import AddingClass from './homepageScreens/components/AddingClass'; // Part of TimetableTab's stack
import AddingModule from './homepageScreens/components/AddingModule'; // Part of TimetableTab's stack

import TimerPage from './homepageScreens/studyTimer/TimerPage';
import ReportPage from './homepageScreens/studyTarget/ReportPage'; // This contains SelectingModule

// Import all screens that will be part of the GroupChat tab's internal stack
import GroupChat from './homepageScreens/groupChat/GroupChat';
import ChatScreen from './homepageScreens/groupChat/ChatScreen';
import GroupDescription from './homepageScreens/groupChat/GroupDescription';
import CreateGroup from './homepageScreens/groupChat/CreateGroup';
import JoinGroup from './homepageScreens/groupChat/JoinGroup';

// Import other nested screens that belong to specific tab stacks
import UserProfile from './homepageScreens/UserProfile'; // Part of HomeTab's stack
import AddingAssignment from './homepageScreens/assignmentTracker/AddingAssignment'; // Part of TrackerTab's stack
import EditAssignment from './homepageScreens/assignmentTracker/EditAssignment';       // Part of TrackerTab's stack
import TrackerPage from './homepageScreens/assignmentTracker/TrackerPage'; // Part of TrackerTab's stack if not a direct tab
import SelectingModule from './homepageScreens/studyTarget/SelectingModule'; // Part of ReportTab's stack


const Tab = createBottomTabNavigator();

// --- Define individual Stack Navigators for each tab ---

const HomeStack = createNativeStackNavigator();
function HomeStackScreens() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomePageContent" component={HomePage} />
      <HomeStack.Screen name="UserProfile" component={UserProfile} />
      <HomeStack.Screen name="AddingClass" component={AddingClass} />
      <HomeStack.Screen name="AddingModule" component={AddingModule} />
      <HomeStack.Screen name="AddingAssignment" component={AddingAssignment} />
      <HomeStack.Screen name="TrackerPage" component={TrackerPage} />
    </HomeStack.Navigator>
  );
}

const GroupChatStack = createNativeStackNavigator();
function GroupChatStackScreens() {
  return (
    <GroupChatStack.Navigator screenOptions={{ headerShown: false }}>
      <GroupChatStack.Screen name="GroupChat" component={GroupChat} />
      <GroupChatStack.Screen name="ChatScreen" component={ChatScreen} />
      <GroupChatStack.Screen name="GroupDescription" component={GroupDescription} />
      <GroupChatStack.Screen name="CreateGroup" component={CreateGroup} />
      <GroupChatStack.Screen name="JoinGroup" component={JoinGroup} />
      <GroupChatStack.Screen name="UserProfile" component={UserProfile} />
    </GroupChatStack.Navigator>
  );
}

const TimetableStack = createNativeStackNavigator();
function TimetableStackScreens() {
  return (
    <TimetableStack.Navigator screenOptions={{ headerShown: false }}>
      <TimetableStack.Screen name="TimetableContent" component={Timetable} />
      <TimetableStack.Screen name="UserProfile" component={UserProfile} />
    </TimetableStack.Navigator>
  );
}

const TimerStack = createNativeStackNavigator();
function TimerStackScreens() {
  return (
    <TimerStack.Navigator screenOptions={{ headerShown: false }}>
      <TimerStack.Screen name="TimerPageContent" component={TimerPage} />
    </TimerStack.Navigator>
  );
}

const ReportStack = createNativeStackNavigator();
function ReportStackScreens() {
  return (
    <ReportStack.Navigator screenOptions={{ headerShown: false }}>
      <ReportStack.Screen name="SelectingModuleContent" component={SelectingModule} />
      <ReportStack.Screen name="ReportPage" component={ReportPage} />
      <ReportStack.Screen name="TrackerPage" component={TrackerPage} />
      <ReportStack.Screen name="AddingAssignment" component={AddingAssignment} />
      <ReportStack.Screen name="EditAssignment" component={EditAssignment} />
    </ReportStack.Navigator>
  );
}

// NOTE: If TrackerPage needs its own tab, create TrackerStack and a TrackerStackScreens function.
// For now, assuming it's part of the Report/SelectingModule flow or accessed globally.


// --- Main HomeTabNavigator Component ---
const HomeTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'GroupChat') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'TimetableTab') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'TimerTab') {
            iconName = focused ? 'time' : 'time-outline';
          } else if (route.name === 'SelectingModuleTab') { // Now a dedicated tab for SelectingModule/Report
            iconName = focused ? 'bag' : 'bag-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FFD23F',
        tabBarInactiveTintColor: 'white',
        tabBarStyle: {
            backgroundColor: '#FF8400',
            paddingVertical: 12,
            height: 60,
        },
        tabBarHideOnKeyboard: true, // Hide tab bar when keyboard is open
        tabBarLabelStyle: {
            fontSize: 12,
        },
      })}
    >
      {/* Tab Screens in the desired order: HomePage, GroupChat, Timetable, TimerPage, SelectingModule */}
      <Tab.Screen
        name="HomeTab"
        component={HomeStackScreens}
        options={{ title: 'Home' }}
      />
      <Tab.Screen
        name="GroupChat"
        component={GroupChatStackScreens} // Now points to the new stack for GroupChat
        options={{ title: 'Chat' }}
      />
      <Tab.Screen
        name="TimetableTab"
        component={TimetableStackScreens}
        options={{ title: 'Timetable' }}
      />
      <Tab.Screen
        name="TimerTab"
        component={TimerStackScreens}
        options={{ title: 'Timer' }}
      />
      <Tab.Screen
        name="SelectingModuleTab" // This tab will open the ReportStack, with SelectingModule often being the entry
        component={ReportStackScreens} // Use the stack that contains ReportPage and SelectingModule
        options={{ title: 'Modules' }} // Adjust label as preferred
      />
    </Tab.Navigator>
  );
};

export default HomeTabNavigator;