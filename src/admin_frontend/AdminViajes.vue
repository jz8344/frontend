<template>
  <div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="mb-1">
          <i class="bi bi-bus-front-fill text-primary me-2"></i>
          Gestión de Viajes
        </h2>
        <p class="text-muted mb-0">Administra las rutas de transporte escolar</p>
      </div>
      <button class="btn btn-primary" @click="openCreateModal">
        <i class="bi bi-plus-circle me-1"></i>
        Nuevo Viaje
      </button>
    </div>

    <!-- Filtros -->
    <div class="card mb-3">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-3">
            <select v-model="filtros.estado" class="form-select" @change="cargar">
              <option value="">Todos los estados</option>
              <option value="abierto">Abierto</option>
              <option value="cerrado">Cerrado</option>
              <option value="en_curso">En Curso</option>
              <option value="completado">Completado</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>
          <div class="col-md-3">
            <select v-model="filtros.tipo_viaje" class="form-select" @change="cargar">
              <option value="">Todos los tipos</option>
              <option value="unico">Único</option>
              <option value="recurrente">Recurrente</option>
            </select>
          </div>
          <div class="col-md-6">
            <input 
              v-model="busqueda" 
              type="text" 
              class="form-control" 
              placeholder="Buscar por nombre de ruta..."
              @input="filtrarViajes"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Tabla de Viajes -->
    <div class="card">
      <div class="card-body">
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Cargando...</span>
          </div>
        </div>

        <div v-else-if="viajesFiltrados.length === 0" class="text-center py-5">
          <i class="bi bi-inbox display-1 text-muted"></i>
          <p class="text-muted mt-3">No hay viajes registrados</p>
        </div>

        <div v-else class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>Ruta</th>
                <th>Tipo</th>
                <th>Escuela</th>
                <th>Horario</th>
                <th>Turno</th>
                <th>Capacidad</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="viaje in viajesFiltrados" :key="viaje.id">
                <td>
                  <strong>{{ viaje.nombre_ruta }}</strong>
                  <br>
                  <small class="text-muted">
                    <i class="bi bi-bus-front me-1"></i>
                    {{ viaje.unidad?.matricula }}
                    <i class="bi bi-person-vcard ms-2 me-1"></i>
                    {{ viaje.chofer?.nombre }}
                  </small>
                </td>
                <td>
                  <span 
                    class="badge" 
                    :class="viaje.tipo_viaje === 'unico' ? 'bg-info' : 'bg-primary'"
                  >
                    {{ viaje.tipo_viaje === 'unico' ? 'Único' : 'Recurrente' }}
                  </span>
                  <br>
                  <small class="text-muted" v-if="viaje.tipo_viaje === 'unico'">
                    {{ formatearFecha(viaje.fecha_especifica) }}
                  </small>
                  <small class="text-muted" v-else-if="viaje.dias_activos">
                    {{ viaje.dias_activos.join(', ') }}
                  </small>
                </td>
                <td>
                  <i class="bi bi-building me-1"></i>
                  {{ viaje.escuela?.nombre || 'N/A' }}
                </td>
                <td>
                  <i class="bi bi-clock me-1"></i>
                  {{ viaje.horario_salida }}
                </td>
                <td>
                  <span 
                    class="badge" 
                    :class="viaje.turno === 'matutino' ? 'bg-warning text-dark' : 'bg-info'"
                  >
                    {{ viaje.turno === 'matutino' ? 'Matutino' : 'Vespertino' }}
                  </span>
                </td>
                <td>
                  <div class="progress" style="height: 20px; min-width: 80px;">
                    <div 
                      class="progress-bar" 
                      :class="getCapacidadClass(viaje)"
                      role="progressbar" 
                      :style="`width: ${getCapacidadPorcentaje(viaje)}%`"
                      :aria-valuenow="viaje.capacidad_actual" 
                      :aria-valuemin="0" 
                      :aria-valuemax="viaje.capacidad_maxima"
                    >
                      {{ viaje.capacidad_actual }}/{{ viaje.capacidad_maxima }}
                    </div>
                  </div>
                </td>
                <td>
                  <span class="badge" :class="getEstadoBadgeClass(viaje.estado)">
                    {{ getEstadoLabel(viaje.estado) }}
                  </span>
                </td>
                <td>
                  <div class="btn-group btn-group-sm">
                    <button 
                      class="btn btn-outline-primary" 
                      @click="edit(viaje)"
                      title="Editar"
                    >
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button 
                      class="btn btn-outline-info" 
                      @click="verSolicitudes(viaje)"
                      title="Ver solicitudes"
                    >
                      <i class="bi bi-list-check"></i>
                    </button>
                    <button 
                      class="btn btn-outline-danger" 
                      @click="eliminar(viaje.id)"
                      title="Eliminar"
                    >
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal de Formulario -->
    <div 
      class="modal fade" 
      id="viajeModal" 
      tabindex="-1" 
      ref="modalElement"
    >
      <div class="modal-dialog modal-lg modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="bi bi-bus-front-fill me-2"></i>
              {{ form.id ? 'Editar Viaje' : 'Nuevo Viaje' }}
            </h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <form @submit.prevent="guardar">
            <div class="modal-body">
              <div class="row g-3">
                <div class="col-12">
                  <label class="form-label">Nombre de la Ruta *</label>
                  <input 
                    v-model="form.nombre_ruta" 
                    type="text" 
                    class="form-control" 
                    required
                    maxlength="100"
                    placeholder="Ej: Ruta Centro - Escuela Primaria"
                  />
                </div>

                <div class="col-md-6">
                  <label class="form-label">Tipo de Viaje *</label>
                  <select v-model="form.tipo_viaje" class="form-select" required>
                    <option value="">Seleccionar...</option>
                    <option value="unico">Único (fecha específica)</option>
                    <option value="recurrente">Recurrente (días de semana)</option>
                  </select>
                </div>

                <div class="col-md-6">
                  <label class="form-label">Escuela *</label>
                  <select v-model="form.escuela_id" class="form-select" required>
                    <option value="">Seleccionar...</option>
                    <option v-for="esc in escuelas" :key="esc.id" :value="esc.id">
                      {{ esc.nombre }}
                    </option>
                  </select>
                </div>

                <div class="col-md-6">
                  <label class="form-label">Unidad *</label>
                  <select v-model="form.unidad_id" class="form-select" required>
                    <option value="">Seleccionar...</option>
                    <option v-for="uni in unidades" :key="uni.id" :value="uni.id">
                      {{ uni.matricula }} - {{ uni.modelo }}
                    </option>
                  </select>
                </div>

                <div class="col-md-6">
                  <label class="form-label">Chofer *</label>
                  <select v-model="form.chofer_id" class="form-select" required>
                    <option value="">Seleccionar...</option>
                    <option v-for="ch in choferes" :key="ch.id" :value="ch.id">
                      {{ ch.nombre }} {{ ch.apellidos }}
                    </option>
                  </select>
                </div>

                <!-- Campos condicionales según tipo_viaje -->
                <div v-if="form.tipo_viaje === 'unico'" class="col-md-6">
                  <label class="form-label">Fecha del Viaje *</label>
                  <input 
                    v-model="form.fecha_especifica" 
                    type="date" 
                    class="form-control" 
                    :required="form.tipo_viaje === 'unico'"
                  />
                </div>

                <div v-if="form.tipo_viaje === 'recurrente'" class="col-12">
                  <label class="form-label">Días Activos *</label>
                  <div class="d-flex flex-wrap gap-2">
                    <div 
                      v-for="dia in diasSemana" 
                      :key="dia" 
                      class="form-check"
                    >
                      <input 
                        class="form-check-input" 
                        type="checkbox" 
                        :value="dia" 
                        v-model="form.dias_activos"
                        :id="`dia-${dia}`"
                      />
                      <label class="form-check-label" :for="`dia-${dia}`">
                        {{ dia }}
                      </label>
                    </div>
                  </div>
                </div>

                <div v-if="form.tipo_viaje === 'recurrente'" class="col-md-6">
                  <label class="form-label">Fecha Inicio Vigencia *</label>
                  <input 
                    v-model="form.fecha_inicio_vigencia" 
                    type="date" 
                    class="form-control" 
                    :required="form.tipo_viaje === 'recurrente'"
                  />
                </div>

                <div v-if="form.tipo_viaje === 'recurrente'" class="col-md-6">
                  <label class="form-label">Fecha Fin Vigencia *</label>
                  <input 
                    v-model="form.fecha_fin_vigencia" 
                    type="date" 
                    class="form-control" 
                    :required="form.tipo_viaje === 'recurrente'"
                  />
                </div>

                <div class="col-md-6">
                  <label class="form-label">Horario de Salida *</label>
                  <input 
                    v-model="form.horario_salida" 
                    type="time" 
                    class="form-control" 
                    required
                  />
                </div>

                <div class="col-md-6">
                  <label class="form-label">Turno *</label>
                  <select v-model="form.turno" class="form-select" required>
                    <option value="">Seleccionar...</option>
                    <option value="matutino">Matutino</option>
                    <option value="vespertino">Vespertino</option>
                  </select>
                </div>

                <div v-if="form.id" class="col-md-6">
                  <label class="form-label">Estado</label>
                  <select v-model="form.estado" class="form-select">
                    <option value="abierto">Abierto</option>
                    <option value="cerrado">Cerrado</option>
                    <option value="en_curso">En Curso</option>
                    <option value="completado">Completado</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </div>

                <div class="col-12">
                  <label class="form-label">Descripción</label>
                  <textarea 
                    v-model="form.descripcion" 
                    class="form-control" 
                    rows="2"
                    maxlength="500"
                    placeholder="Información adicional del viaje..."
                  ></textarea>
                </div>

                <div class="col-12">
                  <label class="form-label">Notas Administrativas</label>
                  <textarea 
                    v-model="form.notas" 
                    class="form-control" 
                    rows="2"
                    maxlength="500"
                    placeholder="Notas internas..."
                  ></textarea>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="closeModal">
                Cancelar
              </button>
              <button type="submit" class="btn btn-primary" :disabled="saving">
                <span v-if="saving" class="spinner-border spinner-border-sm me-1"></span>
                {{ form.id ? 'Actualizar' : 'Crear' }} Viaje
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useNotifications } from '@/composables/useNotifications'
import http from '@/config/api.js'
import { Modal } from 'bootstrap'

