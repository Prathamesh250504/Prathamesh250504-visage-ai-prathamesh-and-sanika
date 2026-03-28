// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDwDxRRsNn8IrsHnnTDhcBgomj6MEmiNVk",
    authDomain: "visage-ai-b76a8.firebaseapp.com",
    projectId: "visage-ai-b76a8",
    storageBucket: "visage-ai-b76a8.firebasestorage.app",
    messagingSenderId: "81666301494",
    appId: "1:81666301494:web:d296854bac1e7118280297",
    measurementId: "G-LNTQTRFZVG"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
