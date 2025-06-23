import { initializeApp } from 'firebase/app';
import {
    createUserWithEmailAndPassword,
    signOut as firebaseSignOut,
    getAuth,
    signInWithEmailAndPassword
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDx3DEy6_A9U10KnJD3lKelG8kp54c09IU",
  authDomain: "internfinder-new.firebaseapp.com",
  projectId: "internfinder-new",
  storageBucket: "internfinder-new.firebasestorage.app",
  messagingSenderId: "1018216159829",
  appId: "1:1018216159829:web:78e672e8af123ea70012dc",
  measurementId: "G-8VW5XFLKRN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth for web
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Get Firestore instance - function expected by components
export const getFirebaseDb = () => {
  return db;
};

// Auth utility functions
export const signInWithEmailPassword = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const signUpWithEmailPassword = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error: any) {
    throw new Error(error.message);
  }
}; 