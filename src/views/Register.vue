<template>
  <MenuNav />
  <section class="auth-section">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-5">
          <div class="card shadow-lg border-0 rounded-4">
            <div class="card-body p-5">
              <div class="text-center mb-4">
                <div class="d-inline-flex align-items-center justify-content-center rounded-circle mb-3" 
                     style="width: 64px; height: 64px; background: linear-gradient(135deg, #3582ff, #009FE3);">
                  <i class="bi bi-person-plus text-white fs-3"></i>
                </div>
                <h2 class="fw-bold text-dark mb-2">Registrarte</h2>
                <p class="text-muted">Crea tu cuenta en TrailynSafe</p>
              </div>

              <form @submit.prevent="register">
                <div v-if="errors.general" class="alert alert-danger d-flex align-items-center" role="alert">
                  <i class="bi bi-exclamation-triangle-fill me-2"></i>
                  {{ errors.general }}
                </div>

                <div v-if="success" class="alert alert-success d-flex align-items-center" role="alert">
                  <i class="bi bi-check-circle-fill me-2"></i>
                  ¡Registro exitoso! Redirigiendo...
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
                        :class="{ 'is-invalid': errors.nombre.length > 0 }"
                        placeholder="Juan"
                        required
                        :disabled="loading"
                        @input="validateNombre"
                        @blur="validateNombre"
                      />
                    </div>
                    <div v-if="errors.nombre.length > 0" class="invalid-feedback d-block">
                      {{ errors.nombre[0] }}
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
                        :class="{ 'is-invalid': errors.apellidos.length > 0 }"
                        placeholder="Pérez"
                        required
                        :disabled="loading"
                        @input="validateApellidos"
                        @blur="validateApellidos"
                      />
                    </div>
                    <div v-if="errors.apellidos.length > 0" class="invalid-feedback d-block">
                      {{ errors.apellidos[0] }}
                    </div>
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label fw-medium">Teléfono</label>
                  <div class="input-group">
                    <span class="input-group-text">
                      <i class="bi bi-telephone"></i>
                    </span>
                    <input
                      v-model="form.telefono"
                      type="tel"
                      class="form-control"
                      :class="{ 'is-invalid': errors.telefono.length > 0 }"
                      placeholder="1234567890"
                      required
                      :disabled="loading"
                      @input="validateTelefono"
                      @blur="validateTelefono"
                      maxlength="10"
                    />
                  </div>
                  <div v-if="errors.telefono.length > 0" class="invalid-feedback d-block">
                    {{ errors.telefono[0] }}
                  </div>
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
                      class="form-control"
                      :class="{ 'is-invalid': errors.correo.length > 0 }"
                      placeholder="correo@ejemplo.com"
                      required
                      :disabled="loading"
                      @input="validateCorreo"
                      @blur="validateCorreo"
                    />
                  </div>
                  <div v-if="errors.correo.length > 0" class="invalid-feedback d-block">
                    {{ errors.correo[0] }}
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
                      class="form-control"
                      :class="{ 'is-invalid': errors.contrasena.length > 0 }"
                      placeholder="••••••••"
                      required
                      :disabled="loading"
                      @input="validateContrasena"
                      @blur="validateContrasena"
                      minlength="6"
                    />
                    <button 
                      type="button" 
                      class="btn btn-outline-secondary"
                      @click="showPassword = !showPassword"
                    >
                      <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                    </button>
                  </div>
                  <div v-if="errors.contrasena.length > 0" class="invalid-feedback d-block">
                    {{ errors.contrasena[0] }}
                  </div>
                  <div class="form-text">
                    <i class="bi bi-info-circle me-1"></i>
                    Mínimo 6 caracteres
                  </div>
                </div>

                <button
                  type="submit"
                  :disabled="loading"
                  class="btn btn-lg w-100 text-white fw-medium mb-3"
                  style="background: linear-gradient(135deg, #3582ff, #009FE3); border: none;"
                >
                  <span v-if="loading" class="d-flex align-items-center justify-content-center">
                    <div class="spinner-border spinner-border-sm me-2" role="status">
                      <span class="visually-hidden">Loading...</span>
                    </div>
                    Registrando...
                  </span>
                  <span v-else class="d-flex align-items-center justify-content-center">
                    <i class="bi bi-person-check me-2"></i>
                    Registrarte
                  </span>
                </button>
                
                <div class="position-relative my-4">
                  <hr class="my-3">
                  <span class="position-absolute top-50 start-50 translate-middle px-3 bg-white text-muted">
                    o regístrate con
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
                  to="/login" 
                  class="text-decoration-none"
                  style="color: #3582ff;"
                >
                  <i class="bi bi-box-arrow-in-right me-1"></i>
                  ¿Ya tienes cuenta? ¡Inicia sesión aquí!
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
  nombre: '',
  apellidos: '',
  telefono: '',
  correo: '',
  contrasena: '',
});
const errors = ref({
  nombre: [],
  apellidos: [],
  telefono: [],
  correo: [],
  contrasena: [],
  general: ''
});
const loading = ref(false);
const success = ref(false);
const showPassword = ref(false);
const GOOGLE_CLIENT_ID = '1072914013560-vs8tip87mu7u3235mlo1dbpjghoslt6j.apps.googleusercontent.com';

