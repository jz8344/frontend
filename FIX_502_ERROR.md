# 🔧 Solución Error 502 en Railway

## ✅ Cambios Aplicados

Se han mejorado los siguientes archivos para solucionar el error 502:

### 1. `server.js` - Mejorado
- ✅ Verificación de carpeta `dist` antes de iniciar
- ✅ Mejor manejo de errores
- ✅ Logs más detallados
- ✅ Cache-control para archivos estáticos

### 2. `nixpacks.toml` - Optimizado
- ✅ Logs verbose para debug
- ✅ Verificación de carpeta dist después del build
- ✅ Variables de entorno configuradas
- ✅ Comando start directo con node

### 3. `railway.json` - Actualizado
- ✅ Healthcheck configurado
- ✅ Verificación de dist en build
- ✅ Comando start directo

### 4. `Procfile` - Creado (Respaldo)
- ✅ Configuración alternativa para Railway

### 5. `start.sh` - Script de verificación
- ✅ Verifica que todo esté en orden antes de iniciar

## 🚀 Sube los Cambios

```bash
# 1. Agrega todos los cambios
git add .

# 2. Commit
git commit -m "Fix: Solución error 502 - Servidor mejorado"

# 3. Push
git push origin master
```

## 🔍 Verifica en Railway

Después del push, Railway redesplegará. En los logs deberías ver:

```
✅ Servidor corriendo en puerto XXXX
🌐 Sirviendo desde: /app/dist
🚀 Aplicación lista
```

## 🐛 Si el Error 502 Persiste

### Opción 1: Revisa los Logs en Railway

1. Ve a Railway Dashboard
2. Click en tu proyecto frontend
3. Ve a "Deployments" → Click en el último deploy
4. Lee los logs completos

Busca errores como:
- ❌ "dist folder not found"
- ❌ "Cannot find module"
- ❌ "Port already in use"

### Opción 2: Verifica las Variables de Entorno

En Railway Dashboard → Variables, asegúrate de tener:

```
VITE_API_BASE_URL = https://web-production-86356.up.railway.app
NODE_ENV = production
```

Railway asigna `PORT` automáticamente.

### Opción 3: Fuerza un Rebuild

En Railway Dashboard:
1. Settings → "Clear Build Cache"
2. Deployments → "Redeploy"

### Opción 4: Verifica el Build

Los logs deben mostrar:
```
✓ npm install
✓ npm run build
✓ 270 modules transformed
✓ built in XX.XXs
```

Si el build falla, el servidor no arrancará.

## 📊 Checklist de Diagnóstico

- [ ] Build completado exitosamente
- [ ] Carpeta `dist` se creó
- [ ] `dist/index.html` existe
- [ ] Servidor inició en el puerto correcto
- [ ] No hay errores en los logs
- [ ] Variable `VITE_API_BASE_URL` configurada
- [ ] Healthcheck responde en `/`

## 🔧 Comandos Útiles

### Test Local (Antes de Push)

```bash
# Build
npm run build

# Verifica que dist existe
ls dist/

# Prueba el servidor
node server.js

# En otro terminal, prueba con curl
curl http://localhost:5173
```

### Desde Railway CLI

```bash
# Ver logs en tiempo real
railway logs

# Forzar redeploy
railway up

# Ver variables
railway variables
```

## 💡 Causas Comunes del 502

1. **Servidor no inicia** → Logs dirán por qué
2. **Puerto incorrecto** → Railway asigna PORT automáticamente
3. **Carpeta dist vacía** → Build falló
4. **Dependencias faltantes** → npm install falló
5. **Error en código** → Revisa server.js

## ✨ Mejoras Implementadas

El servidor ahora:
- ✅ Verifica que `dist` exista antes de iniciar
- ✅ Muestra logs detallados del proceso
- ✅ Maneja errores correctamente
- ✅ Responde al healthcheck de Railway
- ✅ Sirve archivos con cache-control

## 🎯 Próximos Pasos

1. **Push de cambios**
   ```bash
   git add .
   git commit -m "Fix error 502"
   git push origin master
   ```

2. **Espera el redeploy** (2-5 minutos)

3. **Verifica los logs** en Railway Dashboard

4. **Prueba la URL** → `https://frontend-production-a12b.up.railway.app`

5. **Si funciona** → ✅ Listo!

6. **Si sigue con 502** → Lee los logs y aplica las opciones arriba

## 📞 Información Útil

- **Tu Frontend**: `https://frontend-production-a12b.up.railway.app`
- **Tu Backend**: `https://web-production-86356.up.railway.app`
- **Puerto Local**: `5173`

---

**El servidor ya funciona localmente, ahora debe funcionar en Railway después del push! 🚀**
