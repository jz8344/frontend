<template>
  <div class="admin-respaldos">
    <div class="container-fluid py-4">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="mb-1">
            <i class="bi bi-shield-check me-2"></i>
            Gestión de Respaldos
          </h2>
          <p class="text-muted mb-0">Base de datos PostgreSQL</p>
        </div>
        <button class="btn btn-primary" @click="showCreateModal = true">
          <i class="bi bi-plus-lg me-2"></i>
          Crear Backup
        </button>
      </div>

      <!-- Alertas -->
      <div v-if="alert.show" :class="`alert alert-${alert.type} alert-dismissible fade show`" role="alert">
        <i :class="`bi bi-${alert.icon} me-2`"></i>
        {{ alert.message }}
        <button type="button" class="btn-close" @click="alert.show = false"></button>
      </div>

      <!-- Lista de Backups -->
      <div class="card shadow-sm">
        <div class="card-header bg-white">
          <div class="d-flex justify-content-between align-items-center">
            <h5 class="mb-0">
              <i class="bi bi-archive me-2"></i>
              Backups Disponibles
            </h5>
            <button class="btn btn-sm btn-outline-danger" @click="showCleanupModal = true">
              <i class="bi bi-trash me-1"></i>
              Limpiar Antiguos
            </button>
          </div>
        </div>
        <div class="card-body">
          <!-- Loading -->
          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-3 text-muted">Cargando backups...</p>
          </div>

          <!-- Tabla de Backups -->
          <div v-else-if="backups.length > 0" class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Tipo</th>
                  <th>Formato</th>
                  <th>Tamaño</th>
                  <th>Creado Por</th>
                  <th>Fecha</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="backup in backups" :key="backup.id">
                  <td>
                    <i class="bi bi-file-earmark-zip text-primary me-2"></i>
                    <span class="font-monospace">{{ backup.nombre }}</span>
                  </td>
                  <td>
                    <span :class="`badge bg-${getTypeBadge(backup.tipo)}`">
                      {{ backup.tipo }}
                    </span>
                  </td>
                  <td>
                    <span class="badge bg-secondary">{{ backup.formato }}</span>
                  </td>
                  <td>{{ backup.tamano_formateado }}</td>
                  <td>{{ backup.created_by }}</td>
                  <td>{{ formatDate(backup.created_at) }}</td>
                  <td>
                    <div class="btn-group btn-group-sm">
                      <button
                        class="btn btn-outline-primary"
                        @click="downloadBackup(backup.id)"
                        title="Descargar"
                      >
                        <i class="bi bi-download"></i>
                      </button>
                      <button
                        class="btn btn-outline-success"
                        @click="confirmRestore(backup)"
                        title="Restaurar"
                      >
                        <i class="bi bi-arrow-counterclockwise"></i>
                      </button>
                      <button
                        class="btn btn-outline-danger"
                        @click="confirmDelete(backup)"
                        title="Eliminar"
                      >
                        <i class="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Sin backups -->
          <div v-else class="text-center py-5">
            <i class="bi bi-inbox display-1 text-muted"></i>
            <p class="mt-3 text-muted">No hay backups disponibles</p>
            <button class="btn btn-primary" @click="showCreateModal = true">
              Crear Primer Backup
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Crear Backup -->
    <div v-if="showCreateModal" class="modal d-block" tabindex="-1" style="background: rgba(0,0,0,0.5);">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="bi bi-plus-circle me-2"></i>
              Crear Nuevo Backup
            </h5>
            <button type="button" class="btn-close" @click="closeCreateModal"></button>
          </div>
          <form @submit.prevent="createBackup">
            <div class="modal-body">
              <!-- Tipo de Backup -->
              <div class="mb-3">
                <label class="form-label fw-bold">Tipo de Backup</label>
                <div class="row g-2">
                  <div class="col-md-4">
                    <div class="form-check card p-3">
                      <input
                        class="form-check-input"
                        type="radio"
                        v-model="backupForm.tipo"
                        value="completo"
                        id="tipo-completo"
                      />
                      <label class="form-check-label" for="tipo-completo">
                        <i class="bi bi-database me-2"></i>
                        <strong>Completo</strong>
                        <small class="d-block text-muted">Toda la base de datos</small>
                      </label>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-check card p-3">
                      <input
                        class="form-check-input"
                        type="radio"
                        v-model="backupForm.tipo"
                        value="tablas"
                        id="tipo-tablas"
                      />
                      <label class="form-check-label" for="tipo-tablas">
                        <i class="bi bi-table me-2"></i>
                        <strong>Por Tablas</strong>
                        <small class="d-block text-muted">Seleccionar tablas</small>
                      </label>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-check card p-3">
                      <input
                        class="form-check-input"
                        type="radio"
                        v-model="backupForm.tipo"
                        value="estructura"
                        id="tipo-estructura"
                      />
                      <label class="form-check-label" for="tipo-estructura">
                        <i class="bi bi-diagram-3 me-2"></i>
                        <strong>Solo Estructura</strong>
                        <small class="d-block text-muted">Sin datos</small>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Selección de Tablas -->
              <div v-if="backupForm.tipo === 'tablas'" class="mb-3">
                <label class="form-label fw-bold">Seleccionar Tablas</label>
                <div v-if="loadingTables" class="text-center py-3">
                  <span class="spinner-border spinner-border-sm"></span>
                  Cargando tablas...
                </div>
                <div v-else class="border rounded p-3" style="max-height: 200px; overflow-y: auto;">
                  <div class="form-check" v-for="table in availableTables" :key="table">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      :value="table"
                      v-model="backupForm.tablas"
                      :id="`table-${table}`"
                    />
                    <label class="form-check-label" :for="`table-${table}`">
                      {{ table }}
                    </label>
                  </div>
                </div>
                <small class="text-muted">{{ backupForm.tablas.length }} tabla(s) seleccionada(s)</small>
              </div>

              <!-- Formato -->
              <div class="mb-3">
                <label class="form-label fw-bold">Formato de Compresión</label>
                <div class="row g-2">
                  <div class="col-md-4">
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="radio"
                        v-model="backupForm.formato"
                        value="sql"
                        id="formato-sql"
                      />
                      <label class="form-check-label" for="formato-sql">
                        .SQL (Sin comprimir)
                      </label>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="radio"
                        v-model="backupForm.formato"
                        value="gz"
                        id="formato-gz"
                      />
                      <label class="form-check-label" for="formato-gz">
                        .GZ (Gzip)
                      </label>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="radio"
                        v-model="backupForm.formato"
                        value="zip"
                        id="formato-zip"
                      />
                      <label class="form-check-label" for="formato-zip">
                        .ZIP
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Descripción -->
              <div class="mb-3">
                <label class="form-label">Descripción (Opcional)</label>
                <textarea
                  class="form-control"
                  v-model="backupForm.descripcion"
                  rows="2"
                  placeholder="Ej: Backup antes de actualización..."
                ></textarea>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="closeCreateModal">
                Cancelar
              </button>
              <button type="submit" class="btn btn-primary" :disabled="creating">
                <span v-if="creating" class="spinner-border spinner-border-sm me-2"></span>
                <i v-else class="bi bi-check-lg me-2"></i>
                {{ creating ? 'Creando...' : 'Crear Backup' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal Confirmar Eliminación -->
    <div v-if="deleteModal.show" class="modal d-block" tabindex="-1" style="background: rgba(0,0,0,0.5);">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title">
              <i class="bi bi-exclamation-triangle me-2"></i>
              Confirmar Eliminación
            </h5>
            <button type="button" class="btn-close btn-close-white" @click="deleteModal.show = false"></button>
          </div>
          <div class="modal-body">
            <p>¿Está seguro que desea eliminar el backup <strong>{{ deleteModal.backup?.nombre }}</strong>?</p>
            <div class="alert alert-warning">
              <i class="bi bi-info-circle me-2"></i>
              Esta acción no se puede deshacer.
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="deleteModal.show = false">
              Cancelar
            </button>
            <button type="button" class="btn btn-danger" @click="deleteBackup" :disabled="deleting">
              <span v-if="deleting" class="spinner-border spinner-border-sm me-2"></span>
              {{ deleting ? 'Eliminando...' : 'Eliminar' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Confirmar Restauración -->
    <div v-if="restoreModal.show" class="modal d-block" tabindex="-1" style="background: rgba(0,0,0,0.5);">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header bg-warning">
            <h5 class="modal-title">
              <i class="bi bi-exclamation-triangle me-2"></i>
              Confirmar Restauración
            </h5>
            <button type="button" class="btn-close" @click="restoreModal.show = false"></button>
          </div>
          <div class="modal-body">
            <p>¿Está seguro que desea restaurar el backup <strong>{{ restoreModal.backup?.nombre }}</strong>?</p>
            <div class="alert alert-danger">
              <i class="bi bi-exclamation-circle me-2"></i>
              <strong>ADVERTENCIA:</strong> Esta acción reemplazará todos los datos actuales de la base de datos.
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="restoreModal.show = false">
              Cancelar
            </button>
            <button type="button" class="btn btn-warning" @click="restoreBackup" :disabled="restoring">
              <span v-if="restoring" class="spinner-border spinner-border-sm me-2"></span>
              {{ restoring ? 'Restaurando...' : 'Restaurar' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Limpiar Antiguos -->
    <div v-if="showCleanupModal" class="modal d-block" tabindex="-1" style="background: rgba(0,0,0,0.5);">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="bi bi-trash me-2"></i>
              Limpiar Backups Antiguos
            </h5>
            <button type="button" class="btn-close" @click="showCleanupModal = false"></button>
          </div>
          <div class="modal-body">
            <label class="form-label">Eliminar backups con más de:</label>
            <select class="form-select" v-model="cleanupDays">
              <option value="7">7 días</option>
              <option value="15">15 días</option>
              <option value="30">30 días</option>
              <option value="60">60 días</option>
              <option value="90">90 días</option>
            </select>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="showCleanupModal = false">
              Cancelar
            </button>
            <button type="button" class="btn btn-danger" @click="cleanupBackups" :disabled="cleaning">
              <span v-if="cleaning" class="spinner-border spinner-border-sm me-2"></span>
              {{ cleaning ? 'Limpiando...' : 'Limpiar' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { API_BASE_URL } from '@/config/api'
import { useNotifications } from '@/composables/useNotifications'

const { notifyCreated, notifyDeleted } = useNotifications()

// Estado
const loading = ref(false)
const creating = ref(false)
const deleting = ref(false)
const restoring = ref(false)
const cleaning = ref(false)
const loadingTables = ref(false)
const backups = ref([])
const availableTables = ref([])
const showCreateModal = ref(false)
const showCleanupModal = ref(false)
const cleanupDays = ref(30)

const backupForm = reactive({
  tipo: 'completo',
  formato: 'sql',
  tablas: [],
  descripcion: ''
})

const alert = reactive({
  show: false,
  type: 'success',
  icon: 'check-circle',
  message: ''
})

const deleteModal = reactive({
  show: false,
  backup: null
})

const restoreModal = reactive({
  show: false,
  backup: null
})

// Funciones
async function loadBackups() {
  loading.value = true
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/backups`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
        'Accept': 'application/json'
      }
    })

    if (response.ok) {
      backups.value = await response.json()
    } else {
      showAlert('error', 'exclamation-circle', 'Error al cargar backups')
    }
  } catch (error) {
    console.error('Error:', error)
    showAlert('error', 'exclamation-circle', 'Error de conexión')
  } finally {
    loading.value = false
  }
}

async function loadTables() {
  loadingTables.value = true
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/backups/tables`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
        'Accept': 'application/json'
      }
    })

    if (response.ok) {
      availableTables.value = await response.json()
    }
  } catch (error) {
    console.error('Error loading tables:', error)
  } finally {
    loadingTables.value = false
  }
}

async function createBackup() {
  creating.value = true
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/backups`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(backupForm)
    })

    const data = await response.json()

    if (response.ok) {
      showAlert('success', 'check-circle', data.message || 'Backup creado exitosamente')
      notifyCreated('respaldo', data.nombre || `Backup ${backupForm.tipo}`)
      closeCreateModal()
      loadBackups()
    } else {
      showAlert('danger', 'exclamation-circle', data.error || 'Error al crear backup')
    }
  } catch (error) {
    console.error('Error:', error)
    showAlert('danger', 'exclamation-circle', 'Error de conexión')
  } finally {
    creating.value = false
  }
}

function downloadBackup(id) {
  window.open(`${API_BASE_URL}/api/admin/backups/${id}/download?token=${localStorage.getItem('admin_token')}`, '_blank')
}

function confirmDelete(backup) {
  deleteModal.backup = backup
  deleteModal.show = true
}

async function deleteBackup() {
  deleting.value = true
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/backups/${deleteModal.backup.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
        'Accept': 'application/json'
      }
    })

    const data = await response.json()

    if (response.ok) {
      showAlert('success', 'check-circle', data.message || 'Backup eliminado exitosamente')
      notifyDeleted('respaldo', deleteModal.backup.nombre)
      deleteModal.show = false
      loadBackups()
    } else {
      showAlert('danger', 'exclamation-circle', data.error || 'Error al eliminar backup')
    }
  } catch (error) {
    console.error('Error:', error)
    showAlert('danger', 'exclamation-circle', 'Error de conexión')
  } finally {
    deleting.value = false
  }
}

function confirmRestore(backup) {
  restoreModal.backup = backup
  restoreModal.show = true
}

async function restoreBackup() {
  restoring.value = true
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/backups/${restoreModal.backup.id}/restore`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
        'Accept': 'application/json'
      }
    })

    const data = await response.json()

    if (response.ok) {
      showAlert('success', 'check-circle', data.message || 'Backup restaurado exitosamente')
      restoreModal.show = false
    } else {
      showAlert('danger', 'exclamation-circle', data.error || 'Error al restaurar backup')
    }
  } catch (error) {
    console.error('Error:', error)
    showAlert('danger', 'exclamation-circle', 'Error de conexión')
  } finally {
    restoring.value = false
  }
}

