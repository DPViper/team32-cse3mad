import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyDLsUDtju-RfQAPQ2c_2WggLpLU0DpeIyw",
    authDomain: "team32-cse3mad-73398.firebaseapp.com",
    projectId: "team32-cse3mad-73398",
    storageBucket: "team32-cse3mad-73398.firebasestorage.app",
    messagingSenderId: "811335863494",
    appId: "1:811335863494:web:f574f7f4b5d43fe4cc1bc7",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
// export const storage = getMessaging(app);

