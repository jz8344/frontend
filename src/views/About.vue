<template>
  <div>
    <MenuNav />

    <section class="about-hero">
      <div class="about-hero-content">
        <h1>Sobre Nosotros</h1>
        <p>
          Trailyn Safe es una empresa mexicana dedicada a la innovación tecnológica para la seguridad y gestión eficiente del transporte escolar. .
        </p>
      </div>
    </section>

    <section class="about-values">
      <div class="about-values-grid">
        <div class="about-card">
          <div class="card-icon">
            <i class="bi bi-bullseye"></i>
          </div>
          <h2>Objetivo</h2>
          <p>
            Brindar soluciones tecnológicas integrales que garanticen la seguridad, el monitoreo y la eficiencia en el transporte escolar, apoyando a familias, instituciones educativas y operadores.
          </p>
        </div>
        <div class="about-card">
          <div class="card-icon">
            <i class="bi bi-heart-fill"></i>
          </div>
          <h2>Misión</h2>
          <p>
            Proteger y dar tranquilidad a las familias mediante tecnología de vanguardia, promoviendo la confianza y la transparencia en cada trayecto escolar.
          </p>
        </div>
        <div class="about-card">
          <div class="card-icon">
            <i class="bi bi-eye-fill"></i>
          </div>
          <h2>Visión</h2>
          <p>
            Ser la plataforma líder en Latinoamérica en soluciones inteligentes para el transporte escolar, reconocida por su innovación, confiabilidad y compromiso social.
          </p>
        </div>
      </div>
    </section>

    <section class="about-extra">
      <div class="values-container">
        <h2>Nuestros Valores</h2>
        <p class="values-subtitle">Los principios que guían nuestro trabajo y compromiso</p>
        
        <div class="values-grid">
          <div class="value-card">
            <div class="value-icon">
              <i class="bi bi-lightbulb"></i>
            </div>
            <div class="value-content">
              <h3>Innovación</h3>
              <p>Siempre buscamos nuevas formas de mejorar la seguridad y la experiencia de nuestros usuarios.</p>
            </div>
          </div>
          
          <div class="value-card">
            <div class="value-icon">
              <i class="bi bi-shield-check"></i>
            </div>
            <div class="value-content">
              <h3>Compromiso</h3>
              <p>Nos dedicamos a la protección y bienestar de los estudiantes y sus familias.</p>
            </div>
          </div>
          
          <div class="value-card">
            <div class="value-icon">
              <i class="bi bi-eye"></i>
            </div>
            <div class="value-content">
              <h3>Transparencia</h3>
              <p>Información clara y accesible para todos los involucrados.</p>
            </div>
          </div>
          
          <div class="value-card">
            <div class="value-icon">
              <i class="bi bi-people-fill"></i>
            </div>
            <div class="value-content">
              <h3>Responsabilidad Social</h3>
              <p>Contribuimos al desarrollo seguro de la comunidad escolar.</p>
            </div>
          </div>
          
          <div class="value-card">
            <div class="value-icon">
              <i class="bi bi-puzzle"></i>
            </div>
            <div class="value-content">
              <h3>Trabajo en Equipo</h3>
              <p>Colaboramos con padres, escuelas y transportistas para lograr un objetivo común.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="about-team">
      <h2>Equipo Trailyn Safe</h2>
      <div class="about-team-grid">
        <div class="team-card">
        <img src="/img/team2.png" alt="Evelyn Esmeralda Manuel Matus" />
        <h3>Evelyn Esmeralda Manuel Matus</h3>
        <p>Líder y CEO. Desarrolladora frontend, backend y documentadora.</p>
        </div>
        <div class="team-card">
        <img src="/img/team1.png" alt="Jose Javier Zanabria Garcia" />
        <h3>Jose Javier Zanabria Garcia</h3>
        <p>Desarrollador frontend, backend y documentador.</p>
        </div>
        <div class="team-card">
        <img src="/img/team3.png" alt="Karla Sarahi Gomez Gonzales" />
        <h3>Karla Sarahi Gomez Gonzales</h3>
        <p>Desarrolladora frontend, backend y documentadora.</p>
        </div>
        <div class="team-card">
        <img src="/img/team4.png" alt="Hiram Baltazar Jimenez" />
        <h3>Hiram Baltazar Jimenez</h3>
        <p>Desarrollador frontend, especialista en diseño gráfico y documentador.</p>
        </div>
      </div>
    </section>

    

    <FooterSection />
  </div>
</template>

<script setup>
import MenuNav from '@/components/MenuNav.vue';
import FooterSection from '@/components/FooterSection.vue';

</script>

