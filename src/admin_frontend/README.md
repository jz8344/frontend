# Guía del Sistema Admin Bootstrap

## Componentes creados

### 1. AdminNavbar.vue
Navbar unificado reutilizable para todas las páginas del admin.

**Características:**
- Navbar fijo con modo oscuro
- Búsqueda global
- Notificaciones
- Menú de usuario con dropdown
- Sidebar de aplicaciones (móvil y desktop)
- Breadcrumbs automáticos
- Atajos de teclado (Ctrl+K para búsqueda, Ctrl+Alt+A para apps)

**Props:**
- `pageTitle`: Título de la página actual
- `userName`: Nombre del usuario (default: "Demo Company")
- `notificationCount`: Número de notificaciones (default: 0)

**Eventos:**
- `@search`: Emitido cuando se busca algo
- `@showNotifications`: Emitido al hacer clic en notificaciones
- `@showHistory`: Emitido al hacer clic en historial
- `@logout`: Emitido al cerrar sesión

### 2. AdminLayout.vue
Layout base que envuelve el navbar y proporciona estructura común.

**Características:**
- Incluye AdminNavbar automáticamente
- Área de alertas sistema
- Loading overlay
- Slots para header personalizado y acciones
- Manejo de alertas con auto-dismiss

**Props:**
- `pageTitle`: Título de la página
- `pageDescription`: Descripción de la página
- `userName`: Nombre del usuario
- `notificationCount`: Número de notificaciones
- `loading`: Estado de carga
- `loadingMessage`: Mensaje de carga

**Slots:**
- `header`: Header personalizado de la página
- `actions`: Botones de acción en el header
- Default slot: Contenido principal

### 3. AdminDashboard.vue (actualizado)
Dashboard principal usando el nuevo sistema.

## Cómo usar en otras páginas

### Ejemplo básico:
```vue
<template>
  <AdminLayout 
    page-title="Usuarios"
    page-description="Gestión de usuarios del sistema"
    :notification-count="5"
    @search="handleSearch"
    @showNotifications="showNotifications"
  >
    <!-- Tu contenido aquí -->
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <h5>Lista de usuarios</h5>
            <!-- Tabla, formularios, etc. -->
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import AdminLayout from '../layouts/AdminLayout.vue'

function handleSearch(query) {
  console.log('Buscar:', query)
}

function showNotifications() {
  console.log('Mostrar notificaciones')
}
</script>
```

### Ejemplo con header personalizado:
```vue
<template>
  <AdminLayout 
    page-title="Choferes"
    :loading="loading"
    @search="handleSearch"
  >
    <template #header>
      <div class="d-flex justify-content-between align-items-center">
        <div>
          <h1 class="h3 mb-1">Gestión de Choferes</h1>
          <p class="text-muted mb-0">Administra los conductores del sistema</p>
        </div>
        <div>
          <button class="btn btn-primary">
            <i class="bi bi-person-plus me-2"></i>
            Nuevo Chofer
          </button>
        </div>
      </div>
    </template>

    <!-- Contenido -->
    <div class="row">
      <!-- Tu contenido aquí -->
    </div>
  </AdminLayout>
</template>
```

### Ejemplo con alertas:
```vue
<template>
  <AdminLayout 
    ref="layout"
    page-title="Rutas"
    @search="handleSearch"
  >
    <div class="row">
      <div class="col-12">
        <button @click="showAlert" class="btn btn-success">
          Mostrar Alerta de Éxito
        </button>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref } from 'vue'
import AdminLayout from '../layouts/AdminLayout.vue'

const layout = ref(null)

function handleSearch(query) {
  console.log('Buscar:', query)
}

function showAlert() {
  layout.value.addAlert('¡Operación exitosa!', 'success')
}
</script>
```

## Clases CSS de Bootstrap utilizadas

### Grid y Layout:
- `container-fluid`, `row`, `col-*`
- `d-flex`, `justify-content-*`, `align-items-*`
- `position-*`, `fixed-top`

### Componentes:
- `navbar`, `nav`, `dropdown`
- `card`, `card-body`, `card-header`, `card-footer`
- `btn`, `btn-*` (primary, success, outline-*)
- `alert`, `badge`, `offcanvas`

### Utilidades:
- `text-*`, `bg-*`, `border-*`
- `p-*`, `m-*`, `g-*` (spacing)
- `shadow-*`, `rounded-*`
- `fs-*` (font-size)

### Iconos Bootstrap Icons:
- `bi-house-fill`, `bi-people-fill`, `bi-gear-fill`
- `bi-search`, `bi-bell`, `bi-moon`, `bi-sun`
- `bi-shield-check`, `bi-grid-3x3-gap`

## Modo oscuro
El sistema soporta modo oscuro usando el atributo `data-bs-theme="dark"` en el body.
Se persiste la preferencia en localStorage.

## Responsive
- Navbar se adapta a móviles con offcanvas
- Grid responsivo con breakpoints de Bootstrap
- Sidebar de aplicaciones ajustable

## Atajos de teclado
- `Ctrl+K` / `Cmd+K`: Enfocar búsqueda
- `Ctrl+Alt+A`: Abrir/cerrar sidebar de aplicaciones
- `Esc`: Cerrar menús abiertos

## Rutas del sistema
```javascript
const routes = {
  'dashboard': '/admin/dashboard',
  'usuarios': '/admin/usuarios',
  'hijos': '/admin/hijos',
  'choferes': '/admin/choferes',
  'rutas': '/admin/rutas',
  'unidades': '/admin/unidades',
  'estadisticas': '/admin/estadisticas',
  'configuracion': '/admin/configuracion',
}
```

¡Ahora tienes un sistema admin completo usando Bootstrap 5 con navbar unificado que puedes reutilizar en todas tus aplicaciones!
