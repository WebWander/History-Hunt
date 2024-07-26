// Import the necessary functions from the Firebase SDK
import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";
// import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDRtVEqZBn7pIz3ri6Ka5PFOn-r-E_5cU0",
  authDomain: "history-hunt-a504a.firebaseapp.com",
  projectId: "history-hunt-a504a",
  storageBucket: "history-hunt-a504a.appspot.com",
  messagingSenderId: "682418365462",
  appId: "1:682418365462:web:a7e0088acfadd43a8cc137"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a reference to the Auth service
// const auth = initializeAuth(app, {
//   persistence: getReactNativePersistence(AsyncStorage)
// });

export const auth = getAuth(app);
