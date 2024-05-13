import { inicializeApp, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyBgiY2MBS6MqRN3hR9vk41TjeCALO_8Zno",
    authDomain: "app-toodo.firebaseapp.com",
    projectId: "app-toodo",
    storageBucket: "app-toodo.appspot.com",
    messagingSenderId: "273904626570",
    appId: "1:273904626570:web:6ed5e782bd0238830f3673"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app)
export { db, auth };
