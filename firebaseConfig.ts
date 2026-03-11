// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCBa5YQ3oTaNIJl3co6Wcl9-Lo07ARBMiY",
  authDomain: "lucidify-playground.firebaseapp.com",
  projectId: "lucidify-playground",
  storageBucket: "lucidify-playground.firebasestorage.app",
  messagingSenderId: "646276606956",
  appId: "1:646276606956:web:1915a9443e1195b937aec9",
  measurementId: "G-CGYEJ51JDB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const analytics = getAnalytics(app)

export { app, db, auth, googleProvider };