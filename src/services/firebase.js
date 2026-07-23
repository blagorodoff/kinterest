import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC67o1Vpv8lwFjOD3_lgzuOxPtchYC5ugs",
  authDomain: "kinterest-a75bd.firebaseapp.com",
  projectId: "kinterest-a75bd",
  storageBucket: "kinterest-a75bd.firebasestorage.app",
  messagingSenderId: "563648765018",
  appId: "1:563648765018:web:a94ab362a499ffff418c63"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);