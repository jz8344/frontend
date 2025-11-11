<template>
  <div v-if="conexionPerdida" class="alert alert-warning text-center conexion-perdida">
    <i class="bi bi-wifi-off"></i>
    No se pudo conectar con el servidor. Verifica tu conexión.
  </div>
  
  <nav class="navbar">
    <div class="navbar-logo">
      <router-link to="/" class="flex items-center no-underline">
        <img :src="logo" width="120" alt="Trailyn Safe Logo" class="mr-2">
        <h1 class="m-0">Trailyn Safe</h1>
      </router-link>
    </div>
    <div class="navbar-toggle" @click="toggleMobileMenu">
      <i class="bi bi-list" v-if="!showMobileMenu"></i>
      <i class="bi bi-x" v-if="showMobileMenu"></i>
    </div>
    <div class="navbar-links" :class="{ 'mobile-menu-open': showMobileMenu }">
      <router-link to="/" @click="closeMobileMenu">Inicio</router-link>
      <router-link to="/about" @click="closeMobileMenu">Sobre nosotros</router-link>
      <router-link to="/aliados" @click="closeMobileMenu">Aliados</router-link>
      <router-link to="/rutas" @click="closeMobileMenu">Rutas</router-link>
      <template v-if="!usuario || !usuario.id">
        <router-link to="/login" @click="closeMobileMenu">Iniciar sesión</router-link>
        <router-link to="/register" @click="closeMobileMenu">Registrarte</router-link>
      </template>
      <template v-else>
        <button @click="openProfile" class="btn btn-primary">Perfil</button>
      </template>
    </div>

    <div
      v-if="showProfile && usuario"
      class="modal-perfil"
      @keydown.esc="closeProfile"
      role="dialog"
      aria-modal="true"
      aria-labelledby="perfil-title"
      ref="modalRef"
    >
      <div class="modal-content simple">
        <div class="modal-header simple">
          <h2 id="perfil-title">Mi perfil</h2>
          <button @click="closeProfile" class="close-btn" aria-label="Cerrar modal">×</button>
        </div>
        <div class="profile-info simple">
          <section class="profile-panel" aria-labelledby="panel-personal">
            <h3 id="panel-personal">Información personal</h3>
            <ul class="info-modern" role="list">
              <li class="item">
                <span class="icon" aria-hidden="true"><i class="bi bi-person-fill"></i></span>
                <div class="text">
                  <span class="label">Nombre</span>
                  <span class="value">{{ usuario.nombre }} {{ usuario.apellidos }}</span>
                </div>
              </li>

              <li class="item">
                <span class="icon" aria-hidden="true"><i class="bi bi-envelope-fill"></i></span>
                <div class="text">
                  <span class="label">Correo</span>
                  <span class="value">{{ usuario.correo }}</span>
                </div>
              </li>

              <li class="item">
                <span class="icon" aria-hidden="true"><i class="bi bi-telephone-fill"></i></span>
                <div class="text">
                  <span class="label">Teléfono</span>
                  <span class="value">{{ usuario.telefono }}</span>
                </div>
              </li>

              <li class="item">
                <span class="icon" aria-hidden="true"><i class="bi bi-calendar-event-fill"></i></span>
                <div class="text">
                  <span class="label">Registro</span>
                  <span class="value">{{ usuario.fecha_registro }}</span>
                </div>
              </li>
            </ul>

            <router-link to="/editar-perfil" class="btn btn-primary action-full">Editar perfil</router-link>
            
            <button @click="consultarPerfil" class="btn btn-outline action-full mt-2" style="font-size: 0.9rem;">
              <i class="bi bi-arrow-clockwise me-1"></i>
              Actualizar información
            </button>
          </section>
        </div>
        <div class="modal-footer simple">
          <button @click="cerrarSesion" class="btn btn-danger">Cerrar sesión</button>
          <button @click="closeProfile" class="btn btn-outline">Cerrar</button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import logo from '/img/logo.png';
import { ref, onMounted, onUnmounted, watch } from 'vue';
import http, { API_BASE_URL } from '@/config/api.js';
import { useRouter, useRoute } from 'vue-router';
import { usuario, logoutUsuario } from '@/store/session.js';

