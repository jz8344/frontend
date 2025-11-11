<template>
  <div class="vh-100 d-flex align-items-center justify-content-center" style="background: linear-gradient(135deg, #1e3a8a 0%, #7c3aed 50%, #3730a3 100%);">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-5">
          <div class="card shadow-lg border-0 rounded-4">
            <div class="card-body p-5">
              <div class="text-center mb-4">
                <div class="d-inline-flex align-items-center justify-content-center rounded-circle mb-3" 
                     style="width: 64px; height: 64px; background: linear-gradient(135deg, #059669, #3b82f6);">
                  <i class="bi bi-person-plus text-white fs-3"></i>
                </div>
                <h2 class="fw-bold text-dark mb-2">Registro Admin</h2>
                <p class="text-muted">Crear nueva cuenta administrativa</p>
              </div>

              <form @submit.prevent="register">
                <div v-if="error" class="alert alert-danger d-flex align-items-center" role="alert">
                  <i class="bi bi-exclamation-triangle-fill me-2"></i>
                  {{ error }}
                </div>

                <div v-if="success" class="alert alert-success d-flex align-items-center" role="alert">
                  <i class="bi bi-check-circle-fill me-2"></i>
                  {{ success }}
                </div>

                <div class="row mb-3">
                  <div class="col-md-6">
                    <label class="form-label fw-medium">Nombre</label>
                    <div class="input-group">
                      <span class="input-group-text">
                        <i class="bi bi-person"></i>
                      </span>
                      <input
                        v-model="form.nombre"
                        type="text"
                        class="form-control"
                        placeholder="Juan"
                        required
                      />
                    </div>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label fw-medium">Apellidos</label>
                    <div class="input-group">
                      <span class="input-group-text">
                        <i class="bi bi-person"></i>
                      </span>
                      <input
                        v-model="form.apellidos"
                        type="text"
                        class="form-control"
                        placeholder="Pérez"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label fw-medium">Teléfono (Opcional)</label>
                  <div class="input-group">
                    <span class="input-group-text">
                      <i class="bi bi-telephone"></i>
                    </span>
                    <input
                      v-model="form.telefono"
                      type="tel"
                      class="form-control"
                      placeholder="+1234567890"
                    />
                  </div>
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
                      class="form-control"
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
                      class="form-control"
                      placeholder="••••••••"
                      minlength="6"
                      required
                    />
                  </div>
                  <div class="form-text">
                    <i class="bi bi-info-circle me-1"></i>
                    Mínimo 6 caracteres
                  </div>
                </div>

                <button
                  type="submit"
                  :disabled="loading"
                  class="btn btn-lg w-100 text-white fw-medium"
                  style="background: linear-gradient(135deg, #059669, #3b82f6); border: none;"
                >
                  <span v-if="loading" class="d-flex align-items-center justify-content-center">
                    <div class="spinner-border spinner-border-sm me-2" role="status">
                      <span class="visually-hidden">Loading...</span>
                    </div>
                    Registrando...
                  </span>
                  <span v-else class="d-flex align-items-center justify-content-center">
                    <i class="bi bi-person-check me-2"></i>
                    Crear Cuenta
                  </span>
                </button>
              </form>

              <div class="text-center mt-4">
                <router-link 
                  to="/admin/login" 
                  class="text-decoration-none"
                  style="color: #059669;"
                >
                  <i class="bi bi-box-arrow-in-right me-1"></i>
                  ¿Ya tienes cuenta? Inicia sesión aquí
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import http from '@/config/api.js'

export default {
  name: 'AdminRegister',
  data() {
    return {
      form: {
        nombre: '',
        apellidos: '',
        telefono: '',
        email: '',
        password: ''
      },
      loading: false,
      error: null,
      success: null
    }
  },
  methods: {
    async register() {
      this.loading = true
      this.error = null
      this.success = null

      try {
  await http.post('/admin/register', this.form)
        
        this.success = 'Cuenta creada exitosamente. Redirigiendo al login...'
        
        setTimeout(() => {
          this.$router.push('/admin/login')
        }, 2000)
      } catch (error) {
        if (error.response?.data) {
          if (typeof error.response.data === 'object') {
            this.error = Object.values(error.response.data).flat().join(', ')
          } else {
            this.error = error.response.data.error || 'Error al registrar cuenta'
          }
        } else {
          this.error = 'Error de conexión'
        }
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
