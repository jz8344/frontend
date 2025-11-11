<template>
  <footer class="footer-section">
    <div class="footer-inner">
      <div class="footer-brand">
        <h3 class="brand-name">Trailyn Safe</h3>
        <p class="brand-tagline">Protegiendo tu viaje digital y físico.</p>
      </div>
      <nav class="footer-nav" aria-label="Enlaces principales">
        <button type="button" class="footer-link as-button" @click="openModal('terminos')">Términos</button>
        <button type="button" class="footer-link as-button" @click="openModal('privacidad')">Privacidad & Datos</button>
        <button type="button" class="footer-link as-button" @click="openModal('arco')">Derechos ARCO</button>
        <a href="#" class="footer-link">Contacto</a>
      </nav>
      <div class="footer-contact">
        <p><strong>Email:</strong> <a href="mailto:info@trailynsafe.com" class="footer-link">info@trailynsafe.com</a></p>
      </div>
      <div class="footer-social" aria-label="Redes sociales">
        <a href="#" aria-label="LinkedIn" class="social-btn">in</a>
        <a href="#" aria-label="Twitter" class="social-btn">t</a>
        <a href="#" aria-label="GitHub" class="social-btn">gh</a>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; 2025 Trailyn Safe. Todos los derechos reservados.</p>
    </div>

    <transition name="fade-fast">
      <div v-if="modal" class="modal-overlay" @click.self="closeModal" @keyup.esc="closeModal" tabindex="-1">
        <div class="modal" role="dialog" :aria-labelledby="modal + '-title'" aria-modal="true">
          <div class="modal-header">
            <h4 class="modal-title" :id="modal + '-title'">
              <span v-if="modal==='terminos'">Términos y Condiciones</span>
              <span v-else-if="modal==='privacidad'">Privacidad, Uso y Protección de Datos (México)</span>
              <span v-else-if="modal==='arco'">Derechos ARCO (México)</span>
            </h4>
            <button class="close-btn" type="button" @click="closeModal" aria-label="Cerrar">✕</button>
          </div>
          <div class="modal-body">
            <template v-if="modal==='terminos'">
              <p class="disclaimer"><strong>Descargo:</strong> Este texto es informativo y no constituye asesoría legal definitiva. Ajustar con su departamento legal.</p>
              <h5>1. Aceptación</h5>
              <p>Al utilizar la plataforma aceptas estos Términos y cualquier actualización publicada. Si no estás de acuerdo, debes abstenerte de usar el servicio.</p>
              <h5>2. Servicio</h5>
              <p>Trailyn Safe ofrece herramientas de seguridad y seguimiento responsable. Nos reservamos el derecho de modificar o discontinuar funciones previa notificación razonable.</p>
              <h5>3. Cuenta y Seguridad</h5>
              <p>Eres responsable de la confidencialidad de tus credenciales y de todas las actividades asociadas a tu cuenta. Notifica inmediatamente cualquier uso no autorizado.</p>
              <h5>4. Uso Aceptable</h5>
              <ul>
                <li>No vulnerar la seguridad, integridad o disponibilidad del servicio.</li>
                <li>No extraer datos masivamente sin autorización expresa.</li>
                <li>No utilizar la plataforma para fines ilícitos o para vigilar indebidamente a terceros.</li>
              </ul>
              <h5>5. Propiedad Intelectual</h5>
              <p>La marca, logotipos y código pertenecen a Trailyn Safe o sus licenciantes. Se prohíbe su uso sin autorización escrita.</p>
              <h5>6. Limitación de Responsabilidad</h5>
              <p>El servicio se proporciona “tal cual”. En la medida permitida por la ley aplicable no garantizamos disponibilidad ininterrumpida ni ausencia de errores.</p>
              <h5>7. Ley Aplicable</h5>
              <p>Estos Términos se interpretan conforme a la legislación mexicana salvo que la normativa de protección al consumidor local disponga otra cosa.</p>
            </template>

            <template v-else-if="modal==='privacidad'">
              <p class="disclaimer"><strong>Nota:</strong> Resumen orientativo basado en la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP).</p>
              <h5>Finalidades del Tratamiento</h5>
              <p>Usamos tus datos para: (a) crear y administrar tu cuenta, (b) proveer funcionalidades de seguridad y seguimiento, (c) mejorar la experiencia y (d) cumplir obligaciones legales.</p>
              <h5>Datos que Podemos Tratar</h5>
              <ul>
                <li>Identificación básica (nombre, correo).</li>
                <li>Datos de sesión y metadatos técnicos.</li>
                <li>Geolocalización (solo cuando otorgas consentimiento explícito en la app).</li>
              </ul>
              <h5>Base de Legitimación</h5>
              <p>Consentimiento, ejecución de la relación contractual y cumplimiento de obligaciones legales.</p>
              <h5>Transferencias</h5>
              <p>Podemos usar proveedores (hosting, analítica) bajo contratos que protegen tus datos. No vendemos datos personales.</p>
              <h5>Conservación</h5>
              <p>Conservamos los datos el tiempo necesario para las finalidades y conforme a plazos legales o hasta revocación válida del consentimiento.</p>
              <h5>Medidas de Seguridad</h5>
              <p>Aplicamos controles técnicos y organizativos: cifrado en tránsito (TLS), control de acceso, registro de eventos y segmentación lógica.</p>
              <h5>Cookies</h5>
              <p>Utilizamos cookies esenciales y analíticas. Puedes configurar tu navegador para limitar o rechazar cookies no esenciales.</p>
              <h5>Ejercicio de Derechos</h5>
              <p>Consulta la sección Derechos ARCO para conocer cómo ejercer tus derechos de acceso, rectificación, cancelación y oposición.</p>
            </template>

            <template v-else-if="modal==='arco'">
              <p class="disclaimer"><strong>Contexto:</strong> Derechos ARCO conforme a la LFPDPPP en México.</p>
              <h5>¿Qué son los Derechos ARCO?</h5>
              <p>Son los derechos de Acceso, Rectificación, Cancelación y Oposición respecto a tus datos personales.</p>
              <h5>1. Acceso</h5>
              <p>Puedes solicitar confirmación de si tratamos tus datos y recibir copia en formato legible.</p>
              <h5>2. Rectificación</h5>
              <p>Si tus datos son inexactos o incompletos, puedes pedir su corrección adjuntando documentación soporte.</p>
              <h5>3. Cancelación</h5>
              <p>Permite solicitar la supresión cuando el tratamiento no sea necesario, salvo excepciones legales (obligaciones fiscales, seguridad, etc.).</p>
              <h5>4. Oposición</h5>
              <p>Puedes oponerte al tratamiento por causa legítima o revocar tu consentimiento para finalidades no esenciales.</p>
              <h5>Procedimiento</h5>
              <ol>
                <li>Envía solicitud a: <a href="mailto:privacidad@trailynsafe.com" class="inline-link">privacidad@trailynsafe.com</a></li>
                <li>Incluye: nombre completo, medio de respuesta, descripción clara, datos o periodos solicitados y copia de identificación oficial.</li>
                <li>Plazos: Acuse de recepción (5 días hábiles). Respuesta sustantiva (20 días). Ejecución (15 días) salvo prórroga justificada.</li>
              </ol>
              <h5>Revocación de Consentimiento</h5>
              <p>Puedes revocar en cualquier momento salvo que exista obligación legal de conservar los datos.</p>
              <h5>Autoridad</h5>
              <p>Si consideras vulnerados tus derechos puedes acudir al INAI (Instituto Nacional de Transparencia, Acceso a la Información y Protección de Datos Personales).</p>
            </template>
          </div>
          <div class="modal-footer">
            <button class="primary-btn" type="button" @click="closeModal">Cerrar</button>
          </div>
        </div>
      </div>
    </transition>
  </footer>