const router = useRouter();
const route = useRoute();
const showProfile = ref(false);
const showMobileMenu = ref(false);
const conexionPerdida = ref(false);
let sesionIntervalId = null;

const modalRef = ref(null);

function toggleMobileMenu() {
  showMobileMenu.value = !showMobileMenu.value;
}

function closeMobileMenu() {
  showMobileMenu.value = false;
}

function openProfile() {
  showProfile.value = true;
  closeMobileMenu();
}

function closeProfile() {
  showProfile.value = false;
}

function cerrarSesion() {
  const token = localStorage.getItem('token');
  if (token) {
  http.post('/sesiones/cerrar-actual', {}).finally(() => {
      logoutUsuario();
      localStorage.clear();
      sessionStorage.clear();
      router.push('/login');
    });
  } else {
    logoutUsuario();
    localStorage.clear();
    sessionStorage.clear();
    router.push('/login');
  }
}

async function consultarPerfil() {
  const token = localStorage.getItem('token');
  if (!token) return;
  try {
  const res = await http.get('/sesion');
    if (res.data && res.data.usuario) {
      usuario.value = res.data.usuario;
      localStorage.setItem('usuario', JSON.stringify(res.data.usuario));
    }
  } catch (e) {
    if (e.response && e.response.status === 401) {
      console.warn('Sesión inválida - cerrando sesión');
      cerrarSesion();
    } else {
      console.warn('Error al consultar perfil (no crítico):', e.message);
    }
  }
}

async function verificarSesionPeriodicamente() {
  sesionIntervalId = setInterval(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
  await http.get('/sesion');

      if (conexionPerdida.value) {
        conexionPerdida.value = false;
      }

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
  if (usuario.value && usuario.value.id) {
    verificarSesionPeriodicamente();
  }
});

watch(showProfile, (open) => {
  if (open) {
    requestAnimationFrame(() => {
      if (modalRef.value && !modalRef.value.hasAttribute('tabindex')) {
        modalRef.value.setAttribute('tabindex', '-1');
      }
      modalRef.value?.focus?.();
    });
  }
});

watch(route, (newRoute) => {
  if (newRoute.path === '/editar-perfil') {
    showProfile.value = false;
  }
});

onUnmounted(() => {
  if (sesionIntervalId) {
    clearInterval(sesionIntervalId);
  }
});
</script>

<style scoped>
body {
  margin: 0;
  font-family: 'Montserrat', sans-serif;
}

.navbar {
  background-color: #3498db;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 40px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.navbar-logo {
  display: flex;
  align-items: center;
}

.navbar-logo img {
  height: 70px;
  margin-right: 0;
}

.navbar-logo h1 {
  display: none;
}

