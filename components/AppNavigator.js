import React, { useEffect, useContext, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthContext, AuthContextProvider, useAuth } from '../context/authContext';

import LogInScreen from './screens/LogInScreen';
import SignUpScreen from './screens/SignUpScreen';
import ProfileScreen from './screens/ProfileScreen';
import CustomizeScreen from './screens/CustomizeScreen';
import InviteFriends from './invite/InviteFriends';
/* import StartPage from './screens'; */
import HomeScreen from './screens/HomeScreen';




const Stack = createStackNavigator();

const AppNavigator = () => {
  const { isAuthenticated } = useAuth();
  const navigationRef = useRef();

  useEffect(() => {
    if (typeof isAuthenticated === 'undefined') return;

    // Handle navigation based on authentication status
    if (isAuthenticated) {
      // If authenticated, ensure user is on a protected route
      if (navigationRef.current && navigationRef.current.getCurrentRoute().name !== 'Profile') {
        navigationRef.current.reset({
          index: 0,
          routes: [{ name: 'Profile' }],
        });
      }
    } else {
      // If not authenticated, redirect to sign-in
      if (navigationRef.current && navigationRef.current.getCurrentRoute().name !== 'Login') {
        navigationRef.current.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      }
    }
  }, [isAuthenticated]);

  return (
    <Stack.Navigator initialRouteName="Login">
        
     {/*  <Stack.Screen name="index" component={StartPage} options={{ headerShown: false }} /> */}
      <Stack.Screen name="Login" component={LogInScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Signup" component={SignUpScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Customize" component={CustomizeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Invite" component={InviteFriends} options={{ headerShown: false }} />
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      
    </Stack.Navigator>
  );
};

export default function RootNavigator() {
  return (
    <AuthContextProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthContextProvider>
  );
}
