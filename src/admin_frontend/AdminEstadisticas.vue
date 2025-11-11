<template>
  <div class="admin-layout">
    <AdminNavbar 
      page-title="Estadísticas del Sistema"
      :user-name="'Admin'"
      :notification-count="0"
      @search="() => {}"
      @showNotifications="() => {}"
      @showHistory="() => {}"
      @logout="() => {}"
    />

    <main class="main-content">
      <div class="container-fluid py-4">
        <div class="row mb-4">
          <div class="col">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h1 class="h3 mb-1">
                  <i class="bi bi-bar-chart-fill me-2 text-primary"></i>
                  Estadísticas del Sistema
                </h1>
                <p class="text-muted mb-0">Resumen general del estado del sistema TrailynSafe</p>
              </div>
              <button 
                class="btn btn-outline-primary d-flex align-items-center" 
                @click="cargarDatos" 
                :disabled="cargando"
              >
                <span v-if="cargando" class="spinner-border spinner-border-sm me-2"></span>
                <i v-else class="bi bi-arrow-clockwise me-2"></i>
                {{ cargando ? 'Cargando...' : 'Actualizar' }}
              </button>
            </div>
          </div>
        </div>

        <div v-if="error" class="row mb-4">
          <div class="col">
            <div class="alert alert-danger d-flex align-items-center">
              <i class="bi bi-exclamation-triangle me-2"></i>
              {{ error }}
            </div>
          </div>
        </div>

        <div v-if="cargando" class="text-center py-5">
          <div class="spinner-border text-primary mb-3" role="status">
            <span class="visually-hidden">Cargando...</span>
          </div>
          <p class="text-muted">Cargando estadísticas...</p>
        </div>

        <div v-else>
          <div class="row mb-4">
            <div class="col-md-3 mb-3">
              <div class="card stats-card bg-primary text-white">
                <div class="card-body">
                  <div class="d-flex justify-content-between align-items-center">
                    <div>
                      <h4 class="card-title mb-0">{{ totales.usuarios }}</h4>
                      <p class="card-text mb-0">Usuarios</p>
                      <small class="opacity-75">Registrados en el sistema</small>
                    </div>
                    <div class="stats-icon">
                      <i class="bi bi-people-fill"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="col-md-3 mb-3">
              <div class="card stats-card bg-success text-white">
                <div class="card-body">
                  <div class="d-flex justify-content-between align-items-center">
                    <div>
                      <h4 class="card-title mb-0">{{ totales.hijos }}</h4>
                      <p class="card-text mb-0">Estudiantes</p>
                      <small class="opacity-75">En el sistema</small>
                    </div>
                    <div class="stats-icon">
                      <i class="bi bi-person-hearts"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="col-md-3 mb-3">
              <div class="card stats-card bg-warning text-white">
                <div class="card-body">
                  <div class="d-flex justify-content-between align-items-center">
                    <div>
                      <h4 class="card-title mb-0">{{ totales.choferes }}</h4>
                      <p class="card-text mb-0">Choferes</p>
                      <small class="opacity-75">Conductores activos</small>
                    </div>
                    <div class="stats-icon">
                      <i class="bi bi-person-badge"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="col-md-3 mb-3">
              <div class="card stats-card bg-info text-white">
                <div class="card-body">
                  <div class="d-flex justify-content-between align-items-center">
                    <div>
                      <h4 class="card-title mb-0">{{ totales.unidades }}</h4>
                      <p class="card-text mb-0">Unidades</p>
                      <small class="opacity-75">Vehículos disponibles</small>
                    </div>
                    <div class="stats-icon">
                      <i class="bi bi-bus-front"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="row mb-4">
            <div class="col-md-6 mb-4">
              <div class="card h-100">
                <div class="card-header d-flex justify-content-between align-items-center">
                  <h5 class="mb-0">
                    <i class="bi bi-geo-alt text-primary me-2"></i>
                    Rutas por Estado
                  </h5>
                  <span class="badge bg-primary">{{ totales.rutas }} total</span>
                </div>
                <div class="card-body">
                  <div v-if="estadosRutas.length > 0">
                    <div class="table-responsive">
                      <table class="table table-sm">
                        <thead>
                          <tr>
                            <th>Estado</th>
                            <th class="text-center">Cantidad</th>
                            <th class="text-center">Porcentaje</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="estado in estadosRutas" :key="estado.nombre">
                            <td>
                              <span class="badge" :class="getBadgeClass(estado.nombre.toLowerCase())">
                                {{ estado.nombre }}
                              </span>
                            </td>
                            <td class="text-center">{{ estado.cantidad }}</td>
                            <td class="text-center">
                              <div class="progress progress-sm">
                                <div 
                                  class="progress-bar" 
                                  :style="`width: ${estado.porcentaje}%`"
                                ></div>
                              </div>
                              <small>{{ estado.porcentaje }}%</small>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div v-else class="text-center text-muted py-4">
                    <i class="bi bi-geo-alt-fill fs-1"></i>
                    <p class="mt-2">No hay rutas registradas</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="col-md-6 mb-4">
              <div class="card h-100">
                <div class="card-header">
                  <h5 class="mb-0">
                    <i class="bi bi-activity text-success me-2"></i>
                    Actividad del Sistema
                  </h5>
                </div>
                <div class="card-body">
                  <div class="activity-list">
                    <div class="activity-item">
                      <div class="activity-icon bg-primary">
                        <i class="bi bi-person-plus"></i>
                      </div>
                      <div class="activity-content">
                        <strong>Usuarios registrados hoy</strong>
                        <span class="badge bg-primary ms-2">{{ actividadHoy.usuarios }}</span>
                      </div>
                    </div>
                    
                    <div class="activity-item">
                      <div class="activity-icon bg-success">
                        <i class="bi bi-play-circle"></i>
                      </div>
                      <div class="activity-content">
                        <strong>Rutas activas</strong>
                        <span class="badge bg-success ms-2">{{ actividadHoy.rutasActivas }}</span>
                      </div>
                    </div>
                    
                    <div class="activity-item">
                      <div class="activity-icon bg-info">
                        <i class="bi bi-bus"></i>
                      </div>
                      <div class="activity-content">
                        <strong>Unidades en servicio</strong>
                        <span class="badge bg-info ms-2">{{ actividadHoy.unidadesActivas }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-md-6 mb-4">
              <div class="card h-100">
                <div class="card-header">
                  <h5 class="mb-0">
                    <i class="bi bi-clock-history text-info me-2"></i>
                    Usuarios Recientes
                  </h5>
                </div>
                <div class="card-body">
                  <div v-if="usuariosRecientes.length > 0">
                    <div class="list-group list-group-flush">
                      <div 
                        v-for="usuario in usuariosRecientes" 
                        :key="usuario.id"
                        class="list-group-item d-flex justify-content-between align-items-center px-0"
                      >
                        <div class="d-flex align-items-center">
                          <div class="avatar-sm me-3">
                            {{ usuario.nombre?.[0] || 'U' }}{{ usuario.apellidos?.[0] || '' }}
                          </div>
                          <div>
                            <div class="fw-medium">{{ getNombreCompleto(usuario) }}</div>
                            <small class="text-muted">{{ usuario.correo }}</small>
                          </div>
                        </div>
                        <small class="text-muted">{{ formatearFecha(usuario.fecha_registro) }}</small>
                      </div>
                    </div>
                  </div>
                  <div v-else class="text-center text-muted py-4">
                    <i class="bi bi-people fs-1"></i>
                    <p class="mt-2">No hay usuarios recientes</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-md-6 mb-4">
              <div class="card h-100">
                <div class="card-header">
                  <h5 class="mb-0">
                    <i class="bi bi-map text-warning me-2"></i>
                    Rutas Recientes
                  </h5>
                </div>
                <div class="card-body">
                  <div v-if="rutasRecientes.length > 0">
                    <div class="list-group list-group-flush">
                      <div 
                        v-for="ruta in rutasRecientes" 
                        :key="ruta.id"
                        class="list-group-item d-flex justify-content-between align-items-center px-0"
                      >
                        <div>
                          <div class="fw-medium">{{ ruta.nombre || 'Sin nombre' }}</div>
                          <small class="text-muted">
                            {{ ruta.inicio || 'Sin inicio' }} - {{ ruta.fin || 'Sin destino' }}
                          </small>
                        </div>
                        <span class="badge" :class="getBadgeClass(ruta.estado)">
                          {{ ruta.estado || 'Sin estado' }}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div v-else class="text-center text-muted py-4">
                    <i class="bi bi-geo-alt fs-1"></i>
                    <p class="mt-2">No hay rutas recientes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useAdminAuth } from '@/composables/useAdminAuth.js'
