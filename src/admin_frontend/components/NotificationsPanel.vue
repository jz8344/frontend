<template>
  <div class="notifications-panel" :class="{ 'show': isVisible }">
    <div class="panel-header">
      <h5 class="mb-0">
        <i class="bi bi-bell-fill me-2"></i>
        Notificaciones
      </h5>
      <button type="button" class="btn-close" @click="$emit('close')"></button>
    </div>
    
    <div v-if="notifications.length === 0" class="panel-body text-center py-5">
      <i class="bi bi-bell-slash text-muted" style="font-size: 3rem;"></i>
      <p class="text-muted mt-3">No hay notificaciones</p>
    </div>
    
    <div v-else class="panel-body">
      <div class="notification-actions mb-3">
        <button 
          type="button" 
          class="btn btn-sm btn-outline-danger w-100"
          @click="clearAll"
        >
          <i class="bi bi-check2-all me-1"></i>
          Marcar todas como leídas
        </button>
      </div>
      
      <div class="notifications-list">
        <div 
          v-for="notification in notifications" 
          :key="notification.id"
          class="notification-item"
          :class="[
            `notification-${notification.type}`,
            { 'unread': !notification.read }
          ]"
          @click="markAsRead(notification.id)"
        >
          <div class="notification-icon">
            <i :class="getNotificationIcon(notification.type)"></i>
          </div>
          <div class="notification-content">
            <div class="notification-title">{{ notification.title }}</div>
            <div class="notification-message">{{ notification.message }}</div>
            <div class="notification-meta">
              <span class="notification-admin">
                <i class="bi bi-person-circle me-1"></i>
                {{ notification.adminName }}
              </span>
              <span class="notification-time">
                <i class="bi bi-clock me-1"></i>
                {{ formatTime(notification.timestamp) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Overlay -->
  <div 
    v-if="isVisible" 
    class="notifications-overlay"
    @click="$emit('close')"
  ></div>
</template>

<script setup>
import { computed } from 'vue'
import { useNotifications } from '@/composables/useNotifications'

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const { 
  notifications, 
  markAsRead, 
  markAllAsRead, 
  removeNotification, 
  clearAll 
} = useNotifications()

function getNotificationIcon(type) {
  const icons = {
    'success': 'bi bi-check-circle-fill',
    'info': 'bi bi-info-circle-fill',
    'warning': 'bi bi-exclamation-triangle-fill',
    'danger': 'bi bi-x-circle-fill'
  }
  return icons[type] || 'bi bi-bell-fill'
}

function formatTime(timestamp) {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = Math.floor((now - date) / 1000) // segundos
  
  if (diff < 60) return 'Ahora'
  if (diff < 3600) return `Hace ${Math.floor(diff / 60)} min`
  if (diff < 86400) return `Hace ${Math.floor(diff / 3600)} h`
  if (diff < 604800) return `Hace ${Math.floor(diff / 86400)} d`
  
  return date.toLocaleDateString('es-MX', { 
    day: 'numeric', 
    month: 'short' 
  })
}
</script>

<style scoped>
.notifications-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1050;
  backdrop-filter: blur(2px);
}

.notifications-panel {
  position: fixed;
  top: 76px;
  right: -400px;
  width: 400px;
  max-width: 90vw;
  height: calc(100vh - 76px);
  background: var(--bs-body-bg);
  border-left: 1px solid var(--bs-border-color);
  box-shadow: -2px 0 20px rgba(0, 0, 0, 0.1);
  z-index: 1051;
  transition: right 0.3s ease;
  display: flex;
  flex-direction: column;
}

.notifications-panel.show {
  right: 0;
}

.panel-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--bs-border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--bs-primary);
  color: white;
}

.panel-header h5 {
  color: white;
}

.panel-header .btn-close {
  filter: invert(1);
}

.panel-body {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

.notification-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: space-between;
}

.notifications-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.notification-item {
  display: flex;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid var(--bs-border-color);
  background: var(--bs-body-bg);
  transition: all 0.2s ease;
  cursor: pointer;
  position: relative;
}

.notification-item:hover {
  border-color: var(--bs-primary);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transform: translateX(-2px);
}

.notification-item.unread {
  border-left: 4px solid var(--bs-primary);
  background: rgba(var(--bs-primary-rgb), 0.05);
}

.notification-icon {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}

.notification-success .notification-icon {
  background: rgba(25, 135, 84, 0.1);
  color: var(--bs-success);
}

.notification-info .notification-icon {
  background: rgba(13, 110, 253, 0.1);
  color: var(--bs-info);
}

.notification-warning .notification-icon {
  background: rgba(255, 193, 7, 0.1);
  color: var(--bs-warning);
}

.notification-danger .notification-icon {
  background: rgba(220, 53, 69, 0.1);
  color: var(--bs-danger);
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-title {
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
  color: var(--bs-body-color);
}

.notification-message {
  font-size: 0.85rem;
  color: var(--bs-secondary-color);
  margin-bottom: 0.5rem;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.notification-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.75rem;
  color: var(--bs-secondary-color);
}

.btn-remove {
  flex-shrink: 0;
  background: none;
  border: none;
  color: var(--bs-secondary-color);
  cursor: pointer;
  padding: 0.25rem;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.btn-remove:hover {
  background: var(--bs-danger);
  color: white;
}

/* Dark mode */
[data-bs-theme="dark"] .notifications-panel {
  background: var(--bs-dark);
  border-left-color: rgba(255, 255, 255, 0.1);
}

[data-bs-theme="dark"] .panel-header {
  border-bottom-color: rgba(255, 255, 255, 0.1);
}

[data-bs-theme="dark"] .notification-item {
  background: var(--bs-dark);
  border-color: rgba(255, 255, 255, 0.1);
}

[data-bs-theme="dark"] .notification-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

/* Responsive */
@media (max-width: 768px) {
  .notifications-panel {
    width: 100%;
    right: -100%;
  }
}

/* Animación de entrada */
@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.notification-item {
  animation: slideIn 0.3s ease;
}
</style>
