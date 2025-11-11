<template>
  <div>
    <MenuNav />
    
    <section class="banner">
      <div class="banner-content">
        <h1>Seguridad Inteligente para Transporte Escolar</h1>
        <p>
          Trailyn Safe es una solución innovadora que integra tecnologías avanzadas como IoT, GPS, sensores inteligentes y cámaras de vigilancia para garantizar la seguridad de los estudiantes durante el traslado escolar.
        </p>
        <div class="buttons">
        </div>
      </div>
    </section>
    <section class="features-section">
      <h2 class="section-title">Características Principales</h2>
      <div class="features-grid">
        <div class="feature-card">
          <img src="/img/app.png" alt="App Móvil" class="icon">
          <h3>App Móvil</h3>
          <p>Acceso fácil y rápido a toda la información desde cualquier lugar mediante una aplicación móvil intuitiva.</p>
        </div>
        <div class="feature-card">
          <img src="/img/gps.png" alt="GPS" class="icon">
      <h3>Localización en Tiempo Real</h3>
      <p>Seguimiento preciso mediante GPS para conocer la ubicación exacta del transporte escolar en todo momento.</p>
    </div>
    <div class="feature-card">
      <img src="/img/mongodb.png" alt="MongoDB Atlas" class="icon">
      <h3>Respaldo en la Nube</h3>
      <p>Base de datos MongoDB Atlas para almacenamiento seguro y respaldos automáticos de la información.</p>
    </div>
    <div class="feature-card">
      <img src="/img/iot.png" alt="IoT" class="icon">
      <h3>Integración IoT</h3>
      <p>Conexión con sensores inteligentes para monitorear puertas, temperatura y otros parámetros en tiempo real.</p>
    </div>
    <div class="feature-card">
      <img src="/img/speed.png" alt="Velocidad" class="icon">
      <h3>Monitoreo de Velocidad</h3>
      <p>Control constante de la velocidad del vehículo con alertas ante excesos o conducción irregular.</p>
    </div>
    <div class="feature-card">
      <img src="/img/bell.png" alt="Notificaciones" class="icon">
      <h3>Notificaciones Inteligentes</h3>
      <p>Alertas para padres sobre llegadas, salidas y eventos relevantes del trayecto.</p>
    </div>
    <div class="feature-card">
      <img src="/img/security.png" alt="Seguridad" class="icon">
      <h3>Seguridad Avanzada</h3>
      <p>Autenticación segura y cifrado de datos sensibles para proteger la integridad del sistema.</p>
    </div>
    <div class="feature-card">
      <img src="/img/report.png" alt="Reportes" class="icon">
      <h3>Informes Detallados</h3>
      <p>Generación automática de reportes de uso y rendimiento para mejorar el servicio.</p>
    </div>
  </div>
</section>

<section class="about-section">
  <h2>¿Por qué elegir Trailyn Safe?</h2>
  <p>
    Nuestra plataforma está diseñada para brindar tranquilidad a padres, escuelas y transportistas, integrando tecnología de punta y un enfoque centrado en la seguridad infantil.
  </p>
</section>

<section class="testimonials-section">
  <h2>Testimonios</h2>
  <div class="carousel-container">
    <button class="carousel-btn" @click="prevTestimonial">&#8592;</button>
    <div class="carousel">
      <div
        class="testimonial-card"
        v-for="(t, i) in visibleTestimonials"
        :key="t.nombre"
      >
        <div class="testimonial-img">
          <img :src="t.img" :alt="t.nombre" />
        </div>
        <div class="testimonial-stars">
          <span v-for="n in 5" :key="n" class="star" :class="{ filled: n <= t.stars }">&#9733;</span>
        </div>
        <p class="testimonial-text">"{{ t.texto }}"</p>
        <span class="testimonial-name">- {{ t.nombre }}, {{ t.rol }}</span>
      </div>
    </div>
    <button class="carousel-btn" @click="nextTestimonial">&#8594;</button>
  </div>
</section>

<FooterSection />
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue';
import MenuNav from '@/components/MenuNav.vue';
import FooterSection from '@/components/FooterSection.vue';



const form = reactive({
  nombre: '',
  telefono: '',
  email: '',
  interes: '',
  mensaje: ''
});

const handleSubmit = () => {
  console.log('Formulario enviado:', form);
  alert('¡Gracias por tu interés! Nos pondremos en contacto contigo pronto.');
};

