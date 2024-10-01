import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCSfkienvj4QGePEcv_zS4v4fT02c3EzGo",
  authDomain: "translation-app-4e215.firebaseapp.com",
  projectId: "translation-app-4e215",
  storageBucket: "translation-app-4e215.appspot.com",
  messagingSenderId: "914573587223",
  appId: "1:914573587223:web:5d101dd2fd78804cfe7d52"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
