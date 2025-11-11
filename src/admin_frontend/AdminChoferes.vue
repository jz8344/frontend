<template>
  <AdminLayout 
    page-title="Gestión de Choferes"
    page-description="Administra los conductores del sistema"
    :loading="loading"
    @search="handleSearch"
    @showNotifications="handleNotifications"
    @showHistory="handleHistory"
  >
    <div class="row mb-4">
      <div class="col">
        <div class="card shadow-sm border-0">
          <div class="card-header">
            <h5 class="mb-0">{{ form.id ? 'Editar Chofer' : 'Agregar Nuevo Chofer' }}</h5>
          </div>
          <div class="card-body">
            <form @submit.prevent="guardar" class="row g-3">
              <div class="col-md-6">
                <label class="form-label">Usuario</label>
                <select v-model="form.usuario_id" class="form-select" required>
                  <option value="" disabled>Seleccionar usuario</option>
                  <option v-for="u in usuarios" :key="u.id" :value="u.id">
                    {{ u.nombre }} {{ u.apellidos }}
                  </option>
                </select>
              </div>
              <div class="col-md-6">
                <label class="form-label">Licencia</label>
                <input v-model="form.licencia" class="form-control" placeholder="Número de licencia" />
              </div>
              <div class="col-12">
                <button type="submit" class="btn btn-primary" :disabled="loading">
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                  {{ form.id ? 'Actualizar' : 'Agregar' }}
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

    <div class="row">
      <div class="col">
        <div class="card shadow-sm border-0">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="mb-0">Lista de Choferes</h5>
            <span class="badge bg-primary">{{ choferes.length }} registros</span>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-hover">
                <thead class="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Licencia</th>
                    <th class="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="c in choferes" :key="c.id">
                    <td>{{ c.id }}</td>
                    <td>{{ c.usuario?.nombre }} {{ c.usuario?.apellidos }}</td>
                    <td><code>{{ c.licencia }}</code></td>
                    <td class="text-center">
                      <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary" @click="edit(c)" title="Editar">
                          <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-outline-danger" @click="eliminar(c.id)" title="Eliminar">
                          <i class="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr v-if="choferes.length === 0">
                    <td colspan="4" class="text-center text-muted py-4">
                      No hay choferes registrados
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

const choferes = ref([])
const usuarios = ref([])
const loading = ref(false)
const form = reactive({ 
  id: null, 
  usuario_id: '', 
  licencia: '' 
})

async function cargar() {
  try {
    loading.value = true
    const [cRes, uRes] = await Promise.all([
      http.get('/admin/choferes'),
      http.get('/admin/usuarios')
    ])
    choferes.value = cRes.data
    usuarios.value = uRes.data.filter(u => u.rol === 'usuario')
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
  await http.put(`/admin/choferes/${form.id}`, form)
    } else {
  await http.post('/admin/choferes', form)
    }
    reset()
    await cargar()
  } catch (error) {
    console.error('Error guardando:', error)
  } finally {
    loading.value = false
  }
}

function edit(c) {
  Object.assign(form, c)
}

function reset() {
  Object.assign(form, {
    id: null,
    usuario_id: '',
    licencia: ''
  })
}

async function eliminar(id) {
  if (confirm('¿Eliminar este chofer?')) {
    try {
  await http.delete(`/admin/choferes/${id}`)
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
