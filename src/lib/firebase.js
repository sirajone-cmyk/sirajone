import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCfRI0lRBzvLqCkxkZthJX5YD2jrkVIl4M",
  authDomain: "sirajone-786.firebaseapp.com",
  projectId: "sirajone-786",
  storageBucket: "sirajone-786.firebasestorage.app",
  messagingSenderId: "199599547369",
  appId: "1:199599547369:web:d24a5925bc5598c22be178",
  measurementId: "G-M8CSELPEZF"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
