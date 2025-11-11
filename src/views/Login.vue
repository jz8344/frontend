<template>
  <MenuNav />
  <section class="auth-section">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-5 col-lg-4">
          <div class="card shadow-lg border-0 rounded-4">
            <div class="card-body p-5">
              <div class="text-center mb-4">
                <div class="d-inline-flex align-items-center justify-content-center rounded-circle mb-3" 
                     style="width: 64px; height: 64px; background: linear-gradient(135deg, #009FE3, #3582ff);">
                  <i class="bi bi-person-circle text-white fs-3"></i>
                </div>
                <h2 class="fw-bold text-dark mb-2">Iniciar Sesión</h2>
                <p class="text-muted">Accede a tu cuenta TrailynSafe</p>
              </div>

              <form @submit.prevent="login">
                <div v-if="error" class="alert alert-danger d-flex align-items-center" role="alert">
                  <i class="bi bi-exclamation-triangle-fill me-2"></i>
                  {{ error }}
                </div>

                <div v-if="success" class="alert alert-success d-flex align-items-center" role="alert">
                  <i class="bi bi-check-circle-fill me-2"></i>
                  {{ success }}
                </div>

                <div class="mb-3">
                  <label class="form-label fw-medium">Correo Electrónico</label>
                  <div class="input-group">
                    <span class="input-group-text">
                      <i class="bi bi-envelope"></i>
                    </span>
                    <input
                      v-model="form.correo"
                      type="email"
                      class="form-control form-control-lg"
                      placeholder="correo@ejemplo.com"
                      required
                      :disabled="loading"
                      @input="sanitizeCorreo"
                      @blur="sanitizeCorreo"
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
                      v-model="form.contrasena"
                      :type="showPassword ? 'text' : 'password'"
                      class="form-control form-control-lg"
                      placeholder="••••••••"
                      required
                      :disabled="loading"
                      @input="sanitizeContrasena"
                      @blur="sanitizeContrasena"
                    />
                    <button 
                      type="button" 
                      class="btn btn-outline-secondary"
                      @click="showPassword = !showPassword"
                    >
                      <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  :disabled="loading"
                  class="btn btn-lg w-100 text-white fw-medium mb-3"
                  style="background: linear-gradient(135deg, #009FE3, #3582ff); border: none;"
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

                <div class="text-center mb-3">
                  <router-link 
                    to="/recuperar-password" 
                    class="text-decoration-none"
                    style="color: #009FE3;"
                  >
                    <i class="bi bi-key me-1"></i>
                    ¿Olvidaste tu contraseña?
                  </router-link>
                </div>
              </form>

              <div class="text-center">
                <router-link 
                  to="/register" 
                  class="text-decoration-none"
                  style="color: #3582ff;"
                >
                  <i class="bi bi-person-plus me-1"></i>
                  ¿No tienes cuenta? ¡Regístrate aquí!
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import http from '@/config/api.js';
import MenuNav from '@/components/MenuNav.vue';
import { loginUsuario } from '@/store/session.js';

const router = useRouter();
const form = reactive({
  correo: '',
  contrasena: ''
});
const error = ref('');
const success = ref('');
const loading = ref(false);
const showPassword = ref(false);

function sanitizeInput(input) {
  return input.replace(/[<>\/\\}=+,`~|[\]{}]/g, '');
}

function sanitizeCorreo() {
  form.correo = sanitizeInput(form.correo);
}

function sanitizeContrasena() {
  form.contrasena = sanitizeInput(form.contrasena);
}

async function login() {
  error.value = '';
  success.value = '';
  loading.value = true;
  
  try {
  const res = await http.post('/login', form);
    
    if (res.data.token && res.data.usuario) {
      localStorage.setItem('token', res.data.token);
      loginUsuario(res.data.usuario);
      
      success.value = 'Inicio de sesión exitoso. Redirigiendo...';
      
      setTimeout(async () => {
  localStorage.setItem('showWelcomeModal', '1');
  console.debug('[Login] Flag showWelcomeModal seteado');
  await router.push('/');
  console.debug('[Login] Redirigido a Home');
      }, 800);
    } else {
      error.value = 'Respuesta inesperada del servidor';
    }
  } catch (e) {
    console.error('Error en login:', e);
    error.value = e.response?.data?.error || 'Error al iniciar sesión. Verifica tus credenciales.';
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.auth-section {
  background: url('../img/school.png') no-repeat center center/cover;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
}

.auth-section::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1;
}

.container {
  position: relative;
  z-index: 2;
}

@media (max-width: 768px) {
  .auth-section {
    padding: 10px;
  }
}
</style>