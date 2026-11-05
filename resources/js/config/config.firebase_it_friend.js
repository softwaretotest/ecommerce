import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyB7IwaRV2rqCjuq9e6oNx3P7EMDEtLgJlU",
    authDomain: "products-a27b8.firebaseapp.com",
    projectId: "products-a27b8",
    storageBucket: "products-a27b8.firebasestorage.app",
    messagingSenderId: "617179695424",
    appId: "1:617179695424:web:e8eef17e1f7c0efc6352a5",
    measurementId: "G-QKYXY7BVE0",
};

export const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
