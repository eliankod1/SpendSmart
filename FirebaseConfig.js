// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD2NBOmv7o6qHTt5ZFynNARhqaXDmavhG8",
  authDomain: "spendsmart-3cbe9.firebaseapp.com",
  projectId: "spendsmart-3cbe9",
  storageBucket: "spendsmart-3cbe9.appspot.com",
  messagingSenderId: "971499583748",
  appId: "1:971499583748:web:635b23e43f0487fcbbf851"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);