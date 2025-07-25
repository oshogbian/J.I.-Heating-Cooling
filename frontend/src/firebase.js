// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "***********************************",
  authDomain: "********************************",
  projectId: "jiheatingcooling",
  storageBucket: "jiheatingcooling.appspot.com", // Fixed this line - should be .appspot.com not .firebasestorage.app
  messagingSenderId: "563963975459",
  appId: "1:563963975459:web:bd2e909aac48236d1d5e96",
  measurementId: "G-5165GSV8BZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
