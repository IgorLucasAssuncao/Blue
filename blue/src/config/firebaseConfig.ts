// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// TODO: Add your Firebase configuration here
// You can find this in your Firebase Console > Project Settings > General > Your apps
const firebaseConfig = {
	apiKey: "AIzaSyCb2vGaydqA1zKw4uJTbmB-CSdWR3wIYc8",
	authDomain: "blue-e66f7.firebaseapp.com",
	projectId: "blue-e66f7",
	storageBucket: "blue-e66f7.firebasestorage.app",
	messagingSenderId: "423183778364",
	appId: "1:423183778364:web:c5fc57368501615f90b939"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
