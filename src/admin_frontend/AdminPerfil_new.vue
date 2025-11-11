<template>
  <AdminLayout 
    page-title="Perfil de Administrador"
    page-description="Gestiona tu información personal y configuración de cuenta"
    :loading="loading || passwordLoading"
    :loading-message="loading ? 'Actualizando perfil...' : 'Cambiando contraseña...'"
    @search="handleSearch"
    @showNotifications="handleNotifications"
    @showHistory="handleHistory"
  >
    <!-- Perfil básico -->
    <div class="row">
      <div class="col-12">
        <div class="card shadow-lg border-0 rounded-4 overflow-hidden">
          <div class="px-4 py-5 text-white" style="background: linear-gradient(135deg, #7c3aed, #3b82f6);">
            <div class="d-flex align-items-center">
              <div class="bg-white bg-opacity-20 rounded-circle d-flex align-items-center justify-content-center me-4"
                   style="width: 80px; height: 80px; font-size: 2rem; font-weight: bold;">
                {{ adminInitials }}
              </div>
              <div>
                <h3 class="mb-1">{{ adminName }}</h3>
                <p class="mb-0 opacity-75">Administrador del Sistema</p>
                <small class="opacity-50">{{ adminData?.correo }}</small>
              </div>
            </div>
          </div>

          <div class="card-body p-5">
            <form @submit.prevent="actualizarPerfil">
              <div v-if="error" class="alert alert-danger d-flex align-items-center" role="alert">
                <i class="bi bi-exclamation-triangle-fill me-2"></i>
                {{ error }}
              </div>

              <div v-if="success" class="alert alert-success d-flex align-items-center" role="alert">
                <i class="bi bi-check-circle-fill me-2"></i>
                {{ success }}
              </div>

              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label fw-medium">Nombre</label>
                  <div class="input-group">
                    <span class="input-group-text bg-white">
                      <i class="bi bi-person text-primary"></i>
                    </span>
                    <input 
                      type="text" 
                      class="form-control" 
                      v-model="form.nombre"
                      placeholder="Tu nombre"
                      required
                    >
                  </div>
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-medium">Apellidos</label>
                  <div class="input-group">
                    <span class="input-group-text bg-white">
                      <i class="bi bi-person text-primary"></i>
                    </span>
                    <input 
                      type="text" 
                      class="form-control" 
                      v-model="form.apellidos"
                      placeholder="Tus apellidos"
                      required
                    >
                  </div>
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-medium">Teléfono</label>
                  <div class="input-group">
                    <span class="input-group-text bg-white">
                      <i class="bi bi-phone text-primary"></i>
                    </span>
                    <input 
                      type="tel" 
                      class="form-control" 
                      v-model="form.telefono"
                      placeholder="Tu teléfono"
                    >
                  </div>
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-medium">Email</label>
                  <div class="input-group">
                    <span class="input-group-text bg-white">
                      <i class="bi bi-envelope text-primary"></i>
                    </span>
                    <input 
                      type="email" 
                      class="form-control" 
                      :value="adminData?.correo"
                      disabled
                      placeholder="tu@email.com"
                    >
                  </div>
                  <small class="text-muted">El email no puede ser modificado</small>
                </div>
              </div>

              <div class="d-flex justify-content-between pt-4">
                <button
                  type="button"
                  @click="resetForm"
                  class="btn btn-outline-secondary"
                >
                  <i class="bi bi-arrow-clockwise me-2"></i>
                  Restablecer
                </button>
                <button
                  type="submit"
                  :disabled="loading"
                  class="btn btn-primary d-flex align-items-center"
                >
                  <span v-if="loading" class="d-flex align-items-center">
                    <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                    Actualizando...
                  </span>
                  <span v-else class="d-flex align-items-center">
                    <i class="bi bi-check-lg me-2"></i>
                    Actualizar Perfil
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Cambio de contraseña -->
    <div class="row mt-4">
      <div class="col-12">
        <div class="card shadow-lg border-0 rounded-4 overflow-hidden">
          <div class="card-header bg-danger-subtle border-0 py-4">
            <h5 class="mb-1 text-danger fw-bold">
              <i class="bi bi-shield-lock me-2"></i>
              Cambiar Contraseña
            </h5>
            <p class="mb-0 text-danger-emphasis">Asegúrate de usar una contraseña segura</p>
          </div>
          
          <div class="card-body p-4">
            <form @submit.prevent="cambiarContrasena">
              <div v-if="passwordError" class="alert alert-danger d-flex align-items-center" role="alert">
                <i class="bi bi-exclamation-triangle-fill me-2"></i>
                {{ passwordError }}
              </div>

              <div v-if="passwordSuccess" class="alert alert-success d-flex align-items-center" role="alert">
                <i class="bi bi-check-circle-fill me-2"></i>
                {{ passwordSuccess }}
              </div>

              <div class="row g-3">
                <div class="col-md-4">
                  <label class="form-label fw-medium">Contraseña Actual</label>
                  <div class="input-group">
                    <span class="input-group-text bg-white">
                      <i class="bi bi-lock text-danger"></i>
                    </span>
                    <input 
                      :type="showCurrentPassword ? 'text' : 'password'" 
                      class="form-control" 
                      v-model="passwordForm.password_actual"
                      placeholder="Contraseña actual"
                      required
                    >
                    <button
                      type="button"
                      class="btn btn-outline-secondary"
                      @click="showCurrentPassword = !showCurrentPassword"
                    >
                      <i :class="showCurrentPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                    </button>
                  </div>
                </div>
                <div class="col-md-4">
                  <label class="form-label fw-medium">Nueva Contraseña</label>
                  <div class="input-group">
                    <span class="input-group-text bg-white">
                      <i class="bi bi-lock text-danger"></i>
                    </span>
                    <input 
                      :type="showNewPassword ? 'text' : 'password'" 
                      class="form-control" 
                      v-model="passwordForm.nueva_password"
                      placeholder="Nueva contraseña"
                      required
                    >
                    <button
                      type="button"
                      class="btn btn-outline-secondary"
                      @click="showNewPassword = !showNewPassword"
                    >
                      <i :class="showNewPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                    </button>
                  </div>
                  <div v-if="passwordForm.nueva_password" class="mt-2">
                    <div class="progress" style="height: 6px;">
                      <div class="progress-bar" :class="[strengthClass]" :style="{width: strength + '%'}"></div>
                    </div>
                    <small :class="['text-' + strengthClass.replace('bg-', '')]">{{ strengthLabel }}</small>
                  </div>
                </div>
                <div class="col-md-4">
                  <label class="form-label fw-medium">Confirmar Nueva</label>
                  <div class="input-group">
                    <span class="input-group-text bg-white">
                      <i class="bi bi-lock text-danger"></i>
                    </span>
                    <input 
                      :type="showConfirmPassword ? 'text' : 'password'" 
                      class="form-control" 
                      v-model="passwordForm.nueva_password_confirmation"
                      :class="{ 'is-invalid': passwordMismatch }"
                      placeholder="Confirmar contraseña"
                      required
                    >
                    <button
                      type="button"
                      class="btn btn-outline-secondary"
                      @click="showConfirmPassword = !showConfirmPassword"
                    >
                      <i :class="showConfirmPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                    </button>
                  </div>
                  <small v-if="passwordMismatch" class="text-danger">Las contraseñas no coinciden</small>
                </div>
              </div>
              
              <div v-if="passwordForm.nueva_password" class="mt-3">
                <small class="text-muted d-block mb-2">Requisitos de seguridad:</small>
                <div class="d-flex flex-wrap gap-2">
                  <span class="badge" :class="reglas.longitud ? 'text-bg-success' : 'text-bg-danger'">
                    <i class="bi" :class="reglas.longitud ? 'bi-check' : 'bi-x'"></i>
                    6+ caracteres
                  </span>
                  <span class="badge" :class="reglas.mayus ? 'text-bg-success' : 'text-bg-danger'">
                    <i class="bi" :class="reglas.mayus ? 'bi-check' : 'bi-x'"></i>
                    Mayúscula
                  </span>
                  <span class="badge" :class="reglas.numero ? 'text-bg-success' : 'text-bg-danger'">
                    <i class="bi" :class="reglas.numero ? 'bi-check' : 'bi-x'"></i>
                    Número
                  </span>
                  <span class="badge" :class="reglas.especial ? 'text-bg-success' : 'text-bg-danger'">
                    <i class="bi" :class="reglas.especial ? 'bi-check' : 'bi-x'"></i>
                    Especial
                  </span>
                </div>
              </div>

              <div class="d-flex justify-content-end pt-3">
                <button
                  type="submit"
                  :disabled="passwordLoading || passwordMismatch || !isPasswordValid"
                  class="btn btn-danger d-flex align-items-center"
                >
                  <span v-if="passwordLoading" class="d-flex align-items-center">
                    <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                    Cambiando...
                  </span>
                  <span v-else class="d-flex align-items-center">
                    <i class="bi bi-shield-check me-2"></i>
                    Cambiar Contraseña
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AdminLayout from './layouts/AdminLayout.vue'
import { useAdminAuth } from '@/composables/useAdminAuth.js'

