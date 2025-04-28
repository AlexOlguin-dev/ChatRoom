import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue, onDisconnect } from 'firebase/database'; // Importar onDisconnect

// Tu configuración de Firebase (copiada directamente de la consola de Firebase)
const firebaseConfig = {
  apiKey: "AIzaSyBjf1cw1_GIqshoOFB4LV68xY4Ydh4KrbE",
  authDomain: "chatroomalex-5432e.firebaseapp.com",
  databaseURL: "https://chatroomalex-5432e-default-rtdb.firebaseio.com", // URL correcta para la base de datos
  projectId: "chatroomalex-5432e",
  storageBucket: "chatroomalex-5432e.appspot.com", // Cambié firebasestorage.app a .appspot.com
  messagingSenderId: "998288325457",
  appId: "1:998288325457:web:61cc17ac30b88641f5b170",
  measurementId: "G-TC3Q3S3FKY" // Este ID lo puedes dejar si vas a usar Analytics (pero no es necesario para el chat)
};

// Inicialización de Firebase
const app = initializeApp(firebaseConfig);

// Inicialización de la base de datos en tiempo real
const db = getDatabase(app);

export { db, ref, set, onValue, onDisconnect }; // Ahora se exporta onDisconnect