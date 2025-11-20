import { ref, computed } from 'vue'
import { useAdminAuth } from './useAdminAuth'

// Estado global de notificaciones
const notifications = ref([])
const unreadCount = ref(0)
let notificationIdCounter = 1

export function useNotifications() {
  const { adminName } = useAdminAuth()

  // Función para agregar una notificación
  function addNotification(title, message, type = 'info', entityType = '', entityId = null, autoRemove = false) {
    const notification = {
      id: notificationIdCounter++,
      title,
      message,
      type, // 'success', 'info', 'warning', 'danger'
      entityType, // 'escuela', 'unidad', 'chofer', 'viaje', etc.
      entityId,
      adminName: adminName.value || 'Admin',
      timestamp: new Date().toISOString(),
      read: false
    }

    notifications.value.unshift(notification)
    unreadCount.value++

    // Solo auto-eliminar si se especifica explícitamente
    // Las notificaciones del panel NO se auto-eliminan
    if (autoRemove) {
      setTimeout(() => {
        removeNotification(notification.id)
      }, 10000)
    }

    return notification
  }

  // Funciones de notificación específicas para acciones CRUD
  function notifyCreated(entityType, entityName) {
    const titles = {
      'escuela': '¡Nueva Escuela Registrada!',
      'unidad': '¡Nueva Unidad Registrada!',
      'chofer': '¡Nuevo Chofer Registrado!',
      'viaje': '¡Nuevo Viaje Creado!',
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
      'viaje': 'Viaje Actualizado',
      'usuario': 'Usuario Actualizado',
      'hijo': 'Hijo Actualizado',
      'respaldo': 'Respaldo Actualizado'
    }

    let message = `${adminName.value || 'Admin'} ha actualizado: ${entityName}`
    
    if (changes.length > 0) {
      message += ` (${changes.join(', ')})`
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
      'viaje': 'Viaje Eliminado',
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
  function markAsRead(notificationId) {
    const notification = notifications.value.find(n => n.id === notificationId)
    if (notification && !notification.read) {
      notification.read = true
      unreadCount.value = Math.max(0, unreadCount.value - 1)
    }
  }

  // Marcar todas como leídas
  function markAllAsRead() {
    notifications.value.forEach(n => n.read = true)
    unreadCount.value = 0
  }

  // Eliminar notificación
  function removeNotification(notificationId) {
    const index = notifications.value.findIndex(n => n.id === notificationId)
    if (index !== -1) {
      const notification = notifications.value[index]
      if (!notification.read) {
        unreadCount.value = Math.max(0, unreadCount.value - 1)
      }
      notifications.value.splice(index, 1)
    }
  }

  // Limpiar todas las notificaciones
  function clearAll() {
    notifications.value = []
    unreadCount.value = 0
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