const {
  adminData,
  adminName,
  updateProfile,
  changePassword,
  loading: authLoading
} = useAdminAuth()

// Estado reactivo
const loading = ref(false)
const passwordLoading = ref(false)
const error = ref(null)
const success = ref(null)
const passwordError = ref(null)
const passwordSuccess = ref(null)

// Estados de visibilidad de contraseñas
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

// Formularios
const form = ref({
  nombre: '',
  apellidos: '',
  telefono: ''
})

const passwordForm = ref({
  password_actual: '',
  nueva_password: '',
  nueva_password_confirmation: ''
})

// Computed properties
const adminInitials = computed(() => {
  if (adminData.value) {
    const nombre = adminData.value.nombre || ''
    const apellidos = adminData.value.apellidos || ''
    return (nombre[0] || '') + (apellidos[0] || '')
  }
  return 'AD'
})

const passwordMismatch = computed(() => {
  return passwordForm.value.nueva_password && 
         passwordForm.value.nueva_password_confirmation && 
         passwordForm.value.nueva_password !== passwordForm.value.nueva_password_confirmation
})

const reglas = computed(() => {
  const pwd = passwordForm.value.nueva_password || ''
  return {
    longitud: pwd.length >= 6,
    mayus: /[A-Z]/.test(pwd),
    numero: /[0-9]/.test(pwd),
    especial: /[^A-Za-z0-9]/.test(pwd)
  }
})

