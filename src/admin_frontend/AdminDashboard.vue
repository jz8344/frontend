<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AdminLayout from './layouts/AdminLayout.vue'
import axios from 'axios'


const router = useRouter()

 
const loading = ref(false)
const searchQuery = ref('')
const recentActivity = ref([])
const systemAlerts = ref([])
const loadingActivity = ref(true)

 
router.afterEach(() => {
  loading.value = false
})

 
async function fetchRecentActivity() {
  try {
    loadingActivity.value = true
    
    
    const usersResponse = await axios.get('/api/usuarios?limit=2&sort=created_at,desc')
    
    
    const unidadesResponse = await axios.get('/api/unidades?limit=2&sort=updated_at,desc')
    
    
    const choferesResponse = await axios.get('/api/choferes?limit=1&sort=created_at,desc')
    
    const activities = []
    
    
    if (usersResponse.data.data) {
      usersResponse.data.data.forEach(user => {
        activities.push({
          type: 'user',
          icon: 'bi-person-plus',
          color: 'success',
          message: `Nuevo usuario registrado: ${user.nombre}`,
          time: getTimeAgo(user.created_at)
        })
      })
    }
    
    
    if (unidadesResponse.data.data) {
      unidadesResponse.data.data.forEach(unidad => {
        activities.push({
          type: 'unidad',
          icon: 'bi-bus-front',
          color: 'warning',
          message: `Unidad actualizada: ${unidad.numero_unidad}`,
          time: getTimeAgo(unidad.updated_at)
        })
      })
    }
    
    
    if (choferesResponse.data.data) {
      choferesResponse.data.data.forEach(chofer => {
        activities.push({
          type: 'chofer',
          icon: 'bi-person-vcard',
          color: 'primary',
          message: `Nuevo chofer registrado: ${chofer.nombre}`,
          time: getTimeAgo(chofer.created_at)
        })
      })
    }
    
    
    activities.sort((a, b) => {
      const timeA = parseTimeAgo(a.time)
      const timeB = parseTimeAgo(b.time)
      return timeA - timeB
    })
    
    recentActivity.value = activities.slice(0, 3) // Solo mostrar los 3 más recientes
    
  } catch (error) {
    console.error('Error fetching recent activity:', error)
    
    recentActivity.value = [
      {
        type: 'system',
        icon: 'bi-exclamation-triangle',
        color: 'warning',
        message: 'Error al cargar actividad reciente',
        time: 'hace unos momentos'
      }
    ]
  } finally {
    loadingActivity.value = false
  }
}

 
async function fetchSystemAlerts() {
  try {
    const alerts = []
    
    
    const unidadesResponse = await axios.get('/api/unidades')
    if (unidadesResponse.data.data) {
      unidadesResponse.data.data.forEach(unidad => {
        
        if (unidad.combustible && unidad.combustible < 20) {
          alerts.push({
            type: 'warning',
            icon: 'bi-fuel-pump',
            message: `Unidad ${unidad.numero_unidad} necesita combustible (${unidad.combustible}%)`
          })
        }
        
        
        if (unidad.fecha_ultimo_mantenimiento) {
          const lastMaintenance = new Date(unidad.fecha_ultimo_mantenimiento)
          const now = new Date()
          const daysDiff = Math.floor((now - lastMaintenance) / (1000 * 60 * 60 * 24))
          
          if (daysDiff > 90) { // Más de 90 días sin mantenimiento
            alerts.push({
              type: 'danger',
              icon: 'bi-wrench',
              message: `Unidad ${unidad.numero_unidad} requiere mantenimiento urgente (${daysDiff} días)`
            })
          } else if (daysDiff > 75) { // Entre 75-90 días
            alerts.push({
              type: 'warning',
              icon: 'bi-calendar-event',
              message: `Unidad ${unidad.numero_unidad} próxima a mantenimiento`
            })
          }
        }
        
        
        if (unidad.estado === 'fuera_de_servicio' || unidad.estado === 'mantenimiento') {
          alerts.push({
            type: 'info',
            icon: 'bi-tools',
            message: `Unidad ${unidad.numero_unidad} en ${unidad.estado.replace('_', ' ')}`
          })
        }
      })
    }
    
    
    const choferesResponse = await axios.get('/api/choferes')
    if (choferesResponse.data.data) {
      choferesResponse.data.data.forEach(chofer => {
        if (chofer.fecha_vencimiento_licencia) {
          const expiryDate = new Date(chofer.fecha_vencimiento_licencia)
          const now = new Date()
          const daysDiff = Math.floor((expiryDate - now) / (1000 * 60 * 60 * 24))
          
          if (daysDiff < 0) {
            alerts.push({
              type: 'danger',
              icon: 'bi-exclamation-triangle',
              message: `Licencia de ${chofer.nombre} vencida`
            })
          } else if (daysDiff <= 30) {
            alerts.push({
              type: 'warning',
              icon: 'bi-calendar-x',
              message: `Licencia de ${chofer.nombre} vence en ${daysDiff} días`
            })
          }
        }
      })
    }
    
    
    if (alerts.length === 0) {
      alerts.push({
        type: 'success',
        icon: 'bi-check-circle',
        message: 'Todos los sistemas funcionando correctamente'
      })
    }
    
    systemAlerts.value = alerts.slice(0, 4) // Máximo 4 alertas
    
  } catch (error) {
    console.error('Error fetching system alerts:', error)
    systemAlerts.value = [
      {
        type: 'warning',
        icon: 'bi-exclamation-triangle',
        message: 'Error al verificar el estado del sistema'
      }
    ]
  }
}

 
function getTimeAgo(dateString) {
  if (!dateString) return 'fecha desconocida'
  
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now - date) / 1000)
  
  if (diffInSeconds < 60) return 'hace unos momentos'
  if (diffInSeconds < 3600) return `hace ${Math.floor(diffInSeconds / 60)} minutos`
  if (diffInSeconds < 86400) return `hace ${Math.floor(diffInSeconds / 3600)} horas`
  if (diffInSeconds < 2592000) return `hace ${Math.floor(diffInSeconds / 86400)} días`
  return `hace ${Math.floor(diffInSeconds / 2592000)} meses`
}

 
function parseTimeAgo(timeString) {
  if (timeString.includes('momentos')) return 0
  if (timeString.includes('minutos')) return parseInt(timeString.match(/\d+/)[0])
  if (timeString.includes('horas')) return parseInt(timeString.match(/\d+/)[0]) * 60
  if (timeString.includes('días')) return parseInt(timeString.match(/\d+/)[0]) * 24 * 60
  return 999999 // Para fechas muy antiguas
}

 
onMounted(() => {
  fetchRecentActivity()
  fetchSystemAlerts()
})

