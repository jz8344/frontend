<template>
  <div>
    <MenuNav />
    <section class="recovery-section">
      <div class="recovery-container">
        <div class="recovery-header">
          <div class="recovery-icon">
            <i class="bi bi-shield-lock" style="font-size: 3rem; color: #1976d2;"></i>
          </div>
          <h2>Recuperar Contraseña</h2>
          <p class="recovery-subtitle">Sigue los pasos para restablecer tu contraseña de forma segura</p>
        </div>

        <div class="progress-indicator">
          <div class="progress-step" :class="{ active: step >= 1, completed: step > 1 }">
            <div class="step-circle">1</div>
            <span>Correo</span>
          </div>
          <div class="progress-line" :class="{ active: step > 1 }"></div>
          <div class="progress-step" :class="{ active: step >= 2, completed: step > 2 }">
            <div class="step-circle">2</div>
            <span>Código</span>
          </div>
          <div class="progress-line" :class="{ active: step > 2 }"></div>
          <div class="progress-step" :class="{ active: step >= 3 }">
            <div class="step-circle">3</div>
            <span>Nueva Contraseña</span>
          </div>
        </div>

        <div class="recovery-form">
          <div v-if="step === 1" class="step-content">
            <div class="step-header">
              <h3><i class="bi bi-envelope"></i> Ingresa tu correo electrónico</h3>
              <p>Te enviaremos un código de recuperación para restablecer tu contraseña</p>
            </div>
            <div class="form-group">
              <label for="correo">Correo electrónico</label>
              <input 
                id="correo"
                v-model="correo" 
                type="email" 
                class="form-control" 
                placeholder="ejemplo@correo.com"
                :disabled="loading"
                required
                @input="formatCorreo"
              />
            </div>
            <button 
              class="btn btn-primary w-100" 
              @click="enviarCodigo" 
              :disabled="loading || !correo"
            >
              <i class="bi bi-send" v-if="!loading"></i>
              <i class="bi bi-arrow-clockwise spin" v-if="loading"></i>
              {{ loading ? 'Enviando...' : 'Enviar código' }}
            </button>
          </div>

          <div v-if="step === 2" class="step-content">
            <div class="step-header">
              <h3><i class="bi bi-key"></i> Verifica tu código</h3>
              <p>Hemos enviado un código de 6 dígitos a <strong>{{ correo }}</strong></p>
            </div>
            <div class="form-group">
              <label for="codigo">Código de recuperación</label>
              <input 
                id="codigo"
                v-model="codigo" 
                type="text" 
                maxlength="6" 
                class="form-control code-input modern-code-font" 
                placeholder="000000"
                :disabled="loading"
                @input="formatCode"
              />
              <small class="form-text">El código expira en 15 minutos</small>
            </div>
            <button 
              class="btn btn-success w-100" 
              @click="validarCodigo" 
              :disabled="loading || codigo.length !== 6"
            >
              <i class="bi bi-check-circle" v-if="!loading"></i>
              <i class="bi bi-arrow-clockwise spin" v-if="loading"></i>
              {{ loading ? 'Validando...' : 'Validar código' }}
            </button>
            <button class="btn btn-outline-secondary w-100 mt-2" @click="reenviarCodigo" :disabled="loading || !canResend">
              <i class="bi bi-arrow-repeat"></i> Reenviar código
            </button>
            <div v-if="!canResend" class="form-text" style="text-align:center; color:#1976d2;">
              Podrás reenviar un código dentro de {{ resendTimer }} segundos
            </div>
          </div>

          <div v-if="step === 3" class="step-content">
            <div class="step-header">
              <h3><i class="bi bi-lock"></i> Nueva contraseña</h3>
              <p>Crea una contraseña segura para tu cuenta</p>
            </div>
            <div class="form-group">
              <label for="nuevaContrasena">Nueva contraseña</label>
              <div class="input-group">
                <input 
                  id="nuevaContrasena"
                  v-model="nuevaContrasena" 
                  :type="showPasswordNueva ? 'text' : 'password'" 
                  class="form-control"
                  :class="{ 'is-valid': nuevaContrasena.length >= 6, 'is-invalid': nuevaContrasena.length > 0 && nuevaContrasena.length < 6 }"
                  placeholder="Mínimo 6 caracteres"
                  :disabled="loading"
                  @input="sanitizePassword"
                />
                <button 
                  type="button" 
                  class="btn btn-outline-secondary" 
                  @click="showPasswordNueva = !showPasswordNueva"
                >
                  <i :class="showPasswordNueva ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                </button>
              </div>
              <div v-if="nuevaContrasena.length > 0 && nuevaContrasena.length < 6" class="invalid-feedback">
                <i class="bi bi-exclamation-circle"></i>
                La contraseña debe tener al menos 6 caracteres
              </div>
              <div v-if="nuevaContrasena.length >= 6" class="valid-feedback">
                <i class="bi bi-check-circle"></i>
                Contraseña válida
              </div>
            </div>
            <div class="form-group">
              <label for="confirmarContrasena">Confirmar contraseña</label>
              <div class="input-group">
                <input 
                  id="confirmarContrasena"
                  v-model="confirmarContrasena" 
                  :type="showPasswordConfirmar ? 'text' : 'password'" 
                  class="form-control"
                  :class="{ 'is-valid': confirmarContrasena && confirmarContrasena === nuevaContrasena, 'is-invalid': confirmarContrasena && confirmarContrasena !== nuevaContrasena }"
                  placeholder="Repite tu nueva contraseña"
                  :disabled="loading"
                  @input="sanitizePassword"
                />
                <button 
                  type="button" 
                  class="btn btn-outline-secondary" 
                  @click="showPasswordConfirmar = !showPasswordConfirmar"
                >
                  <i :class="showPasswordConfirmar ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                </button>
              </div>
              <div v-if="confirmarContrasena && confirmarContrasena !== nuevaContrasena" class="invalid-feedback">
                <i class="bi bi-exclamation-circle"></i>
                Las contraseñas no coinciden
              </div>
              <div v-if="confirmarContrasena && confirmarContrasena === nuevaContrasena && nuevaContrasena.length >= 6" class="valid-feedback">
                <i class="bi bi-check-circle"></i>
                Las contraseñas coinciden
              </div>
            </div>
            <div class="password-strength" v-if="nuevaContrasena">
              <div class="strength-indicator" :class="passwordStrength.class">
                <div class="strength-bar" :style="{ width: passwordStrength.width }"></div>
              </div>
              <small :class="passwordStrength.class">{{ passwordStrength.text }}</small>
            </div>
            <button 
              class="btn btn-success w-100" 
              @click="actualizarContrasena" 
              :disabled="loading || !isPasswordValid"
            >
              <i class="bi bi-check2-circle" v-if="!loading"></i>
              <i class="bi bi-arrow-clockwise spin" v-if="loading"></i>
              {{ loading ? 'Actualizando...' : 'Cambiar contraseña' }}
            </button>
          </div>
        </div>

        <div v-if="error" class="alert alert-danger">
          <i class="bi bi-exclamation-triangle"></i>
          {{ error }}
        </div>
        <div v-if="success" class="alert alert-success">
          <i class="bi bi-check-circle"></i>
          {{ success }}
        </div>

        <div class="recovery-footer">
          <router-link to="/login" class="btn-link">
            <i class="bi bi-arrow-left"></i> Volver al inicio de sesión
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import http from '@/config/api.js';
import MenuNav from '@/components/MenuNav.vue';

