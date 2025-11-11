<template>
  <!-- Componente especializado para respaldos -->
  <BackupApp v-if="appName === 'respaldos'" />
  
  <!-- Componente dinámico estándar para otras apps -->
  <DynamicAppLayout
    v-else
    :app-config="config"
    :items="items"
    :loading="loading"
    :related-data="relatedData"
    :user-name="userName"
    :notification-count="notificationCount"
    @search="handleSearch"
    @sort="handleSort"
    @create="handleCreate"
    @update="handleUpdate"
    @savePassword="handleSavePassword"
    @delete="handleDelete"
    @deleteSelected="handleDeleteSelected"
    @showNotifications="handleNotifications"
    @showHistory="handleHistory"
  >
    <template v-slot="slotProps">
      <DynamicListView
        :config="config"
        :items="slotProps.items"
        :selected-items="slotProps.selectedItems"
        :sort-field="sortField"
        :sort-direction="sortDirection"
        @toggleSelection="slotProps.toggleSelection"
        @selectAll="slotProps.selectAll"
        @clearSelection="slotProps.clearSelection"
        @openEditModal="slotProps.openEditModal"
        @deleteItem="slotProps.deleteItem"
        @sort="handleSort"
      />
    </template>
  </DynamicAppLayout>

  <!-- Alerts -->
  <div class="position-fixed top-0 end-0 p-3" style="z-index: 9999;">
    <div v-for="(alert, index) in alerts" :key="index" 
         :class="`alert alert-${alert.type} alert-dismissible fade show`" 
         role="alert">
      <i :class="getAlertIcon(alert.type)" class="me-2"></i>
      {{ alert.message }}
      <button type="button" class="btn-close" @click="dismissAlert(index)"></button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DynamicAppLayout from '../layouts/DynamicAppLayout.vue'
import DynamicListView from '../components/DynamicListView.vue'
import BackupApp from './BackupApp.vue'
import { useDynamicApp } from '@/composables/useDynamicApp.js'
import { useAdminAuth } from '@/composables/useAdminAuth.js'

// Definir props (para evitar warnings de Vue Router)
const props = defineProps({
  app: {
    type: String,
    default: ''
  }
})

const route = useRoute()
const router = useRouter()
const { adminName, setupAxiosInterceptors } = useAdminAuth()

// Obtener el nombre de la app desde la ruta o props
const appName = computed(() => props.app || route.params.app)

// Validar que la app existe
const validApps = ['usuarios', 'hijos', 'choferes', 'unidades', 'rutas', 'respaldos']
if (!validApps.includes(appName.value)) {
  router.push('/admin/dashboard')
}

// Usar el composable de app dinámica
const {
  items,
  relatedData,
  loading,
  error,
  config,
  createItem,
  updateItem,
  deleteItem,
  deleteMultipleItems,
  initialize,
  refresh
} = useDynamicApp(appName.value)

// Estado local
const alerts = ref([])
const sortField = ref('')
const sortDirection = ref('asc')
const userName = computed(() => adminName.value || 'Admin')
const notificationCount = ref(0)

// Métodos de manejo de eventos
async function handleCreate(data) {
  const result = await createItem(data)
  
  if (result.success) {
    showAlert(`${config.singular} creado exitosamente`, 'success')
  } else {
    showAlert(result.error, 'danger')
  }
}

async function handleUpdate({ id, data }) {
  const result = await updateItem(id, data)
  
  if (result.success) {
    showAlert(`${config.singular} actualizado exitosamente`, 'success')
  } else {
    showAlert(result.error, 'danger')
  }
}

async function handleSavePassword({ id, contrasena }) {
  const result = await updateItem(id, { contrasena })
  
  if (result.success) {
    showAlert(`Contraseña actualizada exitosamente`, 'success')
  } else {
    showAlert(result.error, 'danger')
  }
}

async function handleDelete(id) {
  const result = await deleteItem(id)
  
  if (result.success) {
    showAlert(`${config.singular} eliminado exitosamente`, 'success')
  } else {
    showAlert(result.error, 'danger')
  }
}

async function handleDeleteSelected(ids) {
  if (ids.length === 0) return
  
  const result = await deleteMultipleItems(ids)
  
  if (result.success) {
    const { summary } = result
    if (summary.errors > 0) {
      showAlert(
        `${summary.success} ${config.name.toLowerCase()} eliminados, ${summary.errors} errores`, 
        'warning'
      )
    } else {
      showAlert(
        `${summary.success} ${config.name.toLowerCase()} eliminados exitosamente`, 
        'success'
      )
    }
  } else {
    showAlert(result.error, 'danger')
  }
}

function handleSearch(query) {
  // La búsqueda se maneja en el layout con computed
  console.log('Searching for:', query)
}

function handleSort({ field, direction }) {
  sortField.value = field
  sortDirection.value = direction
  // El ordenamiento se maneja en el layout con computed
}

function handleNotifications() {
  showAlert('Funcionalidad de notificaciones en desarrollo', 'info')
}

function handleHistory() {
  showAlert('Funcionalidad de historial en desarrollo', 'info')
}

// Métodos de utilidad
function showAlert(message, type = 'info', duration = 5000) {
  const alert = { message, type }
  alerts.value.push(alert)
  
  if (duration > 0) {
    setTimeout(() => {
      dismissAlert(alerts.value.indexOf(alert))
    }, duration)
  }
}

function dismissAlert(index) {
  if (index >= 0 && index < alerts.value.length) {
    alerts.value.splice(index, 1)
  }
}

function getAlertIcon(type) {
  const icons = {
    'success': 'bi bi-check-circle-fill',
    'danger': 'bi bi-exclamation-triangle-fill',
    'warning': 'bi bi-exclamation-triangle-fill',
    'info': 'bi bi-info-circle-fill'
  }
  return icons[type] || 'bi bi-info-circle-fill'
}

// Manejo de errores global
function handleError(err) {
  console.error('App error:', err)
  showAlert('Ha ocurrido un error inesperado', 'danger')
}

// Lifecycle
onMounted(async () => {
  try {
    // Configurar interceptores de axios
    setupAxiosInterceptors()
    
    // Inicializar la aplicación
    await initialize()
    
    // Mostrar mensaje de bienvenida
    showAlert(`Bienvenido a ${config.name}`, 'info', 3000)
  } catch (err) {
    handleError(err)
  }
})

// Watchers para errores
if (error.value) {
  handleError(error.value)
}
</script>

<style scoped>
/* Los estilos están en los componentes individuales */
.alert {
  max-width: 400px;
  animation: slideInRight 0.3s ease-out;
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>