const strength = computed(() => {
  const pwd = passwordForm.value.nueva_password || ''
  let score = 0
  if (pwd.length >= 6) score++
  if (/[A-Z]/.test(pwd)) score++
  if (/[0-9]/.test(pwd)) score++
  if (/[^A-Za-z0-9]/.test(pwd)) score++
  return (score / 4) * 100
})

const strengthClass = computed(() => {
  if (strength.value < 25) return 'bg-danger'
  if (strength.value < 50) return 'bg-warning'
  if (strength.value < 75) return 'bg-info'
  return 'bg-success'
})

const strengthLabel = computed(() => {
  if (strength.value < 25) return 'Débil'
  if (strength.value < 50) return 'Regular'
  if (strength.value < 75) return 'Buena'
  return 'Fuerte'
})

const isPasswordValid = computed(() => {
  return reglas.value.longitud && 
         reglas.value.mayus && 
         reglas.value.numero && 
         reglas.value.especial
})

// Métodos
function loadAdminData() {
  if (adminData.value) {
    form.value.nombre = adminData.value.nombre || ''
    form.value.apellidos = adminData.value.apellidos || ''
    form.value.telefono = adminData.value.telefono || ''
  }
}

async function actualizarPerfil() {
  loading.value = true
  error.value = null
  success.value = null

  try {
    const result = await updateProfile(form.value)
    
    if (result.success) {
      success.value = result.message || 'Perfil actualizado correctamente'
    } else {
      error.value = result.error
    }
  } catch (err) {
    error.value = 'Error inesperado al actualizar perfil'
  } finally {
    loading.value = false
  }
}

async function cambiarContrasena() {
  if (passwordMismatch.value) {
    passwordError.value = 'Las contraseñas no coinciden'
    return
  }

  if (!isPasswordValid.value) {
    passwordError.value = 'La contraseña no cumple con los requisitos de seguridad'
    return
  }

  passwordLoading.value = true
  passwordError.value = null
  passwordSuccess.value = null

  try {
    const result = await changePassword(passwordForm.value)
    
    if (result.success) {
      passwordSuccess.value = result.message || 'Contraseña actualizada correctamente'
      passwordForm.value = {
        password_actual: '',
        nueva_password: '',
        nueva_password_confirmation: ''
      }
    } else {
      passwordError.value = result.error
    }
  } catch (err) {
    passwordError.value = 'Error inesperado al cambiar contraseña'
  } finally {
    passwordLoading.value = false
  }
}

function resetForm() {
  loadAdminData()
  error.value = null
  success.value = null
}

function handleSearch(query) {
  console.log('Buscar:', query)
}

function handleNotifications() {
  console.log('Mostrar notificaciones')
}

function handleHistory() {
  console.log('Mostrar historial')
}

// Lifecycle
onMounted(() => {
  loadAdminData()
})
</script>

<style scoped>
.card {
  border: none;
  box-shadow: 0 10px 40px rgba(0,0,0,.1);
}

.form-control:focus {
  border-color: #7c3aed;
  box-shadow: 0 0 0 0.2rem rgba(124, 58, 237, 0.25);
}

.input-group-text {
  border-color: #e9ecef;
}

.btn-primary {
  background: linear-gradient(135deg, #7c3aed, #3b82f6);
  border: none;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #6d28d9, #2563eb);
  transform: translateY(-1px);
}

.btn-danger {
  background: linear-gradient(135deg, #dc2626, #ef4444);
  border: none;
}

.btn-danger:hover {
  background: linear-gradient(135deg, #b91c1c, #dc2626);
  transform: translateY(-1px);
}
</style>