</template>

<script setup>
import { ref, watch } from 'vue';
const modal = ref(null); 
function openModal(name){ modal.value = name; }
function closeModal(){ modal.value = null; }
watch(modal, (val)=> { document.documentElement.style.overflow = val ? 'hidden' : ''; });
</script>

<style scoped>
.footer-section {
  --c-primary: #1976d2;
  --c-primary-dark: #0d47a1;
  --c-primary-mid: #1565c0;
  --c-primary-light: #bbdefb;
  --c-text: #ffffff;
  --c-text-muted: #e3f2fd;
  background: linear-gradient(135deg, var(--c-primary) 0%, var(--c-primary-mid) 55%, var(--c-primary-dark) 100%);
  color: var(--c-text);
  padding: 48px 24px 16px;
  font-size: 0.95rem;
  position: relative;
  overflow: hidden;
}
.footer-section::before, .footer-section::after {
  content: "";
  position: absolute;
  border-radius: 50%;
  background: rgba(255,255,255,0.05);
  filter: blur(2px);
  animation: float 14s linear infinite;
}
.footer-section::before { width: 420px; height: 420px; top: -160px; right: -120px; }
.footer-section::after { width: 300px; height: 300px; bottom: -140px; left: -100px; animation-duration: 18s; }
@keyframes float { 0% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(18px) rotate(120deg); } 100% { transform: translateY(0) rotate(360deg); } }
.footer-inner {
  max-width: 1180px;
  margin: 0 auto;
  display: grid;
  gap: 32px;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  position: relative;
  z-index: 1;
}
.footer-brand .brand-name {
  margin: 0 0 6px;
  letter-spacing: .5px;
  font-size: 1.35rem;
  font-weight: 600;
}
.brand-tagline { margin: 0; color: var(--c-text-muted); line-height: 1.3; }
.footer-nav { display: flex; flex-direction: column; gap: 6px; }
.footer-nav .footer-link { font-weight: 500; }
.footer-contact p { margin: 0; line-height: 1.5; }
.footer-link { color: var(--c-text-muted); text-decoration: none; position: relative; transition: color .25s ease; }
.footer-link::after { content: ""; position: absolute; left: 0; bottom: -2px; width: 0; height: 2px; background: var(--c-primary-light); transition: width .3s ease; border-radius: 2px; }
.footer-link:hover, .footer-link:focus { color: #fff; }
.footer-link:hover::after, .footer-link:focus::after { width: 100%; }
.footer-social { display: flex; gap: 10px; align-items: center; }
.social-btn { width: 38px; height: 38px; display: inline-flex; align-items: center; justify-content: center; border-radius: 10px; background: rgba(255,255,255,0.08); color: var(--c-text); font-weight: 600; font-size: .85rem; text-decoration: none; letter-spacing: .5px; position: relative; overflow: hidden; transition: background .3s ease, transform .3s ease; }
.social-btn::before { content: ""; position: absolute; inset: 0; background: linear-gradient(145deg, rgba(255,255,255,0.15), transparent 70%); opacity: 0; transition: opacity .4s ease; }
.social-btn:hover::before { opacity: 1; }
.social-btn:hover { background: var(--c-primary-light); color: var(--c-primary-dark); transform: translateY(-4px); }
.social-btn:active { transform: translateY(-1px) scale(.96); }
.footer-bottom { margin-top: 42px; padding-top: 18px; border-top: 1px solid rgba(255,255,255,0.18); text-align: center; font-size: 0.8rem; color: var(--c-text-muted); position: relative; z-index: 1; }
.footer-bottom p { margin: 0; }
.as-button { background: none; border: none; padding: 0; cursor: pointer; font: inherit; text-align: left; }
.as-button:focus { outline: 2px solid var(--c-primary-light); outline-offset: 2px; }
@media (max-width: 640px) { 
  .footer-section { padding: 40px 20px 14px; }
  .footer-inner { gap: 28px; }
  .footer-brand .brand-name { font-size: 1.25rem; }
  .footer-bottom { margin-top: 36px; }
}
.fade-fast-enter-active, .fade-fast-leave-active { transition: opacity .18s ease; }
.fade-fast-enter-from, .fade-fast-leave-to { opacity: 0; }

.modal-overlay {
  position: fixed; inset: 0; display: flex; justify-content: center; align-items: flex-start;
  padding: 60px 20px 40px; background: rgba(10,25,41,0.6); backdrop-filter: blur(6px);
  z-index: 1200; overflow-y: auto; -webkit-overflow-scrolling: touch;
}
.modal {
  background: #0f2744; color: #fff; border-radius: 18px; width: min(860px, 100%);
  box-shadow: 0 10px 40px -8px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06);
  display: flex; flex-direction: column; max-height: 100%;
  animation: pop-in .28s cubic-bezier(.4,.8,.4,1);
}
@keyframes pop-in { 0% { transform: translateY(14px) scale(.96); opacity: 0;} 100% { transform: translateY(0) scale(1); opacity:1;} }
.modal-header { padding: 20px 26px 14px; display: flex; align-items: flex-start; gap: 14px; }
.modal-title { margin: 0; font-size: 1.15rem; font-weight: 600; letter-spacing: .3px; }
.close-btn { background: none; border: none; color: #fff; font-size: 1rem; cursor: pointer; line-height: 1; padding: 6px 8px; border-radius: 8px; }
.close-btn:hover, .close-btn:focus { background: rgba(255,255,255,0.08); }
.modal-body { padding: 0 26px 10px; overflow-y: auto; scrollbar-width: thin; max-height: calc(80vh - 140px); }
.modal-body::-webkit-scrollbar { width: 8px; }
.modal-body::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); border-radius: 10px; }
.modal-body::-webkit-scrollbar-thumb { background: linear-gradient(var(--c-primary-mid), var(--c-primary-dark)); border-radius: 10px; }
.modal-body h5 { margin: 18px 0 6px; font-size: .95rem; letter-spacing: .4px; text-transform: uppercase; font-weight: 600; color: var(--c-primary-light); }
.modal-body p, .modal-body li { font-size: .85rem; line-height: 1.45; }
.modal-body ul, .modal-body ol { padding-left: 18px; margin: 6px 0 10px; }
.modal-footer { display: flex; justify-content: flex-end; padding: 10px 24px 22px; gap: 12px; }
.primary-btn { background: linear-gradient(90deg, var(--c-primary) 0%, var(--c-primary-mid) 50%, var(--c-primary-dark)); color: #fff; border: none; padding: 10px 20px; border-radius: 10px; font-size: .85rem; font-weight: 600; cursor: pointer; letter-spacing: .5px; position: relative; }
.primary-btn::after { content: ""; position: absolute; inset: 0; border-radius: inherit; box-shadow: 0 0 0 0 rgba(255,255,255,0.4); opacity: 0; transition: box-shadow .4s ease, opacity .4s ease; }
.primary-btn:hover { filter: brightness(1.08); }
.primary-btn:hover::after { box-shadow: 0 0 0 3px rgba(255,255,255,0.25); opacity: 1; }
.primary-btn:active { transform: translateY(1px); }
.disclaimer { background: rgba(255,255,255,0.06); padding: 10px 14px; border-left: 4px solid var(--c-primary-light); border-radius: 10px; font-size: .75rem; line-height: 1.35; }
.inline-link { color: var(--c-primary-light); text-decoration: underline; }
.inline-link:hover { color: #fff; }

@media (max-width: 640px) {
  .modal { border-radius: 16px; }
  .modal-header { padding: 18px 20px 10px; }
  .modal-body { padding: 0 20px 8px; }
  .modal-footer { padding: 10px 18px 20px; }
}
</style>