async function cleanupBackups() {
  cleaning.value = true
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/backups/cleanup`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ dias: cleanupDays.value })
    })

    const data = await response.json()

    if (response.ok) {
      showAlert('success', 'check-circle', data.message)
      showCleanupModal.value = false
      loadBackups()
    } else {
      showAlert('danger', 'exclamation-circle', data.error || 'Error al limpiar backups')
    }
  } catch (error) {
    console.error('Error:', error)
    showAlert('danger', 'exclamation-circle', 'Error de conexión')
  } finally {
    cleaning.value = false
  }
}

function closeCreateModal() {
  showCreateModal.value = false
  backupForm.tipo = 'completo'
  backupForm.formato = 'sql'
  backupForm.tablas = []
  backupForm.descripcion = ''
}

function showAlert(type, icon, message) {
  alert.show = true
  alert.type = type
  alert.icon = icon
  alert.message = message

  setTimeout(() => {
    alert.show = false
  }, 5000)
}

function getTypeBadge(tipo) {
  const badges = {
    'completo': 'primary',
    'tablas': 'info',
    'estructura': 'secondary'
  }
  return badges[tipo] || 'secondary'
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleString('es-MX', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Lifecycle
onMounted(() => {
  loadBackups()
  loadTables()
})
</script>

<style scoped>
.admin-respaldos {
  min-height: 100vh;
  background-color: var(--bs-body-bg);
}

.card {
  border: 1px solid var(--bs-border-color);
}

.form-check.card {
  cursor: pointer;
  transition: all 0.2s;
}

.form-check.card:hover {
  border-color: var(--bs-primary);
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.form-check-input:checked + label {
  color: var(--bs-primary);
}

.table {
  color: var(--bs-body-color);
}

[data-bs-theme="dark"] .card {
  background-color: var(--bs-dark);
  border-color: #495057;
}

[data-bs-theme="dark"] .table {
  --bs-table-bg: transparent;
}

[data-bs-theme="dark"] .table > :not(caption) > * > * {
  background-color: transparent;
  border-bottom-color: #495057;
}

[data-bs-theme="dark"] .table-hover > tbody > tr:hover > * {
  background-color: rgba(255, 255, 255, 0.05);
}

.modal-content {
  background-color: var(--bs-body-bg);
  color: var(--bs-body-color);
}
</style>
