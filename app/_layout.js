import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { Slot, useSegments, useRouter } from 'expo-router';
/* import { SessionProvider } from '../ctx'; */
import { AuthContextProvider, useAuth } from '../context/authContext';



const MainLayout = () => {
    const {isAuthenticated} = useAuth();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        if (typeof isAuthenticated == 'undefined') return;
        const inApp = segments[0] == '(app)';
        if( isAuthenticated && !inApp) {
//redirect to home
router.replace('profile');
        } else if (isAuthenticated == false){
//redirect to signIn
router.replace('signIn');
        }

    }), [isAuthenticated]

    return <Slot/>
}
export default function RootLayout() {
  // Set up the auth context and render our layout inside of it.

  return (
    <AuthContextProvider>
        <MainLayout/>
    </AuthContextProvider>
  );
}
