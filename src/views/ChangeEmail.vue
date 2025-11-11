<template>
  <div class="change-email-container">
    <div class="container">
      <div class="email-card">
        <div class="email-header">
          <h2>
            Cambiar correo electrónico
          </h2>
        </div>

        <div class="email-form">
          <form @submit.prevent="abrirModal">
            <div class="form-group">
              <label class="form-label">
                <i class="bi bi-envelope"></i>
                Correo actual
              </label>
              <input 
                :value="correoActual" 
                type="email" 
                class="form-control" 
                readonly 
                style="background: #f8f9fa; color: #6c757d;"
              />
            </div>
            
            <div class="form-group">
              <label class="form-label">
                <i class="bi bi-envelope-plus"></i>
                Nuevo correo electrónico
              </label>
              <input 
                v-model="nuevoCorreo" 
                type="email" 
                class="form-control"
                :class="{
                  'is-valid': nuevoCorreo && validEmail && nuevoCorreo !== correoActual,
                  'is-invalid': nuevoCorreo && (!validEmail || nuevoCorreo === correoActual)
                }"
                placeholder="ejemplo@correo.com"
                required
                @input="sanitizeCorreo"
                @blur="sanitizeCorreo"
              />
              <div v-if="nuevoCorreo && !validEmail" class="invalid-feedback">
                <i class="bi bi-exclamation-circle"></i>
                Ingresa un correo válido
              </div>
              <div v-if="nuevoCorreo && nuevoCorreo === correoActual" class="invalid-feedback">
                <i class="bi bi-exclamation-circle"></i>
                El nuevo correo debe ser diferente al actual
              </div>
              <div v-if="nuevoCorreo && validEmail && nuevoCorreo !== correoActual" class="valid-feedback">
                <i class="bi bi-check-circle"></i>
                Correo válido
              </div>
            </div>

            <button 
              type="submit" 
              class="btn btn-primary w-100" 
              :disabled="loadingCorreo || !canSubmit"
            >
              <i class="bi bi-shield-check" v-if="!loadingCorreo"></i>
              <i class="bi bi-arrow-clockwise spin" v-if="loadingCorreo"></i>
              {{ loadingCorreo ? 'Procesando...' : 'Continuar' }}
            </button>
          </form>

          <div v-if="correoError" class="alert alert-danger">
            <i class="bi bi-exclamation-triangle"></i>
            {{ correoError }}
          </div>
          <div v-if="correoSuccess" class="alert alert-success">
            <i class="bi bi-check-circle"></i>
            {{ correoSuccess }}
          </div>

          <div class="recovery-footer">
            <button @click="goBack" class="btn-link">
              <i class="bi bi-arrow-left"></i> Regresar al inicio
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="mostrarModal" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h4>
            <i class="bi bi-shield-lock"></i>
            Confirma tu identidad
          </h4>
        </div>
        
        <div class="modal-body">
          <p>Por seguridad, ingresa tu contraseña actual para continuar:</p>
          <div class="form-group">
            <label class="form-label">
              <i class="bi bi-lock"></i>
              Contraseña actual
            </label>
            <div class="input-group">
              <input 
                v-model="contrasenaActual" 
                :type="showPassword ? 'text' : 'password'"
                class="form-control" 
                placeholder="Tu contraseña actual"
                :class="{ 'is-invalid': modalError }"
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
        </div>

        <div class="modal-footer">
          <button class="btn btn-outline-secondary" @click="cerrarModal">
            <i class="bi bi-x-circle"></i>
            Cancelar
          </button>
          <button 
            class="btn btn-primary" 
            @click="cambiarCorreo"
            :disabled="!contrasenaActual || loadingCorreo"
          >
            <i class="bi bi-check-circle" v-if="!loadingCorreo"></i>
            <i class="bi bi-arrow-clockwise spin" v-if="loadingCorreo"></i>
            {{ loadingCorreo ? 'Cambiando...' : 'Confirmar cambio' }}
          </button>
        </div>

        <div v-if="modalError" class="alert alert-danger">
          <i class="bi bi-exclamation-triangle"></i>
          {{ modalError }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import http from '@/config/api.js';
import { usuario, loginUsuario } from '@/store/session.js';

const router = useRouter();
const correoActual = usuario.value?.correo || '';
const nuevoCorreo = ref('');
const correoError = ref('');
const correoSuccess = ref('');
const loadingCorreo = ref(false);

const mostrarModal = ref(false);
const contrasenaActual = ref('');
const modalError = ref('');
const showPassword = ref(false);

const validEmail = computed(() => {
  const allowedDomains = [
    'gmail.com', 'hotmail.com', 'outlook.com', 'outlook.es', 'proton.me', 'protonmail.com', 'utzmg.edu.mx'
  ];
  const basicEmail = /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9.-]+)\.[a-zA-Z]{2,}$/;
  if (!basicEmail.test(nuevoCorreo.value)) return false;
  const domain = nuevoCorreo.value.split('@')[1]?.toLowerCase();
  return allowedDomains.includes(domain);
});

