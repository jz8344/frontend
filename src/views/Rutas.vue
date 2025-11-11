<template>
  <div>
    <MenuNav />

    <section class="banner">
      <div class="banner-content">
        <h1>¿Cómo funciona TrailynSafe?</h1>
        <p>Conoce el proceso completo del sistema de seguridad y monitoreo escolar más confiable.</p>
      </div>
    </section>

    <!-- Proceso de registro e inscripción -->
    <section class="process-section">
      <div class="container">
        <h2 class="section-title">Proceso de Registro e Inscripción</h2>
        
        <div class="steps-container">
          <!-- Etapa 1: Inscripción a la escuela -->
          <div class="step-card">
            <div class="step-number">1</div>
            <div class="step-content">
              <h3>Inscripción a la Escuela</h3>
              <p>El primer paso es inscribir a tu hijo(a) en una escuela que utilice el sistema TrailynSafe.</p>
              <div class="step-icon">🏫</div>
            </div>
          </div>

          <!-- Etapa 2: Registro en la plataforma -->
          <div class="step-card">
            <div class="step-number">2</div>
            <div class="step-content">
              <h3>Registro del Padre/Madre/Tutor</h3>
              <p>Regístrate en la página web de TrailynSafe usando tu correo electrónico y una contraseña segura.</p>
              <div class="step-icon">👥</div>
            </div>
          </div>

          <!-- Etapa 3: Registro de hijos -->
          <div class="step-card">
            <div class="step-number">3</div>
            <div class="step-content">
              <h3>Registro de Hijos</h3>
              <p>Una vez dentro del sistema, registra a tus hijos proporcionando su información básica y académica.</p>
              <div class="step-icon">👶</div>
            </div>
          </div>

          <!-- Etapa 4: Generación del QR -->
          <div class="step-card">
            <div class="step-number">4</div>
            <div class="step-content">
              <h3>Generación del Gafete QR</h3>
              <p>El sistema generará automáticamente un código QR único para cada hijo registrado.</p>
              <div class="step-icon">📱</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Opciones de impresión -->
    <section class="printing-section">
      <div class="container">
        <h2 class="section-title">Opciones de Gafete</h2>
        
        <div class="printing-options">
          <div class="option-card">
            <div class="option-icon">🖨️</div>
            <h3>Impresión Casera</h3>
            <p>Descarga e imprime el gafete desde casa. <strong>Importante:</strong> Debe ser plastificado (enmicado) para mayor durabilidad.</p>
            <ul>
              <li>Descarga inmediata</li>
              <li>Impresión en papel resistente</li>
              <li>Plastificado necesario</li>
            </ul>
          </div>

          <div class="option-card featured">
            <div class="option-icon">🏫</div>
            <h3>Solicitar en la Escuela</h3>
            <p>Solicita la impresión y enmicado profesional directamente en la escuela a través de la plataforma web.</p>
            <ul>
              <li>Calidad profesional</li>
              <li>Enmicado incluido</li>
              <li>Entrega en la escuela</li>
            </ul>
            <div class="featured-badge">Recomendado</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Proceso de uso diario -->
    <section class="daily-process-section">
      <div class="container">
        <h2 class="section-title">Uso Diario del Sistema</h2>
        
        <div class="daily-timeline">
          <div class="timeline-item">
            <div class="timeline-icon">📧</div>
            <div class="timeline-content">
              <h3>Notificaciones Automáticas</h3>
              <p>Recibe notificaciones sobre horarios del transporte escolar, rutas y actualizaciones importantes.</p>
            </div>
          </div>

          <div class="timeline-item">
            <div class="timeline-icon">🚌</div>
            <div class="timeline-content">
              <h3>Salida de la Escuela</h3>
              <p>Recibes una notificación cuando el autobús sale de la escuela hacia tu zona.</p>
            </div>
          </div>

          <div class="timeline-item">
            <div class="timeline-icon">📍</div>
            <div class="timeline-content">
              <h3>Seguimiento en Tiempo Real</h3>
              <p>Conoce la ubicación aproximada del autobús y cuándo llegará a tu parada.</p>
            </div>
          </div>

          <div class="timeline-item">
            <div class="timeline-icon">🏠</div>
            <div class="timeline-content">
              <h3>Aproximación a Casa</h3>
              <p>Recibe una alerta cuando el autobús se acerque a tu parada para que tu hijo esté listo.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Proceso de escaneo -->
    <section class="scanning-section">
      <div class="container">
        <h2 class="section-title">Sistema de Verificación por QR</h2>
        
        <div class="scanning-process">
          <div class="scan-step">
            <div class="scan-visual">
              <div class="bus-icon">🚌</div>
              <div class="qr-icon">📱</div>
              <div class="scan-line"></div>
            </div>
            <h3>Subida al Autobús</h3>
            <p>Cuando el autobús llegue a tu parada, el chofer escaneará el gafete QR de tu hijo para verificar y registrar su entrada al vehículo.</p>
            <div class="verification-badge">✅ Entrada Verificada</div>
          </div>

          <div class="scan-step">
            <div class="scan-visual">
              <div class="school-icon">🏫</div>
              <div class="qr-icon">📱</div>
              <div class="scan-line"></div>
            </div>
            <h3>Llegada a la Escuela</h3>
            <p>Al llegar a la escuela, el chofer volverá a escanear el gafete para validar y registrar la salida segura de tu hijo del autobús.</p>
            <div class="verification-badge">✅ Salida Verificada</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Beneficios del sistema -->
    <section class="benefits-section">
      <div class="container">
        <h2 class="section-title">Beneficios de TrailynSafe</h2>
        
        <div class="benefits-grid">
          <div class="benefit-card">
            <div class="benefit-icon">🔒</div>
            <h3>Seguridad Total</h3>
            <p>Control total sobre quién sube y baja del autobús escolar.</p>
          </div>

          <div class="benefit-card">
            <div class="benefit-icon">📱</div>
            <h3>Monitoreo en Tiempo Real</h3>
            <p>Seguimiento constante del recorrido y ubicación del transporte.</p>
          </div>

          <div class="benefit-card">
            <div class="benefit-icon">🔔</div>
            <h3>Notificaciones Instantáneas</h3>
            <p>Alertas inmediatas sobre el estatus del viaje de tu hijo.</p>
          </div>

          <div class="benefit-card">
            <div class="benefit-icon">📊</div>
            <h3>Historial Completo</h3>
            <p>Registro detallado de todos los viajes y eventos.</p>
          </div>

          <div class="benefit-card">
            <div class="benefit-icon">👥</div>
            <h3>Comunicación Directa</h3>
            <p>Canal directo con la escuela y el chofer del autobús.</p>
          </div>

          <div class="benefit-card">
            <div class="benefit-icon">⚡</div>
            <h3>Fácil de Usar</h3>
            <p>Interfaz intuitiva y proceso simple para toda la familia.</p>
          </div>
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
/* Banner principal */
.banner {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 80px 20px;
  text-align: center;
}

