// src/lib/firebase.ts
// Make sure your .env file has variables prefixed with VITE_
// VITE_FIREBASE_API_KEY=YOUR_API_KEY
// VITE_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
// VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
// VITE_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
// VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID
// VITE_FIREBASE_APP_ID=YOUR_APP_ID
// VITE_FIREBASE_MEASUREMENT_ID=YOUR_MEASUREMENT_ID (optional)

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// import { getAuth } from "firebase/auth"; // If you need auth later

// Access environment variables using import.meta.env
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// Initialize Firestore
const db = getFirestore(app);

// Initialize Auth (if needed)
// const auth = getAuth(app);

export { db }; // Export Firestore instance
// export { db, auth }; // Export both if using auth
