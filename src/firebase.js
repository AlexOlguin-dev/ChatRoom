import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue } from 'firebase/database';

// Configuración de Firebase (con las credenciales que copiaste)
const firebaseConfig = {
  apiKey: "AIzaSyBjf1cw1_GIqshoOFB4LV68xY4Ydh4KrbE",
  authDomain: "chatroomalex-5432e.firebaseapp.com",
  databaseURL: "https://chatroomalex-5432e-default-rtdb.firebaseio.com",
  projectId: "chatroomalex-5432e",
  storageBucket: "chatroomalex-5432e.firebasestorage.app",
  messagingSenderId: "998288325457",
  appId: "1:998288325457:web:61cc17ac30b88641f5b170",
  measurementId: "G-TC3Q3S3FKY"
};

// Inicialización de Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db, ref, set, onValue };
