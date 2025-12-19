import { initializeApp } from "firebase/app";
import {
  FacebookAuthProvider,
  getAuth,
  GoogleAuthProvider,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API,
  authDomain: "mern-stories-1d6c9.firebaseapp.com",
  projectId: "mern-stories-1d6c9",
  storageBucket: "mern-stories-1d6c9.firebasestorage.app",
  messagingSenderId: "86723329558",
  appId: "1:86723329558:web:83b20ed9e823a6705a7f37",
  measurementId: "G-YYBX38TPY8",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
export { auth, googleProvider, facebookProvider };
