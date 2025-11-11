<template>
  <div class="change-pass-container">
    <div class="container">
      <div class="password-card">
        <div class="password-header">
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
                  autocomplete="current-password"
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
              :disabled="loadingPass || !passwordActual"
            >
              <i class="bi bi-check-circle" v-if="!loadingPass"></i>
              <i class="bi bi-arrow-clockwise spin" v-if="loadingPass"></i>
              {{ loadingPass ? 'Validando...' : 'Continuar' }}
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
                  autocomplete="new-password"
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
                  autocomplete="new-password"
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
                :disabled="loadingPass || !isFormValid"
              >
                <i class="bi bi-shield-check" v-if="!loadingPass"></i>
                <i class="bi bi-arrow-clockwise spin" v-if="loadingPass"></i>
                {{ loadingPass ? 'Cambiando...' : 'Cambiar contraseña' }}
              </button>
            </div>
          </form>
        </div>

        <div v-if="passError" class="alert alert-danger">
          <i class="bi bi-exclamation-triangle"></i>
          {{ passError }}
        </div>
        <div v-if="passSuccess" class="alert alert-success">
          <i class="bi bi-check-circle"></i>
          {{ passSuccess }}
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

        <div class="recovery-footer">
          <button @click="goBack" class="btn-link">
            <i class="bi bi-arrow-left"></i> Regresar al inicio
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import http from '@/config/api.js';

const router = useRouter();
const step = ref(1);
const loadingPass = ref(false);
const passError = ref('');
const passSuccess = ref('');

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

const conexionPerdida = ref(false);
let sesionIntervalId = null;

function verificarSesionPeriodicamente() {
  sesionIntervalId = setInterval(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
  await http.get('/sesion');
      if (conexionPerdida.value) conexionPerdida.value = false;
    } catch (e) {
      if (e.response && e.response.status === 401) {
        localStorage.clear();
        sessionStorage.clear();
        alert('Tu sesión ha expirado. Por favor inicia sesión nuevamente.');
        window.location.replace('/login');
      } else {
        conexionPerdida.value = false;
        await new Promise(res => setTimeout(res, 10));
        conexionPerdida.value = true;
        console.warn('Error de conexión detectado.');
      }
    }
  }, 8000);
}

onMounted(() => {
  verificarSesionPeriodicamente();
});
onUnmounted(() => {
  if (sesionIntervalId) clearInterval(sesionIntervalId);
});

function goBack() {
  router.push('/');
}

async function validarPasswordActual() {
  passError.value = '';
  errors.value.passwordActual = '';
  loadingPass.value = true;

  try {
    const token = localStorage.getItem('token');
    const res = await http.post(
      '/validar-password-actual',
      { password_actual: passwordActual.value },
      {}
    );

    tokenValidacion.value = res.data.token_validacion;
    step.value = 2;
    passSuccess.value = 'Contraseña validada correctamente';
    
    setTimeout(() => {
      passSuccess.value = '';
    }, 2000);

  } catch (e) {
    if (e.response?.status === 422) {
      errors.value.passwordActual = 'Contraseña actual incorrecta';
    } else {
      passError.value = e.response?.data?.error || 'Error al validar contraseña';
    }
  } finally {
    loadingPass.value = false;
  }
}

async function cambiarContrasena() {
  if (!isFormValid.value) {
    passError.value = 'Por favor completa correctamente todos los campos';
    return;
  }

  passError.value = '';
  passSuccess.value = '';
  loadingPass.value = true;

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

    passSuccess.value = res.data.message || 'Contraseña cambiada exitosamente. Redirigiendo al login...';

    setTimeout(() => {
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = '/login';
      window.location.reload();
    }, 2000);

  } catch (e) {
    passError.value = e.response?.data?.error || 'Error al cambiar contraseña';
  } finally {
    loadingPass.value = false;
  }
}
</script>

<style scoped>
.change-pass-container {
  min-height: calc(100vh - 90px);
  background: linear-gradient(135deg, #f8fbff 0%, #e3f2fd 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px 20px;
  padding-top: 120px;
}

.container {
  max-width: 450px;
  width: 100%;
}

.password-card {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(13, 71, 161, 0.15);
  position: relative;
  animation: fadeInUp 0.6s ease-out;
}

.password-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #2196f3 0%, #1976d2 50%, #0d47a1 100%);
  border-radius: 16px 16px 0 0;
}

.password-header {
  padding: 30px 30px 20px;
  text-align: center;
  border-bottom: 1px solid #e3f2fd;
  position: relative;
}

