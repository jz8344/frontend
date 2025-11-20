# Configuración de Variables de Entorno en Railway

## Variables Requeridas

Para que el frontend funcione correctamente en Railway, necesitas configurar las siguientes variables de entorno:

### 1. VITE_API_BASE_URL
URL base del backend de Laravel desplegado en Railway
```
VITE_API_BASE_URL=https://web-production-86356.up.railway.app
```

### 2. VITE_GOOGLE_MAPS_API_KEY
API Key de Google Maps para funciones de mapas interactivos
```
VITE_GOOGLE_MAPS_API_KEY=AIzaSyDXr4YTxuB1UEgxnV0PPHcq089cEyDbPHk
```

## Cómo Configurar en Railway

1. Ve a tu proyecto en Railway
2. Selecciona el servicio de **frontend**
3. Ve a la pestaña **Variables**
4. Agrega las variables una por una:
   - Click en **+ New Variable**
   - Ingresa el nombre (ej: `VITE_GOOGLE_MAPS_API_KEY`)
   - Ingresa el valor
   - Click en **Add**
5. Railway automáticamente redesplegará tu aplicación

## Seguridad

- ✅ El archivo `.env` está en `.gitignore` y NO se sube al repositorio
- ✅ La API Key se carga dinámicamente desde variables de entorno
- ✅ No hay API Keys hardcodeadas en el código fuente
- ⚠️ Considera restringir la API Key de Google Maps por dominio en Google Cloud Console

## Restricciones Recomendadas para Google Maps API Key

Para mayor seguridad, ve a Google Cloud Console y restringe la API Key:

1. **Restricción de aplicación**: HTTP referrers (sitios web)
2. **Referrers permitidos**:
   - `https://tu-dominio.railway.app/*`
   - `https://web-production-*.up.railway.app/*`
   - `http://localhost:5173/*` (para desarrollo)
3. **Restricción de API**: Solo activa:
   - Maps JavaScript API
   - Places API
   - Geocoding API (si lo usas)

Esto previene que otras personas usen tu API Key sin autorización.
