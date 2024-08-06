
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { collection, getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


const firebaseConfig = {
  apiKey: "AIzaSyCc8r_OoGN4pPiHagPDRrJaCERnpKyott0",
  authDomain: "history-hunt1.firebaseapp.com",
  projectId: "history-hunt1",
  storageBucket: "history-hunt1.appspot.com",
  messagingSenderId: "573147574767",
  appId: "1:573147574767:web:3f41cf39a8f9ff9f4ec61a",
  measurementId: "G-Y4N3NK0SVK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
});

export const db = getFirestore(app);
export const storage = getStorage(app);

export const usersRef = collection(db, 'users');
export const huntsRef = collection(db, 'hunts');