.password-header h2 {
  color: #0d47a1;
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.password-form {
  padding: 25px 30px 30px;
}

.step-info {
  text-align: center;
  margin-bottom: 25px;
  padding: 20px;
  background: #f8fbff;
  border-radius: 12px;
  border: 1px solid #e1f5fe;
}

.step-info h3 {
  color: #0d47a1;
  font-size: 1.4rem;
  font-weight: 600;
  margin: 0 0 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.step-info p {
  color: #546e7a;
  margin: 0;
  font-size: 0.95rem;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #0d47a1;
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 8px;
}

.form-label i {
  color: #2196f3;
  font-size: 1rem;
}

.input-group {
  display: flex;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid #e1f5fe;
  transition: all 0.3s ease;
}

.input-group:focus-within {
  border-color: #2196f3;
  box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
}

.form-control {
  flex: 1;
  padding: 12px 16px;
  border: none;
  font-size: 1rem;
  background: #fafafa;
  transition: all 0.3s ease;
}

.form-control:focus {
  outline: none;
  background: #ffffff;
}

.form-control:disabled {
  background: #f5f5f5;
  opacity: 0.7;
  cursor: not-allowed;
}

.input-group .btn {
  border: none;
  padding: 12px 16px;
  background: #f0f0f0;
  color: #546e7a;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.input-group .btn:hover {
  background: #e0e0e0;
  color: #2196f3;
}

.form-control.is-valid {
  background: #f8fff8;
}

.form-control.is-invalid {
  background: #fff8f8;
}

.invalid-feedback,
.valid-feedback {
  font-size: 0.85rem;
  margin-top: 6px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.invalid-feedback {
  color: #f44336;
}

.valid-feedback {
  color: #4caf50;
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 25px;
}

.form-actions .btn {
  flex: 1;
}

.btn {
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

.btn-primary {
  background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(33, 150, 243, 0.3);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(33, 150, 243, 0.4);
  background: linear-gradient(135deg, #1976d2 0%, #0d47a1 100%);
}

.btn-outline-secondary {
  background: transparent;
  color: #546e7a;
  border: 2px solid #e1f5fe;
}

.btn-outline-secondary:hover:not(:disabled) {
  background: #e3f2fd;
  color: #1976d2;
  transform: translateY(-1px);
}

.w-100 {
  width: 100%;
}

.alert {
  padding: 12px 16px;
  border-radius: 8px;
  margin: 20px 30px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
}

.alert-danger {
  background: #ffebee;
  color: #c62828;
  border: 1px solid #ffcdd2;
}

.alert-success {
  background: #e8f5e8;
  color: #2e7d32;
  border: 1px solid #c8e6c9;
}

.security-info {
  background: #f8fbff;
  padding: 20px 30px;
  border-top: 1px solid #e3f2fd;
  border-radius: 0 0 16px 16px;
}

.info-card {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  text-align: left;
}

.info-card i {
  font-size: 1.2rem;
  margin-top: 2px;
  color: #1976d2;
}

.info-card strong {
  color: #0d47a1;
}

.info-card p {
  margin: 4px 0 0;
  color: #546e7a;
  font-size: 0.85rem;
  line-height: 1.4;
}

.recovery-footer {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.btn-link {
  color: #1976d2;
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px;
  border-radius: 6px;
  transition: all 0.2s ease;
  background: none;
  border: none;
  cursor: pointer;
}

.btn-link:hover {
  background: rgba(25, 118, 210, 0.05);
  color: #1565c0;
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .change-pass-container {
    padding: 20px 15px;
    padding-top: 100px;
  }
  
  .password-header {
    padding: 25px 20px 15px;
  }
  
  .password-header h2 {
    font-size: 1.5rem;
  }
  
  .password-form {
    padding: 20px;
  }
  
  .security-info {
    padding: 15px 20px;
  }
  
  .form-actions {
    flex-direction: column;
  }
}
  
  .recovery-footer {
    gap: 8px;
  }
  
  .btn-link {
    font-size: 0.9rem;
  }


@media (max-width: 480px) {
  .change-pass-container {
    padding: 15px 10px;
    padding-top: 90px;
  }
  
  .password-header h2 {
    font-size: 1.3rem;
  }
  
  .password-form {
    padding: 15px;
  }
  
  .btn {
    padding: 14px 20px;
    font-size: 0.95rem;
  }
}

@media (max-width: 360px) {
  .password-card {
    padding: 20px 15px;
  }
  
  .step-info h3 {
    font-size: 1rem;
  }
}
</style>