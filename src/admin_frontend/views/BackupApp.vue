<template>
  <div class="backup-app">
    <!-- Header simplificado -->
    <div class="app-header d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1 class="h3 mb-0">
          <i class="bi bi-shield-check me-2 text-primary"></i>
          Gestión de Respaldos
        </h1>
        <p class="text-muted mb-0">Agrega el primer respaldo haciendo clic en el botón "Crear Respaldo"</p>
      </div>
      <div>
        <button 
          class="btn btn-success"
          @click="createBackup"
          :disabled="isCreatingBackup"
        >
          <i class="bi bi-plus-circle me-2"></i>
          {{ isCreatingBackup ? 'Creando...' : 'Crear Respaldo' }}
        </button>
      </div>
    </div>

    <!-- Mensaje si no hay respaldos -->
    <div v-if="backups.length === 0" class="text-center py-4">
      <i class="bi bi-archive fa-3x text-muted mb-3"></i>
      <h5 class="text-muted">No hay respaldos para mostrar</h5>
      <p class="text-muted">Agrega el primer respaldo haciendo clic en el botón "Crear Respaldo"</p>
    </div>

    <!-- Tabla de respaldos si existen -->
    <div v-else class="card">
      <div class="card-header">
        <h5 class="card-title mb-0">
          <i class="bi bi-list me-2"></i>
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
          <i class="bi bi-archive fa-3x text-muted mb-3"></i>
          <h5 class="text-muted">No hay respaldos para mostrar</h5>
          <p class="text-muted">Agrega el primer respaldo haciendo clic en el botón "Crear Respaldo"</p>
        </div>
        <div v-else class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>Archivo</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="backup in backups" :key="backup.filename">
                <td>{{ backup.filename }}</td>
                <td>{{ backup.created_human }}</td>
                <td>
                  <button class="btn btn-outline-primary btn-sm me-2" @click="downloadBackup(backup.filename)">
                    <i class="bi bi-download"></i> Descargar
                  </button>
                  <button class="btn btn-outline-danger btn-sm" @click="deleteBackup(backup.filename)">
                    <i class="bi bi-trash"></i> Eliminar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal para crear respaldo -->
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
                <p>¿Deseas crear un nuevo respaldo de la base de datos?</p>
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
              :disabled="isExecutingBackup"
            >
              <i class="bi bi-database me-2"></i>
              {{ isExecutingBackup ? 'Creando...' : 'Crear Respaldo' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para limpieza -->
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
                <i class="bi bi-exclamation-triangle me-2"></i>
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
              <i class="bi bi-trash"></i>
              {{ isCleaning ? 'Limpiando...' : 'Eliminar Respaldos' }}
            </button>
          </div>
        </div>
      </div>
    </div>






  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useToast } from '../../composables/useToast'
import api from '../../config/api'
import DynamicListView from '../components/DynamicListView.vue'
import BackupActions from '../components/BackupActions.vue'
import { getAppConfig } from '../config/appConfigs'

export default {
  name: 'BackupApp',
  components: {
    DynamicListView,
    BackupActions
  },
  setup() {
    const { showToast, toasts, removeToast } = useToast()
    
    // State
    const backups = ref([])
    const storageInfo = ref({
      total_backups: 0,
      total_size: '0 B',
      total_size_bytes: 0
    })
    const mongoStatus = ref('Verificando...')
    const isLoading = ref(false)
    const isCreatingBackup = ref(false)
    const isExecutingBackup = ref(false)
    const isCleaning = ref(false)
    const lastOutput = ref('')
    
    // Configuración
    const backupConfig = ref(getAppConfig('respaldos'))
    const backupOptions = ref({
      cleanup: false,
      retention_days: 7
    })
    const cleanupDays = ref(30)
    const scheduleConfig = ref({
      enabled: false,
      frequency: 'daily',
      time: '02:00',
      retention_days: 30,
      cleanup_enabled: true
    })
    
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
      // Mostrar modal usando el método más compatible
      const modalElement = document.getElementById('createBackupModal')
      if (modalElement) {
        // Intentar usar Bootstrap si está disponible
        if (typeof bootstrap !== 'undefined') {
          const modal = new bootstrap.Modal(modalElement)
          modal.show()
        } else {
          // Fallback para mostrar modal manualmente
          modalElement.style.display = 'block'
          modalElement.classList.add('show')
          document.body.classList.add('modal-open')
        }
      }
    }
    
    const executeBackup = async () => {
      try {
        isExecutingBackup.value = true
        
        const response = await api.post('/admin/backups', backupOptions.value)
        
        if (response.data.success) {
          showToast('Respaldo creado exitosamente', 'success')
          lastOutput.value = response.data.output
          
          // Cerrar modal
          const modalElement = document.getElementById('createBackupModal')
          if (modalElement) {
            if (typeof bootstrap !== 'undefined') {
              const modal = bootstrap.Modal.getInstance(modalElement)
              if (modal) modal.hide()
            } else {
              modalElement.style.display = 'none'
              modalElement.classList.remove('show')
              document.body.classList.remove('modal-open')
            }
          }
          
          // Actualizar datos
          await loadBackups()
        } else {
          showToast(response.data.message || 'Error al crear respaldo', 'error')
          lastOutput.value = response.data.output || ''
        }
      } catch (error) {
        console.error('Error creating backup:', error)
        showToast('Error al crear respaldo', 'error')
      } finally {
        isExecutingBackup.value = false
      }
    }
    
    const showCleanupModal = () => {
      const modalElement = document.getElementById('cleanupModal')
      if (modalElement) {
        if (typeof bootstrap !== 'undefined') {
          const modal = new bootstrap.Modal(modalElement)
          modal.show()
        } else {
          modalElement.style.display = 'block'
          modalElement.classList.add('show')
          document.body.classList.add('modal-open')
        }
      }
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
          
          // Cerrar modal
          const modalElement = document.getElementById('cleanupModal')
          if (modalElement) {
            if (typeof bootstrap !== 'undefined') {
              const modal = bootstrap.Modal.getInstance(modalElement)
              if (modal) modal.hide()
            } else {
              modalElement.style.display = 'none'
              modalElement.classList.remove('show')
              document.body.classList.remove('modal-open')
            }
          }
          
          // Actualizar datos
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
    
    const showScheduleModal = () => {
      const modalElement = document.getElementById('scheduleModal')
      if (modalElement) {
        if (typeof bootstrap !== 'undefined') {
          const modal = new bootstrap.Modal(modalElement)
          modal.show()
        } else {
          modalElement.style.display = 'block'
          modalElement.classList.add('show')
          document.body.classList.add('modal-open')
        }
      }
    }
    
    const saveSchedule = () => {
      // Guardar configuración de programación (implementar según necesidades)
      showToast('Configuración guardada (función pendiente de implementar)', 'info')
      const modalElement = document.getElementById('scheduleModal')
      if (modalElement) {
        if (typeof bootstrap !== 'undefined') {
          const modal = bootstrap.Modal.getInstance(modalElement)
          if (modal) modal.hide()
        } else {
          modalElement.style.display = 'none'
          modalElement.classList.remove('show')
          document.body.classList.remove('modal-open')
        }
      }
    }
    
    const handleCustomAction = (action, item) => {
      switch (action) {
        case 'create_backup':
          createBackup()
          break
        case 'cleanup_old':
          showCleanupModal()
          break
        case 'schedule_backup':
          showScheduleModal()
          break
      }
    }
    
    // Toast helper functions
    const getToastClass = (type) => {
      const classes = {
        'success': 'success',
        'error': 'danger',
        'warning': 'warning',
        'info': 'info'
      }
      return classes[type] || 'info'
    }
    
    const getToastIcon = (type) => {
      const icons = {
        'success': 'bi bi-check-circle-fill',
        'error': 'bi bi-exclamation-triangle-fill',
        'warning': 'bi bi-exclamation-triangle-fill',
        'info': 'bi bi-info-circle-fill'
      }
      return icons[type] || 'bi bi-info-circle-fill'
    }
    
    // Lifecycle
    onMounted(() => {
      Promise.all([
        loadBackups(),
        checkMongoStatus()
      ])
    })
    
    return {
      // State
      backups,
      storageInfo,
      mongoStatus,
      isLoading,
      isCreatingBackup,
      isExecutingBackup,
      isCleaning,
      lastOutput,
      backupConfig,
      backupOptions,
      cleanupDays,
      scheduleConfig,
      
      // Computed
      latestBackupAge,
      
      // Methods
      loadBackups,
      createBackup,
      executeBackup,
      showCleanupModal,
      executeCleanup,
      showScheduleModal,
      saveSchedule,
      handleCustomAction,
      
      // Toast
      toasts,
      removeToast,
      getToastClass,
      getToastIcon
    }
  }
}
</script>

<style scoped>
.backup-app {
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

pre {
  font-size: 0.875rem;
  line-height: 1.4;
}

.app-header {
  border-bottom: 1px solid #dee2e6;
  padding-bottom: 1rem;
}
</style>
