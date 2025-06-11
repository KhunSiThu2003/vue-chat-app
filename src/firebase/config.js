import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDFP1aewXVGKjSddFBA9qeZsAXcoW5zGAI",
  authDomain: "chatting-ac4aa.firebaseapp.com",
  projectId: "chatting-ac4aa",
  storageBucket: "chatting-ac4aa.firebasestorage.app",
  messagingSenderId: "723200732929",
  appId: "1:723200732929:web:f2ff13d6be5d65a5b9b500"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); 