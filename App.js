import React from 'react';
import { LogBox } from 'react-native';
import RootNavigator from './components/AppNavigator'; 
import { AuthContextProvider } from './context/authContext';



export default function App() {
  return (
    <AuthContextProvider>
      <RootNavigator />
    </AuthContextProvider>
  );
}


