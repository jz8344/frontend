<template>
  <div class="editar-perfil-section">
    <div class="editar-perfil-container">
      <button @click="goBack" class="btn-flecha-regresar" aria-label="Regresar">
        &#8592;
      </button>
      <div class="perfil-header">

        <h2>Editar Perfil</h2>
        <p class="perfil-subtitle">Actualiza tu información personal</p>
      </div>

      <form @submit.prevent="editarPerfil" class="perfil-form">
        <div class="form-group">
          <label for="nombre">
            <i class="bi bi-person"></i>
            Nombre
          </label>
          <input 
            id="nombre"
            v-model="form.nombre" 
            type="text" 
            class="form-control" 
            :class="{ 'is-invalid': errors.nombre, 'is-valid': form.nombre && !errors.nombre }"
            placeholder="Ingresa tu nombre"
            @input="validateNombre"
            required
          />
          <div v-if="errors.nombre" class="invalid-feedback">
            <i class="bi bi-exclamation-circle"></i> {{ errors.nombre }}
          </div>
        </div>

        <div class="form-group">
          <label for="apellidos">
            <i class="bi bi-person-badge"></i>
            Apellidos
          </label>
          <input 
            id="apellidos"
            v-model="form.apellidos" 
            type="text" 
            class="form-control" 
            :class="{ 'is-invalid': errors.apellidos, 'is-valid': form.apellidos && !errors.apellidos }"
            placeholder="Ingresa tus apellidos"
            @input="validateApellidos"
            required
          />
          <div v-if="errors.apellidos" class="invalid-feedback">
            <i class="bi bi-exclamation-circle"></i> {{ errors.apellidos }}
          </div>
        </div>

        <div class="form-group">
          <label for="telefono">
            <i class="bi bi-telephone"></i>
            Teléfono
          </label>
          <input 
            id="telefono"
            v-model="form.telefono" 
            type="tel" 
            class="form-control" 
            :class="{ 'is-invalid': errors.telefono, 'is-valid': form.telefono && !errors.telefono }"
            placeholder="10 dígitos"
            @input="validateTelefono"
            maxlength="10"
            required
          />
          <div v-if="errors.telefono" class="invalid-feedback">
            <i class="bi bi-exclamation-circle"></i> {{ errors.telefono }}
          </div>
        </div>

        <div class="form-group">
          <label for="correo">
            <i class="bi bi-envelope"></i>
            Correo electrónico
          </label>
          <input 
            id="correo"
            :value="form.correo" 
            type="email" 
            class="form-control" 
            disabled 
            style="background: #f0f0f0; color: #666;"
          />
          <div class="form-text">
            <i class="bi bi-info-circle"></i>
            Para cambiar tu correo, usa la opción específica
          </div>
          <router-link to="/cambiar-email" class="btn-cambiar-password" style="margin-top: 8px;">
            <i class="bi bi-envelope-paper"></i>
            Cambiar correo
          </router-link>
        </div>

        <div class="form-group">
          <label>
            <i class="bi bi-lock"></i>
            Contraseña
          </label>
          <input 
            value="••••••••••••" 
            type="password" 
            class="form-control" 
            disabled 
            style="background: #f0f0f0; color: #666;"
          />
          <router-link to="/cambiar-contrasena" class="btn-cambiar-password">
            <i class="bi bi-key"></i>
            Cambiar contraseña
          </router-link>
        </div>

        <div v-if="error" class="alert alert-danger">
          <i class="bi bi-exclamation-triangle"></i>
          {{ error }}
        </div>
        <div v-if="success" class="alert alert-success">
          <i class="bi bi-check-circle"></i>
          {{ success }}
        </div>

        <div class="form-actions">
          <button 
            type="button" 
            @click="goHome" 
            class="btn btn-outline-secondary"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            class="btn btn-primary" 
            :disabled="loading"
          >
            {{ loading ? 'Guardando...' : 'Guardar cambios' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>


<script setup>
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue';
import { usuario, loginUsuario } from '@/store/session.js';
import { useRouter } from 'vue-router';
import http from '@/config/api.js';

const router = useRouter();
const error = ref('');
const success = ref('');
const loading = ref(false);

const form = reactive({
  nombre: '',
  apellidos: '',
  telefono: '',
  correo: ''
});

const errors = reactive({
  nombre: '',
  apellidos: '',
  telefono: ''
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
  if (usuario.value) {
    form.nombre = usuario.value.nombre || '';
    form.apellidos = usuario.value.apellidos || '';
    form.telefono = usuario.value.telefono || '';
    form.correo = usuario.value.correo || '';
  }
  verificarSesionPeriodicamente();
});
onUnmounted(() => {
  if (sesionIntervalId) clearInterval(sesionIntervalId);
});

function capitalizeName(name) {
  return name.replace(/\b\w/g, l => l.toUpperCase());
}

function validateNombre() {
  const nombre = form.nombre;
  form.nombre = nombre.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
  if (!form.nombre) {
    errors.nombre = 'El nombre es requerido';
  } else if (form.nombre.length < 2) {
    errors.nombre = 'El nombre debe tener al menos 2 caracteres';
  } else {
    errors.nombre = '';
    form.nombre = capitalizeName(form.nombre);
  }
}

function validateApellidos() {
  const apellidos = form.apellidos;
  form.apellidos = apellidos.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
  if (!form.apellidos) {
    errors.apellidos = 'Los apellidos son requeridos';
  } else if (form.apellidos.length < 2) {
    errors.apellidos = 'Los apellidos deben tener al menos 2 caracteres';
  } else {
    errors.apellidos = '';
    form.apellidos = capitalizeName(form.apellidos);
  }
}

function validateTelefono() {
  form.telefono = form.telefono.replace(/\D/g, '');
  if (!form.telefono) {
    errors.telefono = 'El teléfono es requerido';
  } else if (form.telefono.length !== 10) {
    errors.telefono = 'El teléfono debe tener exactamente 10 dígitos';
  } else {
    errors.telefono = '';
  }
}

async function editarPerfil() {
  validateNombre();
  validateApellidos();
  validateTelefono();
  if (errors.nombre || errors.apellidos || errors.telefono) {
    error.value = 'Corrige los errores antes de guardar.';
    return;
  }
  error.value = '';
  success.value = '';
  loading.value = true;
  try {
    const token = localStorage.getItem('token');
    const { nombre, apellidos, telefono } = form;
  const res = await http.post('/editar-perfil', { nombre, apellidos, telefono });
    if (res.data.usuario) {
      loginUsuario(res.data.usuario);
      success.value = 'Perfil actualizado correctamente.';
    } else {
      error.value = res.data.message || 'No se pudo actualizar el perfil.';
    }
  } catch (e) {
    error.value = e.response?.data?.message || 'Error al actualizar perfil.';
  } finally {
    loading.value = false;
  }
}

function goBack() {
  router.back();
}

</script>

<style scoped>
.editar-perfil-section {
  min-height: calc(100vh - 90px);
  background: linear-gradient(135deg, #f8fbff 0%, #e3f2fd 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px 20px;
  padding-top: 120px;
}

.editar-perfil-container {
  background: #fff;
  padding: 40px;
  border-radius: 20px;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 8px 32px rgba(25, 118, 210, 0.12), 0 1.5px 6px rgba(0,0,0,0.08);
  position: relative;
  overflow: hidden;
}

.editar-perfil-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #4facfe, #00f2fe);
}

.perfil-header {
  text-align: center;
  margin-bottom: 30px;
  position: relative;
}

.perfil-icon {
  margin-bottom: 15px;
  background: #e3f2fd;
  color: #1976d2;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
}

.perfil-header h2 {
  font-size: 1.6rem;
  color: #1976d2;
  margin: 0 0 10px 0;
  font-weight: 700;
}

.perfil-subtitle {
  color: #666;
  font-size: 0.95rem;
  margin: 0;
  line-height: 1.4;
}

.btn-flecha-regresar {
  position: absolute;
  top: 18px;
  left: 18px;
  background: transparent;
  color: #1976d2;
  border: none;
  padding: 8px 12px;
  border-radius: 50%;
  font-size: 1.7rem;
  font-weight: 600;
  transition: background 0.2s;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
}
.btn-flecha-regresar:hover {
  background: #e3f2fd;
  color: #1565c0;
}

.perfil-form {
  padding: 0;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #1976d2;
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

.form-control.is-valid {
  border-color: #4caf50;
  background: #f8fff8;
}

.form-control.is-invalid {
  border-color: #f44336;
  background: #fff8f8;
}

.invalid-feedback {
  color: #f44336;
  font-size: 0.85rem;
  margin-top: 6px;
  display: block;
}

.form-text {
  font-size: 0.85rem;
  color: #666;
  margin-top: 6px;
  display: block;
}

.btn-cambiar-password {
  display: inline-block;
  color: #1976d2;
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 600;
  margin-top: 8px;
  padding: 6px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  transition: all 0.2s;
}
.btn-cambiar-password:hover {
  background: #e3f2fd;
  color: #1565c0;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
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

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 25px;
}
.form-actions .btn {
  flex: 1;
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
  .editar-perfil-section {
    padding: 20px 15px;
    padding-top: 100px;
  }
  .editar-perfil-container {
    padding: 30px 25px;
    border-radius: 16px;
    max-width: 100%;
  }
  .perfil-header h2 {
    font-size: 1.3rem;
  }
  .btn-flecha-regresar {
    top: 8px;
    left: 8px;
    font-size: 1.1rem;
  }
  .form-actions {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .editar-perfil-section {
    padding: 15px 10px;
    padding-top: 90px;
  }
  .editar-perfil-container {
    padding: 20px 10px;
    border-radius: 12px;
  }
  .perfil-header h2 {
    font-size: 1.1rem;
  }
  .btn {
    padding: 10px 16px;
    font-size: 0.9rem;
  }
}
.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(33, 150, 243, 0.4);
  background: linear-gradient(135deg, #1976d2 0%, #0d47a1 100%);
}

.btn-secondary {
  background: transparent;
  color: #546e7a;
  border: 2px solid #e1f5fe;
}

.btn-secondary:hover:not(:disabled) {
  background: #e3f2fd;
  color: #1976d2;
  transform: translateY(-1px);
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 25px;
}

.form-actions .btn {
  flex: 1;
}

.alert {
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 20px;
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

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
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
  .editar-perfil-section {
    padding: 20px 15px;
    padding-top: 100px;
  }
  
  .editar-perfil-container {
    max-width: 100%;
  }
  
  .perfil-header {
    padding: 25px 20px 15px;
  }
  
  .perfil-header h2 {
    font-size: 1.5rem;
    margin-right: 80px;
  }
  
  .btn-regresar {
    top: 15px;
    right: 15px;
    padding: 6px 12px;
    font-size: 0.8rem;
  }
  
  .perfil-form {
    padding: 20px;
  }
  
  .form-actions {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .editar-perfil-section {
    padding: 15px 10px;
    padding-top: 90px;
  }
  
  .perfil-header {
    padding: 20px 15px 15px;
  }
  
  .perfil-header h2 {
    font-size: 1.3rem;
  }
  
  .perfil-form {
    padding: 15px;
  }
  
  .btn {
    padding: 14px 20px;
    font-size: 0.95rem;
  }
}
</style>