const { notifyCreated, notifyUpdated, notifyDeleted } = useNotifications()

const viajes = ref([])
const escuelas = ref([])
const unidades = ref([])
const choferes = ref([])
const loading = ref(false)
const saving = ref(false)
const busqueda = ref('')
const filtros = reactive({
  estado: '',
  tipo_viaje: ''
})

const modalElement = ref(null)
let modalInstance = null

const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']

const form = reactive({
  id: null,
  nombre_ruta: '',
  tipo_viaje: '',
  escuela_id: '',
  unidad_id: '',
  chofer_id: '',
  fecha_especifica: '',
  dias_activos: [],
  fecha_inicio_vigencia: '',
  fecha_fin_vigencia: '',
  horario_salida: '',
  turno: '',
  estado: 'abierto',
  descripcion: '',
  notas: ''
})

const viajesFiltrados = computed(() => {
  let resultado = viajes.value

  if (busqueda.value) {
    const term = busqueda.value.toLowerCase()
    resultado = resultado.filter(v => 
      v.nombre_ruta?.toLowerCase().includes(term)
    )
  }

  return resultado
})

function filtrarViajes() {
  // La lógica de filtrado ya está en el computed
}

async function cargar() {
  try {
    loading.value = true
    const params = {}
    if (filtros.estado) params.estado = filtros.estado
    if (filtros.tipo_viaje) params.tipo_viaje = filtros.tipo_viaje

    const [viajesRes, escuelasRes, unidadesRes, choferesRes] = await Promise.all([
      http.get('/admin/viajes', { params }),
      http.get('/admin/escuelas'),
      http.get('/admin/unidades'),
      http.get('/admin/choferes')
    ])

    viajes.value = viajesRes.data
    escuelas.value = escuelasRes.data
    unidades.value = unidadesRes.data
    choferes.value = choferesRes.data
  } catch (error) {
    console.error('Error cargando datos:', error)
  } finally {
    loading.value = false
  }
}

