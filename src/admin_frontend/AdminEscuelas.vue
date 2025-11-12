<template>
  <DynamicAppLayout
    :app-config="config"
    :items="escuelas"
    :loading="loading"
    :related-data="{}"
    :user-name="userName"
    :notification-count="0"
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
        :items="filteredItems"
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
import { ref, computed, onMounted } from 'vue'
import DynamicAppLayout from './layouts/DynamicAppLayout.vue'
import DynamicListView from './components/DynamicListView.vue'
import { useAdminAuth } from '@/composables/useAdminAuth.js'
import { getAppConfig } from './config/appConfigs.js'
import http from '@/config/api.js'

const { adminName, setupAxiosInterceptors } = useAdminAuth()

// Configuración de la app
const config = getAppConfig('escuelas')

// Estado reactivo
const escuelas = ref([])
const loading = ref(false)
const error = ref(null)
const alerts = ref([])
const sortField = ref('')
const sortDirection = ref('asc')
const searchQuery = ref('')

const userName = computed(() => adminName.value || 'Admin')

// Computed para filtrar items
const filteredItems = computed(() => {
  let filtered = [...escuelas.value]
  
  // Aplicar filtro de búsqueda
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(item => {
      return config.searchFields.some(field => {
        const value = getNestedValue(item, field)
        return value && String(value).toLowerCase().includes(query)
      })
    })
  }
  
  // Aplicar ordenamiento
  if (sortField.value) {
    filtered.sort((a, b) => {
      const aVal = getNestedValue(a, sortField.value)
      const bVal = getNestedValue(b, sortField.value)
      
      if (aVal === null || aVal === undefined) return 1
      if (bVal === null || bVal === undefined) return -1
      
      const comparison = aVal > bVal ? 1 : aVal < bVal ? -1 : 0
      return sortDirection.value === 'asc' ? comparison : -comparison
    })
  }
  
  return filtered
})

// Métodos
function getNestedValue(obj, path) {
  if (!obj || !path) return null
  const keys = path.split('.')
  let value = obj
  for (const key of keys) {
    value = value?.[key]
    if (value === null || value === undefined) return null
  }
  return value
}

async function loadItems() {
  loading.value = true
  error.value = null
  
  try {
    const response = await http.get('/admin/escuelas')
    escuelas.value = response.data || []
  } catch (err) {
    error.value = `Error cargando escuelas: ${err.message}`
    showAlert(error.value, 'danger')
    console.error('Error loading items:', err)
  } finally {
    loading.value = false
  }
}

async function handleCreate(data) {
  try {
    loading.value = true
    const response = await http.post('/admin/escuelas', data)
    
    if (response.data) {
      escuelas.value.push(response.data)
    }
    
    await loadItems()
    showAlert('Escuela creada exitosamente', 'success')
  } catch (err) {
    const errorMessage = err.response?.data?.error || 'Error creando escuela'
    showAlert(errorMessage, 'danger')
    console.error('Error creating:', err)
  } finally {
    loading.value = false
  }
}

async function handleUpdate({ id, data }) {
  try {
    loading.value = true
    const response = await http.put(`/admin/escuelas/${id}`, data)
    
    const index = escuelas.value.findIndex(item => item.id === id)
    if (index >= 0 && response.data) {
      escuelas.value[index] = response.data
    }
    
    await loadItems()
    showAlert('Escuela actualizada exitosamente', 'success')
  } catch (err) {
    const errorMessage = err.response?.data?.error || 'Error actualizando escuela'
    showAlert(errorMessage, 'danger')
    console.error('Error updating:', err)
  } finally {
    loading.value = false
  }
}

async function handleDelete(id) {
  try {
    await http.delete(`/admin/escuelas/${id}`)
    
    const index = escuelas.value.findIndex(item => item.id === id)
    if (index >= 0) {
      escuelas.value.splice(index, 1)
    }
    
    showAlert('Escuela eliminada exitosamente', 'success')
  } catch (err) {
    const errorMessage = err.response?.data?.error || 'Error eliminando escuela'
    showAlert(errorMessage, 'danger')
    console.error('Error deleting:', err)
  }
}

async function handleDeleteSelected(ids) {
  if (ids.length === 0) return
  
  try {
    loading.value = true
    let successCount = 0
    let errorCount = 0
    
    for (const id of ids) {
      try {
        await http.delete(`/admin/escuelas/${id}`)
        successCount++
      } catch (err) {
        errorCount++
        console.error('Error deleting item:', err)
      }
    }
    
    await loadItems()
    
    if (errorCount > 0) {
      showAlert(`${successCount} escuelas eliminadas, ${errorCount} errores`, 'warning')
    } else {
      showAlert(`${successCount} escuelas eliminadas exitosamente`, 'success')
    }
  } catch (err) {
    showAlert('Error en eliminación múltiple', 'danger')
  } finally {
    loading.value = false
  }
}

function handleSearch(query) {
  searchQuery.value = query
}

function handleSort({ field, direction }) {
  sortField.value = field
  sortDirection.value = direction
}

function handleNotifications() {
  showAlert('Funcionalidad de notificaciones en desarrollo', 'info')
}

function handleHistory() {
  showAlert('Funcionalidad de historial en desarrollo', 'info')
}

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
  await loadItems()
  showAlert('Bienvenido a Gestión de Escuelas', 'info', 3000)
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