const testimonials = [
  {
    nombre: 'Laura G.',
    rol: 'Madre de familia',
    texto: 'Ahora sé exactamente cuándo mi hijo llega a la escuela. ¡Excelente servicio!',
    img: '/img/testimonio1.png',
    stars: 5
  },
  {
    nombre: 'Juan P.',
    rol: 'Conductor escolar',
    texto: 'La seguridad y el monitoreo han mejorado mucho desde que usamos Trailyn Safe.',
    img: '/img/testimonio2.png',
    stars: 4
  },
  {
    nombre: 'María R.',
    rol: 'Directora de escuela',
    texto: 'La tranquilidad que ofrece Trailyn Safe a los padres es invaluable.',
    img: '/img/testimonio3.png',
    stars: 5
  },
  {
    nombre: 'Carlos S.',
    rol: 'Padre de familia',
    texto: 'Recibo notificaciones puntuales y el sistema es muy fácil de usar.',
    img: '/img/testimonio4.png',
    stars: 5
  }
];

const current = ref(0);
const visibleCount = 2;

const visibleTestimonials = computed(() => {
  const start = current.value;
  const end = start + visibleCount;
  if (end <= testimonials.length) {
    return testimonials.slice(start, end);
  } else {
    return testimonials.slice(start).concat(testimonials.slice(0, end - testimonials.length));
  }
});

function nextTestimonial() {
  current.value = (current.value + 1) % testimonials.length;
}
function prevTestimonial() {
  current.value = (current.value - 1 + testimonials.length) % testimonials.length;
}
</script>

<style>
body {
  margin: 0;
  font-family: 'Great Vibes';
}

.banner {
  background: linear-gradient(90deg, #4facfe, #00f2fe); 
  min-height: 50vh; 
  color: white;
  display: flex;
  align-items: center;
  justify-content: center; 
  text-align: center; 
  padding: 100px 5% 30px 5%;
  position: relative;
}

.banner-content {
  max-width: 800px; 
  z-index: 1;
}

.banner h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 15px;
  line-height: 1.2;
}

.banner p {
  font-size: 1.1rem;
  line-height: 1.5;
  margin-bottom: 25px;
}

.buttons {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  justify-content: center; 
}

.btn {
  padding: 12px 20px;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: 0.3s;
}

.btn-primary {
  background-color: #009FE3;
  color: white;
}

.btn-primary:hover {
  background-color: #007cb3;
}

.features-section {
  background-color: #f8fbff;
  padding: 60px 5%;
  text-align: center;
}

.section-title {
  font-size: 2rem;
  color: #1976d2;
  margin-bottom: 40px;
  font-weight: bold;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  justify-content: center;
}

.feature-card {
  background-color: white;
  border-radius: 12px;
  padding: 30px 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-card .icon {
  width: 85px;
  height: 85px;
  margin-bottom: 15px;
}

.feature-card h3 {
  font-size: 1.2rem;
  color: #0d47a1;
  margin-bottom: 10px;
}

.feature-card p {
  color: #444;
  font-size: 0.95rem;
  line-height: 1.4;
}

.about-section {
  background-color: #ffffff;
  padding: 60px 5%;
  text-align: center;
}

.about-section h2 {
  font-size: 2rem;
  color: #1976d2;
  margin-bottom: 20px;
  font-weight: bold;
}

.about-section p {
  font-size: 1rem;
  color: #333;
  line-height: 1.6;
}

.testimonials-section {
  background-color: #f8f9fa;
  padding: 100px 10% 100px 10%; 
  text-align: center;
}

.testimonials-section h2 {
  font-size: 2.5rem;
  color: #1976d2;
  margin-bottom: 50px;
  font-weight: bold;
  letter-spacing: 1px;
}

.carousel-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 30px; 
  margin-top: 40px;
}

.carousel {
  display: flex;
  gap: 40px; 
}

.carousel-btn {
  background: #1976d2;
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  font-size: 2rem;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
  box-shadow: 0 2px 8px rgba(25, 118, 210, 0.10);
  display: flex;
  align-items: center;
  justify-content: center;
}
.carousel-btn:hover {
  background: #0d47a1;
  transform: scale(1.1);
}

