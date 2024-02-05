// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDSXXdVbYDC7snxBRcD7IWOZgM329wBr8o",
  authDomain: "hokuwebdev.firebaseapp.com",
  projectId: "hokuwebdev",
  storageBucket: "hokuwebdev.appspot.com",
  messagingSenderId: "342794218020",
  appId: "1:342794218020:web:77e323817a776af602c6b1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const db = getFirestore(app);