const cards = [
  {
    key: 'bd',
    title: 'Base de datos',
    description: 'Respaldos y gestión de MongoDB',
    icon: 'bi-database-fill',
    color: 'primary',
    img: 'https://raw.githubusercontent.com/odoo/odoo/18.0/addons/sale/static/description/icon.png',
    badge: 'DB',
  },
  {
    key: 'usuarios',
    title: 'Usuarios',
    description: 'Administrar usuarios del sistema',
    icon: 'bi-people-fill',
    color: 'success',
    img: '/img/USUARIOS.png',
    badge: 'Nuevo',
  },
  {
    key: 'hijos',
    title: 'Hijos',
    description: 'Registro de estudiantes',
    icon: 'bi-person-heart',
    color: 'info',
    img: '/src/assets/icons/hijos.png',
  },
  {
    key: 'choferes',
    title: 'Choferes',
    description: 'Gestión de conductores',
    icon: 'bi-person-vcard',
    color: 'warning',
    img: '/src/assets/icons/choferes.png',
  },
  {
    key: 'rutas',
    title: 'Rutas',
    description: 'Planificación de recorridos',
    icon: 'bi-geo-alt-fill',
    color: 'danger',
    img: '/src/assets/icons/rutas.png',
  },
  {
    key: 'unidades',
    title: 'Unidades',
    description: 'Control de vehículos',
    icon: 'bi-bus-front-fill',
    color: 'secondary',
    img: '/src/assets/icons/unidades.png',
  },
  {
    key: 'estadisticas',
    title: 'Estadísticas',
    description: 'Reportes y métricas',
    icon: 'bi-bar-chart-fill',
    color: 'dark',
    img: '/src/assets/icons/estadisticas.png',
  },
  {
    key: 'respaldos',
    title: 'Respaldos',
    description: 'Gestión de backup MongoDB',
    icon: 'bi-shield-check',
    color: 'primary',
    img: '/src/assets/icons/backup.png',
    badge: 'DB',
  },
]

 
const routeMap = {
  'dashboard': '/admin/dashboard',
  'bd': '/admin/app/respaldos',
  'usuarios': '/admin/app/usuarios',
  'hijos': '/admin/app/hijos',
  'choferes': '/admin/app/choferes',
  'rutas': '/admin/app/rutas',
  'unidades': '/admin/app/unidades',
  'estadisticas': '/admin/estadisticas',
  'respaldos': '/admin/app/respaldos',
  'ajustes': '/admin/configuracion',
}

 
async function onCardClick(key) {
  console.log('Clicked card:', key)
  const route = routeMap[key]
  console.log('Route to navigate:', route)
  
  if (route) {
    loading.value = true
    console.log('Navigating to:', route)
    
    try {
      await router.push(route)
      console.log('Navigation successful to:', route)
    } catch (error) {
      console.error('Navigation error:', error)
    } finally {
      loading.value = false
    }
  } else {
    console.error('No route found for key:', key)
  }
}

