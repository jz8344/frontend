import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import http from '@/config/api.js'
import { getAppConfig } from '@/admin_frontend/config/appConfigs.js'

export function useDynamicApp(appName) {
  const router = useRouter()
  
  // Estado reactivo
  const items = ref([])
  const relatedData = reactive({})
  const loading = ref(false)
  const error = ref(null)
  
  // Configuración de la app
  const config = getAppConfig(appName)
  
  if (!config) {
    throw new Error(`Configuración no encontrada para la app: ${appName}`)
  }
  
  // Computed
  const apiEndpoint = computed(() => `/admin/${appName}`)
  
  // Métodos principales
  async function loadItems() {
    loading.value = true
    error.value = null
    
    try {
      const response = await http.get(apiEndpoint.value)
      items.value = response.data || []
    } catch (err) {
      error.value = `Error cargando ${config.name.toLowerCase()}: ${err.message}`
      console.error('Error loading items:', err)
    } finally {
      loading.value = false
    }
  }
  
  async function loadRelatedData() {
    if (!config.fields) return
    
    // Identificar campos que necesitan datos relacionados
    const relatedFields = config.fields.filter(field => field.relatedKey)
    
    if (relatedFields.length === 0) return
    
    try {
      // Cargar datos relacionados en paralelo
      const promises = relatedFields.map(async (field) => {
        let endpoint = ''
        
        switch (field.relatedKey) {
          case 'usuarios':
            endpoint = '/admin/usuarios'
            break
          case 'padres':
            endpoint = '/admin/usuarios'
            break
          case 'choferes':
            endpoint = '/admin/choferes'
            break
          case 'unidades':
            endpoint = '/admin/unidades'
            break
          default:
            endpoint = `/admin/${field.relatedKey}`
        }
        
        const response = await http.get(endpoint)
        let data = response.data || []
        
        // Filtrar usuarios para padres (solo usuarios con rol 'usuario')
        if (field.relatedKey === 'padres') {
          data = data.filter(user => user.rol === 'usuario')
        }
        
        relatedData[field.relatedKey] = data
      })
      
      await Promise.all(promises)
    } catch (err) {
      console.error('Error loading related data:', err)
    }
  }
  
  async function createItem(data) {
    try {
      loading.value = true
      
      // Configurar headers apropiados para FormData
      const config = {}
      if (data instanceof FormData) {
        config.headers = {
          'Content-Type': 'multipart/form-data'
        }
      }
      
      const response = await http.post(apiEndpoint.value, data, config)
      
      // Agregar el nuevo item a la lista local
      if (response.data) {
        items.value.push(response.data)
      }
      
      // Recargar la lista completa para asegurar consistencia
      await loadItems()
      
      return { success: true, data: response.data }
    } catch (err) {
      console.error('Error creating item:', err)
      let errorMessage = `Error creando ${config.singular.toLowerCase()}`
      
      if (err.response?.status === 422 && err.response?.data) {
        // Errores de validación
        const validationErrors = err.response.data
        if (typeof validationErrors === 'object') {
          const firstError = Object.values(validationErrors)[0]
          errorMessage = Array.isArray(firstError) ? firstError[0] : firstError
        }
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message
      }
      
      return { success: false, error: errorMessage, validationErrors: err.response?.data }
    } finally {
      loading.value = false
    }
  }
  
  async function updateItem(id, data) {
    try {
      loading.value = true
      
      // Para FormData con PUT, necesitamos usar POST con method spoofing
      let requestData = data
      let requestConfig = {}
      let method = 'put'
      let url = `${apiEndpoint.value}/${id}`
      
      if (data instanceof FormData) {
        // Agregar method spoofing para Laravel
        requestData.append('_method', 'PUT')
        method = 'post'
        requestConfig.headers = {
          'Content-Type': 'multipart/form-data'
        }
      }
      
      const response = await http[method](url, requestData, requestConfig)
      
      // Actualizar el item en la lista local
      const index = items.value.findIndex(item => item.id === id)
      if (index >= 0 && response.data) {
        items.value[index] = response.data
      }
      
      // Recargar la lista completa para asegurar consistencia
      await loadItems()
      
      return { success: true, data: response.data }
    } catch (err) {
      console.error('Error updating item:', err)
      let errorMessage = `Error actualizando ${config.singular.toLowerCase()}`
      
      if (err.response?.status === 422 && err.response?.data) {
        // Errores de validación
        const validationErrors = err.response.data
        if (typeof validationErrors === 'object') {
          const firstError = Object.values(validationErrors)[0]
          errorMessage = Array.isArray(firstError) ? firstError[0] : firstError
        }
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message
      }
      
      return { success: false, error: errorMessage, validationErrors: err.response?.data }
    } finally {
      loading.value = false
    }
  }
  
  async function deleteItem(id) {
    try {
      loading.value = true
      await http.delete(`${apiEndpoint.value}/${id}`)
      
      // Remover el item de la lista local
      const index = items.value.findIndex(item => item.id === id)
      if (index >= 0) {
        items.value.splice(index, 1)
      }
      
      return { success: true }
    } catch (err) {
      const errorMessage = err.response?.data?.error || 
                          err.response?.data?.message || 
                          `Error eliminando ${config.singular.toLowerCase()}`
      return { success: false, error: errorMessage }
    } finally {
      loading.value = false
    }
  }
  
  async function deleteMultipleItems(ids) {
    try {
      loading.value = true
      const results = []
      
      // Eliminar items en serie para evitar sobrecarga del servidor
      for (const id of ids) {
        try {
          await http.delete(`${apiEndpoint.value}/${id}`)
          results.push({ id, success: true })
        } catch (err) {
          results.push({ 
            id, 
            success: false, 
            error: err.response?.data?.error || 'Error eliminando item'
          })
        }
      }
      
      // Recargar la lista completa
      await loadItems()
      
      const successCount = results.filter(r => r.success).length
      const errorCount = results.filter(r => !r.success).length
      
      return { 
        success: true, 
        results,
        summary: {
          total: ids.length,
          success: successCount,
          errors: errorCount
        }
      }
    } catch (err) {
      return { 
        success: false, 
        error: `Error en eliminación múltiple: ${err.message}` 
      }
    } finally {
      loading.value = false
    }
  }
  
  // Métodos de inicialización
  async function initialize() {
    await Promise.all([
      loadRelatedData(),
      loadItems()
    ])
  }
  
  // Método para refrescar datos
  async function refresh() {
    await initialize()
  }
  
  // Métodos de utilidad
  function getDisplayValue(item, fieldKey) {
    if (!item || !fieldKey) return '-'
    
    // Manejar campos anidados (ej: 'chofer.usuario.nombre')
    const keys = fieldKey.split('.')
    let value = item
    
    for (const key of keys) {
      value = value?.[key]
      if (value === null || value === undefined) {
        return '-'
      }
    }
    
    return value
  }
  
  function formatDisplayValue(item, field) {
    let value = getDisplayValue(item, field.key)
    
    if (field.getValue && typeof field.getValue === 'function') {
      value = field.getValue(item)
    }
    
    if (value === null || value === undefined || value === '') {
      return '-'
    }
    
    // Formateo específico por tipo
    switch (field.type) {
      case 'date':
        try {
          return new Date(value).toLocaleDateString('es-MX')
        } catch {
          return value
        }
      case 'currency':
        return new Intl.NumberFormat('es-MX', { 
          style: 'currency', 
          currency: 'MXN' 
        }).format(value)
      case 'boolean':
        return value ? 'Sí' : 'No'
      default:
        return value
    }
  }
  
  // Navegación
  function navigateToApp(appName) {
    router.push(`/admin/app/${appName}`)
  }
  
  function navigateBack() {
    router.push('/admin/dashboard')
  }
  
  return {
    // Estado
    items,
    relatedData,
    loading,
    error,
    config,
    
    // Métodos CRUD
    loadItems,
    loadRelatedData,
    createItem,
    updateItem,
    deleteItem,
    deleteMultipleItems,
    
    // Métodos de control
    initialize,
    refresh,
    
    // Métodos de utilidad
    getDisplayValue,
    formatDisplayValue,
    navigateToApp,
    navigateBack,
    
    // Computed
    apiEndpoint
  }
}
