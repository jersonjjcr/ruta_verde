import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'

// Configuración de Firebase
// IMPORTANTE: Reemplaza estos valores con tu configuración de Firebase
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://TU_PROJECT_ID-default-rtdb.firebaseio.com",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_PROJECT_ID.appspot.com",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID"
}

// Inicializar Firebase
const app = initializeApp(firebaseConfig)
const database = getDatabase(app)

export { database }
