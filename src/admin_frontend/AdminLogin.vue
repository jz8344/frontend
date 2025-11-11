<template>
  <div class="vh-100 d-flex align-items-center justify-content-center" style="background: linear-gradient(135deg, #1e3a8a 0%, #7c3aed 50%, #3730a3 100%);">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-5 col-lg-4">
          <div class="card shadow-lg border-0 rounded-4">
            <div class="card-body p-5">
              <div class="text-center mb-4">
                <div class="d-inline-flex align-items-center justify-content-center rounded-circle mb-3" 
                     style="width: 64px; height: 64px; background: linear-gradient(135deg, #7c3aed, #3b82f6);">
                  <i class="bi bi-shield-lock text-white fs-3"></i>
                </div>
                <h2 class="fw-bold text-dark mb-2">Panel de Admin</h2>
                <p class="text-muted">Acceso administrativo al sistema</p>
              </div>

              <form @submit.prevent="login">
                <div v-if="error" class="alert alert-danger d-flex align-items-center" role="alert">
                  <i class="bi bi-exclamation-triangle-fill me-2"></i>
                  {{ error }}
                </div>

                <div class="mb-3">
                  <label class="form-label fw-medium">Correo Electrónico</label>
                  <div class="input-group">
                    <span class="input-group-text">
                      <i class="bi bi-envelope"></i>
                    </span>
                    <input
                      v-model="form.email"
                      type="email"
                      class="form-control form-control-lg"
                      placeholder="admin@example.com"
                      required
                    />
                  </div>
                </div>

                <div class="mb-4">
                  <label class="form-label fw-medium">Contraseña</label>
                  <div class="input-group">
                    <span class="input-group-text">
                      <i class="bi bi-lock"></i>
                    </span>
                    <input
                      v-model="form.password"
                      type="password"
                      class="form-control form-control-lg"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  :disabled="loading"
                  class="btn btn-lg w-100 text-white fw-medium"
                  style="background: linear-gradient(135deg, #7c3aed, #3b82f6); border: none;"
                >
                  <span v-if="loading" class="d-flex align-items-center justify-content-center">
                    <div class="spinner-border spinner-border-sm me-2" role="status">
                      <span class="visually-hidden">Loading...</span>
                    </div>
                    Iniciando sesión...
                  </span>
                  <span v-else class="d-flex align-items-center justify-content-center">
                    <i class="bi bi-box-arrow-in-right me-2"></i>
                    Iniciar Sesión
                  </span>
                </button>
              </form>

              <div class="text-center mt-4">
                <router-link 
                  to="/admin/register" 
                  class="text-decoration-none"
                  style="color: #7c3aed;"
                >
                  <i class="bi bi-person-plus me-1"></i>
                  ¿No tienes cuenta? Regístrate aquí
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { loginAdmin } from '@/store/session.js'
import http from '@/config/api.js'

const router = useRouter()

// Estado local
const form = ref({
  email: '',
  password: ''
})
const loading = ref(false)
const error = ref(null)

// Verificar si ya está autenticado al cargar
onMounted(async () => {
  // Aquí podrías verificar el estado de autenticación si es necesario
})

async function login() {
  loading.value = true
  error.value = null

  try {
    // Petición directa con axios
  const response = await http.post('/admin/login', {
      email: form.value.email,
      password: form.value.password
    })
    
    if (response.data.success) {
      // Guardar token y datos del admin usando el store
      localStorage.setItem('admin_token', response.data.token)
      loginAdmin(response.data.admin)
      
      console.log('Login exitoso, admin logueado:', response.data.admin)
      console.log('Redirigiendo a dashboard...')
      await new Promise(resolve => setTimeout(resolve, 100))
      router.push('/admin/dashboard')
    } else {
      error.value = response.data.error || 'Error al iniciar sesión'
    }
  } catch (err) {
    if (err.response && err.response.data && err.response.data.errors) {
      error.value = Object.values(err.response.data.errors).join(' ')
    } else if (err.response && err.response.data && err.response.data.error) {
      error.value = err.response.data.error
    } else {
      error.value = 'Error inesperado al iniciar sesión'
    }
    console.error('Error en login:', err)
  } finally {
    loading.value = false
  }
}
</script>
