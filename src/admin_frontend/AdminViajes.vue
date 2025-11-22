<template>
  <DynamicAppLayout
    :app-config="config"
    :items="viajes"
    :loading="loading"
    :related-data="relatedData"
    :user-name="userName"
    :notification-count="unreadCount"
    :current-sort-field="sortField"
    :current-sort-direction="sortDirection"
    @search="handleSearch"
    @sort="handleSort"
    @create="handleCreate"
    @update="handleUpdate"
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
        @customAction="handleCustomAction"
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
import DynamicAppLayout from './layouts/DynamicAppLayout.vue'
import DynamicListView from './components/DynamicListView.vue'
import { useAdminAuth } from '@/composables/useAdminAuth.js'
import { useNotifications } from '@/composables/useNotifications.js'
import http from '@/config/api.js'
import { appConfigs } from './config/appConfigs.js'

const { adminName, setupAxiosInterceptors } = useAdminAuth()
const { notifyCreated, notifyUpdated, notifyDeleted, notifications, unreadCount } = useNotifications()

// Configuración de la app
const config = appConfigs.viajes

// Estado reactivo
const viajes = ref([])
const relatedData = ref({})
const loading = ref(false)
const alerts = ref([])
const sortField = ref('')
const sortDirection = ref('asc')
const userName = computed(() => adminName.value || 'Admin')

// Métodos de carga
async function cargar() {
  try {
    loading.value = true
    const response = await http.get('/admin/viajes')
    viajes.value = response.data
  } catch (error) {
    console.error('Error cargando viajes:', error)
    showAlert('Error al cargar viajes', 'danger')
  } finally {
    loading.value = false
  }
}

// Métodos de manejo de eventos
async function handleCreate(data) {
  try {
    loading.value = true
    
    // Preparar datos según tipo_viaje
    const payload = { ...data }
    if (payload.tipo_viaje === 'unico') {
      payload.dias_activos = null
      payload.fecha_inicio_vigencia = null
      payload.fecha_fin_vigencia = null
    } else if (payload.tipo_viaje === 'recurrente') {
      payload.fecha_especifica = null
    }

    // Si estado no está definido, usar 'abierto' por defecto
    if (!payload.estado) {
      payload.estado = 'abierto'
    }

    await http.post('/admin/viajes', payload)
    showAlert('Viaje creado exitosamente', 'success')
    notifyCreated('viaje', data.nombre_ruta || 'Nuevo viaje')
    await cargar()
  } catch (error) {
    console.error('Error creando viaje:', error)
    const errorMsg = error.response?.data?.message || 'Error al crear el viaje'
    showAlert(errorMsg, 'danger')
  } finally {
    loading.value = false
  }
}

async function handleUpdate({ id, data }) {
  try {
    loading.value = true
    
    // Preparar datos según tipo_viaje
    const payload = { ...data }
    if (payload.tipo_viaje === 'unico') {
      payload.dias_activos = null
      payload.fecha_inicio_vigencia = null
      payload.fecha_fin_vigencia = null
    } else if (payload.tipo_viaje === 'recurrente') {
      payload.fecha_especifica = null
    }

    await http.put(`/admin/viajes/${id}`, payload)
    showAlert('Viaje actualizado exitosamente', 'success')
    notifyUpdated('viaje', data.nombre_ruta || `ID ${id}`)
    await cargar()
  } catch (error) {
    console.error('Error actualizando viaje:', error)
    const errorMsg = error.response?.data?.message || 'Error al actualizar el viaje'
    showAlert(errorMsg, 'danger')
  } finally {
    loading.value = false
  }
}

async function handleDelete(id) {
  const viaje = viajes.value.find(v => v.id === id)
  const nombreViaje = viaje?.nombre_ruta || `ID ${id}`

  if (confirm(`¿Estás seguro de eliminar el viaje "${nombreViaje}"?`)) {
    try {
      loading.value = true
      await http.delete(`/admin/viajes/${id}`)
      showAlert('Viaje eliminado exitosamente', 'success')
      notifyDeleted('viaje', nombreViaje)
      await cargar()
    } catch (error) {
      console.error('Error eliminando viaje:', error)
      const errorMsg = error.response?.data?.message || 'Error al eliminar el viaje'
      showAlert(errorMsg, 'danger')
    } finally {
      loading.value = false
    }
  }
}

async function handleDeleteSelected(ids) {
  if (ids.length === 0) return

  if (confirm(`¿Estás seguro de eliminar ${ids.length} viajes?`)) {
    try {
      loading.value = true
      let eliminados = 0
      let errores = 0

      for (const id of ids) {
        try {
          await http.delete(`/admin/viajes/${id}`)
          eliminados++
        } catch (error) {
          errores++
          console.error(`Error eliminando viaje ${id}:`, error)
        }
      }

      if (eliminados > 0) {
        showAlert(`${eliminados} viaje(s) eliminado(s) exitosamente`, 'success')
      }
      if (errores > 0) {
        showAlert(`${errores} viaje(s) no pudieron ser eliminados`, 'warning')
      }

      await cargar()
    } finally {
      loading.value = false
    }
  }
}

function handleSearch(query) {
  console.log('Searching for:', query)
  // La búsqueda se maneja en el layout con computed
}

function handleSort({ field, direction }) {
  sortField.value = field
  sortDirection.value = direction
}

function handleNotifications() {
  // El panel de notificaciones se maneja desde AdminNavbar
}

function handleHistory() {
  showAlert('Funcionalidad de historial en desarrollo', 'info')
}

async function handleCustomAction({ action, item }) {
  if (action.name === 'ver_solicitudes') {
    // TODO: Implementar vista de solicitudes
    showAlert(`Ver solicitudes del viaje "${item.nombre_ruta}" en desarrollo`, 'info')
  }
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

// Lifecycle
onMounted(async () => {
  setupAxiosInterceptors()
  await cargar()
  showAlert('Bienvenido a Gestión de Viajes', 'info', 3000)
})
</script>

<style scoped>
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
