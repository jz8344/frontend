<template>
  <AdminLayout 
    page-title="Gestión de Escuelas"
    page-description="Administra las escuelas a las que TrailynSafe da servicio"
    :loading="loading"
    @search="handleSearch"
    @showNotifications="handleNotifications"
    @showHistory="handleHistory"
  >
    <!-- Estadísticas rápidas -->
    <div class="row mb-4">
      <div class="col-md-3">
        <div class="card bg-primary text-white">
          <div class="card-body">
            <h6 class="card-subtitle mb-2">Total Escuelas</h6>
            <h3 class="mb-0">{{ escuelas.length }}</h3>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card bg-success text-white">
          <div class="card-body">
            <h6 class="card-subtitle mb-2">Servicios Activos</h6>
            <h3 class="mb-0">{{ escuelasActivas }}</h3>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card bg-info text-white">
          <div class="card-body">
            <h6 class="card-subtitle mb-2">Total Alumnos</h6>
            <h3 class="mb-0">{{ totalAlumnos }}</h3>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card bg-warning text-dark">
          <div class="card-body">
            <h6 class="card-subtitle mb-2">Suspendidos</h6>
            <h3 class="mb-0">{{ escuelasSuspendidas }}</h3>
          </div>
        </div>
      </div>
    </div>

    <!-- Formulario -->
    <div class="row mb-4">
      <div class="col">
        <div class="card shadow-sm border-0">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="mb-0">
              <i class="bi bi-building me-2"></i>
              {{ form.id ? 'Editar Escuela' : 'Agregar Nueva Escuela' }}
            </h5>
            <button 
              v-if="form.id" 
              type="button" 
              class="btn btn-sm btn-outline-secondary"
              @click="reset"
            >
              <i class="bi bi-x-circle me-1"></i>Cancelar
            </button>
          </div>
          <div class="card-body">
            <form @submit.prevent="guardar" class="row g-3">
              <!-- Información Básica -->
              <div class="col-12">
                <h6 class="text-muted border-bottom pb-2 mb-3">
                  <i class="bi bi-info-circle me-2"></i>Información Básica
                </h6>
              </div>
              
              <div class="col-md-8">
                <label class="form-label">Nombre de la Escuela *</label>
                <input v-model="form.nombre" class="form-control" placeholder="Nombre completo de la institución" required />
              </div>
              <div class="col-md-4">
                <label class="form-label">Clave (CCT)</label>
                <input v-model="form.clave" class="form-control" placeholder="Clave de Centro de Trabajo" />
              </div>

              <div class="col-md-6">
                <label class="form-label">Nivel Educativo *</label>
                <select v-model="form.nivel" class="form-select" required>
                  <option value="">Seleccionar...</option>
                  <option value="preescolar">Preescolar</option>
                  <option value="primaria">Primaria</option>
                  <option value="secundaria">Secundaria</option>
                  <option value="preparatoria">Preparatoria</option>
                  <option value="universidad">Universidad</option>
                  <option value="mixto">Mixto</option>
                </select>
              </div>
              <div class="col-md-6">
                <label class="form-label">Turno</label>
                <select v-model="form.turno" class="form-select">
                  <option value="">Seleccionar...</option>
                  <option value="matutino">Matutino</option>
                  <option value="vespertino">Vespertino</option>
                  <option value="mixto">Mixto</option>
                  <option value="tiempo_completo">Tiempo Completo</option>
                </select>
              </div>

              <!-- Ubicación -->
              <div class="col-12 mt-4">
                <h6 class="text-muted border-bottom pb-2 mb-3">
                  <i class="bi bi-geo-alt me-2"></i>Ubicación
                </h6>
              </div>

              <div class="col-12">
                <label class="form-label">Dirección *</label>
                <textarea v-model="form.direccion" class="form-control" rows="2" placeholder="Dirección completa" required></textarea>
              </div>

              <div class="col-md-4">
                <label class="form-label">Colonia</label>
                <input v-model="form.colonia" class="form-control" placeholder="Colonia o fraccionamiento" />
              </div>
              <div class="col-md-4">
                <label class="form-label">Ciudad</label>
                <input v-model="form.ciudad" class="form-control" placeholder="Ciudad" />
              </div>
              <div class="col-md-4">
                <label class="form-label">Código Postal</label>
                <input v-model="form.codigo_postal" class="form-control" placeholder="00000" maxlength="5" />
              </div>

              <!-- Contacto -->
              <div class="col-12 mt-4">
                <h6 class="text-muted border-bottom pb-2 mb-3">
                  <i class="bi bi-person-lines-fill me-2"></i>Información de Contacto
                </h6>
              </div>

              <div class="col-md-6">
                <label class="form-label">Teléfono</label>
                <input v-model="form.telefono" type="tel" class="form-control" placeholder="+52 123 456 7890" />
              </div>
              <div class="col-md-6">
                <label class="form-label">Correo Electrónico</label>
                <input v-model="form.correo" type="email" class="form-control" placeholder="contacto@escuela.edu.mx" />
              </div>

              <div class="col-md-6">
                <label class="form-label">Nombre del Contacto</label>
                <input v-model="form.contacto" class="form-control" placeholder="Director(a) o responsable" />
              </div>
              <div class="col-md-6">
                <label class="form-label">Cargo del Contacto</label>
                <input v-model="form.cargo_contacto" class="form-control" placeholder="Director(a), Subdirector(a)" />
              </div>

              <!-- Servicio -->
              <div class="col-12 mt-4">
                <h6 class="text-muted border-bottom pb-2 mb-3">
                  <i class="bi bi-gear me-2"></i>Información del Servicio
                </h6>
              </div>

              <div class="col-md-6">
                <label class="form-label">Horario de Entrada</label>
                <input v-model="form.horario_entrada" type="time" class="form-control" />
              </div>
              <div class="col-md-6">
                <label class="form-label">Horario de Salida</label>
                <input v-model="form.horario_salida" type="time" class="form-control" />
              </div>

              <div class="col-md-6">
                <label class="form-label">Fecha de Inicio de Servicio</label>
                <input v-model="form.fecha_inicio_servicio" type="date" class="form-control" />
              </div>
              <div class="col-md-6">
                <label class="form-label">Número de Alumnos</label>
                <input v-model="form.numero_alumnos" type="number" class="form-control" placeholder="Alumnos que usan el servicio" min="0" />
              </div>

              <div class="col-12">
                <label class="form-label">Notas/Observaciones</label>
                <textarea v-model="form.notas" class="form-control" rows="3" placeholder="Información adicional relevante"></textarea>
              </div>

              <div class="col-12">
                <label class="form-label">Estado del Servicio *</label>
                <select v-model="form.estado" class="form-select" required>
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                  <option value="suspendido">Suspendido</option>
                </select>
              </div>

              <div class="col-12 mt-4">
                <button type="submit" class="btn btn-primary" :disabled="loading">
                  <i class="bi" :class="form.id ? 'bi-save' : 'bi-plus-circle'"></i>
                  {{ form.id ? 'Actualizar' : 'Guardar' }} Escuela
                </button>
                <button 
                  type="button" 
                  class="btn btn-secondary ms-2" 
                  @click="reset"
                  :disabled="loading"
                >
                  <i class="bi bi-x-circle"></i> Limpiar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabla -->
    <div class="row">
      <div class="col">
        <div class="card shadow-sm border-0">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="mb-0">
              <i class="bi bi-list-ul me-2"></i>Lista de Escuelas
            </h5>
            <span class="badge bg-primary">{{ escuelas.length }} registros</span>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-hover">
                <thead class="table-light">
                  <tr>
                    <th>Escuela</th>
                    <th>Nivel</th>
                    <th>Ubicación</th>
                    <th>Contacto</th>
                    <th>Alumnos</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="escuela in escuelas" :key="escuela.id">
                    <td>
                      <div class="fw-bold">{{ escuela.nombre }}</div>
                      <small class="text-muted" v-if="escuela.clave">CCT: {{ escuela.clave }}</small>
                    </td>
                    <td>
                      <span class="badge bg-info">{{ formatNivel(escuela.nivel) }}</span>
                      <div><small class="text-muted">{{ formatTurno(escuela.turno) }}</small></div>
                    </td>
                    <td>
                      <div>{{ escuela.ciudad || 'N/A' }}</div>
                      <small class="text-muted">{{ escuela.colonia || '' }}</small>
                    </td>
                    <td>
                      <div>{{ escuela.contacto || 'N/A' }}</div>
                      <small class="text-muted">{{ escuela.telefono || '' }}</small>
                    </td>
                    <td class="text-center">
                      <span class="badge bg-secondary">{{ escuela.numero_alumnos || 0 }}</span>
                    </td>
                    <td>
                      <span 
                        class="badge" 
                        :class="{
                          'bg-success': escuela.estado === 'activo',
                          'bg-danger': escuela.estado === 'inactivo',
                          'bg-warning text-dark': escuela.estado === 'suspendido'
                        }"
                      >
                        {{ formatEstado(escuela.estado) }}
                      </span>
                    </td>
                    <td>
                      <div class="btn-group btn-group-sm">
                        <button 
                          class="btn btn-outline-primary" 
                          @click="edit(escuela)"
                          title="Editar"
                        >
                          <i class="bi bi-pencil"></i>
                        </button>
                        <button 
                          class="btn btn-outline-danger" 
                          @click="eliminar(escuela.id)"
                          title="Eliminar"
                        >
                          <i class="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr v-if="escuelas.length === 0">
                    <td colspan="7" class="text-center text-muted py-4">
                      <i class="bi bi-inbox fs-1 d-block mb-2"></i>
                      No hay escuelas registradas
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import AdminLayout from './layouts/AdminLayout.vue'
import { useAdminAuth } from '@/composables/useAdminAuth.js'
import http from '@/config/api.js'

