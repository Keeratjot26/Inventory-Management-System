// lib/firebase.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// ✅ Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyD9-ILrxps9gHYHRxRFCfKxGLI1gNfVOQQ",
  authDomain: "optistocks-5b78f.firebaseapp.com",
  projectId: "optistocks-5b78f",
  storageBucket: "optistocks-5b78f.appspot.com", // fixed bucket
  messagingSenderId: "939673556921",
  appId: "1:939673556921:web:a5833a12841815b9210868",
  measurementId: "G-BV6DJG1F4J",
};

// ✅ Initialize app only once
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Auth
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Firestore
const db = getFirestore(app);

export { app, auth, googleProvider, db };