import AdminNavbar from './components/AdminNavbar.vue'
import http from '@/config/api.js'

const { setupAxiosInterceptors } = useAdminAuth()

const cargando = ref(false)
const error = ref('')
const totales = reactive({
  usuarios: 0,
  hijos: 0,
  choferes: 0,
  unidades: 0,
  rutas: 0
})

const estadosRutas = ref([])
const actividadHoy = reactive({
  usuarios: 0,
  rutasActivas: 0,
  unidadesActivas: 0
})

const usuariosRecientes = ref([])
const rutasRecientes = ref([])

async function cargarDatos() {
  cargando.value = true
  error.value = ''
  
  try {
    // Cargar datos de todas las entidades en paralelo
    const [usuariosRes, hijosRes, choferesRes, unidadesRes, rutasRes] = await Promise.all([
      http.get('/admin/usuarios'),
      http.get('/admin/hijos'), 
      http.get('/admin/choferes'),
      http.get('/admin/unidades'),
      http.get('/admin/rutas')
    ])

    // Actualizar totales
    totales.usuarios = usuariosRes.data?.length || 0
    totales.hijos = hijosRes.data?.length || 0
    totales.choferes = choferesRes.data?.length || 0
    totales.unidades = unidadesRes.data?.length || 0
    totales.rutas = rutasRes.data?.length || 0

    // Procesar datos de rutas
    const rutas = rutasRes.data || []
    if (rutas.length > 0) {
      // Calcular estadísticas de rutas por estado
      const estadosCount = {}
      rutas.forEach(ruta => {
        const estado = ruta.estado || 'sin_estado'
        estadosCount[estado] = (estadosCount[estado] || 0) + 1
      })

      estadosRutas.value = Object.entries(estadosCount).map(([nombre, cantidad]) => ({
        nombre: nombre.charAt(0).toUpperCase() + nombre.slice(1).replace('_', ' '),
        cantidad,
        porcentaje: Math.round((cantidad / rutas.length) * 100)
      }))

      // Rutas activas
      actividadHoy.rutasActivas = rutas.filter(r => r.estado === 'activa').length
      
      // Rutas recientes (últimas 5)
      rutasRecientes.value = rutas
        .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
        .slice(0, 5)
    } else {
      estadosRutas.value = []
      actividadHoy.rutasActivas = 0
      rutasRecientes.value = []
    }

    // Procesar datos de usuarios
    const usuarios = usuariosRes.data || []
    if (usuarios.length > 0) {
      // Usuarios registrados hoy
      const hoy = new Date().toDateString()
      actividadHoy.usuarios = usuarios.filter(u => {
        const fechaRegistro = u.fecha_registro ? new Date(u.fecha_registro).toDateString() : null
        return fechaRegistro === hoy
      }).length

      // Usuarios recientes (últimos 5)
      usuariosRecientes.value = usuarios
        .filter(u => u.rol === 'usuario')
        .sort((a, b) => new Date(b.fecha_registro || 0) - new Date(a.fecha_registro || 0))
        .slice(0, 5)
    } else {
      actividadHoy.usuarios = 0
      usuariosRecientes.value = []
    }

    // Unidades activas (estimación basada en rutas activas)
    actividadHoy.unidadesActivas = Math.min(actividadHoy.rutasActivas, totales.unidades)

  } catch (err) {
    error.value = 'Error al cargar estadísticas: ' + (err.response?.data?.message || err.message)
    console.error('Error al cargar estadísticas:', err)
  } finally {
    cargando.value = false
  }
}

