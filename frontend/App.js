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
import UserProfile from './screens/homepageScreens/userProfile';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginScreen"
      screenOptions={{headerShown : false}}>

        <Stack.Screen name="UserProfile" component={UserProfile}/>
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUp}/>
        <Stack.Screen name="ConfirmationSignUp" component={ConfirmationSignUp}/>
        <Stack.Screen name="ForgotPassword" component={ForgotPassword}/>
        <Stack.Screen name="ConfirmationForgotPassword" component={ConfirmationForgotPassword}/>
        <Stack.Screen name="ChangePassword" component={ChangePassword}/>
        <Stack.Screen name="HomePage" component={HomePage} />
        

      </Stack.Navigator>
    </NavigationContainer>
  );
}
