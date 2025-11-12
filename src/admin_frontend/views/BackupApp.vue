<template>
  <div class="backup-app">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1 class="h3 mb-1 d-flex align-items-center">
          <i class="bi bi-shield-check me-2 text-primary"></i>
          Gestión de Respaldos PostgreSQL
        </h1>
        <p class="text-muted mb-0">Administra los respaldos de la base de datos</p>
      </div>
      <div class="d-flex gap-2">
        <button class="btn btn-warning" @click="showCleanupModal">
          <i class="bi bi-trash me-2"></i>Limpiar Antiguos
        </button>
        <button class="btn btn-success" @click="openCreateModal" :disabled="creating">
          <i class="bi bi-plus-circle me-2"></i>{{ creating ? 'Creando...' : 'Crear Respaldo' }}
        </button>
      </div>
    </div>

    <div class="card">
      <div class="card-body">
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary mb-3"></div>
          <p class="text-muted">Cargando respaldos...</p>
        </div>

        <div v-else-if="items.length === 0" class="text-center py-5">
          <i class="bi bi-archive display-1 text-muted mb-3"></i>
          <h5 class="text-muted">No hay respaldos disponibles</h5>
          <p class="text-muted">Crea tu primer respaldo usando el botón superior</p>
        </div>

        <div v-else class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th @click="handleSort('nombre')" style="cursor: pointer;">
                  <i class="bi bi-file-earmark-zip me-1"></i>Archivo
                  <i v-if="sortField === 'nombre'" :class="`bi bi-arrow-${sortDirection === 'asc' ? 'up' : 'down'}`"></i>
                </th>
                <th @click="handleSort('tipo')" style="cursor: pointer;">
                  <i class="bi bi-tag me-1"></i>Tipo
                  <i v-if="sortField === 'tipo'" :class="`bi bi-arrow-${sortDirection === 'asc' ? 'up' : 'down'}`"></i>
                </th>
                <th>Formato</th>
                <th>Tamaño</th>
                <th>Creado Por</th>
                <th @click="handleSort('created_at')" style="cursor: pointer;">
                  <i class="bi bi-calendar me-1"></i>Fecha
                  <i v-if="sortField === 'created_at'" :class="`bi bi-arrow-${sortDirection === 'asc' ? 'up' : 'down'}`"></i>
                </th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in sortedItems" :key="item.id">
                <td><code class="text-primary">{{ item.nombre }}</code></td>
                <td><span :class="`badge ${getTipoBadgeClass(item.tipo)}`">{{ item.tipo }}</span></td>
                <td><span class="badge bg-dark">{{ item.formato ? item.formato.toUpperCase() : 'SQL' }}</span></td>
                <td>{{ item.tamano_formateado }}</td>
                <td><i class="bi bi-person me-1"></i>{{ item.created_by || 'Sistema' }}</td>
                <td><small>{{ formatDate(item.created_at) }}</small></td>
                <td>
                  <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-primary" @click="handleDownload(item)" title="Descargar">
                      <i class="bi bi-download"></i>
                    </button>
                    <button class="btn btn-outline-success" @click="handleRestore(item)" title="Restaurar">
                      <i class="bi bi-arrow-counterclockwise"></i>
                    </button>
                    <button class="btn btn-outline-danger" @click="handleDelete(item.id)" title="Eliminar">
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <DynamicFormModal
      v-if="showFormModal"
      :config="config"
      :is-editing="false"
      :item="null"
      @close="closeCreateModal"
      @save="handleCreate"
    />

    <div v-if="showCleanup" class="modal d-block" tabindex="-1" style="background: rgba(0,0,0,0.5);">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title"><i class="bi bi-trash me-2"></i>Limpiar Respaldos Antiguos</h5>
            <button type="button" class="btn-close" @click="showCleanup = false"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Eliminar respaldos con más de:</label>
              <div class="input-group">
                <input v-model.number="cleanupDays" type="number" class="form-control" min="1" max="365" placeholder="30" />
                <span class="input-group-text">días</span>
              </div>
              <small class="form-text text-muted">Se eliminarán todos los respaldos más antiguos que esta cantidad de días</small>
            </div>
            <div class="alert alert-warning">
              <i class="bi bi-exclamation-triangle me-2"></i>Esta acción no se puede deshacer
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="showCleanup = false">Cancelar</button>
            <button type="button" class="btn btn-warning" @click="handleCleanup" :disabled="creating">
              <i class="bi bi-trash me-2"></i>{{ creating ? 'Limpiando...' : 'Limpiar' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="position-fixed top-0 end-0 p-3" style="z-index: 9999;">
      <div v-for="(alert, index) in alerts" :key="index" :class="`alert alert-${alert.type} alert-dismissible fade show`">
        <i :class="getAlertIcon(alert.type)" class="me-2"></i>{{ alert.message }}
        <button type="button" class="btn-close" @click="dismissAlert(index)"></button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import DynamicFormModal from '../components/DynamicFormModal.vue'
import { appConfigs } from '../config/appConfigs.js'
import axios from 'axios'

const config = appConfigs.respaldos
const items = ref([])
const loading = ref(false)
const creating = ref(false)
const showFormModal = ref(false)
const showCleanup = ref(false)
const cleanupDays = ref(30)
const sortField = ref('created_at')
const sortDirection = ref('desc')
const alerts = ref([])

const sortedItems = computed(() => {
  const sorted = [...items.value]
  sorted.sort((a, b) => {
    let aVal = a[sortField.value]
    let bVal = b[sortField.value]
    if (sortField.value === 'created_at') {
      aVal = new Date(aVal).getTime()
      bVal = new Date(bVal).getTime()
    }
    return sortDirection.value === 'asc' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1)
  })
  return sorted
})

async function loadBackups() {
  loading.value = true
  try {
    const response = await axios.get('/api/admin/backups')
    items.value = response.data.backups || response.data || []
  } catch (error) {
    showAlert('Error al cargar respaldos', 'danger')
  } finally {
    loading.value = false
  }
}

function openCreateModal() {
  showFormModal.value = true
}

function closeCreateModal() {
  showFormModal.value = false
}

async function handleCreate(formData) {
  creating.value = true
  try {
    const response = await axios.post('/api/admin/backups', formData)
    showAlert(response.data.message || 'Respaldo creado exitosamente', 'success')
    closeCreateModal()
    await loadBackups()
  } catch (error) {
    showAlert(error.response?.data?.message || 'Error al crear respaldo', 'danger')
  } finally {
    creating.value = false
  }
}

async function handleDownload(item) {
  try {
    const response = await axios.get(`/api/admin/backups/${item.id}/download`, { responseType: 'blob' })
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', item.nombre)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
    showAlert('Descarga iniciada', 'success')
  } catch (error) {
    showAlert('Error al descargar respaldo', 'danger')
  }
}

async function handleRestore(item) {
  if (!confirm('¿Está seguro de restaurar este backup? Esta acción reemplazará todos los datos actuales.')) return
  creating.value = true
  try {
    const response = await axios.post(`/api/admin/backups/${item.id}/restore`)
    showAlert(response.data.message || 'Respaldo restaurado exitosamente', 'success')
    await loadBackups()
  } catch (error) {
    showAlert(error.response?.data?.message || 'Error al restaurar respaldo', 'danger')
  } finally {
    creating.value = false
  }
}

async function handleDelete(id) {
  if (!confirm('¿Está seguro de eliminar este respaldo?')) return
  try {
    await axios.delete(`/api/admin/backups/${id}`)
    showAlert('Respaldo eliminado exitosamente', 'success')
    await loadBackups()
  } catch (error) {
    showAlert('Error al eliminar respaldo', 'danger')
  }
}

function showCleanupModal() {
  cleanupDays.value = 30
  showCleanup.value = true
}

async function handleCleanup() {
  if (!confirm(`¿Eliminar respaldos con más de ${cleanupDays.value} días?`)) return
  creating.value = true
  try {
    const response = await axios.post('/api/admin/backups/cleanup', { days: cleanupDays.value })
    showAlert(response.data.message || 'Limpieza completada', 'success')
    showCleanup.value = false
    await loadBackups()
  } catch (error) {
    showAlert('Error al limpiar respaldos', 'danger')
  } finally {
    creating.value = false
  }
}

function handleSort(field) {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDirection.value = 'asc'
  }
}

