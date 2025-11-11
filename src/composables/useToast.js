import { ref } from 'vue'

// Estado global para las notificaciones toast
const toasts = ref([])
let toastId = 0

export function useToast() {
  const showToast = (message, type = 'info', duration = 5000) => {
    const id = ++toastId
    const toast = {
      id,
      message,
      type,
      timestamp: new Date()
    }
    
    toasts.value.push(toast)
    
    // Auto-remove después del tiempo especificado
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }
    
    return id
  }
  
  const removeToast = (id) => {
    const index = toasts.value.findIndex(toast => toast.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }
  
  const clearAllToasts = () => {
    toasts.value.splice(0, toasts.value.length)
  }
  
  // Métodos de conveniencia
  const showSuccess = (message, duration = 5000) => showToast(message, 'success', duration)
  const showError = (message, duration = 8000) => showToast(message, 'error', duration)
  const showWarning = (message, duration = 6000) => showToast(message, 'warning', duration)
  const showInfo = (message, duration = 5000) => showToast(message, 'info', duration)
  
  return {
    toasts,
    showToast,
    removeToast,
    clearAllToasts,
    showSuccess,
    showError,
    showWarning,
    showInfo
  }
}
