import React, { createContext, useState, useEffect, useMemo, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'; // You'll need to install this: `npx expo install @react-native-async-storage/async-storage` or `npm install @react-native-async-storage/async-storage`
import { View, ActivityIndicator } from 'react-native';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('userToken');
        if (storedToken) {
          setUserToken(storedToken);
        }
      } catch (e) {
        console.error('Failed to load token from AsyncStorage', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadToken();
  }, []);

  const authContext = useMemo(
    () => ({
      signIn: async (token) => {
        setIsLoading(true); // Maybe re-show loading
        await AsyncStorage.setItem('userToken', token);
        setUserToken(token);
        setIsLoading(false);
      },
      signOut: async () => {
        setIsLoading(true); // Maybe re-show loading
        await AsyncStorage.removeItem('userToken');
        setUserToken(null);
        setIsLoading(false);
      },
      userToken,
      isLoading,
    }),
    [userToken, isLoading]
  );

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={authContext}>
      {children}
    </AuthContext.Provider>
  );
};