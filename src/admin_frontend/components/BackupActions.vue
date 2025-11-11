<template>
  <div class="backup-actions">
    <div class="btn-group btn-group-sm">
      <button 
        class="btn btn-outline-primary"
        @click="downloadBackup(item.filename)"
        title="Descargar"
        :disabled="isDownloading"
      >
        <i class="bi bi-download"></i>
      </button>
      <button 
        class="btn btn-outline-danger"
        @click="deleteBackup(item.filename)"
        title="Eliminar"
        :disabled="isDeleting"
      >
        <i class="bi bi-trash"></i>
      </button>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useToast } from '../../composables/useToast'
import api from '../../config/api'

export default {
  name: 'BackupActions',
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  emits: ['refresh'],
  setup(props, { emit }) {
    const { showToast } = useToast()
    const isDownloading = ref(false)
    const isDeleting = ref(false)
    
    const downloadBackup = async (filename) => {
      try {
        isDownloading.value = true
        
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
      } finally {
        isDownloading.value = false
      }
    }
    
    const deleteBackup = async (filename) => {
      if (!confirm(`¿Estás seguro de que quieres eliminar el respaldo "${filename}"?`)) {
        return
      }
      
      try {
        isDeleting.value = true
        
        const response = await api.delete(`/admin/backups/${filename}`)
        
        if (response.data.success) {
          showToast('Respaldo eliminado exitosamente', 'success')
          emit('refresh')
        } else {
          showToast(response.data.message || 'Error al eliminar respaldo', 'error')
        }
      } catch (error) {
        console.error('Error deleting backup:', error)
        showToast('Error al eliminar respaldo', 'error')
      } finally {
        isDeleting.value = false
      }
    }
    
    return {
      isDownloading,
      isDeleting,
      downloadBackup,
      deleteBackup
    }
  }
}
</script>

<style scoped>
.backup-actions .btn {
  padding: 0.25rem 0.5rem;
}
</style>
