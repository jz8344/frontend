# 🚀 Guía de Despliegue en Railway - TrailynSafe Frontend

## 📋 Prerrequisitos

1. Cuenta en [Railway.app](https://railway.app/)
2. Repositorio Git (GitHub, GitLab, etc.)
3. URL de tu API backend ya desplegada en Railway

## 🔧 Configuración Previa al Despliegue

### 1. Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con la URL de tu API:

```env
VITE_API_BASE_URL=https://tu-api-backend.railway.app
PORT=5173
```

**⚠️ IMPORTANTE:** No subas el archivo `.env` a git, usa el `.env.example` como referencia.

### 2. Verifica la Configuración

Los siguientes archivos ya están configurados para Railway:

- ✅ `package.json` - Scripts de build y start
- ✅ `vite.config.js` - Configuración optimizada para producción
- ✅ `server.js` - Servidor Express para servir la aplicación
- ✅ `railway.json` - Configuración de despliegue
- ✅ `.gitignore` - Archivos excluidos de git

## 📤 Pasos para Desplegar en Railway

### Opción 1: Desde GitHub (Recomendado)

1. **Sube tu código a GitHub:**
   ```bash
   git add .
   git commit -m "Configuración lista para Railway"
   git push origin main
   ```

2. **En Railway.app:**
   - Inicia sesión en [Railway.app](https://railway.app/)
   - Click en "New Project"
   - Selecciona "Deploy from GitHub repo"
   - Autoriza Railway para acceder a tu GitHub
   - Selecciona el repositorio de tu frontend

3. **Configura las Variables de Entorno:**
   - Ve a la pestaña "Variables" en tu proyecto
   - Agrega la variable: `VITE_API_BASE_URL`
   - Valor: URL de tu backend (ej: `https://tu-api-backend.railway.app`)
   - Railway asigna automáticamente el `PORT`

4. **Railway Desplegará Automáticamente:**
   - Railway detectará que es un proyecto Node.js
   - Ejecutará `npm ci && npm run build`
   - Iniciará el servidor con `npm run start`

### Opción 2: Desde CLI de Railway

1. **Instala Railway CLI:**
   ```bash
   npm install -g @railway/cli
   ```

2. **Inicia sesión:**
   ```bash
   railway login
   ```

3. **Inicializa el proyecto:**
   ```bash
   railway init
   ```

4. **Configura variables de entorno:**
   ```bash
   railway variables set VITE_API_BASE_URL=https://tu-api-backend.railway.app
   ```

5. **Despliega:**
   ```bash
   railway up
   ```

## 🔍 Verificación del Despliegue

1. **Revisa los logs:**
   - En Railway dashboard, ve a "Deployments"
   - Verifica que el build sea exitoso
   - Revisa los logs del servidor

2. **Prueba la URL:**
   - Railway te dará una URL pública
   - Abre la URL en tu navegador
   - Verifica que la aplicación cargue correctamente

3. **Verifica la conexión con el backend:**
   - Prueba hacer login o cualquier llamada API
   - Abre DevTools (F12) > Network
   - Verifica que las peticiones vayan a tu backend de Railway

## 🔄 Actualizaciones Automáticas

Railway redesplegará automáticamente cada vez que hagas push a tu rama principal:

```bash
git add .
git commit -m "Nueva funcionalidad"
git push origin main
```

## 🐛 Troubleshooting

### Error: "Cannot find module 'express'"
**Solución:** Asegúrate que `express` esté en `dependencies` (no en `devDependencies`)

### Error: Variables de entorno no funcionan
**Solución:** 
- Las variables deben empezar con `VITE_`
- Configúralas en Railway Dashboard > Variables
- Redespliega el proyecto

### Error 404 en rutas de Vue Router
**Solución:** El `server.js` ya maneja esto con `app.get('*', ...)`

### Error de CORS
**Solución:** 
- Verifica que el backend tenga configurado CORS correctamente
- Asegúrate que la URL del backend en `VITE_API_BASE_URL` sea correcta

## 📊 Optimizaciones Implementadas

- ✅ Chunks separados para vendor, bootstrap y utils
- ✅ Minificación con esbuild
- ✅ Servidor Express para SPA routing
- ✅ Build optimizado para producción
- ✅ Sourcemaps deshabilitados en producción

## 🔐 Seguridad

- ✅ Archivos `.env` ignorados en git
- ✅ Variables sensibles en Railway
- ✅ Dependencias actualizadas
- ✅ CORS configurado en backend

## 📝 Comandos Útiles

```bash
# Desarrollo local
npm run dev

# Build para producción
npm run build

# Preview del build localmente
npm run preview

# Iniciar servidor de producción
npm run start

# Limpiar caché de Railway
railway run --clean
```

## 🌐 URLs Importantes

- **Frontend Production:** `https://tu-proyecto.railway.app`
- **Backend API:** `https://tu-api-backend.railway.app`
- **Railway Dashboard:** `https://railway.app/dashboard`

## 📞 Soporte

Si encuentras problemas:
1. Revisa los logs en Railway Dashboard
2. Verifica las variables de entorno
3. Asegúrate que el backend esté funcionando
4. Consulta la [documentación de Railway](https://docs.railway.app/)

---

**¡Listo para desplegar! 🚀**