.navbar-toggle {
  display: none;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.navbar-toggle:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.navbar-links {
  display: flex;
  align-items: center;
}

.navbar-links a {
  margin-left: 25px;
  color: white;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  transition: color 0.3s;
}

.navbar-links a:hover {
  color: #bbdefb;
}

.navbar-logo a {
  text-decoration: none;
  color: inherit;
}

.btn {
  padding: 10px 20px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.btn-primary {
  background-color: #2196f3;
  color: white;
}

.btn-primary:hover {
  background-color: #1976d2;
  transform: translateY(-1px);
}

.btn-outline {
  background-color: transparent;
  color: #2196f3;
  border: 2px solid #2196f3;
}

.btn-outline:hover {
  background-color: #e3f2fd;
  transform: translateY(-1px);
}

.btn-secondary {
  background-color: #90caf9;
  color: white;
}

.btn-secondary:hover {
  background-color: #64b5f6;
  transform: translateY(-1px);
}

.btn-danger {
  background-color: #f53535;
  color: white;
}

.btn-danger:hover {
  background-color: #f98585;
  transform: translateY(-1px);
}

 
.modal-perfil {
  --c-nav-primary: #2196f3;
  --c-nav-dark: #1565c0;

  position: fixed;
  inset: 0;
  background: rgba(8, 32, 55, 0.48);
  backdrop-filter: blur(2px) saturate(150%);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: clamp(40px, 6vh, 70px) 24px 48px;
  z-index: 1000;
  animation: fadeIn .35s ease;
  overflow-y: auto;
}

.modal-content {
  background: linear-gradient(135deg, #ffffff 0%, #f9fbfe 60%, #f2f8ff 100%);
  border-radius: 22px;
  width: min(720px, 100%);
  max-height: none;
  box-shadow: 0 18px 50px -10px rgba(0,0,0,.45), 0 4px 10px -3px rgba(0,0,0,.35);
  position: relative;
  display: flex;
  flex-direction: column;
}

.modal-content.simple {
  background: #ffffff;
  border-radius: 20px;
  width: min(640px, 100%);
  box-shadow: 0 10px 40px -8px rgba(0,0,0,.35), 0 0 0 1px rgba(25,118,210,0.08);
  overflow: hidden;
}

.modal-content.simple::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  height: 4px;
  width: 100%;
  background: linear-gradient(90deg, var(--c-nav-primary), var(--c-nav-dark));
}

.modal-header {
  background: linear-gradient(120deg, var(--c-nav-primary), var(--c-nav-dark));
  color: #fff;
  padding: 26px 34px 20px;
  border-radius: 22px 22px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.modal-header.simple {
  background: transparent;
  padding: 26px 30px 8px;
  color: #0d2a44;
}

.modal-header.simple h2 {
  font-size: 1.35rem;
  font-weight: 600;
  letter-spacing: .4px;
  margin: 0;
}

.close-btn {
  background: rgba(255, 255, 255, 0.14);
  border: none;
  color: #fff;
  font-size: 1.3rem;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 12px;
  transition: background .3s ease, transform .3s ease;
}

.modal-header.simple .close-btn {
  color: #1565c0;
  background: rgba(21, 101, 192, 0.08);
}

.close-btn:hover, .close-btn:focus {
  background: rgba(255, 255, 255, 0.28);
  outline: none;
}

.modal-header.simple .close-btn:hover, .modal-header.simple .close-btn:focus {
  background: rgba(21, 101, 192, 0.14);
}

.close-btn:active {
  transform: scale(.92);
}

.profile-info {
  padding: 26px 34px 8px;
}

.profile-info.simple {
  padding: 4px 30px 6px;
}

.profile-panel {
  background: #f7fbff;
  border: 1px solid #d8e9f9;
  border-radius: 16px;
  padding: 22px 22px 18px;
  box-shadow: 0 2px 6px -2px rgba(0,0,0,0.08) inset;
}

.profile-panel h3 {
  margin: 0 0 18px;
  font-size: .9rem;
  letter-spacing: .8px;
  font-weight: 700;
  text-transform: uppercase;
  color: #1565c0;
}

.info-modern {
  margin: 0 0 20px;
  padding: 0;
  list-style: none;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 18px 18px;
}

.info-modern .item {
  position: relative;
  background: linear-gradient(145deg, #ffffff, #f5f9fe 70%);
  border: 1px solid #e1ecf7;
  border-radius: 18px;
  padding: 14px 16px 14px 54px;
  box-shadow: 0 4px 12px -6px rgba(0,0,0,0.08);
  transition: box-shadow .35s ease, transform .35s ease, border-color .35s ease;
  overflow: hidden;
}

.info-modern .item::after {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 90% 15%, rgba(25,118,210,0.18), transparent 60%);
  opacity: .55;
  pointer-events: none;
}

.info-modern .item:hover {
  box-shadow: 0 10px 22px -10px rgba(0,0,0,0.25);
  transform: translateY(-3px);
  border-color: #c2def4;
}

.info-modern .icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  background: linear-gradient(135deg, #2196f3, #1565c0);
  color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 6px -2px rgba(0,0,0,.35);
}

.info-modern .text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-modern .label {
  font-size: .65rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #1565c0;
  opacity: .85;
}

.info-modern .value {
  font-size: .85rem;
  font-weight: 600;
  color: #0d2a44;
  word-break: break-word;
}

.action-full {
  display: block;
  width: 100%;
  text-align: center;
}

.mt-2 {
  margin-top: 0.5rem;
}

.modal-footer {
  padding: 20px 30px;
  border-top: 1px solid #bbdefb;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  background: #e3f2fd;
  border-radius: 0 0 12px 12px;
}

.noti-bell {
  color: white;
  font-size: 32px;
  display: flex;
  align-items: center;
  position: relative;
}

.noti-count {
  position: absolute;
  top: -6px;
  right: -6px;
  background: #ffcc80;
  color: #0d47a1;
  border-radius: 50%;
  font-size: 0.85em;
  padding: 2px 7px;
  font-weight: bold;
  min-width: 22px;
  text-align: center;
  box-shadow: 0 1px 4px rgba(0,0,0,0.15);
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.conexion-perdida {
  position: fixed;
  top: 90px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1001;
  background: #fff3cd;
  color: #856404;
  border: 1px solid #ffeaa7;
  border-radius: 8px;
  padding: 12px 20px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  animation: fadeIn 0.3s ease-out;
}

.conexion-perdida i {
  margin-right: 8px;
}

@media (max-width: 768px) {
  .navbar {
    padding: 8px 20px;
    position: relative;
  }
  
  .navbar-toggle {
    display: block;
  }
  
  .navbar-links {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: #3498db;
    flex-direction: column;
    padding: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    z-index: 999;
  }
  
  .navbar-links.mobile-menu-open {
    display: flex;
  }
  
  .navbar-links a {
    margin: 8px 0;
    padding: 12px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    text-align: center;
    width: 100%;
  }
  
  .navbar-links .btn {
    margin: 10px 0;
    width: 100%;
    text-align: center;
  }
  
  .modal-content {
    width: 95%;
    max-width: none;
    margin: 10px;
    max-height: 90vh;
  }
  
  .modal-header {
    padding: 15px 20px;
  }
  
  .modal-header h2 {
    font-size: 1.5rem;
  }
  
  .profile-info {
    padding: 20px;
  }
  
  .info-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
  
  .info-label {
    width: 100%;
    font-size: 0.9rem;
  }
  
  .info-value {
    width: 100%;
    text-align: left;
    font-size: 0.95rem;
    color: #555;
  }
  
  .modal-footer {
    padding: 15px 20px;
    flex-direction: column;
    gap: 10px;
  }
  
  .modal-footer .btn {
    width: 100%;
    text-align: center;
  }
  
  .btn {
    padding: 12px 16px;
    font-size: 0.95rem;
  }
}

@media (max-width: 480px) {
  .navbar {
    padding: 8px 15px;
  }
  
  .navbar-logo img {
    height: 60px;
  }
  
  .navbar-links {
    gap: 10px;
  }
  
  .navbar-links a {
    font-size: 0.9rem;
  }
  
  .modal-content {
    width: 98%;
    margin: 5px;
    border-radius: 8px;
  }
  
  .modal-header {
    padding: 12px 15px;
    border-radius: 8px 8px 0 0;
  }
  
  .modal-header h2 {
    font-size: 1.3rem;
  }
  
  .close-btn {
    font-size: 1.3rem;
  }
  
  .profile-info {
    padding: 15px;
  }
  
  .info-card {
    padding: 15px;
  }
  
  .info-card h3 {
    font-size: 1.1rem;
  }
  
  .info-row {
    padding: 6px 0;
    margin-bottom: 8px;
  }
  
  .info-label {
    font-size: 0.85rem;
  }
  
  .info-value {
    font-size: 0.9rem;
  }
  
  .modal-footer {
    padding: 12px 15px;
    border-radius: 0 0 8px 8px;
  }
  
  .btn {
    padding: 10px 14px;
    font-size: 0.9rem;
  }
}

@media (max-width: 360px) {
  .navbar-toggle {
    font-size: 1.3rem;
  }
  
  .modal-content {
    height: 95vh;
    margin: 2.5vh auto;
  }
  
  .modal-header h2 {
    font-size: 1.2rem;
  }
  
  .info-card h3 {
    font-size: 1rem;
  }
  
  .info-label {
    font-size: 0.8rem;
  }
  
  .info-value {
    font-size: 0.85rem;
  }
}
</style>
