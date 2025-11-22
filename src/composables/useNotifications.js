import { ref, computed } from 'vue'
import { useAdminAuth } from './useAdminAuth'
import http from '@/config/api'

// Estado global de notificaciones
const notifications = ref([])
const unreadCount = ref(0)
const isLoading = ref(false)

export function useNotifications() {
  const { adminName } = useAdminAuth()

  // Cargar notificaciones desde el backend
  async function fetchNotifications() {
    if (isLoading.value) return
    
    try {
      isLoading.value = true
      const response = await http.get('/admin/notificaciones')
      
      // Mapear respuesta del backend al formato local
      notifications.value = response.data.data.map(n => ({
        id: n.id,
        title: n.titulo,
        message: n.mensaje,
        type: n.tipo,
        entityType: n.entity_type,
        entityId: n.entity_id,
        adminName: n.admin_name,
        timestamp: n.created_at,
        read: n.read
      }))
      
      unreadCount.value = response.data.unread_count
    } catch (error) {
      console.error('Error cargando notificaciones:', error)
    } finally {
      isLoading.value = false
    }
  }

  // Función para agregar una notificación
  async function addNotification(title, message, type = 'info', entityType = '', entityId = null, autoRemove = false) {
    // 1. Agregar localmente (optimistic update)
    const tempId = Date.now() // ID temporal
    const notification = {
      id: tempId,
      title,
      message,
      type,
      entityType,
      entityId,
      adminName: adminName.value || 'Admin',
      timestamp: new Date().toISOString(),
      read: false
    }

    // Si es autoRemove (toast), no la guardamos en BD, solo local
    if (autoRemove) {
      notifications.value.unshift(notification)
      setTimeout(() => {
        const index = notifications.value.findIndex(n => n.id === tempId)
        if (index !== -1) notifications.value.splice(index, 1)
      }, 5000)
      return notification
    }

    // 2. Guardar en BD (solo si no es autoRemove)
    try {
      const response = await http.post('/admin/notificaciones', {
        titulo: title,
        mensaje: message,
        tipo: type,
        entity_type: entityType,
        entity_id: entityId,
        admin_name: adminName.value || 'Admin'
      })
      
      // Reemplazar la notificación temporal con la real del backend o agregarla al inicio
      // Para simplificar y asegurar consistencia, recargamos o agregamos la respuesta
      const savedNotification = {
        id: response.data.id,
        title: response.data.titulo,
        message: response.data.mensaje,
        type: response.data.tipo,
        entityType: response.data.entity_type,
        entityId: response.data.entity_id,
        adminName: response.data.admin_name,
        timestamp: response.data.created_at,
        read: false
      }
      
      notifications.value.unshift(savedNotification)
      unreadCount.value++
      
    } catch (error) {
      console.error('Error guardando notificación:', error)
      // En caso de error, podríamos mostrar un toast de error o simplemente ignorar
    }

    return notification
  }

  // Funciones de notificación específicas para acciones CRUD
  function notifyCreated(entityType, entityName) {
    const titles = {
      'escuela': '¡Nueva Escuela Registrada!',
      'unidad': '¡Nueva Unidad Registrada!',
      'chofer': '¡Nuevo Chofer Registrado!',
      'usuario': '¡Nuevo Usuario Registrado!',
      'hijo': '¡Nuevo Hijo Registrado!',
      'respaldo': '¡Nuevo Respaldo Creado!'
    }

    const message = `${adminName.value || 'Admin'} ha registrado: ${entityName}`
    return addNotification(
      titles[entityType] || '¡Elemento Creado!',
      message,
      'success',
      entityType
    )
  }

  function notifyUpdated(entityType, entityName, changes = []) {
    const titles = {
      'escuela': 'Escuela Actualizada',
      'unidad': 'Unidad Actualizada',
      'chofer': 'Chofer Actualizado',
      'usuario': 'Usuario Actualizado',
      'hijo': 'Hijo Actualizado',
      'respaldo': 'Respaldo Actualizado'
    }

    let message = `${adminName.value || 'Admin'} ha actualizado: ${entityName}`
    
    if (changes.length > 0) {
      const changesText = changes.length === 1 
        ? `Campo modificado: ${changes[0]}`
        : `Campos modificados: ${changes.join(', ')}`
      message += `\n${changesText}`
    }

    return addNotification(
      titles[entityType] || 'Elemento Actualizado',
      message,
      'info',
      entityType
    )
  }

  function notifyDeleted(entityType, entityName) {
    const titles = {
      'escuela': 'Escuela Eliminada',
      'unidad': 'Unidad Eliminada',
      'chofer': 'Chofer Eliminado',
      'usuario': 'Usuario Eliminado',
      'hijo': 'Hijo Eliminado',
      'respaldo': 'Respaldo Eliminado'
    }

    const message = `${adminName.value || 'Admin'} ha eliminado: ${entityName}`
    return addNotification(
      titles[entityType] || 'Elemento Eliminado',
      message,
      'warning',
      entityType
    )
  }

  function notifyStateChange(entityType, entityName, oldState, newState) {
    const message = `${adminName.value || 'Admin'} cambió el estado de ${entityName} de "${oldState}" a "${newState}"`
    return addNotification(
      'Cambio de Estado Detectado',
      message,
      'info',
      entityType
    )
  }

  function notifySpecialEvent(title, message, type = 'warning') {
    return addNotification(title, message, type)
  }

  // Marcar como leída
  async function markAsRead(notificationId) {
    const notification = notifications.value.find(n => n.id === notificationId)
    if (notification && !notification.read) {
      // Optimistic update
      notification.read = true
      unreadCount.value = Math.max(0, unreadCount.value - 1)
      
      try {
        await http.put(`/admin/notificaciones/${notificationId}/read`)
      } catch (error) {
        console.error('Error marcando como leída:', error)
        // Revertir si falla
        notification.read = false
        unreadCount.value++
      }
    }
  }

  // Marcar todas como leídas
  async function markAllAsRead() {
    const unread = notifications.value.filter(n => !n.read)
    if (unread.length === 0) return

    // Optimistic update
    notifications.value.forEach(n => n.read = true)
    const oldCount = unreadCount.value
    unreadCount.value = 0
    
    try {
      await http.put('/admin/notificaciones/read-all')
    } catch (error) {
      console.error('Error marcando todas como leídas:', error)
      // Revertir parcialmente (complejo, mejor recargar)
      unreadCount.value = oldCount
      await fetchNotifications()
    }
  }

  // Eliminar notificación
  async function removeNotification(notificationId) {
    const index = notifications.value.findIndex(n => n.id === notificationId)
    if (index !== -1) {
      const notification = notifications.value[index]
      
      // Optimistic update
      notifications.value.splice(index, 1)
      if (!notification.read) {
        unreadCount.value = Math.max(0, unreadCount.value - 1)
      }
      
      try {
        await http.delete(`/admin/notificaciones/${notificationId}`)
      } catch (error) {
        console.error('Error eliminando notificación:', error)
        // Podríamos recargar la lista
      }
    }
  }

  // Limpiar todas las notificaciones (Ahora se comporta como marcar todas como leídas)
  async function clearAll() {
    await markAllAsRead()
  }

  // Obtener notificaciones recientes (últimas 5)
  const recentNotifications = computed(() => {
    return notifications.value.slice(0, 5)
  })

  // Obtener notificaciones no leídas
  const unreadNotifications = computed(() => {
    return notifications.value.filter(n => !n.read)
  })

  return {
    notifications,
    unreadCount,
    recentNotifications,
    unreadNotifications,
    isLoading,
    fetchNotifications,
    addNotification,
    notifyCreated,
    notifyUpdated,
    notifyDeleted,
    notifyStateChange,
    notifySpecialEvent,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll
  }
}
