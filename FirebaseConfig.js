import { initializeApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyD2NBOmv7o6qHTt5ZFynNARhqaXDmavhG8",
  authDomain: "spendsmart-3cbe9.firebaseapp.com",
  projectId: "spendsmart-3cbe9",
  storageBucket: "spendsmart-3cbe9.appspot.com",
  messagingSenderId: "971499583748",
  appId: "1:971499583748:web:635b23e43f0487fcbbf851",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with AsyncStorage
export const FIREBASE_AUTH = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export const FIREBASE_DB = getFirestore(app);
