import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './loginScreens/LoginScreen';
import SignUp from './loginScreens/SignUp';
import ConfirmationSignUp from './loginScreens/ConfirmationSignUp';
import ForgotPassword from './loginScreens/ForgotPassword';
import ConfirmationForgotPassword from './loginScreens/ConfirmationForgotPassword';
import ChangePassword from './loginScreens/ChangePassword';

const Auth = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Auth.Navigator screenOptions={{ headerShown: false }}>
      <Auth.Screen name="LoginScreen" component={LoginScreen} />
      <Auth.Screen name="SignUp" component={SignUp} />
      <Auth.Screen name="ConfirmationSignUp" component={ConfirmationSignUp} />
      <Auth.Screen name="ForgotPassword" component={ForgotPassword} />
      <Auth.Screen name="ConfirmationForgotPassword" component={ConfirmationForgotPassword} />
      <Auth.Screen name="ChangePassword" component={ChangePassword} />
    </Auth.Navigator>
  );
};

export default AuthStack;