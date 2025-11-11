<template>
  <div>
    <MenuNav />
    <section class="aliados-hero">
      <div class="aliados-hero-content">
        <h1>Aliados Educativos</h1>
        <p>
          Estas son algunas de las instituciones educativas que han confiado en Trailyn Safe para la seguridad y gestión de su transporte escolar.
        </p>
      </div>
    </section>
<section class="aliados-gallery">
  <div class="aliados-gallery-grid">
    <transition-group name="card-fade" tag="div" class="cards-container" appear>
      <div 
        class="aliado-card"
        v-for="(escuela, index) in escuelas"
        :key="escuela.nombre"
        :style="{ 'animation-delay': `${index * 0.1}s` }"
        @mouseenter="handleMouseEnter(escuela)"
        @mouseleave="handleMouseLeave(escuela)"
      >
        <img :src="escuela.img" :alt="escuela.nombre" />
        <h3>{{ escuela.nombre }}</h3>
      </div>
    </transition-group>
  </div>
  <transition name="modal-fade">
    <div v-if="showModal && escuelaSeleccionada" class="modal-aliado" @click.self="closeModal">
      <transition name="modal-scale">
        <div class="modal-aliado-content">
          <button class="close-btn" @click="closeModal">×</button>
          <div class="modal-header">
            <h2>{{ escuelaSeleccionada.nombre }}</h2>
          </div>
          <div class="modal-info">
            <div class="info-item">
              <i class="bi bi-geo-alt-fill"></i>
              <span>{{ escuelaSeleccionada.ubicacion }}</span>
            </div>
            <div class="info-item">
              <i class="bi bi-telephone-fill"></i>
              <span>{{ escuelaSeleccionada.telefono }}</span>
            </div>
            <div class="info-item">
              <i class="bi bi-building"></i>
              <span>{{ escuelaSeleccionada.direccion }}</span>
            </div>
          </div>
          <iframe
            :src="escuelaSeleccionada.maps + '&output=embed'"
            width="100%"
            height="300"
            style="border:0; border-radius:12px; margin-top:16px;"
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </transition>
    </div>
  </transition>
</section>
    <FooterSection />
  </div>
</template>

<script setup>
import MenuNav from '@/components/MenuNav.vue';
import FooterSection from '@/components/FooterSection.vue';

import { ref } from 'vue';

const escuelas = [
  {
    nombre: 'UTZMG',
    img: '/img/utzmg.png',
    direccion: 'Universidad Tecnológica de la Zona Metropolitana de Guadalajara',
    ubicacion: 'Tlajomulco de Zúñiga, Jalisco',
    telefono: '(33) 3057-7600',
    maps: 'https://www.google.com/maps?q=Universidad+Tecnológica+de+la+Zona+Metropolitana+de+Guadalajara',
  },
  {
    nombre: 'UVM Guadalajara Sur',
    img: '/img/uvm.png',
    direccion: 'UVM Guadalajara Sur',
    ubicacion: 'Guadalajara, Jalisco',
    telefono: '(33) 3834-5600',
    maps: 'https://www.google.com/maps?q=UVM+Guadalajara+Sur',
  },
  {
    nombre: 'UPZMG',
    img: '/img/upzmg.png',
    direccion: 'Universidad Politécnica de la Zona Metropolitana de Guadalajara',
    ubicacion: 'Cajititlán, Tlajomulco, Jalisco',
    telefono: '(33) 3057-7800',
    maps: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3738.6096422099727!2d-103.31070322577797!3d20.440139007737134!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x842f4efec926e0f7%3A0x2c5b230ea330dc24!2sUniversidad%20Polit%C3%A9cnica%20de%20la%20ZMG-Cajititl%C3%A1n!5e0!3m2!1ses!2smx!4v1753336406444!5m2!1ses!2smx'
  },
  {
    nombre: 'Universidad de Guadalajara',
    img: '/img/udg.png',
    direccion: 'Universidad de Guadalajara',
    ubicacion: 'Guadalajara, Jalisco',
    telefono: '(33) 3134-2222',
    maps: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7465.884943504951!2d-103.37815596654936!3d20.671919341328596!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8428b1ee37beded9%3A0x9efee7d9f8f0843d!2sUniversidad%20De%20Guadalajara!5e0!3m2!1ses!2smx!4v1753336505528!5m2!1ses!2smx" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"',
  },
  {
    nombre: 'ITESO',
    img: '/img/iteso.png',
    direccion: 'ITESO Universidad Jesuita de Guadalajara',
    ubicacion: 'Tlaquepaque, Jalisco',
    telefono: '(33) 3669-3434',
    maps: 'https://www.google.com/maps?q=ITESO',
  },
];

const showModal = ref(false);
const escuelaSeleccionada = ref(null);
const hoverTimeouts = ref({});

