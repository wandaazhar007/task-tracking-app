// src/utils/firebase.ts
/*
Author: Wanda Azhar
Location: Twin Falls, ID. USA
Contact: wandaazhar@gmail.com
Description: Firebase configuration and initialization for the Task Tracking App.
*/

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// IMPORTANT: Replace these with your actual Firebase project credentials
const firebaseConfig = {
  apiKey: "AIzaSyD-jkusQP8Z27zYp-bxE-76XaBNlY9M0WY",
  authDomain: "task-tracking-app-9ec40.firebaseapp.com",
  projectId: "task-tracking-app-9ec40",
  storageBucket: "task-tracking-app-9ec40.firebasestorage.app",
  messagingSenderId: "659120951358",
  appId: "1:659120951358:web:8d9b391cefc3f2d89c016f",
  measurementId: "G-LVSTPCC2FK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export { db };