function formatearFecha(fecha) {
  if (!fecha) return 'Sin fecha'
  try {
    return new Date(fecha).toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  } catch {
    return 'Fecha inválida'
  }
}

function getNombreCompleto(usuario) {
  if (!usuario) return 'Sin nombre'
  return `${usuario.nombre || ''} ${usuario.apellidos || ''}`.trim() || 'Sin nombre'
}

function getBadgeClass(estado) {
  const estadoLower = estado.toLowerCase()
  const clases = {
    'activa': 'bg-success',
    'activo': 'bg-success',
    'inactiva': 'bg-secondary',
    'inactivo': 'bg-secondary',
    'completada': 'bg-primary',
    'completado': 'bg-primary',
    'pendiente': 'bg-warning',
    'cancelada': 'bg-danger',
    'cancelado': 'bg-danger'
  }
  return clases[estadoLower] || 'bg-secondary'
}

onMounted(async () => {
  setupAxiosInterceptors()
  await cargarDatos()
})
</script>

<style scoped>
/* Layout principal */
.admin-layout {
  min-height: 100vh;
  background: #f8f9fa;
}

/* Main content con padding para el navbar fijo */
.main-content {
  margin-top: 76px;
  min-height: calc(100vh - 76px);
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
}

/* Stats cards */
.stats-card {
  border: none;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  overflow: hidden;
  position: relative;
}