function openCreateModal() {
  reset()
  if (!modalInstance) {
    modalInstance = new Modal(modalElement.value)
  }
  modalInstance.show()
}

function closeModal() {
  if (modalInstance) {
    modalInstance.hide()
  }
  reset()
}

function edit(viaje) {
  Object.assign(form, {
    id: viaje.id,
    nombre_ruta: viaje.nombre_ruta,
    tipo_viaje: viaje.tipo_viaje,
    escuela_id: viaje.escuela_id,
    unidad_id: viaje.unidad_id,
    chofer_id: viaje.chofer_id,
    fecha_especifica: viaje.fecha_especifica,
    dias_activos: viaje.dias_activos || [],
    fecha_inicio_vigencia: viaje.fecha_inicio_vigencia,
    fecha_fin_vigencia: viaje.fecha_fin_vigencia,
    horario_salida: viaje.horario_salida,
    turno: viaje.turno,
    estado: viaje.estado,
    descripcion: viaje.descripcion || '',
    notas: viaje.notas || ''
  })
  
  if (!modalInstance) {
    modalInstance = new Modal(modalElement.value)
  }
  modalInstance.show()
}

function reset() {
  Object.assign(form, {
    id: null,
    nombre_ruta: '',
    tipo_viaje: '',
    escuela_id: '',
    unidad_id: '',
    chofer_id: '',
    fecha_especifica: '',
    dias_activos: [],
    fecha_inicio_vigencia: '',
    fecha_fin_vigencia: '',
    horario_salida: '',
    turno: '',
    estado: 'abierto',
    descripcion: '',
    notas: ''
  })
}

