import React from 'react';
/* import { LogBox } from 'react-native'; */
import RootNavigator from './components/AppNavigator'; 
import { AuthContextProvider } from './context/authContext';
import { PushNotificationProvider } from './components/PushNotificationsProvider';





export default function App() {
  return (
    <AuthContextProvider>
   <PushNotificationProvider>
    <RootNavigator/>
   </PushNotificationProvider>
  </AuthContextProvider>
  );
}