function getTipoBadgeClass(tipo) {
  return { 'completo': 'bg-primary', 'tablas': 'bg-info', 'estructura': 'bg-secondary' }[tipo] || 'bg-secondary'
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleString('es-MX', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function showAlert(message, type = 'info') {
  alerts.value.push({ message, type })
  setTimeout(() => alerts.value.shift(), 5000)
}

function dismissAlert(index) {
  alerts.value.splice(index, 1)
}

function getAlertIcon(type) {
  return { success: 'bi bi-check-circle-fill', danger: 'bi bi-exclamation-triangle-fill', warning: 'bi bi-exclamation-circle-fill', info: 'bi bi-info-circle-fill' }[type] || 'bi bi-info-circle-fill'
}

onMounted(() => loadBackups())
</script>

<style scoped>
.backup-app { padding: 1.5rem; }
.card { border: none; box-shadow: 0 0.125rem 0.25rem rgba(0,0,0,0.075); }
.table thead th { border-top: none; font-weight: 600; text-transform: uppercase; font-size: 0.875rem; color: #6c757d; }
.table tbody tr:hover { background-color: rgba(0,123,255,0.05); }
code.text-primary { background-color: rgba(13,110,253,0.1); padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.875rem; }
[data-bs-theme="dark"] .table thead th { color: #adb5bd; }
[data-bs-theme="dark"] .table tbody tr:hover { background-color: rgba(255,255,255,0.05); }
[data-bs-theme="dark"] code.text-primary { background-color: rgba(13,110,253,0.2); }
</style>
