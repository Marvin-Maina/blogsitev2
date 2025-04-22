// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBzd0mBIcgjGdQiMK9HLOEhsiPhxace89M",
  authDomain: "blogsite-49bd8.firebaseapp.com",
  projectId: "blogsite-49bd8",
  storageBucket: "blogsite-49bd8.firebasestorage.app",
  messagingSenderId: "382843040849",
  appId: "1:382843040849:web:e4d2814339cd0979e8b470",
  measurementId: "G-XT4WC48SSC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);