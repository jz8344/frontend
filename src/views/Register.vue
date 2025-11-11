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
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import http from '@/config/api.js';
import MenuNav from '@/components/MenuNav.vue';

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