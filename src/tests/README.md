# 🧪 Tests de Rutas Protegidas - TrailynSafe

Este directorio contiene tests para validar la seguridad de las rutas protegidas del sistema TrailynSafe.

## 📁 Archivos

### `routeProtectionTest.js`
Test completo y detallado que verifica:
- ✅ Rutas de usuario regulares
- ✅ Rutas de administrador
- ✅ Seguridad cruzada entre roles
- ✅ Funcionamiento de middlewares

### `quickTest.js`
Test rápido para usar desde la consola del navegador:
```javascript
QuickRouteTester.quickTest()
```

### `testRunner.html`
Interfaz web elegante para ejecutar los tests con:
- 🎮 Controles interactivos
- 📊 Resultados en tiempo real
- 🎨 Interfaz moderna

## 🚀 Cómo usar

### Opción 1: Interfaz Web
1. Abre `testRunner.html` en tu navegador
2. Haz clic en "🚀 Ejecutar Tests Completos"
3. Observa los resultados en tiempo real

### Opción 2: Consola del Navegador
1. Importa el script en tu aplicación:
```javascript
import { QuickRouteTester } from './tests/quickTest.js'
```

2. Ejecuta desde la consola:
```javascript
QuickRouteTester.quickTest()
```

### Opción 3: Test de Ruta Específica
```javascript
testRoute('/sesion', 'tu_token_aqui')
testRoute('/admin/usuarios', 'admin_token_aqui')
```

## 🔍 Qué se prueba

### Rutas de Usuario
- `GET /sesion` - Obtener sesión actual
- `GET /validar-sesion` - Validar sesión
- `POST /editar-perfil` - Editar perfil
- `DELETE /sesiones` - Eliminar sesiones

### Rutas de Admin
- `GET /usuarios` - Listar usuarios
- `GET /admin/sesion` - Sesión de admin
- `GET /admin/validar-sesion` - Validar sesión admin
- `POST /admin/editar-perfil` - Editar perfil admin

### Seguridad Cruzada
- ❌ Usuario intentando acceder a rutas de admin (debe fallar)
- ❌ Admin intentando acceder a rutas específicas de usuario (debe fallar)

## 📊 Resultados Esperados

### ✅ Casos de Éxito
- Usuario accede a sus rutas → Status 200
- Admin accede a sus rutas → Status 200
- Middleware funciona correctamente

### ❌ Casos de Fallo Esperado (Seguridad)
- Usuario intenta acceder a admin → Status 403
- Tokens inválidos → Status 401
- Sin token → Status 401

## 🛠️ Configuración

Asegúrate de que:
1. El backend esté corriendo en `http://127.0.0.1:8000`
2. Las rutas estén configuradas correctamente
3. Los middlewares estén activos

## 📝 Notas

- Los tests crean usuarios temporales para las pruebas
- Se utilizan emails únicos con timestamp para evitar conflictos
- Los resultados se muestran con códigos de color para fácil lectura
- Todos los tests son no destructivos

## 🎨 Características de la UI

- **Diseño Moderno**: Gradientes y sombras elegantes
- **Tiempo Real**: Resultados actualizados instantáneamente
- **Códigos de Color**: Verde (éxito), Rojo (error), Amarillo (advertencia)
- **Progreso Visual**: Barra de progreso durante la ejecución
- **Responsive**: Funciona en dispositivos móviles

¡Ejecuta los tests para asegurar que tu sistema esté protegido correctamente! 🔒
