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
                
                <div class="position-relative my-4">
                  <hr class="my-3">
                  <span class="position-absolute top-50 start-50 translate-middle px-3 bg-white text-muted">
                    o continúa con
                  </span>
                </div>

                <button
                  type="button"
                  @click="signInWithGoogle"
                  :disabled="loading"
                  class="btn btn-outline-dark btn-lg w-100 d-flex align-items-center justify-content-center mb-3"
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" class="me-2">
                    <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
                    <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
                    <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z"/>
                    <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z"/>
                  </svg>
                  Google
                </button>
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
import { reactive, ref, onMounted } from 'vue';
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
const GOOGLE_CLIENT_ID = '1072914013560-vs8tip87mu7u3235mlo1dbpjghoslt6j.apps.googleusercontent.com';

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

// Cargar Google Identity Services
onMounted(() => {
  if (!document.getElementById('google-identity-script')) {
    const script = document.createElement('script');
    script.id = 'google-identity-script';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
    
    script.onload = () => {
      initializeGoogleSignIn();
    };
  } else {
    initializeGoogleSignIn();
  }
});

function initializeGoogleSignIn() {
  if (window.google) {
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleGoogleCallback,
      auto_select: false,
      cancel_on_tap_outside: true,
    });
  }
}

function signInWithGoogle() {
  if (window.google) {
    window.google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        // Fallback a popup si One Tap no está disponible
        window.google.accounts.id.prompt();
      }
    });
  } else {
    error.value = 'Google Sign-In no está disponible. Intenta recargar la página.';
  }
}

async function handleGoogleCallback(response) {
  loading.value = true;
  error.value = '';
  
  try {
    const res = await http.post('/auth/google', {
      id_token: response.credential,
      device_name: 'web-browser'
    });
    
    if (res.data.success && res.data.data.token) {
      localStorage.setItem('token', res.data.data.token);
      loginUsuario(res.data.data.usuario);
      
      const mensaje = res.data.is_new_user 
        ? '¡Bienvenido! Tu cuenta ha sido creada exitosamente.' 
        : '¡Bienvenido de nuevo!';
      
      success.value = mensaje + ' Redirigiendo...';
      
      setTimeout(async () => {
        localStorage.setItem('showWelcomeModal', '1');
        await router.push('/');
      }, 800);
    } else {
      error.value = res.data.message || 'Error al iniciar sesión con Google';
    }
  } catch (e) {
    console.error('Error en Google Sign-In:', e);
    error.value = e.response?.data?.message || 'Error al iniciar sesión con Google';
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