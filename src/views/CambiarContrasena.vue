<template>
  <div class="change-password-container">
    <div class="container">
      <div class="password-card">
        <div class="password-header">
          <button @click="goBack" class="btn-back">
            <i class="bi bi-arrow-left"></i>
            Regresar
          </button>
          <h2>
            <i class="bi bi-shield-lock"></i>
            Cambiar contraseña
          </h2>
        </div>

        <div v-if="step === 1" class="password-form">
          <div class="step-info">
            <h3>
              <i class="bi bi-key"></i>
              Confirma tu identidad
            </h3>
            <p>Por seguridad, primero confirma tu contraseña actual</p>
          </div>

          <form @submit.prevent="validarPasswordActual">
            <div class="form-group">
              <label class="form-label">
                <i class="bi bi-lock"></i>
                Contraseña actual
              </label>
              <div class="input-group">
                <input 
                  v-model="passwordActual"
                  :type="showActual ? 'text' : 'password'"
                  class="form-control"
                  :class="{ 'is-invalid': errors.passwordActual }"
                  placeholder="Ingresa tu contraseña actual"
                  required
                />
                <button 
                  type="button" 
                  class="btn btn-outline-secondary"
                  @click="showActual = !showActual"
                >
                  <i :class="showActual ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                </button>
              </div>
              <div v-if="errors.passwordActual" class="invalid-feedback">
                <i class="bi bi-exclamation-circle"></i>
                {{ errors.passwordActual }}
              </div>
            </div>

            <button 
              type="submit" 
              class="btn btn-primary w-100"
              :disabled="loading || !passwordActual"
            >
              <i class="bi bi-check-circle" v-if="!loading"></i>
              <i class="bi bi-arrow-clockwise spin" v-if="loading"></i>
              {{ loading ? 'Validando...' : 'Continuar' }}
            </button>
          </form>
        </div>

        <div v-if="step === 2" class="password-form">
          <div class="step-info">
            <h3>
              <i class="bi bi-shield-check text-success"></i>
              Nueva contraseña
            </h3>
            <p>Ingresa tu nueva contraseña y confírmala</p>
          </div>

          <form @submit.prevent="cambiarContrasena">
            <div class="form-group">
              <label class="form-label">
                <i class="bi bi-lock-fill"></i>
                Nueva contraseña
              </label>
              <div class="input-group">
                <input 
                  v-model="nuevaPassword"
                  :type="showNueva ? 'text' : 'password'"
                  class="form-control"
                  :class="{ 
                    'is-valid': nuevaPassword.length >= 6,
                    'is-invalid': nuevaPassword.length > 0 && nuevaPassword.length < 6
                  }"
                  placeholder="Mínimo 6 caracteres"
                  required
                />
                <button 
                  type="button" 
                  class="btn btn-outline-secondary"
                  @click="showNueva = !showNueva"
                >
                  <i :class="showNueva ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                </button>
              </div>
              <div v-if="nuevaPassword.length > 0 && nuevaPassword.length < 6" class="invalid-feedback">
                <i class="bi bi-exclamation-circle"></i>
                La contraseña debe tener al menos 6 caracteres
              </div>
              <div v-if="nuevaPassword.length >= 6" class="valid-feedback">
                <i class="bi bi-check-circle"></i>
                Contraseña válida
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">
                <i class="bi bi-lock-fill"></i>
                Confirmar nueva contraseña
              </label>
              <div class="input-group">
                <input 
                  v-model="confirmarPassword"
                  :type="showConfirmar ? 'text' : 'password'"
                  class="form-control"
                  :class="{ 
                    'is-valid': confirmarPassword && confirmarPassword === nuevaPassword,
                    'is-invalid': confirmarPassword && confirmarPassword !== nuevaPassword
                  }"
                  placeholder="Repite la nueva contraseña"
                  required
                />
                <button 
                  type="button" 
                  class="btn btn-outline-secondary"
                  @click="showConfirmar = !showConfirmar"
                >
                  <i :class="showConfirmar ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                </button>
              </div>
              <div v-if="confirmarPassword && confirmarPassword !== nuevaPassword" class="invalid-feedback">
                <i class="bi bi-exclamation-circle"></i>
                Las contraseñas no coinciden
              </div>
              <div v-if="confirmarPassword && confirmarPassword === nuevaPassword" class="valid-feedback">
                <i class="bi bi-check-circle"></i>
                Las contraseñas coinciden
              </div>
            </div>

            <div class="form-actions">
              <button 
                type="button" 
                @click="step = 1" 
                class="btn btn-outline-secondary"
              >
                <i class="bi bi-arrow-left"></i>
                Atrás
              </button>
              <button 
                type="submit" 
                class="btn btn-primary"
                :disabled="loading || !isFormValid"
              >
                <i class="bi bi-shield-check" v-if="!loading"></i>
                <i class="bi bi-arrow-clockwise spin" v-if="loading"></i>
                {{ loading ? 'Cambiando...' : 'Cambiar contraseña' }}
              </button>
            </div>
          </form>
        </div>

        <div v-if="error" class="alert alert-danger">
          <i class="bi bi-exclamation-triangle"></i>
          {{ error }}
        </div>
        <div v-if="success" class="alert alert-success">
          <i class="bi bi-check-circle"></i>
          {{ success }}
        </div>

        <div class="security-info">
          <div class="info-card">
            <i class="bi bi-info-circle text-primary"></i>
            <div>
              <strong>Información importante:</strong>
              <p>Al cambiar tu contraseña, todas las sesiones activas en otros dispositivos serán cerradas automáticamente por seguridad.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import http from '@/config/api.js';