function handleSearch(query) {
  searchQuery.value = query
  console.log('Buscar:', query)
  
}

function handleNotifications() {
  console.log('Mostrar notificaciones')
  
}

function handleHistory() {
  console.log('Mostrar historial')
  
}
</script>

<template>
  <AdminLayout 
    page-title="Dashboard Administrativo"
    page-description="Bienvenido al panel de control de TrailynSafe"
    :notification-count="3"
    :loading="loading"
    @search="handleSearch"
    @showNotifications="handleNotifications"
    @showHistory="handleHistory"
  >
    <div class="row g-4">
      <div v-for="card in cards" :key="card.key" class="col-12 col-sm-6 col-lg-4 col-xl-3">
        <div 
          class="card h-100 shadow-sm card-hover" 
          @click="onCardClick(card.key)"
          style="cursor: pointer; transition: all 0.3s ease;"
        >
          <div class="card-body text-center position-relative">
            <span 
              v-if="card.badge" 
              class="position-absolute top-0 start-100 translate-middle badge bg-success"
            >
              {{ card.badge }}
            </span>

            <div class="mb-3">
              <div 
                v-if="card.icon" 
                :class="`bg-${card.color} bg-gradient`"
                class="rounded-circle d-flex align-items-center justify-content-center mx-auto"
                style="width: 64px; height: 64px;"
              >
                <i :class="card.icon" class="text-white fs-2"></i>
              </div>
              <img 
                v-else-if="card.img" 
                :src="card.img" 
                :alt="card.title" 
                class="img-fluid rounded"
                style="width: 64px; height: 64px; object-fit: contain;"
              >
            </div>

            <h5 class="card-title mb-2">{{ card.title }}</h5>
            <p class="card-text text-muted small mb-0">{{ card.description }}</p>
          </div>
          
          <div class="card-footer bg-transparent border-0 pt-0">
            <button :class="`btn btn-outline-${card.color} btn-sm w-100`">
              <i class="bi bi-arrow-right me-1"></i>
              Acceder
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="row mt-4">
      <div class="col-lg-8">
        <div class="card shadow-sm">
          <div class="card-header bg-transparent border-bottom-0">
            <h6 class="card-title mb-0">
              <i class="bi bi-clock-history text-primary me-2"></i>
              Actividad reciente
            </h6>
          </div>
          <div class="card-body">
            <div v-if="loadingActivity" class="text-center py-3">
              <div class="spinner-border spinner-border-sm text-primary" role="status">
                <span class="visually-hidden">Cargando...</span>
              </div>
              <p class="mt-2 mb-0 small text-muted">Cargando actividad reciente...</p>
            </div>
            <div v-else-if="recentActivity.length === 0" class="text-center py-3">
              <i class="bi bi-inbox text-muted fs-3"></i>
              <p class="mt-2 mb-0 text-muted">No hay actividad reciente</p>
            </div>
            <div v-else class="list-group list-group-flush">
              <div 
                v-for="(activity, index) in recentActivity" 
                :key="index"
                class="list-group-item border-0 px-0"
              >
                <div class="d-flex align-items-center">
                  <div :class="`bg-${activity.color} bg-gradient`" class="rounded-circle p-2 me-3">
                    <i :class="activity.icon" class="text-white small"></i>
                  </div>
                  <div class="flex-grow-1">
                    <p class="mb-1 small">{{ activity.message }}</p>
                    <small class="text-muted">{{ activity.time }}</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-4 mt-4 mt-lg-0">
        <div class="card shadow-sm">
          <div class="card-header bg-transparent border-bottom-0">
            <h6 class="card-title mb-0">
              <i class="bi bi-exclamation-triangle text-warning me-2"></i>
              Alertas del sistema
            </h6>
          </div>
          <div class="card-body">
            <div v-if="systemAlerts.length === 0" class="text-center py-3">
              <div class="spinner-border spinner-border-sm text-warning" role="status">
                <span class="visually-hidden">Verificando sistema...</span>
              </div>
              <p class="mt-2 mb-0 small text-muted">Verificando alertas...</p>
            </div>
            <div v-else>
              <div 
                v-for="(alert, index) in systemAlerts" 
                :key="index"
                :class="[`alert alert-${alert.type} alert-sm`, { 'mb-0': index === systemAlerts.length - 1 }]"
                role="alert"
              >
                <small>
                  <i :class="alert.icon" class="me-1"></i>
                  {{ alert.message }}
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<style scoped>
/* Hover effects para tarjetas */
.card-hover:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
}