function capitalizeName(name) {
  return name.replace(/\b\w/g, l => l.toUpperCase());
}

function sanitizeInput(input) {
  return input.replace(/[<>\/\\}=+,`~|[\]{}]/g, '');
}

function validateNombre() {
  const nombre = form.nombre;
  form.nombre = nombre.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
  
  if (!form.nombre) {
    errors.value.nombre = ['El nombre es requerido'];
  } else if (form.nombre.length < 2) {
    errors.value.nombre = ['El nombre debe tener al menos 2 caracteres'];
  } else if (form.nombre.length > 50) {
    errors.value.nombre = ['El nombre no puede tener más de 50 caracteres'];
  } else {
    errors.value.nombre = [];
    form.nombre = capitalizeName(form.nombre);
  }
}

function validateApellidos() {
  const apellidos = form.apellidos;
  form.apellidos = apellidos.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
  
  if (!form.apellidos) {
    errors.value.apellidos = ['Los apellidos son requeridos'];
  } else if (form.apellidos.length < 2) {
    errors.value.apellidos = ['Los apellidos deben tener al menos 2 caracteres'];
  } else if (form.apellidos.length > 50) {
    errors.value.apellidos = ['Los apellidos no pueden tener más de 50 caracteres'];
  } else {
    errors.value.apellidos = [];
    form.apellidos = capitalizeName(form.apellidos);
  }
}

function validateTelefono() {
  form.telefono = form.telefono.replace(/\D/g, '');
  
  if (!form.telefono) {
    errors.value.telefono = ['El teléfono es requerido'];
  } else if (form.telefono.length !== 10) {
    errors.value.telefono = ['El teléfono debe tener exactamente 10 dígitos'];
  } else {
    errors.value.telefono = [];
  }
}

function validateCorreo() {
  form.correo = sanitizeInput(form.correo);
  
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  if (!form.correo) {
    errors.value.correo = ['El correo es requerido'];
  } else if (!emailRegex.test(form.correo)) {
    errors.value.correo = ['Ingresa un correo electrónico válido'];
  } else {
    errors.value.correo = [];
  }
}

function validateContrasena() {
  form.contrasena = sanitizeInput(form.contrasena);
  
  if (!form.contrasena) {
    errors.value.contrasena = ['La contraseña es requerida'];
  } else if (form.contrasena.length < 6) {
    errors.value.contrasena = ['La contraseña debe tener al menos 6 caracteres'];
  } else if (form.contrasena.length > 100) {
    errors.value.contrasena = ['La contraseña no puede tener más de 100 caracteres'];
  } else {
    errors.value.contrasena = [];
  }
}

const register = async () => {
  validateNombre();
  validateApellidos();
  validateTelefono();
  validateCorreo();
  validateContrasena();
  
  const hasErrors = Object.values(errors.value).some(error => 
    Array.isArray(error) ? error.length > 0 : error
  );
  
  if (hasErrors) {
    errors.value.general = 'Por favor, corrige los errores antes de continuar.';
    return;
  }

  loading.value = true;
  errors.value = {
    nombre: [],
    apellidos: [],
    telefono: [],
    correo: [],
    contrasena: [],
    general: ''
  };
  success.value = false;

  try {
  console.log('Enviando datos:', form); 
    const response = await http.post('/register', form, {
      headers: { 'Content-Type': 'application/json' }
    });
    success.value = true;
    setTimeout(() => {
      router.push({ name: 'Login' });
    }, 2000);
  } catch (error) {
  console.error('Error completo:', error.response || error); 
    if (error.response && error.response.status === 422) {
      const serverErrors = error.response.data.errors;
      for (const field in serverErrors) {
        if (errors.value.hasOwnProperty(field)) {
          errors.value[field] = serverErrors[field];
        }
      }
    } else {
      errors.value.general = 'Error al registrar. Por favor, intenta de nuevo.';
    }
  } finally {
    loading.value = false;
  }
};

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
        window.google.accounts.id.prompt();
      }
    });
  } else {
    errors.value.general = 'Google Sign-In no está disponible. Intenta recargar la página.';
  }
}

async function handleGoogleCallback(response) {
  loading.value = true;
  errors.value.general = '';
  
  try {
    const res = await http.post('/auth/google', {
      id_token: response.credential,
      device_name: 'web-browser'
    });
    
    if (res.data.success && res.data.data.token) {
      localStorage.setItem('token', res.data.data.token);
      loginUsuario(res.data.data.usuario);
      
      success.value = true;
      
      setTimeout(async () => {
        localStorage.setItem('showWelcomeModal', '1');
        await router.push('/');
      }, 1500);
    } else {
      errors.value.general = res.data.message || 'Error al registrar con Google';
    }
  } catch (e) {
    console.error('Error en Google Sign-In:', e);
    errors.value.general = e.response?.data?.message || 'Error al registrar con Google';
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