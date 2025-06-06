import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const db = getFirestore(app);

export { db };