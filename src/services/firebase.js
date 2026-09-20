// Official Firebase Initialization Bridge
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

// Connected to user's Firebase project: d-boss-bb3e9
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBayA4Wr8RDfUfxQCwdknABdPed21Fu2fA",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "d-boss-bb3e9.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "d-boss-bb3e9",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "d-boss-bb3e9.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "780520765671",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:780520765671:web:b9f1f4b370018b9eac8a42",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-WDJP2W1KBG"
};

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Analytics conditionally (safely handles environments where analytics is not supported)
export let analytics = null;
if (typeof window !== "undefined") {
  isSupported().then((yes) => {
    if (yes) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {
    // Analytics initialization silent fallback
  });
}
