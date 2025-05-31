import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './screens/LoginScreen';
import HomePage from './screens/HomePage'; 
import SignUp from './screens/SignUp';
import ConfirmationSignUp from './screens/ConfirmationSignUp';
import ForgotPassword from './screens/ForgotPassword';
import ConfirmationForgotPassword from './screens/ConfirmationForgotPassword';
import ChangePassword from './screens/ChangePassword';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginScreen"
      screenOptions={{headerShown : false}}>

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
