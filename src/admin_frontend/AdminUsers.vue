<template>
  <AdminLayout 
    page-title="Gestión de Usuarios"
    page-description="Administra los usuarios del sistema"
    :loading="loading"
    :loading-message="'Cargando usuarios...'"
    @search="handleSearch"
    @showNotifications="handleNotifications"
    @showHistory="handleHistory"
  >
    <!-- Toolbar -->
    <div class="row mb-4">
      <div class="col">
        <div class="card shadow-sm border-0">
          <div class="card-body">
            <div class="row align-items-center">
              <div class="col-md-6">
                <div class="d-flex gap-2">
                  <button class="btn btn-primary d-flex align-items-center" @click="abrirModalCrear">
                    <i class="bi bi-plus-lg me-2"></i>
                    Nuevo Usuario
                  </button>
                  <button 
                    class="btn btn-outline-danger d-flex align-items-center" 
                    :disabled="!seleccionados.length" 
                    @click="borrarSeleccionados"
                  >
                    <i class="bi bi-trash me-2"></i>
                    Eliminar ({{ seleccionados.length }})
                  </button>
                </div>
              </div>
              <div class="col-md-6">
                <div class="row g-2">
                  <div class="col">
                    <input 
                      v-model="filtro" 
                      type="text" 
                      class="form-control" 
                      placeholder="Buscar nombre o email..."
                    />
                  </div>
                  <div class="col-auto">
                    <select v-model="rolFiltro" class="form-select">
                      <option value="">Todos</option>
                      <option value="usuario">Usuarios</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Grid de usuarios -->
    <div class="row">
      <div class="col">
        <div class="card shadow-sm border-0">
          <div class="card-body">
            <div v-if="loading" class="text-center py-5">
              <div class="spinner-border text-primary mb-3" role="status">
                <span class="visually-hidden">Cargando...</span>
              </div>
              <p class="text-muted">Cargando usuarios...</p>
            </div>
            <div v-else class="row g-4">
              <div
                v-for="u in filtrados"
                :key="u.id"
                class="col-12 col-sm-6 col-lg-4 col-xl-3"
              >
                <div 
                  class="card h-100 user-card" 
                  :class="{ 'border-primary': seleccionados.includes(u.id) }"
                  @click="toggleSeleccion(u.id)"
                  style="cursor: pointer; transition: all 0.3s ease;"
                >
                  <div class="card-body">
                    <div class="d-flex align-items-center mb-3">
                      <div 
                        class="bg-primary bg-gradient rounded-circle d-flex align-items-center justify-content-center me-3"
                        style="width: 48px; height: 48px; font-weight: bold; color: white;"
                      >
                        {{ iniciales(u.nombre, u.apellidos) }}
                      </div>
                      <div class="flex-grow-1">
                        <h6 class="card-title mb-1">{{ u.nombre }} {{ u.apellidos }}</h6>
                        <small class="text-muted">{{ u.correo }}</small>
                      </div>
                      <button 
                        class="btn btn-outline-primary btn-sm" 
                        @click.stop="abrirModalEditar(u)"
                        title="Editar usuario"
                      >
                        <i class="bi bi-pencil"></i>
                      </button>
                    </div>
                    
                    <div class="d-flex justify-content-between align-items-center">
                      <span class="badge bg-primary bg-gradient">
                        {{ u.rol || 'usuario' }}
                      </span>
                      <small class="text-muted">
                        {{ formatearFecha(u.fecha_registro) }}
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para crear/editar usuarios -->
    <div v-if="mostrarModal" class="modal d-block" tabindex="-1" style="background: rgba(0,0,0,0.5);">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ editando ? 'Editar Usuario' : 'Crear Usuario' }}</h5>
            <button type="button" class="btn-close" @click="cerrarModal"></button>
          </div>
          <form @submit.prevent="guardar">
            <div class="modal-body">
              <div v-if="error" class="alert alert-danger">{{ error }}</div>
              
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label">Nombre</label>
                  <input v-model="form.nombre" type="text" class="form-control" required />
                </div>
                <div class="col-md-6">
                  <label class="form-label">Apellidos</label>
                  <input v-model="form.apellidos" type="text" class="form-control" required />
                </div>
                <div class="col-md-6">
                  <label class="form-label">Correo</label>
                  <input 
                    v-model="form.correo" 
                    type="email" 
                    class="form-control" 
                    :disabled="editando" 
                    required 
                  />
                </div>
                <div class="col-md-6">
                  <label class="form-label">Teléfono</label>
                  <input v-model="form.telefono" type="tel" class="form-control" />
                </div>
                <div v-if="!editando" class="col-12">
                  <label class="form-label">Contraseña</label>
                  <div class="input-group">
                    <input 
                      v-model="form.contrasena" 
                      :type="showPwd ? 'text' : 'password'" 
                      class="form-control" 
                      minlength="6" 
                      required 
                    />
                    <button 
                      type="button" 
                      class="btn btn-outline-secondary" 
                      @click="showPwd = !showPwd"
                    >
                      <i :class="showPwd ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                    </button>
                  </div>
                </div>
                <div v-if="editando" class="col-12">
                  <div class="card border-info">
                    <div class="card-body text-center py-4">
                      <i class="bi bi-key fs-1 text-info mb-3"></i>
                      <h6 class="mb-2">Contraseña del Usuario</h6>
                      <p class="text-muted small mb-3">
                        La contraseña está protegida y encriptada
                      </p>
                      <button 
                        type="button" 
                        class="btn btn-outline-info"
                        @click="abrirModalPassword"
                      >
                        <i class="bi bi-pencil-square me-2"></i>
                        Cambiar Contraseña
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="cerrarModal">Cancelar</button>
              <button type="submit" class="btn btn-primary" :disabled="guardando">
                <span v-if="guardando" class="spinner-border spinner-border-sm me-2"></span>
                {{ guardando ? 'Guardando...' : 'Guardar' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal para cambiar contraseña -->
    <div v-if="mostrarModalPassword" class="modal d-block" tabindex="-1" style="background: rgba(0,0,0,0.5);">
      <div class="modal-dialog modal-md">
        <div class="modal-content">
          <div class="modal-header bg-info bg-opacity-10">
            <h5 class="modal-title">
              <i class="bi bi-key me-2"></i>
              Cambiar Contraseña de Usuario
            </h5>
            <button type="button" class="btn-close" @click="cerrarModalPassword"></button>
          </div>
          <form @submit.prevent="guardarPassword">
            <div class="modal-body">
              <div v-if="passwordError" class="alert alert-danger">{{ passwordError }}</div>
              
              <div class="text-center mb-4">
                <div class="bg-info bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center" 
                     style="width: 60px; height: 60px;">
                  <i class="bi bi-person-fill fs-4 text-info"></i>
                </div>
                <h6 class="mt-2 mb-0">{{ usuarioPassword?.nombre }} {{ usuarioPassword?.apellidos }}</h6>
                <small class="text-muted">{{ usuarioPassword?.correo }}</small>
              </div>

              <div class="row g-3">
                <div class="col-12">
                  <label class="form-label">Nueva Contraseña</label>
                  <div class="input-group">
                    <input 
                      v-model="passwordForm.nueva_contrasena" 
                      :type="showNewPwd ? 'text' : 'password'" 
                      class="form-control" 
                      placeholder="Mínimo 6 caracteres"
                      minlength="6" 
                      required
                      autofocus
                    />
                    <button 
                      type="button" 
                      class="btn btn-outline-secondary" 
                      @click="showNewPwd = !showNewPwd"
                    >
                      <i :class="showNewPwd ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                    </button>
                  </div>
                </div>
                <div class="col-12">
                  <label class="form-label">Confirmar Nueva Contraseña</label>
                  <div class="input-group">
                    <input 
                      v-model="passwordForm.confirmar_contrasena" 
                      :type="showConfirmPwd ? 'text' : 'password'" 
                      class="form-control" 
                      placeholder="Repetir contraseña"
                      minlength="6" 
                      required
                    />
                    <button 
                      type="button" 
                      class="btn btn-outline-secondary" 
                      @click="showConfirmPwd = !showConfirmPwd"
                    >
                      <i :class="showConfirmPwd ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                    </button>
                  </div>
                </div>
                <div class="col-12">
                  <div class="form-text">
                    <small class="text-muted">
                      <i class="bi bi-info-circle me-1"></i>
                      La contraseña debe tener al menos 6 caracteres y ambos campos deben coincidir.
                    </small>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="cerrarModalPassword">Cancelar</button>
              <button type="submit" class="btn btn-info" :disabled="guardandoPassword">
                <span v-if="guardandoPassword" class="spinner-border spinner-border-sm me-2"></span>
                <i v-else class="bi bi-check-lg me-2"></i>
                {{ guardandoPassword ? 'Actualizando...' : 'Actualizar Contraseña' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AdminLayout from './layouts/AdminLayout.vue'
import { useAdminAuth } from '@/composables/useAdminAuth.js'
import http from '@/config/api.js'

const { setupAxiosInterceptors } = useAdminAuth()

// Estado reactivo
const usuarios = ref([])
const loading = ref(false)
const error = ref(null)
const filtro = ref('')
const rolFiltro = ref('')
const seleccionados = ref([])
const mostrarModal = ref(false)
const mostrarModalPassword = ref(false)
const editando = ref(false)
const guardando = ref(false)
const guardandoPassword = ref(false)
const showPwd = ref(false)
const showNewPwd = ref(false)
const showConfirmPwd = ref(false)
const cambiarPassword = ref(false)
const passwordError = ref('')
const usuarioPassword = ref(null)

const form = ref({
  id: null,
  nombre: '',
  apellidos: '',
  correo: '',
  telefono: '',
  contrasena: ''
})

const passwordForm = ref({
  nueva_contrasena: '',
  confirmar_contrasena: ''
})

// Computed
const filtrados = computed(() => {
  return usuarios.value.filter(u => {
    const texto = (u.nombre + ' ' + u.apellidos + ' ' + u.correo).toLowerCase()
    const passFiltro = !filtro.value || texto.includes(filtro.value.toLowerCase())
    const passRol = !rolFiltro.value || u.rol === rolFiltro.value
    return passFiltro && passRol
  })
})

// Métodos
const iniciales = (nombre, apellidos) => {
  return ((nombre?.[0] || '') + (apellidos?.[0] || '')).toUpperCase()
}

const formatearFecha = (fecha) => {
  return fecha ? new Date(fecha).toLocaleDateString('es-MX') : ''
}

const abrirModalPassword = () => {
  usuarioPassword.value = usuarios.value.find(u => u.id === form.value.id)
  passwordForm.value = {
    nueva_contrasena: '',
    confirmar_contrasena: ''
  }
  passwordError.value = ''
  showNewPwd.value = false
  showConfirmPwd.value = false
  mostrarModalPassword.value = true
}

const cerrarModalPassword = () => {
  mostrarModalPassword.value = false
  usuarioPassword.value = null
}

const validarPasswords = () => {
  passwordError.value = ''
  
  if (!passwordForm.value.nueva_contrasena || passwordForm.value.nueva_contrasena.length < 6) {
    passwordError.value = 'La nueva contraseña debe tener al menos 6 caracteres'
    return false
  }
  
  if (passwordForm.value.nueva_contrasena !== passwordForm.value.confirmar_contrasena) {
    passwordError.value = 'Las contraseñas no coinciden'
    return false
  }
  
  return true
}

const guardarPassword = async () => {
  if (!validarPasswords()) {
    return
  }
  
  guardandoPassword.value = true
  passwordError.value = ''
  
  try {
    await http.put(`/admin/usuarios/${usuarioPassword.value.id}`, {
      contrasena: passwordForm.value.nueva_contrasena
    })
    
    cerrarModalPassword()
    // Mostrar mensaje de éxito (opcional)
    console.log('Contraseña actualizada correctamente')
  } catch (e) {
    passwordError.value = e.response?.data?.error || 'Error actualizando contraseña'
    console.error('Error:', e)
  } finally {
    guardandoPassword.value = false
  }
}

const cargar = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await http.get('/admin/usuarios')
    usuarios.value = response.data
  } catch (e) {
    error.value = 'Error cargando usuarios'
    console.error('Error:', e)
  } finally {
    loading.value = false
  }
}

const toggleSeleccion = (id) => {
  const index = seleccionados.value.indexOf(id)
  if (index >= 0) {
    seleccionados.value.splice(index, 1)
  } else {
    seleccionados.value.push(id)
  }
}

const abrirModalCrear = () => {
  editando.value = false
  form.value = {
    id: null,
    nombre: '',
    apellidos: '',
    correo: '',
    telefono: '',
    contrasena: ''
  }
  showPwd.value = false
  mostrarModal.value = true
  error.value = null
}

const abrirModalEditar = (usuario) => {
  editando.value = true
  form.value = {
    id: usuario.id,
    nombre: usuario.nombre,
    apellidos: usuario.apellidos,
    correo: usuario.correo,
    telefono: usuario.telefono,
    contrasena: ''
  }
  showPwd.value = false
  mostrarModal.value = true
  error.value = null
}

const cerrarModal = () => {
  mostrarModal.value = false
}

const guardar = async () => {
  guardando.value = true
  error.value = null
  
  try {
    if (editando.value) {
      // Para edición, solo enviar los campos que pueden cambiar (sin contraseña)
      const updateData = {
        nombre: form.value.nombre,
        apellidos: form.value.apellidos,
        telefono: form.value.telefono,
      }
      
      await http.put(`/admin/usuarios/${form.value.id}`, updateData)
    } else {
      // Para creación, enviar todos los datos incluyendo contraseña
      await http.post('/admin/usuarios', form.value)
    }
    await cargar()
    cerrarModal()
  } catch (e) {
    error.value = e.response?.data?.error || 'Error guardando'
    console.error('Error:', e)
  } finally {
    guardando.value = false
  }
}

const borrarSeleccionados = async () => {
  if (!confirm('¿Eliminar usuarios seleccionados?')) return
  
  for (const id of seleccionados.value) {
    try {
      await http.delete(`/admin/usuarios/${id}`)
    } catch (e) {
      console.error('Error eliminando usuario:', e)
    }
  }
  
  seleccionados.value = []
  await cargar()
}

const handleSearch = (query) => {
  filtro.value = query
}

const handleNotifications = () => {
  console.log('Mostrar notificaciones')
}

const handleHistory = () => {
  console.log('Mostrar historial')
}

// Lifecycle
onMounted(async () => {
  setupAxiosInterceptors()
  await cargar()
})
</script>

<style scoped>
.user-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.308);
}

.user-card.border-primary {
  border-width: 2px !important;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}
</style>