const { setupAxiosInterceptors } = useAdminAuth()

const escuelas = ref([])
const loading = ref(false)
const form = reactive({ 
  id: null,
  nombre: '',
  clave: '',
  nivel: '',
  turno: '',
  direccion: '',
  colonia: '',
  ciudad: '',
  codigo_postal: '',
  telefono: '',
  correo: '',
  contacto: '',
  cargo_contacto: '',
  horario_entrada: '',
  horario_salida: '',
  fecha_inicio_servicio: '',
  numero_alumnos: 0,
  notas: '',
  estado: 'activo'
})

// Computed
const escuelasActivas = computed(() => 
  escuelas.value.filter(e => e.estado === 'activo').length
)

const escuelasSuspendidas = computed(() => 
  escuelas.value.filter(e => e.estado === 'suspendido').length
)

const totalAlumnos = computed(() => 
  escuelas.value.reduce((sum, e) => sum + (parseInt(e.numero_alumnos) || 0), 0)
)

// Métodos
async function cargar() {
  try {
    loading.value = true
    const response = await http.get('/admin/escuelas')
    escuelas.value = response.data
  } catch (error) {
    console.error('Error cargando escuelas:', error)
  } finally {
    loading.value = false
  }
}

async function guardar() {
  try {
    loading.value = true
    if (form.id) {
      await http.put(`/admin/escuelas/${form.id}`, form)
    } else {
      await http.post('/admin/escuelas', form)
    }
    reset()
    await cargar()
  } catch (error) {
    console.error('Error guardando:', error)
  } finally {
    loading.value = false
  }
}