async function guardar() {
  try {
    saving.value = true

    const payload = { ...form }
    
    // Limpiar campos según tipo_viaje
    if (payload.tipo_viaje === 'unico') {
      payload.dias_activos = null
      payload.fecha_inicio_vigencia = null
      payload.fecha_fin_vigencia = null
    } else if (payload.tipo_viaje === 'recurrente') {
      payload.fecha_especifica = null
    }

    if (form.id) {
      await http.put(`/admin/viajes/${form.id}`, payload)
      notifyUpdated('viaje', form.nombre_ruta)
    } else {
      await http.post('/admin/viajes', payload)
      notifyCreated('viaje', payload.nombre_ruta)
    }

    closeModal()
    await cargar()
  } catch (error) {
    console.error('Error guardando viaje:', error)
    alert(error.response?.data?.message || 'Error al guardar el viaje')
  } finally {
    saving.value = false
  }
}

async function eliminar(id) {
  const viaje = viajes.value.find(v => v.id === id)
  const nombreViaje = viaje?.nombre_ruta || `ID ${id}`

  if (confirm(`¿Eliminar el viaje "${nombreViaje}"?`)) {
    try {
      await http.delete(`/admin/viajes/${id}`)
      notifyDeleted('viaje', nombreViaje)
      await cargar()
    } catch (error) {
      console.error('Error eliminando viaje:', error)
      alert(error.response?.data?.message || 'Error al eliminar el viaje')
    }
  }
}

function verSolicitudes(viaje) {
  // TODO: Implementar vista de solicitudes
  console.log('Ver solicitudes del viaje:', viaje)
  alert(`Funcionalidad de solicitudes para "${viaje.nombre_ruta}" en desarrollo`)
}

function getCapacidadPorcentaje(viaje) {
  if (!viaje.capacidad_maxima) return 0
  return (viaje.capacidad_actual / viaje.capacidad_maxima) * 100
}

function getCapacidadClass(viaje) {
  const porcentaje = getCapacidadPorcentaje(viaje)
  if (porcentaje >= 90) return 'bg-danger'
  if (porcentaje >= 70) return 'bg-warning'
  return 'bg-success'
}

function getEstadoBadgeClass(estado) {
  const clases = {
    'abierto': 'bg-success',
    'cerrado': 'bg-secondary',
    'en_curso': 'bg-primary',
    'completado': 'bg-info',
    'cancelado': 'bg-danger'
  }
  return clases[estado] || 'bg-secondary'
}

function getEstadoLabel(estado) {
  const labels = {
    'abierto': 'Abierto',
    'cerrado': 'Cerrado',
    'en_curso': 'En Curso',
    'completado': 'Completado',
    'cancelado': 'Cancelado'
  }
  return labels[estado] || estado
}

function formatearFecha(fecha) {
  if (!fecha) return ''
  const date = new Date(fecha)
  return date.toLocaleDateString('es-MX', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

onMounted(async () => {
  await cargar()
})
</script>

<style scoped>
.progress {
  font-size: 0.75rem;
}

.btn-group-sm > .btn {
  padding: 0.25rem 0.5rem;
}

.form-check {
  min-width: 100px;
}
</style>
