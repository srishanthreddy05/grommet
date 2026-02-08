import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyB8ms2shEg2SUPE63tSKWmtazlnizCqykw",
  authDomain: "grommetxn.firebaseapp.com",
  databaseURL: "https://grommetxn-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "grommetxn",
  storageBucket: "grommetxn.firebasestorage.app",
  messagingSenderId: "962590269970",
  appId: "1:962590269970:web:16f81ff112daf4d60feecb"
};

// Initialize Firebase (singleton pattern)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const database = getDatabase(app);

export { app, auth, database };
