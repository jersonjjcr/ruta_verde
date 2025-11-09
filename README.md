# 🚌 Rutas Verdes - Sincelejo

Sistema de seguimiento en tiempo real de buses urbanos para la ciudad de Sincelejo, Colombia.

## 🌟 Características

- **Visualización de rutas**: Muestra 4 rutas de buses (A y B, Ida y Retorno) en mapa interactivo
- **Seguimiento GPS en tiempo real**: Los usuarios dentro del bus pueden compartir su ubicación
- **Mapa interactivo**: Integración con OpenStreetMap usando Leaflet
- **Diseño responsive**: Optimizado para móviles, tablets y desktop
- **Modo simulación**: Demuestra el funcionamiento cuando no hay usuarios activos

## 🚀 Tecnologías

- **React 19** - Framework de UI
- **Vite** - Build tool y dev server
- **Leaflet** - Mapas interactivos
- **OpenStreetMap** - Datos de mapas

## 📦 Instalación

```bash
# Clonar el repositorio
git clone https://github.com/jersonjjcr/ruta_verde.git

# Entrar al directorio
cd ruta_verde

# Instalar dependencias
npm install

# Configurar Firebase (Ver FIREBASE_SETUP.md)
cp .env.example .env
# Editar .env con tus credenciales de Firebase

# Iniciar servidor de desarrollo
npm run dev
```

## 🔥 Configuración de Firebase

Esta aplicación usa **Firebase Realtime Database** para sincronizar las ubicaciones en tiempo real.

**Pasos rápidos:**
1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Habilita Realtime Database
3. Copia tu configuración a `.env`
4. Consulta `FIREBASE_SETUP.md` para instrucciones detalladas

## 🛠️ Scripts disponibles

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Compilar para producción
npm run preview  # Previsualizar build de producción
npm run lint     # Ejecutar linter
```

## 📱 Uso

1. Abre la aplicación en tu navegador
2. Selecciona una ruta (A o B, Ida o Retorno)
3. Si estás en un bus, haz clic en "📍 Activar ubicación"
4. Acepta los permisos de geolocalización
5. Tu ubicación se mostrará en tiempo real en el mapa

## 🗺️ Rutas disponibles

- **Ruta A - Ida**: Recorrido principal norte-sur
- **Ruta A - Retorno**: Regreso sur-norte
- **Ruta B - Ida**: Recorrido secundario
- **Ruta B - Retorno**: Regreso ruta secundaria

## 🔧 Configuración

Las rutas están definidas en archivos JSON ubicados en `/rutas/`:
- `a_ida.json`
- `a_retorno.json`
- `b_ida.json`
- `b_retorno.json`

## 🌐 Deploy

Este proyecto está desplegado en Vercel: [URL_DE_TU_DEPLOY]

## 📄 Licencia

MIT

## 👥 Contribuciones

Las contribuciones son bienvenidas. Por favor:
1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📧 Contacto

Proyecto creado para mejorar el transporte público en Sincelejo.

## React Compiler

The React Compiler is currently not compatible with SWC. See [this issue](https://github.com/vitejs/vite-plugin-react/issues/428) for tracking the progress.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
