import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, browserLocalPersistence, setPersistence } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD3bWxidID9NovC4RIQxUI4fKOqAql2K58",
  authDomain: "medyourprofiles.firebaseapp.com",
  projectId: "medyourprofiles",
  storageBucket: "medyourprofiles.firebasestorage.app",
  messagingSenderId: "250236138150",
  appId: "1:250236138150:web:10619e4a0c0b2aeb75ba67",
  measurementId: "G-GE3RRV3WCM",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
// حافظ على الجلسة في المتصفح
setPersistence(auth, browserLocalPersistence);
