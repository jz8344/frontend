<template>
  <div class="backup-management">
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1 class="h3 mb-0">
          <i class="fas fa-database me-2 text-primary"></i>
          Respaldos de Base de Datos
        </h1>
        <p class="text-muted mb-0">Gestiona los respaldos de MongoDB Atlas</p>
      </div>
      <button 
        class="btn btn-primary"
        @click="createBackup"
        :disabled="isLoading"
      >
        <i class="fas fa-plus me-2"></i>
        {{ isLoading ? 'Creando...' : 'Nuevo Respaldo' }}
      </button>
    </div>

    <!-- Status Cards -->
    <div class="row mb-4">
      <div class="col-md-3">
        <div class="card bg-primary text-white">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <i class="fas fa-database fa-2x me-3"></i>
              <div>
                <div class="h5 mb-0">{{ mongoStatus }}</div>
                <small>Estado MongoDB</small>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card bg-success text-white">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <i class="fas fa-archive fa-2x me-3"></i>
              <div>
                <div class="h5 mb-0">{{ storageInfo.total_backups }}</div>
                <small>Total Respaldos</small>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card bg-info text-white">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <i class="fas fa-hdd fa-2x me-3"></i>
              <div>
                <div class="h5 mb-0">{{ storageInfo.total_size }}</div>
                <small>Espacio Usado</small>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card bg-warning text-white">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <i class="fas fa-clock fa-2x me-3"></i>
              <div>
                <div class="h5 mb-0">{{ latestBackupAge }}</div>
                <small>Último Respaldo</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Backup Creation Modal -->
    <div class="modal fade" id="createBackupModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Crear Nuevo Respaldo</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="executeBackup">
              <div class="mb-3">
                <div class="form-check">
                  <input 
                    class="form-check-input" 
                    type="checkbox" 
                    id="cleanupAfter"
                    v-model="backupOptions.cleanup"
                  >
                  <label class="form-check-label" for="cleanupAfter">
                    Limpiar respaldos antiguos después de crear
                  </label>
                </div>
              </div>
              <div class="mb-3" v-if="backupOptions.cleanup">
                <label for="retentionDays" class="form-label">Días de retención</label>
                <input 
                  type="number" 
                  class="form-control" 
                  id="retentionDays"
                  v-model.number="backupOptions.retention_days"
                  min="1" 
                  max="365"
                >
                <div class="form-text">
                  Los respaldos más antiguos que este número de días serán eliminados.
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              Cancelar
            </button>
            <button 
              type="button" 
              class="btn btn-primary"
              @click="executeBackup"
              :disabled="isCreating"
            >
              <i class="fas fa-database me-2"></i>
              {{ isCreating ? 'Creando...' : 'Crear Respaldo' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Cleanup Modal -->
    <div class="modal fade" id="cleanupModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Limpiar Respaldos Antiguos</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="executeCleanup">
              <div class="mb-3">
                <label for="cleanupDays" class="form-label">Eliminar respaldos más antiguos que:</label>
                <input 
                  type="number" 
                  class="form-control" 
                  id="cleanupDays"
                  v-model.number="cleanupDays"
                  min="1" 
                  max="365"
                  required
                >
                <div class="form-text">
                  Se eliminarán todos los respaldos que tengan más de este número de días.
                </div>
              </div>
              <div class="alert alert-warning">
                <i class="fas fa-exclamation-triangle me-2"></i>
                Esta acción no se puede deshacer. Los respaldos eliminados no se podrán recuperar.
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              Cancelar
            </button>
            <button 
              type="button" 
              class="btn btn-danger"
              @click="executeCleanup"
              :disabled="isCleaning"
            >
              <i class="fas fa-trash-alt me-2"></i>
              {{ isCleaning ? 'Limpiando...' : 'Eliminar Respaldos' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Controls -->
    <div class="row mb-4">
      <div class="col-md-6">
        <button 
          class="btn btn-outline-danger me-2"
          @click="showCleanupModal"
        >
          <i class="fas fa-broom me-2"></i>
          Limpiar Antiguos
        </button>
        <button 
          class="btn btn-outline-info"
          @click="refreshData"
          :disabled="isLoading"
        >
          <i class="fas fa-sync-alt me-2"></i>
          Actualizar
        </button>
      </div>
    </div>

    <!-- Backups List -->
    <div class="card">
      <div class="card-header">
        <h5 class="card-title mb-0">
          <i class="fas fa-list me-2"></i>
          Lista de Respaldos
        </h5>
      </div>
      <div class="card-body">
        <div v-if="isLoading" class="text-center py-4">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Cargando...</span>
          </div>
          <p class="mt-2 text-muted">Cargando respaldos...</p>
        </div>
        
        <div v-else-if="backups.length === 0" class="text-center py-4">
          <i class="fas fa-archive fa-3x text-muted mb-3"></i>
          <h5 class="text-muted">No hay respaldos disponibles</h5>
          <p class="text-muted">Crea tu primer respaldo haciendo clic en "Crear Respaldo"</p>
        </div>
        
        <div v-else class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>Archivo</th>
                <th>Tamaño</th>
                <th>Fecha de Creación</th>
                <th>Antigüedad</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="backup in backups" :key="backup.filename">
                <td>
                  <i class="fas fa-file-archive text-primary me-2"></i>
                  {{ backup.filename }}
                </td>
                <td>
                  <span class="badge bg-info">{{ backup.size }}</span>
                </td>
                <td>{{ formatDate(backup.created_at) }}</td>
                <td>
                  <span :class="getAgeClass(backup.age_days)">
                    {{ backup.created_human }}
                  </span>
                </td>
                <td>
                  <div class="btn-group btn-group-sm">
                    <button 
                      class="btn btn-outline-primary"
                      @click="downloadBackup(backup.filename)"
                      title="Descargar"
                    >
                      <i class="fas fa-download"></i>
                    </button>
                    <button 
                      class="btn btn-outline-danger"
                      @click="deleteBackup(backup.filename)"
                      title="Eliminar"
                    >
                      <i class="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Output Log -->
    <div v-if="lastOutput" class="card mt-4">
      <div class="card-header">
        <h5 class="card-title mb-0">
          <i class="fas fa-terminal me-2"></i>
          Último Log de Ejecución
        </h5>
      </div>
      <div class="card-body">
        <pre class="bg-dark text-light p-3 rounded" style="max-height: 300px; overflow-y: auto;">{{ lastOutput }}</pre>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useToast } from '@/composables/useToast'
import api from '@/config/api'

export default {
  name: 'BackupManagement',
  setup() {
    const { showToast } = useToast()
    
    // State
    const backups = ref([])
    const storageInfo = ref({
      total_backups: 0,
      total_size: '0 B',
      total_size_bytes: 0
    })
    const mongoStatus = ref('Verificando...')
    const isLoading = ref(false)
    const isCreating = ref(false)
    const isCleaning = ref(false)
    const lastOutput = ref('')
    
    // Backup options
    const backupOptions = ref({
      cleanup: false,
      retention_days: 7
    })
    const cleanupDays = ref(30)
    
    // Computed
    const latestBackupAge = computed(() => {
      if (backups.value.length === 0) return 'N/A'
      return backups.value[0].created_human
    })
    
    // Methods
    const loadBackups = async () => {
      try {
        isLoading.value = true
        const response = await api.get('/admin/backups')
        
        if (response.data.success) {
          backups.value = response.data.backups
          storageInfo.value = response.data.storage_info
        }
      } catch (error) {
        console.error('Error loading backups:', error)
        showToast('Error al cargar respaldos', 'error')
      } finally {
        isLoading.value = false
      }
    }
    
    const checkMongoStatus = async () => {
      try {
        const response = await api.get('/admin/backups/status')
        mongoStatus.value = response.data.mongo_status === 'connected' ? 'Conectado' : 'Error'
      } catch (error) {
        mongoStatus.value = 'Error'
      }
    }
    
    const createBackup = () => {
      const modal = new bootstrap.Modal(document.getElementById('createBackupModal'))
      modal.show()
    }
    
    const executeBackup = async () => {
      try {
        isCreating.value = true
        
        const response = await api.post('/admin/backups', backupOptions.value)
        
        if (response.data.success) {
          showToast('Respaldo creado exitosamente', 'success')
          lastOutput.value = response.data.output
          backups.value = response.data.backups
          
          // Cerrar modal
          const modal = bootstrap.Modal.getInstance(document.getElementById('createBackupModal'))
          modal.hide()
          
          // Actualizar información de almacenamiento
          await loadBackups()
        } else {
          showToast(response.data.message || 'Error al crear respaldo', 'error')
          lastOutput.value = response.data.output || ''
        }
      } catch (error) {
        console.error('Error creating backup:', error)
        showToast('Error al crear respaldo', 'error')
      } finally {
        isCreating.value = false
      }
    }
    
    const showCleanupModal = () => {
      const modal = new bootstrap.Modal(document.getElementById('cleanupModal'))
      modal.show()
    }
    
    const executeCleanup = async () => {
      try {
        isCleaning.value = true
        
        const response = await api.post('/admin/backups/cleanup', {
          days: cleanupDays.value
        })
        
        if (response.data.success) {
          showToast(response.data.message, 'success')
          lastOutput.value = response.data.output
          backups.value = response.data.backups
          
          // Cerrar modal
          const modal = bootstrap.Modal.getInstance(document.getElementById('cleanupModal'))
          modal.hide()
          
          // Actualizar información
          await loadBackups()
        } else {
          showToast(response.data.message || 'Error en limpieza', 'error')
        }
      } catch (error) {
        console.error('Error cleaning up:', error)
        showToast('Error en limpieza de respaldos', 'error')
      } finally {
        isCleaning.value = false
      }
    }
    
    const downloadBackup = async (filename) => {
      try {
        const response = await api.get(`/admin/backups/${filename}/download`, {
          responseType: 'blob'
        })
        
        // Crear enlace de descarga
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', filename)
        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(url)
        
        showToast('Descarga iniciada', 'success')
      } catch (error) {
        console.error('Error downloading backup:', error)
        showToast('Error al descargar respaldo', 'error')
      }
    }
    
    const deleteBackup = async (filename) => {
      if (!confirm(`¿Estás seguro de que quieres eliminar el respaldo "${filename}"?`)) {
        return
      }
      
      try {
        const response = await api.delete(`/admin/backups/${filename}`)
        
        if (response.data.success) {
          showToast('Respaldo eliminado exitosamente', 'success')
          backups.value = response.data.backups
          await loadBackups()
        } else {
          showToast(response.data.message || 'Error al eliminar respaldo', 'error')
        }
      } catch (error) {
        console.error('Error deleting backup:', error)
        showToast('Error al eliminar respaldo', 'error')
      }
    }
    
    const refreshData = async () => {
      await Promise.all([
        loadBackups(),
        checkMongoStatus()
      ])
    }
    
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
    
    const getAgeClass = (days) => {
      if (days <= 1) return 'badge bg-success'
      if (days <= 7) return 'badge bg-warning'
      return 'badge bg-danger'
    }
    
    // Lifecycle
    onMounted(() => {
      refreshData()
    })
    
    return {
      // State
      backups,
      storageInfo,
      mongoStatus,
      isLoading,
      isCreating,
      isCleaning,
      lastOutput,
      backupOptions,
      cleanupDays,
      
      // Computed
      latestBackupAge,
      
      // Methods
      createBackup,
      executeBackup,
      showCleanupModal,
      executeCleanup,
      downloadBackup,
      deleteBackup,
      refreshData,
      formatDate,
      getAgeClass
    }
  }
}
</script>

<style scoped>
.backup-management {
  padding: 20px;
}

.card {
  border: none;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

.card-header {
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
}

.table th {
  border-top: none;
  font-weight: 600;
  color: #495057;
}

.btn-group-sm .btn {
  padding: 0.25rem 0.5rem;
}

pre {
  font-size: 0.875rem;
  line-height: 1.4;
}

.spinner-border {
  width: 2rem;
  height: 2rem;
}
</style>
