import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider, AuthContext } from './screens/AuthContext'; // Adjust path
import ErrorBoundary from './ErrorBoundary';

import AuthStack from './screens/AuthStack';
import AppStack from './screens/AppStack';

export default function App() {
  console.log('App opened');
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </ErrorBoundary>
  );
}

function AppNavigator() {
  const { userToken, isLoading } = React.useContext(AuthContext);

  if (isLoading) {
    // AuthContext handles its own loading spinner internally for initial load.
    // If you need a custom one here, you can add it.
    return null; // AuthContext's provider will render the spinner
  }

  return (
    <NavigationContainer>
      {userToken == null ? <AuthStack /> : <AppStack />}
    </NavigationContainer>
  );
}