# 🔥 Configuración de Firebase para Rutas Verdes

## Pasos para configurar Firebase Realtime Database:

### 1. Crear proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Click en "Agregar proyecto"
3. Nombre del proyecto: `rutas-verdes-sincelejo`
4. Deshabilita Google Analytics (opcional)
5. Click en "Crear proyecto"

### 2. Configurar Realtime Database

1. En el menú lateral, ve a **"Realtime Database"**
2. Click en **"Crear base de datos"**
3. Selecciona ubicación: **Estados Unidos (us-central1)**
4. Modo de seguridad: **"Empezar en modo de prueba"**
   - Esto permite lectura/escritura durante 30 días
   - Después configuraremos reglas más seguras
5. Click en **"Habilitar"**

### 3. Obtener configuración de Firebase

1. En la consola de Firebase, ve a **Configuración del proyecto** (ícono de engranaje)
2. Scroll down hasta **"Tus aplicaciones"**
3. Click en el ícono **</> (Web)**
4. Registra tu app con el nombre: `rutas-verdes-web`
5. **NO** marques "Firebase Hosting"
6. Click en **"Registrar app"**
7. Copia la configuración que aparece (firebaseConfig)

### 4. Configurar el proyecto

1. Abre el archivo `src/firebase/config.js`
2. Reemplaza los valores con tu configuración:

```javascript
const firebaseConfig = {
  apiKey: "TU_API_KEY_AQUI",
  authDomain: "rutas-verdes-sincelejo.firebaseapp.com",
  databaseURL: "https://rutas-verdes-sincelejo-default-rtdb.firebaseio.com",
  projectId: "rutas-verdes-sincelejo",
  storageBucket: "rutas-verdes-sincelejo.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
}
```

### 5. Configurar variables de entorno (Recomendado)

Para mayor seguridad, crea un archivo `.env` en la raíz del proyecto:

```env
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_auth_domain
VITE_FIREBASE_DATABASE_URL=tu_database_url
VITE_FIREBASE_PROJECT_ID=tu_project_id
VITE_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
```

Y actualiza `src/firebase/config.js`:

```javascript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}
```

### 6. Configurar reglas de seguridad (Importante)

En Firebase Console → Realtime Database → Reglas, reemplaza con:

```json
{
  "rules": {
    "buses": {
      ".read": true,
      ".write": true,
      "$busId": {
        ".validate": "newData.hasChildren(['lat', 'lng', 'ruta', 'timestamp'])",
        "lat": {
          ".validate": "newData.isNumber() && newData.val() >= -90 && newData.val() <= 90"
        },
        "lng": {
          ".validate": "newData.isNumber() && newData.val() >= -180 && newData.val() <= 180"
        },
        "timestamp": {
          ".validate": "newData.isNumber()"
        }
      }
    }
  }
}
```

### 7. En Vercel (para deploy)

1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Agrega cada variable de entorno:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - etc.
4. Redeploy el proyecto

## ✅ Verificación

Una vez configurado:
1. Ejecuta `npm run dev`
2. Abre la app en el navegador
3. Activa tu ubicación
4. Abre la app en otro dispositivo/navegador
5. Deberías ver ambos buses en tiempo real

## 🔒 Seguridad para Producción

Después de las pruebas, actualiza las reglas de Firebase para mayor seguridad:

```json
{
  "rules": {
    "buses": {
      ".read": true,
      ".write": "auth != null",
      "$busId": {
        ".validate": "newData.hasChildren(['lat', 'lng', 'ruta', 'timestamp']) && 
                     newData.child('timestamp').val() > (now - 5000)",
        ".write": "!data.exists() || data.child('id').val() === auth.uid"
      }
    }
  }
}
```

## 🆘 Solución de problemas

- **Error de permisos**: Verifica que las reglas estén en modo de prueba
- **No aparecen buses**: Revisa la consola del navegador para errores
- **Error de conexión**: Verifica que el `databaseURL` sea correcto
- **Variables de entorno no funcionan**: Reinicia el servidor de desarrollo

## 📚 Recursos

- [Documentación de Firebase](https://firebase.google.com/docs)
- [Realtime Database Guide](https://firebase.google.com/docs/database)