function handleMouseEnter(escuela) {
  hoverTimeouts.value[escuela.nombre] = setTimeout(() => {
    escuelaSeleccionada.value = escuela;
    showModal.value = true;
  }, 2500); 
}

function handleMouseLeave(escuela) {
  clearTimeout(hoverTimeouts.value[escuela.nombre]);
}

function closeModal() {
  showModal.value = false;
  escuelaSeleccionada.value = null;
}
</script>

<style scoped>
.aliados-hero {
  background: linear-gradient(90deg, #4facfe, #00f2fe);
  color: white;
  padding: 60px 5% 40px 5%;
  text-align: center;
}
.aliados-hero-content {
  max-width: 800px;
  margin: 0 auto;
}
.aliados-hero h1 {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 18px;
}
.aliados-hero p {
  font-size: 1.15rem;
  line-height: 1.6;
}
.aliados-gallery {
  background: #f8fbff;
  padding: 50px 5%;
}
.aliados-gallery-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 36px;
  justify-content: center;
}

.cards-container {
  display: flex;
  flex-wrap: wrap;
  gap: 36px;
  justify-content: center;
}

.card-fade-enter-active {
  animation: cardSlideUp 0.8s ease-out forwards;
}

@keyframes cardSlideUp {
  0% {
    opacity: 0;
    transform: translateY(50px) scale(0.9);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.aliado-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 0 0 3px #30d9ff, 0 8px 24px rgba(0,0,0,0.10);
  padding: 28px 18px;
  max-width: 220px;
  min-width: 180px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.6s cubic-bezier(.4,2,.6,1), box-shadow 0.2s;
  perspective: 800px;
  opacity: 1;
  animation: cardSlideUp 0.8s ease-out forwards;
  animation-fill-mode: both;
}
.aliado-card:hover {
  transform: translateY(-6px) scale(1.04) rotateY(15deg);
  box-shadow: 0 0 0 4px #1976d2, 0 16px 32px rgba(25, 118, 210, 0.18);
  animation: cardVibrate 0.6s ease-in-out infinite;
}

@keyframes cardVibrate {
  0%, 100% { transform: translateY(-6px) scale(1.04) rotateY(15deg); }
  25% { transform: translateY(-7px) scale(1.045) rotateY(15.5deg) rotate(0.2deg); }
  50% { transform: translateY(-5px) scale(1.035) rotateY(14.5deg) rotate(-0.2deg); }
  75% { transform: translateY(-6.5px) scale(1.042) rotateY(15.2deg) rotate(0.1deg); }
}

.aliado-card:not(:hover) {
  animation: none;
}
.aliado-card img {
  width: 180px;
  height: 180px;
  object-fit: contain;
  margin-bottom: 14px;
  background: #f4f8fb;
  border-radius: 8px;
  border: 2px solid #e3f2fd;
}
.aliado-card h3 {
  margin: 0;
  color: #1976d2;
  font-size: 1.05rem;
  font-weight: 600;
}

.modal-fade-enter-active {
  transition: opacity 0.4s ease-out;
}

.modal-fade-leave-active {
  transition: opacity 0.3s ease-in;
}

.modal-fade-enter-from, .modal-fade-leave-to {
  opacity: 0;
}

.modal-scale-enter-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.modal-scale-leave-active {
  transition: all 0.4s cubic-bezier(0.55, 0.085, 0.68, 0.53);
}

.modal-scale-enter-from {
  opacity: 0;
  transform: scale(0.7) translateY(-30px) rotate(-2deg);
}

.modal-scale-leave-to {
  opacity: 0;
  transform: scale(0.8) translateX(400px) rotate(15deg);
}

.modal-aliado {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-aliado-content {
  background: #fff;
  border-radius: 16px;
  padding: 32px 24px 24px 24px;
  max-width: 480px;
  width: 90vw;
  box-shadow: 0 8px 32px rgba(25, 118, 210, 0.18);
  position: relative;
  text-align: center;
}

.modal-header h2 {
  color: #1976d2;
  font-size: 1.4rem;
  margin-bottom: 16px;
  font-weight: 700;
}

.modal-info {
  text-align: left;
  margin-bottom: 16px;
}

.info-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  padding: 8px 12px;
  background: #f8fbff;
  border-radius: 8px;
  border-left: 4px solid #1976d2;
}

.info-item i {
  color: #1976d2;
  font-size: 1.1rem;
  margin-right: 12px;
  min-width: 20px;
}

.info-item span {
  color: #444;
  font-size: 0.95rem;
  line-height: 1.4;
}
.close-btn {
  position: absolute;
  top: 10px;
  right: 16px;
  background: none;
  border: none;
  font-size: 1.7rem;
  color: #1976d2;
  cursor: pointer;
  transition: color 0.2s;
}
.close-btn:hover {
  color: #0d47a1;
}
</style>