.banner-content h1 {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 20px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.banner-content p {
  font-size: 1.3rem;
  opacity: 0.95;
  max-width: 600px;
  margin: 0 auto;
}

/* Contenedor general */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Títulos de sección */
.section-title {
  font-size: 2.5rem;
  color: #2c3e50;
  text-align: center;
  margin-bottom: 50px;
  font-weight: 700;
}

/* Sección de proceso de registro */
.process-section {
  padding: 80px 0;
  background: #f8f9fa;
}

.steps-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  margin-top: 40px;
}

.step-card {
  background: white;
  border-radius: 20px;
  padding: 40px 30px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  overflow: hidden;
}

.step-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
}

.step-number {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0 auto 20px;
}

.step-content h3 {
  color: #2c3e50;
  font-size: 1.4rem;
  margin-bottom: 15px;
  font-weight: 600;
}

.step-content p {
  color: #6c757d;
  line-height: 1.6;
  margin-bottom: 20px;
}

.step-icon {
  font-size: 3rem;
  opacity: 0.1;
  position: absolute;
  top: 20px;
  right: 20px;
}

/* Sección de opciones de impresión */
.printing-section {
  padding: 80px 0;
  background: white;
}

.printing-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 40px;
  margin-top: 40px;
}

.option-card {
  background: #f8f9fa;
  border-radius: 20px;
  padding: 40px;
  text-align: center;
  border: 3px solid transparent;
  transition: all 0.3s ease;
  position: relative;
}

.option-card.featured {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: #667eea;
}

.option-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
}

.option-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

.option-card h3 {
  font-size: 1.5rem;
  margin-bottom: 15px;
  font-weight: 600;
}