const canSubmit = computed(() => {
  return nuevoCorreo.value && validEmail.value && nuevoCorreo.value !== correoActual;
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

function sanitizeInput(input) {
  return input.replace(/[<>\/\\}=+,`~|[\]{}]/g, '');
}

function sanitizeCorreo() {
  nuevoCorreo.value = sanitizeInput(nuevoCorreo.value);
}

function sanitizeContrasena() {
  contrasenaActual.value = sanitizeInput(contrasenaActual.value);
}

function goBack() {
  router.push('/');
}

function abrirModal() {
  if (!canSubmit.value) {
    if (!nuevoCorreo.value) {
      correoError.value = 'Ingresa un nuevo correo electrónico.';
    } else if (!validEmail.value) {
      correoError.value = 'Ingresa un correo válido.';
    } else if (nuevoCorreo.value === correoActual) {
      correoError.value = 'El nuevo correo debe ser diferente al actual.';
    }
    return;
  }

  correoError.value = '';
  correoSuccess.value = '';
  modalError.value = '';
  mostrarModal.value = true;
}

function cerrarModal() {
  mostrarModal.value = false;
  contrasenaActual.value = '';
  modalError.value = '';
  showPassword.value = false;
}

async function cambiarCorreo() {
  modalError.value = '';
  loadingCorreo.value = true;
  
  try {
    const token = localStorage.getItem('token');
  const res = await http.post('/cambiar-correo', {
      nuevo_correo: nuevoCorreo.value,
      contrasena_actual: contrasenaActual.value
  });
    
    if (res.data.usuario) {
      loginUsuario(res.data.usuario);
    }
    
    correoSuccess.value = 'Correo actualizado correctamente.';
    cerrarModal();
    
    setTimeout(() => {
      router.push('/');
    }, 2000); 
    
  } catch (e) {
    if (e.response?.status === 422) {
      const errors = e.response.data.error;
      if (errors.nuevo_correo) {
        modalError.value = 'Este correo electrónico ya está registrado. Por favor, utiliza otro correo.';
      } else if (errors.contrasena_actual) {
        modalError.value = 'La contraseña actual es requerida.';
      } else {
        modalError.value = 'Datos inválidos. Verifica la información ingresada.';
      }
    } else if (e.response?.status === 401) {
      modalError.value = 'Contraseña actual incorrecta.';
    } else {
      modalError.value = e.response?.data?.error || 'Error al cambiar correo. Intenta nuevamente.';
    }
  } finally {
    loadingCorreo.value = false;
  }
}
</script>

<style scoped>
.change-email-container {
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

.email-card {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(13, 71, 161, 0.15);
  position: relative;
  animation: fadeInUp 0.6s ease-out;
}

.email-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #2196f3 0%, #1976d2 50%, #0d47a1 100%);
  border-radius: 16px 16px 0 0;
}

.email-header {
  padding: 30px 30px 20px;
  text-align: center;
  border-bottom: 1px solid #e3f2fd;
  position: relative;
}

.email-header h2 {
  color: #0d47a1;
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.email-form {
  padding: 25px 30px 30px;
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
  padding: 12px 16px;
  border: none;
  font-size: 1rem;
  background: #fafafa;
  transition: all 0.3s ease;
  width: 100%;
}

.form-control:focus {
  outline: none;
  background: #ffffff;
}

.form-control:not(.input-group .form-control) {
  border: 2px solid #e1f5fe;
  border-radius: 12px;
}

.form-control:not(.input-group .form-control):focus {
  border-color: #2196f3;
  box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
}

.input-group .btn {
  border: none;
  padding: 12px 16px;
  background: #f0f0f0;
  color: #546e7a;
  transition: all 0.3s ease;
}

.input-group .btn:hover {
  background: #e0e0e0;
  color: #2196f3;
}

.form-control.is-valid {
  border-color: #4caf50;
  background: #f8fff8;
}

.form-control.is-invalid {
  border-color: #f44336;
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
  margin-top: 20px;
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

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(13, 71, 161, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;
}

.modal-content {
  background: white;
  border-radius: 16px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 8px 32px rgba(13, 71, 161, 0.3);
  overflow: hidden;
  position: relative;
}

.modal-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #2196f3 0%, #1976d2 50%, #0d47a1 100%);
}

.modal-header {
  background: #f8fbff;
  border-bottom: 1px solid #e3f2fd;
  padding: 20px;
  text-align: center;
}

.modal-header h4 {
  margin: 0;
  font-weight: 600;
  color: #0d47a1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.modal-body {
  padding: 20px;
}

.modal-body p {
  color: #546e7a;
  margin-bottom: 15px;
  text-align: center;
}

.modal-footer {
  padding: 15px 20px;
  border-top: 1px solid #e3f2fd;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.modal-footer .btn {
  flex: 1;
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
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .change-email-container {
    padding: 20px 15px;
    padding-top: 100px;
  }
  
  .email-header {
    padding: 25px 20px 15px;
  }
  
  .email-header h2 {
    font-size: 1.5rem;
  }
  
  .email-form {
    padding: 20px;
  }
  
  .modal-content {
    max-width: 95%;
  }
  
  .modal-footer {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .change-email-container {
    padding: 15px 10px;
    padding-top: 90px;
  }
  
  .email-header h2 {
    font-size: 1.3rem;
  }
  
  .email-form {
    padding: 15px;
  }
  
  .btn {
    padding: 14px 20px;
    font-size: 0.95rem;
  }
}
</style>