const router = useRouter();
const step = ref(1);
const loading = ref(false);
const error = ref('');
const success = ref('');

const passwordActual = ref('');
const showActual = ref(false);
const tokenValidacion = ref('');

const nuevaPassword = ref('');
const confirmarPassword = ref('');
const showNueva = ref(false);
const showConfirmar = ref(false);

const errors = ref({
  passwordActual: ''
});

const isFormValid = computed(() => {
  return nuevaPassword.value.length >= 6 && 
         confirmarPassword.value === nuevaPassword.value;
});

function goBack() {
  router.push('/');
}

async function validarPasswordActual() {
  error.value = '';
  errors.value.passwordActual = '';
  loading.value = true;

  try {
    const token = localStorage.getItem('token');
    const res = await http.post(
      '/validar-password-actual',
      { password_actual: passwordActual.value },
      {}
    );

    tokenValidacion.value = res.data.token_validacion;
    step.value = 2;
    success.value = 'Contraseña validada correctamente';
    
    setTimeout(() => {
      success.value = '';
    }, 2000);

  } catch (e) {
    if (e.response?.status === 401) {
      errors.value.passwordActual = 'Contraseña actual incorrecta';
    } else {
      error.value = e.response?.data?.error || 'Error al validar contraseña';
    }
  } finally {
    loading.value = false;
  }
}

async function cambiarContrasena() {
  if (!isFormValid.value) {
    error.value = 'Por favor completa correctamente todos los campos';
    return;
  }

  error.value = '';
  success.value = '';
  loading.value = true;

  try {
    const token = localStorage.getItem('token');
    const res = await http.post(
      '/cambiar-contrasena-autenticado',
      {
        nueva_contrasena: nuevaPassword.value,
        confirmar_contrasena: confirmarPassword.value,
        token_validacion: tokenValidacion.value
      },
      {}
    );

    success.value = res.data.message;

    setTimeout(() => {
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = '/login';
    }, 2000);

  } catch (e) {
    error.value = e.response?.data?.error || 'Error al cambiar contraseña';
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.change-password-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 0;
}

.container {
  max-width: 500px;
  margin: 0 auto;
  padding: 0 1rem;
}

.password-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
}

.password-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  position: relative;
}

.password-header h2 {
  margin: 0;
  font-weight: 600;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-back {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  border-radius: 10px;
  padding: 0.5rem 1rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
}

.btn-back:hover {
  background: rgba(255, 255, 255, 0.3);
  color: white;
  transform: translateY(-2px);
}

.password-form {
  padding: 2rem;
}

.step-info {
  text-align: center;
  margin-bottom: 2rem;
}

.step-info h3 {
  color: #333;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.step-info p {
  color: #6c757d;
  margin: 0;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.input-group {
  display: flex;
  border-radius: 10px;
  overflow: hidden;
}

.form-control {
  flex: 1;
  border: 2px solid #e9ecef;
  border-right: none;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #f8f9fa;
  border-radius: 10px 0 0 10px;
}

.input-group .btn {
  border: 2px solid #e9ecef;
  border-left: none;
  border-radius: 0 10px 10px 0;
  padding: 0.75rem 1rem;
  background: #f8f9fa;
  color: #6c757d;
}

.form-control:focus {
  background: white;
  border-color: #667eea;
  box-shadow: none;
}

.form-control:focus + .btn {
  border-color: #667eea;
}

.form-control.is-valid {
  border-color: #28a745;
  background: #f8fff9;
}

.form-control.is-valid + .btn {
  border-color: #28a745;
}

.form-control.is-invalid {
  border-color: #dc3545;
  background: #fff8f8;
}

.form-control.is-invalid + .btn {
  border-color: #dc3545;
}

.invalid-feedback,
.valid-feedback {
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.invalid-feedback {
  color: #dc3545;
}

.valid-feedback {
  color: #28a745;
}

.form-actions {
  display: flex;
  gap: 1rem;
}

.form-actions .btn {
  flex: 1;
}

.btn {
  font-weight: 600;
  padding: 0.875rem 1rem;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
  color: white;
}

.btn-primary:disabled {
  background: #6c757d;
  cursor: not-allowed;
  box-shadow: none;
}

.btn-outline-secondary {
  background: transparent;
  border: 2px solid #6c757d;
  color: #6c757d;
}

.btn-outline-secondary:hover {
  background: #6c757d;
  color: white;
  transform: translateY(-2px);
}

.w-100 {
  width: 100%;
}

.alert {
  border: none;
  border-radius: 10px;
  padding: 1rem 1.5rem;
  margin: 1.5rem 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.alert-danger {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
  color: white;
}

.alert-success {
  background: linear-gradient(135deg, #51cf66 0%, #40c057 100%);
  color: white;
}

.security-info {
  background: #f8f9fa;
  padding: 1.5rem 2rem;
  border-top: 1px solid #e9ecef;
}

.info-card {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.info-card i {
  font-size: 1.25rem;
  margin-top: 0.125rem;
}

.info-card p {
  margin: 0.25rem 0 0;
  color: #6c757d;
  font-size: 0.875rem;
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 576px) {
  .change-password-container {
    padding: 1rem 0;
  }
  
  .password-header {
    padding: 1.5rem 1rem;
  }
  
  .btn-back {
    top: 1rem;
    right: 1rem;
    padding: 0.375rem 0.75rem;
    font-size: 0.75rem;
  }
  
  .password-header h2 {
    font-size: 1.25rem;
    margin-right: 5rem;
  }
  
  .password-form {
    padding: 1.5rem 1rem;
  }
  
  .security-info {
    padding: 1rem;
  }
  
  .form-actions {
    flex-direction: column;
  }
}
</style>
