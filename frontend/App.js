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
import CreateGroup from './screens/homepageScreens/groupChat/CreateGroup';
import JoinGroup from './screens/homepageScreens/groupChat/JoinGroup';

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
        <Stack.Screen name="CreateGroup" component={CreateGroup}/>
        <Stack.Screen name="JoinGroup" component={JoinGroup}/>
        

      </Stack.Navigator>
    </NavigationContainer>
  );
}