.stats-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  pointer-events: none;
}

.stats-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.stats-icon {
  font-size: 3rem;
  opacity: 0.8;
}

.card-title {
  font-size: 2.5rem;
  font-weight: 700;
}

/* Regular cards */
.card {
  border: none;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.card-header {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-bottom: 1px solid #dee2e6;
  border-radius: 12px 12px 0 0 !important;
  font-weight: 600;
  padding: 20px;
}

.card-body {
  padding: 20px;
}

/* Activity list */
.activity-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.activity-item:hover {
  background: #e9ecef;
  transform: translateX(4px);
}

.activity-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
}

.activity-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Avatar */
.avatar-sm {
  width: 40px;
  height: 40px;
  background: linear-gradient(45deg, #6c757d, #495057);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
}

/* Progress bars */
.progress {
  height: 8px;
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0.1);
  margin-bottom: 4px;
}

.progress-bar {
  background: linear-gradient(90deg, #007bff, #0056b3);
  border-radius: 4px;
}

.progress-sm {
  height: 6px;
}

/* Badges */
.badge {
  font-size: 0.75rem;
  padding: 6px 12px;
  border-radius: 8px;
  font-weight: 500;
}

/* Table improvements */
.table {
  margin-bottom: 0;
}

.table thead th {
  background-color: transparent;
  border-bottom: 2px solid #e9ecef;
  font-weight: 600;
  color: #495057;
  padding: 16px 12px;
}

.table tbody td {
  padding: 12px;
  vertical-align: middle;
  border-top: 1px solid #f8f9fa;
}

/* List group improvements */
.list-group-item {
  border: none;
  border-bottom: 1px solid #f8f9fa;
  padding: 16px 0;
  background: transparent;
}

.list-group-item:last-child {
  border-bottom: none;
}

/* Button improvements */
.btn {
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-outline-primary {
  border-color: #007bff;
  color: #007bff;
}

.btn-outline-primary:hover {
  background-color: #007bff;
  border-color: #007bff;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 123, 255, 0.3);
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card {
  animation: fadeInUp 0.6s ease-out;
}

.stats-card:nth-child(1) { animation-delay: 0.1s; }
.stats-card:nth-child(2) { animation-delay: 0.2s; }
.stats-card:nth-child(3) { animation-delay: 0.3s; }
.stats-card:nth-child(4) { animation-delay: 0.4s; }

/* Empty state */
.text-center.text-muted {
  color: #6c757d !important;
}

.text-center.text-muted i {
  opacity: 0.5;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .main-content {
    margin-top: 60px;
  }
  
  .stats-card .card-body {
    padding: 16px;
  }
  
  .stats-icon {
    font-size: 2rem;
  }
  
  .card-title {
    font-size: 2rem;
  }
  
  .activity-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .activity-content {
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .card-header {
    padding: 16px;
  }
  
  .card-body {
    padding: 16px;
  }
}

@media (max-width: 576px) {
  .activity-icon {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }
  
  .avatar-sm {
    width: 32px;
    height: 32px;
    font-size: 0.75rem;
  }
  
  .list-group-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}

/* Dark mode support */
[data-bs-theme="dark"] .main-content {
  background: linear-gradient(135deg, rgba(52, 58, 64, 0.95) 0%, rgba(33, 37, 41, 0.95) 100%);
}

[data-bs-theme="dark"] .card {
  background-color: rgba(255, 255, 255, 0.05);
  color: #fff;
}

[data-bs-theme="dark"] .card-header {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  border-bottom-color: rgba(255, 255, 255, 0.1);
}

[data-bs-theme="dark"] .activity-item {
  background: rgba(255, 255, 255, 0.05);
}

[data-bs-theme="dark"] .activity-item:hover {
  background: rgba(255, 255, 255, 0.1);
}
</style>
