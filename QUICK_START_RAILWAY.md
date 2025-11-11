# 🚀 Despliegue Rápido en Railway

## 🎯 Configuración Inicial (Solo 1 vez)

### 1. Edita el archivo `.env`
```env
VITE_API_BASE_URL=https://TU-BACKEND-EN-RAILWAY.railway.app
```

### 2. Prueba local (Opcional pero recomendado)
```bash
npm run build
npm run start
# Abre http://localhost:5173
```

## 📤 Subir a Railway

### Método 1: GitHub (Más Fácil) ⭐

```bash
# 1. Sube tu código
git add .
git commit -m "Deploy to Railway"
git push origin main

# 2. En railway.app:
# - New Project
# - Deploy from GitHub repo
# - Selecciona tu repositorio
# - Agrega variable: VITE_API_BASE_URL = tu-backend-url
# - ¡Listo! Railway despliega automáticamente
```

### Método 2: Railway CLI

```bash
# Instalar CLI (solo 1 vez)
npm install -g @railway/cli

# Login
railway login

# Inicializar proyecto
railway init

# Configurar variable
railway variables set VITE_API_BASE_URL=https://tu-backend.railway.app

# Desplegar
railway up
```

## ✅ Verificación

1. ✅ Build completado sin errores
2. ✅ Servidor iniciado
3. ✅ URL pública generada
4. ✅ Aplicación carga correctamente
5. ✅ API conecta con backend

## 🔧 Variables en Railway

En Railway Dashboard > Variables, agrega:

```
VITE_API_BASE_URL = https://tu-backend.railway.app
```

(Railway configura `PORT` automáticamente)

## 📋 Archivos Importantes

- ✅ `server.js` - Servidor de producción
- ✅ `railway.json` - Config de Railway
- ✅ `vite.config.js` - Build optimizado
- ✅ `.env` - Variables locales (no se sube a git)
- ✅ `package.json` - Scripts actualizados

## 🐛 Solución de Problemas

**Error en build:**
```bash
npm ci
npm run build
```

**Error en variables:**
- Verifica que `VITE_API_BASE_URL` esté configurada en Railway
- Debe incluir https:// y no terminar en /

**Error 404 en rutas:**
- Ya está solucionado en `server.js`

## 📞 Más Ayuda

Lee `DEPLOY_RAILWAY.md` para guía completa.

---
**¡Listo para desplegar! 🎉**