.option-card ul {
  text-align: left;
  list-style: none;
  padding: 0;
  margin-top: 20px;
}

.option-card li {
  padding: 8px 0;
  position: relative;
  padding-left: 25px;
}

.option-card li::before {
  content: "✓";
  position: absolute;
  left: 0;
  color: #28a745;
  font-weight: bold;
}

.option-card.featured li::before {
  color: #fff;
}

.featured-badge {
  position: absolute;
  top: 20px;
  right: 20px;
  background: #ffc107;
  color: #333;
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: bold;
}

/* Sección de proceso diario */
.daily-process-section {
  padding: 80px 0;
  background: #f8f9fa;
}

.daily-timeline {
  max-width: 800px;
  margin: 0 auto;
}

.timeline-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 40px;
  position: relative;
}

.timeline-item:not(:last-child)::after {
  content: '';
  position: absolute;
  left: 30px;
  top: 70px;
  width: 2px;
  height: 60px;
  background: linear-gradient(to bottom, #667eea, #764ba2);
}

.timeline-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-right: 30px;
  flex-shrink: 0;
}

.timeline-content {
  background: white;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  flex: 1;
}

.timeline-content h3 {
  color: #2c3e50;
  margin-bottom: 10px;
  font-weight: 600;
}

.timeline-content p {
  color: #6c757d;
  line-height: 1.6;
  margin: 0;
}

/* Sección de escaneo */
.scanning-section {
  padding: 80px 0;
  background: white;
}

.scanning-process {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 60px;
  margin-top: 40px;
}

.scan-step {
  text-align: center;
  padding: 40px;
  background: #f8f9fa;
  border-radius: 20px;
  position: relative;
}

.scan-visual {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-bottom: 30px;
  position: relative;
}

.bus-icon, .school-icon, .qr-icon {
  font-size: 3rem;
  padding: 20px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.scan-line {
  width: 40px;
  height: 2px;
  background: linear-gradient(to right, #667eea, #764ba2);
  position: relative;
}

.scan-line::after {
  content: '';
  position: absolute;
  right: -5px;
  top: -3px;
  width: 0;
  height: 0;
  border-left: 8px solid #764ba2;
  border-top: 4px solid transparent;
  border-bottom: 4px solid transparent;
}

.scan-step h3 {
  color: #2c3e50;
  font-size: 1.5rem;
  margin-bottom: 15px;
  font-weight: 600;
}

.scan-step p {
  color: #6c757d;
  line-height: 1.6;
  margin-bottom: 20px;
}

.verification-badge {
  background: #28a745;
  color: white;
  padding: 10px 20px;
  border-radius: 25px;
  font-weight: bold;
  display: inline-block;
}

/* Sección de beneficios */
.benefits-section {
  padding: 80px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.benefits-section .section-title {
  color: white;
}

.benefits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-top: 40px;
}

.benefit-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 40px 30px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: transform 0.3s ease;
}

.benefit-card:hover {
  transform: translateY(-10px);
  background: rgba(255, 255, 255, 0.15);
}

.benefit-icon {
  font-size: 3rem;
  margin-bottom: 20px;
}

.benefit-card h3 {
  font-size: 1.3rem;
  margin-bottom: 15px;
  font-weight: 600;
}

.benefit-card p {
  opacity: 0.9;
  line-height: 1.6;
}

/* Responsive */
@media (max-width: 768px) {
  .banner-content h1 {
    font-size: 2.2rem;
  }
  
  .banner-content p {
    font-size: 1.1rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .steps-container {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .printing-options {
    grid-template-columns: 1fr;
    gap: 30px;
  }
  
  .scanning-process {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  
  .benefits-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .timeline-item {
    flex-direction: column;
    text-align: center;
  }
  
  .timeline-item::after {
    display: none;
  }
  
  .timeline-icon {
    margin: 0 auto 20px;
  }
  
  .scan-visual {
    flex-direction: column;
    gap: 15px;
  }
  
  .scan-line {
    transform: rotate(90deg);
  }
}

@media (max-width: 480px) {
  .banner {
    padding: 60px 20px;
  }
  
  .process-section,
  .printing-section,
  .daily-process-section,
  .scanning-section,
  .benefits-section {
    padding: 60px 0;
  }
  
  .step-card,
  .option-card,
  .scan-step,
  .benefit-card {
    padding: 30px 20px;
  }
}
</style>
