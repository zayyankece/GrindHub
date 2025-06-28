import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './screens/loginScreens/LoginScreen';
import HomePage from './screens/homepageScreens/HomePage'; 
import SignUp from './screens/loginScreens/SignUp';
import ConfirmationSignUp from './screens/loginScreens/ConfirmationSignUp';
import ForgotPassword from './screens/loginScreens/ForgotPassword';
import ConfirmationForgotPassword from './screens/loginScreens/ConfirmationForgotPassword';
import ChangePassword from './screens/loginScreens/ChangePassword';
import UserProfile from './screens/homepageScreens/UserProfile';
import GroupChat from './screens/homepageScreens/groupChat/GroupChat';
import ChatScreen from './screens/homepageScreens/groupChat/ChatScreen';
import GroupDescription from './screens/homepageScreens/groupChat/GroupDescription';
import Timetable from './screens/homepageScreens/Timetable';
import AddingAssingment from './screens/assignmentTracker/addingAssignment';
import EditAssignment from './screens/assignmentTracker/editAssignment';
import AssignmentTracker from './screens/assignmentTracker/trackerPage';
import StudyTargetReport from './screens/studyTarget/reportPage';
import SelectingModule from './screens/studyTarget/selectingModule';
import TimerPage from './screens/studyTimer/timerPage';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginScreen"
      screenOptions={{headerShown : false}}>

        <Stack.Screen name="Timetable" component={Timetable}/>
        <Stack.Screen name="ChatScreen" component={ChatScreen}/>
        <Stack.Screen name="GroupDescription" component={GroupDescription}/>
        <Stack.Screen name="GroupChat" component={GroupChat} />
        <Stack.Screen name="UserProfile" component={UserProfile}/>
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUp}/>
        <Stack.Screen name="ConfirmationSignUp" component={ConfirmationSignUp}/>
        <Stack.Screen name="ForgotPassword" component={ForgotPassword}/>
        <Stack.Screen name="ConfirmationForgotPassword" component={ConfirmationForgotPassword}/>
        <Stack.Screen name="ChangePassword" component={ChangePassword}/>
        <Stack.Screen name="HomePage" component={HomePage} />
        <Stack.Screen name="AddingAssignment" component={AddingAssingment} />
        <Stack.Screen name="EditAssignment" component={EditAssignment} />
        <Stack.Screen name="AssignmentTracker" component={AssignmentTracker} />
        <Stack.Screen name="StudyTargetReport" component={StudyTargetReport} />
        <Stack.Screen name="SelectingModule" component={SelectingModule} />
        <Stack.Screen name="TimerPage" component={TimerPage} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
