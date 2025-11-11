<template>
  <AdminLayout 
    page-title="Gestión de Hijos"
    page-description="Administra los estudiantes del sistema"
    :loading="loading"
    @search="handleSearch"
    @showNotifications="handleNotifications"
    @showHistory="handleHistory"
  >
    <!-- Formulario -->
    <div class="row mb-4">
      <div class="col">
        <div class="card shadow-sm border-0">
          <div class="card-header">
            <h5 class="mb-0">{{ form.id ? 'Editar Hijo' : 'Agregar Nuevo Hijo' }}</h5>
          </div>
          <div class="card-body">
            <form @submit.prevent="guardar" class="row g-3">
              <div class="col-md-3">
                <label class="form-label">Nombre</label>
                <input v-model="form.nombre" class="form-control" placeholder="Nombre completo" required />
              </div>
              <div class="col-md-2">
                <label class="form-label">Grado</label>
                <input v-model="form.grado" class="form-control" placeholder="Ej: 5to" />
              </div>
              <div class="col-md-2">
                <label class="form-label">Grupo</label>
                <input v-model="form.grupo" class="form-control" placeholder="Ej: A" />
              </div>
              <div class="col-md-3">
                <label class="form-label">Código QR</label>
                <input v-model="form.codigo_qr" class="form-control" placeholder="Código QR único" required />
              </div>
              <div class="col-md-2">
                <label class="form-label">Padre/Tutor</label>
                <select v-model="form.padre_id" class="form-select" required>
                  <option value="" disabled>Seleccionar padre</option>
                  <option v-for="u in padres" :key="u.id" :value="u.id">
                    {{ u.nombre }} {{ u.apellidos }}
                  </option>
                </select>
              </div>
              <div class="col-12">
                <button type="submit" class="btn btn-primary" :disabled="loading">
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                  {{ form.id ? 'Actualizar' : 'Crear' }}
                </button>
                <button 
                  type="button" 
                  v-if="form.id" 
                  class="btn btn-secondary ms-2" 
                  @click="reset"
                >
                  Cancelar
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
            <h5 class="mb-0">Lista de Hijos</h5>
            <span class="badge bg-primary">{{ hijos.length }} registros</span>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-hover">
                <thead class="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Grado</th>
                    <th>Grupo</th>
                    <th>Código QR</th>
                    <th>Padre/Tutor</th>
                    <th class="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="h in hijos" :key="h.id">
                    <td>{{ h.id }}</td>
                    <td>{{ h.nombre }}</td>
                    <td>{{ h.grado }}</td>
                    <td>{{ h.grupo }}</td>
                    <td><code>{{ h.codigo_qr }}</code></td>
                    <td>{{ h.padre?.nombre }} {{ h.padre?.apellidos }}</td>
                    <td class="text-center">
                      <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary" @click="edit(h)" title="Editar">
                          <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-outline-danger" @click="eliminar(h.id)" title="Eliminar">
                          <i class="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr v-if="hijos.length === 0">
                    <td colspan="7" class="text-center text-muted py-4">
                      No hay hijos registrados
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
import { ref, reactive, onMounted } from 'vue'
import AdminLayout from './layouts/AdminLayout.vue'
import { useAdminAuth } from '@/composables/useAdminAuth.js'
import http from '@/config/api.js'

const { setupAxiosInterceptors } = useAdminAuth()

const hijos = ref([])
const padres = ref([])
const loading = ref(false)
const form = reactive({ 
  id: null, 
  nombre: '', 
  grado: '', 
  grupo: '', 
  codigo_qr: '', 
  padre_id: '' 
})

async function cargar() {
  try {
    loading.value = true
    const [hRes, uRes] = await Promise.all([
      http.get('/admin/hijos'),
      http.get('/admin/usuarios')
    ])
    hijos.value = hRes.data
    padres.value = uRes.data.filter(u => u.rol === 'usuario')
  } catch (error) {
    console.error('Error cargando datos:', error)
  } finally {
    loading.value = false
  }
}

async function guardar() {
  try {
    loading.value = true
    if (form.id) {
  await http.put(`/admin/hijos/${form.id}`, form)
    } else {
  await http.post('/admin/hijos', form)
    }
    reset()
    await cargar()
  } catch (error) {
    console.error('Error guardando:', error)
  } finally {
    loading.value = false
  }
}

function edit(h) {
  Object.assign(form, h)
}

function reset() {
  Object.assign(form, {
    id: null,
    nombre: '',
    grado: '',
    grupo: '',
    codigo_qr: '',
    padre_id: ''
  })
}

async function eliminar(id) {
  if (confirm('¿Eliminar este hijo?')) {
    try {
  await http.delete(`/admin/hijos/${id}`)
      await cargar()
    } catch (error) {
      console.error('Error eliminando:', error)
    }
  }
}

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