.card-hover:hover .btn {
  background-color: var(--bs-primary);
  color: white !important;
  border-color: var(--bs-primary);
}

/* Dark mode specific hover effects */
[data-bs-theme="dark"] .card-hover:hover .btn {
  background-color: var(--bs-primary);
  color: white !important;
  border-color: var(--bs-primary);
}

/* Alertas más pequeñas */
.alert-sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
}

/* Cards con gradiente sutil - Modo claro */
.card {
  background: linear-gradient(145deg, #ffffff, #f8f9fa);
  border: 1px solid rgba(0,0,0,0.1);
  color: var(--bs-body-color);
}

/* Cards en modo oscuro */
[data-bs-theme="dark"] .card {
  background: linear-gradient(145deg, #2d3748, #1a202c);
  border: 1px solid rgba(255,255,255,0.1);
  color: var(--bs-body-color);
}

[data-bs-theme="dark"] .card-body {
  color: var(--bs-body-color);
}

[data-bs-theme="dark"] .card-title {
  color: var(--bs-body-color);
}

[data-bs-theme="dark"] .text-muted {
  color: rgba(255,255,255,0.6) !important;
}

/* Botones en modo oscuro */
[data-bs-theme="dark"] .btn-outline-primary {
  color: var(--bs-primary);
  border-color: var(--bs-primary);
  background-color: transparent;
}

[data-bs-theme="dark"] .btn-outline-success {
  color: var(--bs-success);
  border-color: var(--bs-success);
}

[data-bs-theme="dark"] .btn-outline-warning {
  color: var(--bs-warning);
  border-color: var(--bs-warning);
}

[data-bs-theme="dark"] .btn-outline-danger {
  color: var(--bs-danger);
  border-color: var(--bs-danger);
}

[data-bs-theme="dark"] .btn-outline-info {
  color: var(--bs-info);
  border-color: var(--bs-info);
}

[data-bs-theme="dark"] .btn-outline-secondary {
  color: var(--bs-secondary);
  border-color: var(--bs-secondary);
}

/* Botón dark específico - En modo oscuro debe ser blanco */
[data-bs-theme="dark"] .btn-outline-dark {
  color: #ffffff !important;
  border-color: #ffffff !important;
  background-color: transparent;
}

[data-bs-theme="dark"] .btn-outline-dark:hover {
  background-color: #ffffff !important;
  color: #000000 !important;
  border-color: #ffffff !important;
}

/* Botón dark en modo claro - debe ser negro */
.btn-outline-dark {
  color: #000000;
  border-color: #000000;
}

.btn-outline-dark:hover {
  background-color: #000000;
  color: #ffffff;
  border-color: #000000;
}

/* Card footer en modo oscuro */
[data-bs-theme="dark"] .card-footer {
  background-color: transparent;
  border-color: rgba(255,255,255,0.1);
}

/* Background para modo oscuro */
[data-bs-theme="dark"] .bg-light {
  background-color: var(--bs-dark) !important;
  color: var(--bs-light);
}

/* Animaciones suaves */
.btn, .card {
  transition: all 0.3s ease;
}
</style>