function edit(escuela) {
  Object.assign(form, escuela)
  // Scroll to form
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function reset() {
  Object.assign(form, {
    id: null,
    nombre: '',
    clave: '',
    nivel: '',
    turno: '',
    direccion: '',
    colonia: '',
    ciudad: '',
    codigo_postal: '',
    telefono: '',
    correo: '',
    contacto: '',
    cargo_contacto: '',
    horario_entrada: '',
    horario_salida: '',
    fecha_inicio_servicio: '',
    numero_alumnos: 0,
    notas: '',
    estado: 'activo'
  })
}

async function eliminar(id) {
  if (confirm('¿Estás seguro de eliminar esta escuela?')) {
    try {
      await http.delete(`/admin/escuelas/${id}`)
      await cargar()
    } catch (error) {
      console.error('Error eliminando:', error)
    }
  }
}

// Formatters
function formatNivel(nivel) {
  const niveles = {
    'preescolar': 'Preescolar',
    'primaria': 'Primaria',
    'secundaria': 'Secundaria',
    'preparatoria': 'Preparatoria',
    'universidad': 'Universidad',
    'mixto': 'Mixto'
  }
  return niveles[nivel] || nivel
}

function formatTurno(turno) {
  const turnos = {
    'matutino': 'Matutino',
    'vespertino': 'Vespertino',
    'mixto': 'Mixto',
    'tiempo_completo': 'Tiempo Completo'
  }
  return turnos[turno] || turno || ''
}

function formatEstado(estado) {
  const estados = {
    'activo': 'Activo',
    'inactivo': 'Inactivo',
    'suspendido': 'Suspendido'
  }
  return estados[estado] || estado
}

// Handlers
const handleSearch = (query) => {
  console.log('Buscar:', query)
}

const handleNotifications = () => {
  console.log('Mostrar notificaciones')
}

const handleHistory = () => {
  console.log('Mostrar historial')
}

onMounted(async () => {
  setupAxiosInterceptors()
  await cargar()
})
</script>

<style scoped>
.card {
  transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.table th {
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.875rem;
  letter-spacing: 0.5px;
}

.badge {
  font-weight: 500;
  padding: 0.375rem 0.75rem;
}
</style>