const route = useRoute();
const router = useRouter();

const correo = ref('');
const codigo = ref('');
const nuevaContrasena = ref('');
const confirmarContrasena = ref('');
const step = ref(1);
const loading = ref(false);
const error = ref('');
const success = ref('');
const showPasswordNueva = ref(false);
const showPasswordConfirmar = ref(false);
const canResend = ref(true);
const resendTimer = ref(0);
let resendInterval = null;

const correoRegex = /^([a-zA-Z0-9._%+-]+)@((gmail|hotmail|outlook|yahoo|icloud|live|protonmail|gmx|aol|zoho|mail|msn)\.(com|mx|es|net|org|info|dev|app)|([a-zA-Z0-9.-]+\.)?(edu|edu\.mx|edu\.com))$/i;
const correoSanitize = (input) => input.replace(/[><="'\\=+|}\s]/g, '');

const isPasswordValid = computed(() => {
  return nuevaContrasena.value.length >= 6 &&
    nuevaContrasena.value === confirmarContrasena.value;
});

const passwordStrength = computed(() => {
  const password = nuevaContrasena.value;
  if (password.length === 0) return { class: '', width: '0%', text: '' };
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 2) return { class: 'weak', width: '33%', text: 'Débil' };
  if (score <= 3) return { class: 'medium', width: '66%', text: 'Media' };
  return { class: 'strong', width: '100%', text: 'Fuerte' };
});

function formatCode() {
  codigo.value = codigo.value.replace(/[^0-9]/g, '');
}

function formatCorreo() {
  correo.value = correoSanitize(correo.value);
}

function sanitizePassword() {
  nuevaContrasena.value = nuevaContrasena.value.replace(/[><="'\\=+|}\s]/g, '');
  confirmarContrasena.value = confirmarContrasena.value.replace(/[><="'\\=+|}\s]/g, '');
}

async function reenviarCodigo() {
  if (!canResend.value) return;
  await enviarCodigo();
  canResend.value = false;
  resendTimer.value = 60;
  resendInterval = setInterval(() => {
    resendTimer.value--;
    if (resendTimer.value <= 0) {
      canResend.value = true;
      clearInterval(resendInterval);
    }
  }, 1000);
}

async function enviarCodigo() {
  formatCorreo();
  if (!correo.value) {
    error.value = 'Por favor ingresa tu correo electrónico.';
    return;
  }
  if (!correoRegex.test(correo.value)) {
    error.value = 'Formato de correo inválido.';
    return;
  }
  loading.value = true;
  error.value = '';
  success.value = '';
  try {
  const response = await http.post('/enviar-codigo', {
      correo: correo.value
    });
    if (response.data.success === true) {
      step.value = 2;
      success.value = 'Código enviado exitosamente a tu correo.';
    } else {
      error.value = 'Este correo no está registrado. Por favor verifica tu dirección de correo.';
    }
  } catch (e) {
    error.value = e.response?.data?.error || 'Error al enviar el código. Inténtalo de nuevo.';
  } finally {
    loading.value = false;
  }
}

async function validarCodigo() {
  formatCorreo();
  if (codigo.value.length !== 6) {
    error.value = 'El código debe tener 6 dígitos.';
    return;
  }
  loading.value = true;
  error.value = '';
  success.value = '';
  try {
  await http.post('/validar-codigo', {
      correo: correo.value,
      codigo: codigo.value
    });
    step.value = 3;
    success.value = 'Código validado correctamente. Ahora puedes cambiar tu contraseña.';
  } catch (e) {
    error.value = e.response?.data?.error || 'Código inválido o expirado. Verifica e inténtalo de nuevo.';
  } finally {
    loading.value = false;
  }
}

async function actualizarContrasena() {
  sanitizePassword();
  if (!nuevaContrasena.value || nuevaContrasena.value.length < 6) {
    error.value = 'La contraseña debe tener al menos 6 caracteres.';
    return;
  }
  if (nuevaContrasena.value !== confirmarContrasena.value) {
    error.value = 'Las contraseñas no coinciden. Verifica e inténtalo de nuevo.';
    return;
  }
  loading.value = true;
  error.value = '';
  success.value = '';
  try {
  await http.post('/cambiar-contrasena', {
      correo: correo.value,
      codigo: codigo.value,
      nueva_contrasena: nuevaContrasena.value,
      nueva_contrasena_confirmation: confirmarContrasena.value
    });
    const token = localStorage.getItem('token');
    if (token) {
      try {
  await http.delete('/sesiones');
      } catch (e) {}
      localStorage.removeItem('token');
    }
    success.value = '¡Contraseña actualizada correctamente! Redirigiendo al inicio de sesión...';
    setTimeout(() => router.push('/login'), 3000);
  } catch (e) {
    error.value = e.response?.data?.error || 'Error al actualizar la contraseña. Inténtalo de nuevo.';
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.recovery-section {
  min-height: calc(100vh - 90px);
  background: linear-gradient(135deg, #f8fbff 0%, #e3f2fd 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px 20px;
  padding-top: 120px; 
}

.recovery-container {
  background: #fff;
  padding: 40px;
  border-radius: 20px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 8px 32px rgba(25, 118, 210, 0.12), 0 1.5px 6px rgba(0,0,0,0.08);
  position: relative;
  overflow: hidden;
}

.recovery-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #4facfe, #00f2fe);
}

.recovery-header {
  text-align: center;
  margin-bottom: 30px;
}

.recovery-icon {
  margin-bottom: 15px;
}

.recovery-header h2 {
  font-size: 1.8rem;
  color: #1976d2;
  margin: 0 0 10px 0;
  font-weight: 700;
}

.recovery-subtitle {
  color: #666;
  font-size: 0.95rem;
  margin: 0;
  line-height: 1.4;
}

.progress-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 35px;
  padding: 0 20px;
}

.progress-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  position: relative;
}

.step-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #e0e0e0;
  color: #999;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.progress-step.active .step-circle {
  background: #1976d2;
  color: white;
  transform: scale(1.1);
}

.progress-step.completed .step-circle {
  background: #4caf50;
  color: white;
}

.progress-step span {
  font-size: 0.8rem;
  color: #666;
  font-weight: 500;
  text-align: center;
}

.progress-step.active span {
  color: #1976d2;
  font-weight: 600;
}

.progress-line {
  flex: 1;
  height: 2px;
  background: #e0e0e0;
  margin: 0 15px;
  transition: background 0.3s ease;
}

.progress-line.active {
  background: #4caf50;
}

.recovery-form {
  margin-bottom: 25px;
}

.step-content {
  animation: fadeInUp 0.4s ease-out;
}

.step-header {
  text-align: center;
  margin-bottom: 25px;
}

.step-header h3 {
  font-size: 1.3rem;
  color: #1976d2;
  margin: 0 0 8px 0;
  font-weight: 600;
}

.step-header h3 i {
  margin-right: 8px;
  font-size: 1.1rem;
}

.step-header p {
  color: #666;
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.4;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
  font-size: 0.95rem;
}

.form-control {
  width: 100%;
  padding: 14px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 1rem;
  font-family: inherit;
  transition: all 0.3s ease;
  background: #f8fbff;
  box-sizing: border-box;
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

.form-control:focus {
  outline: none;
  border-color: #1976d2;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
}

.form-control:disabled {
  background: #f5f5f5;
  opacity: 0.7;
  cursor: not-allowed;
}

.code-input {
  text-align: center;
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: 8px;
}
.modern-code-font {
  font-family: 'Fira Mono', 'Roboto Mono', 'Menlo', 'Consolas', 'monospace';
}

.form-text {
  font-size: 0.85rem;
  color: #666;
  margin-top: 6px;
  display: block;
}

.input-group {
  display: flex;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid #e0e0e0;
  transition: all 0.3s ease;
}

.input-group:focus-within {
  border-color: #1976d2;
  box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
}

.input-group .form-control {
  flex: 1;
  border: none;
  border-radius: 0;
  background: #f8fbff;
}

.input-group .form-control:focus {
  background: #fff;
}

.input-group .btn {
  border: none;
  border-radius: 0;
  background: #f0f0f0;
  color: #546e7a;
  white-space: nowrap;
  padding: 14px 16px;
  transition: all 0.3s ease;
}

.input-group .btn:hover {
  background: #e0e0e0;
  color: #1976d2;
}

.password-strength {
  margin-top: 8px;
}

.strength-indicator {
  height: 4px;
  background: #e0e0e0;
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 4px;
}

.strength-bar {
  height: 100%;
  transition: all 0.3s ease;
  border-radius: 2px;
}

.weak .strength-bar { background: #f44336; }
.medium .strength-bar { background: #ff9800; }
.strong .strength-bar { background: #4caf50; }

.password-strength small {
  font-size: 0.8rem;
  font-weight: 500;
}

.weak { color: #f44336; }
.medium { color: #ff9800; }
.strong { color: #4caf50; }

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 20px;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  border: 2px solid transparent;
  font-family: inherit;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

.btn-primary {
  background: #1976d2;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #1565c0;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.3);
}

.btn-success {
  background: #4caf50;
  color: white;
}

.btn-success:hover:not(:disabled) {
  background: #43a047;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

.btn-outline-secondary {
  background: transparent;
  color: #666;
  border-color: #e0e0e0;
}

.btn-outline-secondary:hover:not(:disabled) {
  background: #f5f5f5;
  border-color: #999;
  color: #333;
}

.w-100 {
  width: 100%;
}

.mt-2 {
  margin-top: 8px;
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.alert {
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.95rem;
  line-height: 1.4;
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
}

.btn-link:hover {
  background: rgba(25, 118, 210, 0.05);
  color: #1565c0;
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
  .recovery-section {
    padding: 20px 15px;
    padding-top: 140px;
  }
  
  .recovery-container {
    padding: 30px 25px;
    border-radius: 16px;
  }
  
  .recovery-header h2 {
    font-size: 1.6rem;
  }
  
  .recovery-subtitle {
    font-size: 0.9rem;
  }
  
  .progress-indicator {
    padding: 0 10px;
    margin-bottom: 30px;
  }
  
  .step-circle {
    width: 35px;
    height: 35px;
    font-size: 0.85rem;
  }
  
  .progress-step span {
    font-size: 0.75rem;
  }
  
  .progress-line {
    margin: 0 10px;
  }
  
  .step-header h3 {
    font-size: 1.2rem;
  }
  
  .step-header p {
    font-size: 0.9rem;
  }
  
  .form-control {
    padding: 12px 14px;
    font-size: 1rem;
  }
  
  .code-input {
    font-size: 1.3rem;
    letter-spacing: 6px;
  }
  
  .btn {
    padding: 12px 18px;
    font-size: 0.95rem;
  }
  
  .input-group {
    flex-direction: column;
    gap: 8px;
  }
  
  .input-group .form-control {
    border-radius: 12px;
    border-right: 2px solid #e0e0e0;
  }
  
  .input-group .btn {
    border-radius: 12px;
    border-left: 2px solid #e0e0e0;
  }
}

@media (max-width: 480px) {
  .recovery-section {
    padding: 15px 10px;
    padding-top: 150px;
  }
  
  .recovery-container {
    padding: 25px 20px;
    border-radius: 12px;
  }
  
  .recovery-header h2 {
    font-size: 1.4rem;
  }
  
  .progress-indicator {
    flex-direction: column;
    gap: 15px;
  }
  
  .progress-line {
    width: 2px;
    height: 20px;
    margin: 0;
  }
  
  .step-circle {
    width: 30px;
    height: 30px;
    font-size: 0.8rem;
  }
  
  .step-header h3 {
    font-size: 1.1rem;
  }
  
  .form-control {
    padding: 10px 12px;
    font-size: 0.95rem;
  }
  
  .code-input {
    font-size: 1.2rem;
    letter-spacing: 4px;
  }
  
  .btn {
    padding: 10px 16px;
    font-size: 0.9rem;
  }
  
  .recovery-footer {
    gap: 8px;
  }
  
  .btn-link {
    font-size: 0.9rem;
  }
}

@media (max-width: 360px) {
  .recovery-container {
    padding: 20px 15px;
  }
  
  .step-header h3 {
    font-size: 1rem;
  }
  
  .progress-step span {
    font-size: 0.7rem;
  }
}
</style>

