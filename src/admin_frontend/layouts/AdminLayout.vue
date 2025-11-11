<template>
  <div class="admin-layout">
    <AdminNavbar 
      :page-title="pageTitle"
      :user-name="actualUserName"
      :notification-count="notificationCount"
      @search="handleSearch"
      @showNotifications="handleNotifications"
      @showHistory="handleHistory"
      @logout="handleLogout"
    />

    <!-- Main content area -->
    <main class="main-content">
      <div class="container-fluid py-4">
        <!-- Page header slot -->
        <div v-if="$slots.header" class="row mb-4">
          <div class="col">
            <slot name="header"></slot>
          </div>
        </div>

        <!-- Default page header si no se proporciona -->
        <div v-else-if="pageTitle" class="row mb-4">
          <div class="col">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h1 class="h3 mb-1">{{ pageTitle }}</h1>
                <p v-if="pageDescription" class="text-muted mb-0">{{ pageDescription }}</p>
              </div>
              <div v-if="$slots.actions">
                <slot name="actions"></slot>
              </div>
            </div>
          </div>
        </div>

        <!-- Alerts area -->
        <div v-if="alerts.length > 0" class="row mb-4">
          <div class="col">
            <div 
              v-for="(alert, index) in alerts" 
              :key="index"
              :class="`alert alert-${alert.type} alert-dismissible fade show`"
              role="alert"
            >
              <i :class="getAlertIcon(alert.type)" class="me-2"></i>
              {{ alert.message }}
              <button 
                type="button" 
                class="btn-close" 
                @click="dismissAlert(index)"
                aria-label="Cerrar"
              ></button>
            </div>
          </div>
        </div>

        <!-- Main content slot -->
        <slot></slot>
      </div>
    </main>

    <!-- Loading overlay -->
    <div v-if="loading" class="loading-overlay">
      <div class="d-flex justify-content-center align-items-center h-100">
        <div class="text-center">
          <div class="spinner-border text-primary mb-3" role="status">
            <span class="visually-hidden">Cargando...</span>
          </div>
          <p class="text-muted">{{ loadingMessage || 'Cargando...' }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import AdminNavbar from '../components/AdminNavbar.vue'
import { useAdminAuth } from '@/composables/useAdminAuth.js'

// Props
const props = defineProps({
  pageTitle: {
    type: String,
    default: 'Dashboard'
  },
  pageDescription: {
    type: String,
    default: ''
  },
  userName: {
    type: String,
    default: ''
  },
  notificationCount: {
    type: Number,
    default: 0
  },
  loading: {
    type: Boolean,
    default: false
  },
  loadingMessage: {
    type: String,
    default: ''
  }
})

// Emits
const emit = defineEmits(['search', 'showNotifications', 'showHistory'])

const router = useRouter()
const { adminName, logout: adminLogout, initializeAuth, setupAxiosInterceptors } = useAdminAuth()

// Estado reactivo
const alerts = ref([])

// Computed para usar el nombre real del admin o el prop
const actualUserName = computed(() => {
  return props.userName || adminName.value
})

// Métodos
function handleSearch(query) {
  emit('search', query)
}

function handleNotifications() {
  emit('showNotifications')
}

function handleHistory() {
  emit('showHistory')
}

async function handleLogout() {
  try {
    await adminLogout()
    router.push('/admin/login')
  } catch (error) {
    console.error('Error al cerrar sesión:', error)
    // Forzar logout local y redirección
    router.push('/admin/login')
  }
}

function addAlert(message, type = 'info') {
  alerts.value.push({ message, type })
}

function dismissAlert(index) {
  alerts.value.splice(index, 1)
}

function getAlertIcon(type) {
  const icons = {
    'success': 'bi-check-circle-fill',
    'danger': 'bi-exclamation-triangle-fill',
    'warning': 'bi-exclamation-triangle-fill',
    'info': 'bi-info-circle-fill',
    'primary': 'bi-info-circle-fill',
    'secondary': 'bi-info-circle-fill'
  }
  return icons[type] || 'bi-info-circle-fill'
}

// Lifecycle
onMounted(async () => {
  // Configurar interceptores de axios una sola vez
  setupAxiosInterceptors()
  
  // No hacer validación automática aquí - dejar que cada página maneje su autenticación
  console.log('AdminLayout mounted, interceptors configured')
})

// Exponer métodos para el componente padre
defineExpose({
  addAlert,
  dismissAlert
})
</script>

<style scoped>
/* Layout principal */
.admin-layout {
  min-height: 100vh;
  background: var(--bs-body-bg);
  color: var(--bs-body-color);
}

/* Main content con padding para el navbar fijo */
.main-content {
  margin-top: 76px;
  min-height: calc(100vh - 76px);
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  color: var(--bs-body-color);
}

/* Loading overlay */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(255, 255, 255, 0.9);
  z-index: 9999;
  color: var(--bs-body-color);
}

/* Dark mode overrides */
[data-bs-theme="dark"] .admin-layout {
  background: var(--bs-dark);
  color: var(--bs-light);
}

[data-bs-theme="dark"] .main-content {
  background: linear-gradient(135deg, rgba(52, 58, 64, 0.95) 0%, rgba(33, 37, 41, 0.95) 100%);
  color: var(--bs-light);
}

[data-bs-theme="dark"] .loading-overlay {
  background: rgba(33, 37, 41, 0.9);
  color: var(--bs-light);
}

[data-bs-theme="dark"] .text-muted {
  color: rgba(255, 255, 255, 0.6) !important;
}

/* Page title colors */
[data-bs-theme="dark"] h1, 
[data-bs-theme="dark"] h2, 
[data-bs-theme="dark"] h3, 
[data-bs-theme="dark"] h4, 
[data-bs-theme="dark"] h5, 
[data-bs-theme="dark"] h6 {
  color: var(--bs-light);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .main-content {
    margin-top: 60px;
  }
}

/* Animaciones suaves */
.alert {
  animation: slideInDown 0.3s ease-out;
}

@keyframes slideInDown {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