.testimonial-card {
  background-color: #fff;
  border-radius: 20px;
  box-shadow: 0 6px 24px rgba(25, 118, 210, 0.12);
  padding: 40px 32px 28px 32px;
  max-width: 380px;
  min-width: 280px;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.3s, box-shadow 0.3s;
  margin-bottom: 10px;
}
.testimonial-card:hover {
  transform: translateY(-8px) scale(1.03);
  box-shadow: 0 12px 32px rgba(25, 118, 210, 0.18);
}

.testimonial-img {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 18px;
  border: 4px solid #1976d2;
  box-shadow: 0 2px 12px rgba(25, 118, 210, 0.13);
}
.testimonial-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.testimonial-stars {
  margin-bottom: 14px;
}
.star {
  color: #ffd700;
  font-size: 1.5rem;
  margin-right: 2px;
}
.star.filled {
  color: #ffd700;
}
.star:not(.filled) {
  color: #ccc;
}

.testimonial-text {
  font-size: 1.15rem;
  color: #333;
  margin-bottom: 18px;
  text-align: center;
  font-style: italic;
  min-height: 60px;
}

.testimonial-name {
  font-size: 1.05rem;
  color: #1976d2;
  font-weight: bold;
  margin-top: 8px;
  text-align: center;
  letter-spacing: 0.5px;
}

@media (max-width: 768px) {
  .banner {
    min-height: 60vh;
    padding: 120px 5% 30px 5%; 
  }
  
  .banner h1 {
    font-size: 2rem;
    margin-bottom: 20px;
  }
  
  .banner p {
    font-size: 1rem;
    margin-bottom: 30px;
  }
  
  .features-section {
    padding: 40px 5%;
  }
  
  .section-title {
    font-size: 1.6rem;
    margin-bottom: 30px;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .feature-card {
    padding: 25px 15px;
  }
  
  .feature-card .icon {
    width: 70px;
    height: 70px;
  }
  
  .about-section {
    padding: 40px 5%;
  }
  
  .about-section h2 {
    font-size: 1.6rem;
  }
  
  .testimonials-section {
    padding: 60px 5%;
  }
  
  .testimonials-section h2 {
    font-size: 2rem;
    margin-bottom: 30px;
  }
  
  .carousel-container {
    flex-direction: column;
    gap: 20px;
  }
  
  .carousel {
    flex-direction: column;
    gap: 20px;
    width: 100%;
  }
  
  .carousel-btn {
    width: 40px;
    height: 40px;
    font-size: 1.5rem;
  }
  
  .testimonial-card {
    max-width: 100%;
    min-width: auto;
    padding: 30px 20px;
  }
  
  .testimonial-img {
    width: 120px;
    height: 120px;
  }
  
  .testimonial-text {
    font-size: 1rem;
    min-height: auto;
  }
}

@media (max-width: 480px) {
  .banner {
    min-height: 50vh;
    padding: 100px 5% 25px 5%;  
  }
  
  .banner h1 {
    font-size: 1.6rem;
    line-height: 1.3;
  }
  
  .banner p {
    font-size: 0.9rem;
    line-height: 1.4;
  }
  
  .btn {
    padding: 10px 16px;
    font-size: 0.9rem;
  }
  
  .features-section {
    padding: 30px 4%;
  }
  
  .section-title {
    font-size: 1.4rem;
  }
  
  .feature-card {
    padding: 20px 15px;
  }
  
  .feature-card h3 {
    font-size: 1.1rem;
  }
  
  .feature-card p {
    font-size: 0.9rem;
  }
  
  .about-section {
    padding: 30px 4%;
  }
  
  .about-section h2 {
    font-size: 1.4rem;
  }
  
  .about-section p {
    font-size: 0.9rem;
  }
  
  .testimonials-section {
    padding: 40px 4%;
  }
  
  .testimonials-section h2 {
    font-size: 1.6rem;
  }
  
  .testimonial-card {
    padding: 25px 15px;
  }
  
  .testimonial-img {
    width: 100px;
    height: 100px;
  }
  
  .testimonial-text {
    font-size: 0.95rem;
  }
  
  .testimonial-name {
    font-size: 1rem;
  }
}

@media (max-width: 360px) {
  .banner {
    padding: 110px 4% 20px 4%;  
    min-height: 45vh;
  }
  
  .banner h1 {
    font-size: 1.4rem;
  }
  
  .banner p {
    font-size: 0.85rem;
  }
  
  .section-title {
    font-size: 1.2rem;
  }
  
  .testimonials-section h2 {
    font-size: 1.4rem;
  }
}
</style>