<style scoped>
.about-hero {
  background: linear-gradient(90deg, #4facfe, #00f2fe);
  color: white;
  padding: 60px 5% 40px 5%;
  text-align: center;
}
.about-hero-content {
  max-width: 800px;
  margin: 0 auto;
}
.about-hero h1 {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 18px;
}
.about-hero p {
  font-size: 1.15rem;
  line-height: 1.6;
}

.about-values {
  background: #f8fbff;
  padding: 80px 5%;
}

.about-values-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
  justify-content: center;
  max-width: 1200px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .about-values {
    padding: 60px 5%;
  }
  
  .about-values-grid {
    gap: 30px;
  }
  
  .about-card {
    min-width: 100%;
    max-width: 100%;
  }
  
  .card-icon {
    width: 70px;
    height: 70px;
  }
  
  .card-icon i {
    font-size: 2rem;
  }
  
  .about-card h2 {
    font-size: 1.3rem;
  }
  
  .about-card p {
    font-size: 0.95rem;
  }
}
.about-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
  padding: 40px 28px;
  max-width: 340px;
  min-width: 260px;
  flex: 1 1 260px;
  text-align: center;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.about-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 32px rgba(0,0,0,0.12);
}

.card-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px auto;
  transition: all 0.3s ease;
}

.card-icon i {
  font-size: 2.2rem;
  color: white;
}

.about-card:hover .card-icon {
  transform: scale(1.1);
  box-shadow: 0 8px 20px rgba(79, 172, 254, 0.3);
}

.about-card h2 {
  color: #1976d2;
  font-size: 1.4rem;
  margin-bottom: 16px;
  font-weight: 600;
}

.about-card p {
  color: #555;
  font-size: 1rem;
  line-height: 1.6;
}

.about-extra {
  padding: 80px 5% 60px 5%;
  background: linear-gradient(135deg, #f8fbff 0%, #e3f2fd 100%);
  text-align: center;
}

.values-container {
  max-width: 1200px;
  margin: 0 auto;
}

.about-extra h2 {
  color: #1976d2;
  font-size: 2.2rem;
  margin-bottom: 12px;
  font-weight: 700;
}

.values-subtitle {
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 50px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.values-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-top: 40px;
}

.value-card {
  background: white;
  border-radius: 16px;
  padding: 30px 25px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
  transition: all 0.3s ease;
  display: flex;
  align-items: flex-start;
  gap: 20px;
  text-align: left;
  position: relative;
  overflow: hidden;
}

.value-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  transition: all 0.3s ease;
}

.value-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 32px rgba(0,0,0,0.12);
}

.value-card:hover::before {
  width: 100%;
  opacity: 0.05;
}

.value-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.value-icon i {
  font-size: 1.8rem;
  color: white;
}

.value-card:hover .value-icon {
  transform: scale(1.1);
  box-shadow: 0 8px 20px rgba(79, 172, 254, 0.3);
}

.value-content h3 {
  color: #1976d2;
  font-size: 1.3rem;
  margin: 0 0 10px 0;
  font-weight: 600;
}

.value-content p {
  color: #555;
  font-size: 1rem;
  line-height: 1.6;
  margin: 0;
}

@media (max-width: 768px) {
  .values-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .value-card {
    flex-direction: column;
    text-align: center;
    padding: 25px 20px;
  }
  
  .value-icon {
    align-self: center;
  }
  
  .about-extra h2 {
    font-size: 1.8rem;
  }
  
  .values-subtitle {
    font-size: 1rem;
  }
}

.about-team {
  background: #f8f9fa;
  padding: 50px 5% 40px 5%;
  text-align: center;
}
.about-team h2 {
  color: #1976d2;
  font-size: 1.5rem;
  margin-bottom: 30px;
}
.about-team-grid {
  display: flex;
  gap: 40px;
  justify-content: center;
  flex-wrap: wrap;
}
.team-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.06);
  padding: 28px 18px;
  max-width: 220px;
  min-width: 180px;
  text-align: center;
}
.team-card img {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 12px;
  border: 3px solid #1976d2;
}
.team-card h3 {
  margin: 0 0 6px 0;
  color: #1976d2;
  font-size: 1.1rem;
}
.team-card p {
  color: #444;
  font-size: 0.98rem;
}

.about-contact {
  background: #fff;
  padding: 40px 5% 60px 5%;
  text-align: center;
}
.about-contact h2 {
  color: #1976d2;
  font-size: 1.3rem;
  margin-bottom: 16px;
}
.about-contact a {
  color: #1976d2;
  text-decoration: underline;
  margin: 0 10px;
}
.about-social {
  margin-top: 18px;
}
.about-social a {
  margin: 0 12px;
  color: #1976d2;
  font-weight: bold;
  font-size: 1.1rem;
  text-decoration: none;
}
.about-social a:hover {
  text-decoration: underline;
}
</style>