<template>
  
  <div 
    class="modal fade" 
    id="welcomeModal" 
    tabindex="-1" 
    aria-labelledby="welcomeModalLabel" 
    aria-hidden="true"
    data-bs-backdrop="static" 
    data-bs-keyboard="false"
  >
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content border-0 shadow-lg">
        <div class="modal-body p-0">
          
          <div v-if="currentStep === 'welcome'" class="text-center p-5">
            <div class="mb-4">
              <div class="d-inline-flex align-items-center justify-content-center rounded-circle mb-3" 
                   style="width: 80px; height: 80px; background: linear-gradient(135deg, #009FE3, #3582ff);">
                <i class="bi bi-house-heart text-white fs-1"></i>
              </div>
            </div>
            <h2 class="fw-bold text-primary mb-3">¡Bienvenido a TrailynSafe!</h2>
            <p class="lead text-muted mb-4">
              Nos alegra tenerte en nuestra familia. Para brindarte la mejor experiencia y garantizar la seguridad de tus hijos, necesitamos que registres a los estudiantes que utilizarán nuestro servicio de transporte escolar.
            </p>
            <p class="text-muted mb-4">
              Este proceso es rápido y solo lo harás una vez. Una vez registrados, podrás monitorear en tiempo real la ubicación del transporte y recibir notificaciones importantes.
            </p>
            <button 
              @click="nextStep" 
              class="btn btn-lg px-5 text-white fw-medium"
              style="background: linear-gradient(135deg, #009FE3, #3582ff); border: none;"
            >
              <i class="bi bi-person-plus me-2"></i>
              Registrar mis hijos
            </button>
          </div>

          
          <div v-if="currentStep === 'count'" class="p-5">
            <div class="text-center mb-4">
              <h3 class="fw-bold text-primary mb-3">¿Cuántos hijos vas a registrar?</h3>
              <p class="text-muted">Selecciona la cantidad de estudiantes que utilizarán el servicio</p>
            </div>
            
            <div class="row justify-content-center">
              <div class="col-md-6">
                <label class="form-label fw-medium">Cantidad de hijos</label>
                <select 
                  v-model="childrenCount" 
                  class="form-select form-select-lg"
                  @change="initializeForms"
                >
                  <option value="">Selecciona una opción</option>
                  <option v-for="i in 5" :key="i" :value="i">{{ i }} {{ i === 1 ? 'hijo' : 'hijos' }}</option>
                </select>
                
                <div class="text-center mt-4">
                  <button 
                    @click="previousStep" 
                    class="btn btn-outline-secondary me-3"
                  >
                    <i class="bi bi-arrow-left me-1"></i>
                    Atrás
                  </button>
                  <button 
                    @click="nextStep" 
                    :disabled="!childrenCount"
                    class="btn text-white fw-medium"
                    style="background: linear-gradient(135deg, #009FE3, #3582ff); border: none;"
                  >
                    Continuar
                    <i class="bi bi-arrow-right ms-1"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          
          <div v-if="currentStep === 'forms'" class="p-5">
            <div class="text-center mb-4">
              <h3 class="fw-bold text-primary mb-3">Registro de estudiantes</h3>
              <p class="text-muted">
                Completa la información de {{ childrenCount === 1 ? 'tu hijo' : 'tus hijos' }}
                <span class="badge bg-primary ms-1">{{ currentFormIndex + 1 }} de {{ childrenCount }}</span>
              </p>
            </div>

            <div class="row justify-content-center">
              <div class="col-md-8">
                <form @submit.prevent="submitCurrentForm" novalidate>
                  
                  <div class="mb-3">
                    <label class="form-label fw-medium">
                      Nombre completo
                      <span class="text-danger">*</span>
                    </label>
                    <input
                      v-model="childrenForms[currentFormIndex].nombre"
                      @blur="validateName(currentFormIndex)"
                      type="text"
                      class="form-control form-control-lg"
                      :class="{ 'is-invalid': formErrors[currentFormIndex]?.nombre }"
                      placeholder="Ingresa el nombre completo del estudiante"
                    >
                    <div v-if="formErrors[currentFormIndex]?.nombre" class="invalid-feedback">
                      {{ formErrors[currentFormIndex].nombre }}
                    </div>
                  </div>

                  
                  <div class="mb-3">
                    <label class="form-label fw-medium">
                      Grado
                      <span class="text-danger">*</span>
                    </label>
                    <select 
                      v-model="childrenForms[currentFormIndex].grado"
                      class="form-select form-select-lg"
                      :class="{ 'is-invalid': formErrors[currentFormIndex]?.grado }"
                    >
                      <option value="">Selecciona el grado</option>
                      <option v-for="i in 8" :key="i" :value="String(i)">{{ i }}° Grado</option>
                    </select>
                    <div v-if="formErrors[currentFormIndex]?.grado" class="invalid-feedback">
                      {{ formErrors[currentFormIndex].grado }}
                    </div>
                  </div>

                  
                  <div class="mb-3">
                    <label class="form-label fw-medium">
                      Grupo
                      <span class="text-danger">*</span>
                    </label>
                    <select 
                      v-model="childrenForms[currentFormIndex].grupo"
                      class="form-select form-select-lg"
                      :class="{ 'is-invalid': formErrors[currentFormIndex]?.grupo }"
                    >
                      <option value="">Selecciona el grupo</option>
                      <option v-for="letter in ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K']" 
                              :key="letter" 
                              :value="letter">
                        Grupo {{ letter }}
                      </option>
                    </select>
                    <div v-if="formErrors[currentFormIndex]?.grupo" class="invalid-feedback">
                      {{ formErrors[currentFormIndex].grupo }}
                    </div>
                  </div>

                  
                  <div class="mb-4">
                    <label class="form-label fw-medium">
                      Escuela
                      <span class="text-danger">*</span>
                    </label>
                    <select 
                      v-model="childrenForms[currentFormIndex].escuela"
                      class="form-select form-select-lg"
                      :class="{ 'is-invalid': formErrors[currentFormIndex]?.escuela }"
                    >
                      <option value="">Selecciona la escuela</option>
                      <option value="Escuela Primaria Benito Juárez">Escuela Primaria Benito Juárez</option>
                      <option value="Instituto Educativo Miguel Hidalgo">Instituto Educativo Miguel Hidalgo</option>
                      <option value="Colegio José María Morelos">Colegio José María Morelos</option>
                      <option value="Escuela Primaria Guadalupe Victoria">Escuela Primaria Guadalupe Victoria</option>
                      <option value="Instituto Tecnológico Regional">Instituto Tecnológico Regional</option>
                      <option value="Escuela Primaria Emiliano Zapata">Escuela Primaria Emiliano Zapata</option>
                    </select>
                    <div v-if="formErrors[currentFormIndex]?.escuela" class="invalid-feedback">
                      {{ formErrors[currentFormIndex].escuela }}
                    </div>
                  </div>

                  
                  <div class="row mb-4">
                    <div class="col-md-6 mb-3 mb-md-0">
                      <label class="form-label fw-medium">Teléfono de emergencia 1</label>
                      <input type="tel" maxlength="25" class="form-control form-control-lg" v-model="childrenForms[currentFormIndex].emergencia_1" placeholder="Ej. 5551234567" />
                    </div>
                    <div class="col-md-6">
                      <label class="form-label fw-medium">Teléfono de emergencia 2</label>
                      <input type="tel" maxlength="25" class="form-control form-control-lg" v-model="childrenForms[currentFormIndex].emergencia_2" placeholder="Opcional" />
                    </div>
                  </div>

                  
                  <div class="mb-4" v-if="qrPreviews[currentFormIndex]">
                    <label class="form-label fw-medium d-flex justify-content-between align-items-center">
                      Código QR generado
                      <button type="button" class="btn btn-sm btn-outline-primary" @click="downloadQR(currentFormIndex)">
                        <i class="bi bi-download me-1"></i> Descargar
                      </button>
                    </label>
                    <div class="p-3 border rounded text-center bg-light">
                      <img :src="qrPreviews[currentFormIndex]" :alt="'QR Hijo '+(currentFormIndex+1)" style="max-width:180px;" />
                      <div class="small text-muted mt-2">Incluye nombre, grado, grupo y escuela.</div>
                    </div>
                  </div>

                  
                  <div class="d-flex justify-content-between">
                    <button 
                      type="button"
                      @click="previousForm" 
                      :disabled="currentFormIndex === 0"
                      class="btn btn-outline-secondary"
                    >
                      <i class="bi bi-arrow-left me-1"></i>
                      {{ currentFormIndex === 0 ? 'Atrás' : 'Anterior hijo' }}
                    </button>
                    
                    <button 
                      type="submit"
                      :disabled="submitting"
                      class="btn text-white fw-medium"
                      style="background: linear-gradient(135deg, #009FE3, #3582ff); border: none;"
                    >
                      <span v-if="submitting" class="d-flex align-items-center">
                        <div class="spinner-border spinner-border-sm me-2" role="status"></div>
                        Registrando...
                      </span>
                      <span v-else>
                        {{ currentFormIndex === childrenCount - 1 ? 'Finalizar registro' : 'Siguiente hijo' }}
                        <i class="bi bi-arrow-right ms-1"></i>
                      </span>
                    </button>
                  </div>
                  <div v-if="formErrors[currentFormIndex]?._general" class="alert alert-danger mt-3">
                    {{ formErrors[currentFormIndex]._general }}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  
  <div class="modal fade" :class="{show: currentStep==='explain'}" :style="currentStep==='explain'? 'display:block;' : ''" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content border-0 shadow-lg">
        <div class="modal-body p-5">
          <div class="text-center mb-4">
            <div class="d-inline-flex align-items-center justify-content-center rounded-circle mb-3" style="width:80px;height:80px;background:linear-gradient(135deg,#009FE3,#3582ff);">
              <i class="bi bi-bus-front text-white fs-1"></i>
            </div>
            <h2 class="fw-bold text-primary mb-3">Credenciales digitales listas</h2>
            <p class="lead text-muted">Tus hijos ya cuentan con su código QR único.</p>
          </div>
          <div class="mb-4">
            <p class="mb-3">Este código QR será el pase seguro para abordar el transporte escolar TrailynSafe. Cada vez que tu hijo suba o baje del autobús, el conductor escaneará el QR para:</p>
            <ul class="list-unstyled ms-2">
              <li class="mb-2"><i class="bi bi-check-circle text-success me-2"></i>Confirmar su ingreso al transporte.</li>
              <li class="mb-2"><i class="bi bi-check-circle text-success me-2"></i>Registrar su salida de manera segura.</li>
              <li class="mb-2"><i class="bi bi-check-circle text-success me-2"></i>Generar notificaciones en tu panel y futuras alertas.</li>
            </ul>
            <p class="mb-3">Para que esto funcione de forma cómoda, recomendamos imprimir el gafete plastificado que tu hijo podrá portar en su mochila o uniforme.</p>
            <p class="fw-medium">A continuación puedes solicitar a la escuela la impresión y además descargaremos una versión digital de respaldo para ti.</p>
          </div>
          <div class="text-center">
            <button @click="solicitarImpresion" class="btn btn-lg text-white fw-medium px-5" style="background:linear-gradient(135deg,#009FE3,#3582ff);border:none;" :disabled="requestingPrint">
              <span v-if="requestingPrint" class="spinner-border spinner-border-sm me-2"></span>
              <i class="bi bi-printer me-2"></i>Solicitar impresión y descargar
            </button>
            <div v-if="printRequestMessage" class="alert alert-info mt-4">{{ printRequestMessage }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- Modal de Celebración -->
  <div 
    class="modal fade" 
    id="celebrationModal" 
    tabindex="-1" 
    aria-labelledby="celebrationModalLabel" 
    aria-hidden="true"
  >
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content border-0 shadow-lg bg-success text-white">
        <div class="modal-body text-center p-5 position-relative">
          
          <div class="confetti-container">
            <div class="confetti" v-for="i in 50" :key="i"></div>
          </div>
          
          <div class="mb-4">
            <i class="bi bi-check-circle fs-1 mb-3 d-block"></i>
          </div>
          <h2 class="fw-bold mb-3">¡Felicitaciones!</h2>
          <p class="lead mb-4">
            Has completado exitosamente el registro de {{ childrenCount === 1 ? 'tu hijo' : 'tus hijos' }}.
          </p>
          <p class="mb-4">
            Ahora puedes disfrutar de todas las funciones de TrailynSafe para monitorear el transporte escolar de manera segura.
          </p>
          <div class="d-flex flex-column flex-md-row justify-content-center gap-3">
            <button 
              @click="solicitarImpresion" 
              class="btn btn-outline-light btn-lg fw-medium"
              :disabled="requestingPrint"
            >
              <span v-if="requestingPrint" class="spinner-border spinner-border-sm me-2"></span>
              <i class="bi bi-printer me-2"></i>
              Solicitar impresión a la escuela
            </button>
            <button 
              @click="closeCelebration" 
              class="btn btn-light btn-lg fw-medium"
            >
              <i class="bi bi-house me-2"></i>
              Continuar al inicio
            </button>
          </div>
          <div v-if="printRequestMessage" class="alert alert-success mt-4">
            {{ printRequestMessage }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Modal } from 'bootstrap'
import http from '@/config/api.js'
import QRCode from 'qrcode'

// Estados reactivos
const currentStep = ref('welcome') // welcome -> count -> forms -> explain -> celebration
const childrenCount = ref('')
const currentFormIndex = ref(0)
const submitting = ref(false)
const childrenForms = ref([])
const formErrors = ref([])
const qrPreviews = ref([])
const requestingPrint = ref(false)
const printRequestMessage = ref('')

// Modales
let welcomeModal = null
let celebrationModal = null
const router = useRouter()

// Inicializar formularios según la cantidad de hijos
function initializeForms() {
  const count = parseInt(childrenCount.value)
  childrenForms.value = []
  formErrors.value = []
  qrPreviews.value = []
  
  for (let i = 0; i < count; i++) {
    childrenForms.value.push({
      nombre: '',
      grado: '',
      grupo: '',
      escuela: '',
      emergencia_1: '',
      emergencia_2: '',
      codigo_qr: generateQRCode(),
      _generated_id: null
    })
    formErrors.value.push({})
    qrPreviews.value.push('')
  }
}

// Generar código QR único
function generateQRCode() {
  return 'QR' + Date.now() + Math.random().toString(36).substr(2, 9)
}

// Validaciones
function validateName(index) {
  const nombre = childrenForms.value[index].nombre
  
  if (!nombre) {
    formErrors.value[index].nombre = 'El nombre es requerido'
    return false
  }
  
  if (nombre.length < 2) {
    formErrors.value[index].nombre = 'El nombre debe tener al menos 2 caracteres'
    return false
  }
  
  // Solo letras y espacios
  const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/
  if (!nameRegex.test(nombre)) {
    formErrors.value[index].nombre = 'El nombre solo puede contener letras'
    return false
  }
  
  // Capitalizar nombre
  childrenForms.value[index].nombre = nombre.replace(/\b\w/g, l => l.toUpperCase())
  formErrors.value[index].nombre = ''
  return true
}

function validateCurrentForm() {
  const index = currentFormIndex.value
  const form = childrenForms.value[index]
  let isValid = true
  
  // Limpiar errores previos
  formErrors.value[index] = {}
  
  // Validar nombre
  if (!validateName(index)) {
    isValid = false
  }
  
  // Validar grado
  if (!form.grado) {
    formErrors.value[index].grado = 'El grado es requerido'
    isValid = false
  }
  
  // Validar grupo
  if (!form.grupo) {
    formErrors.value[index].grupo = 'El grupo es requerido'
    isValid = false
  }
  
  // Validar escuela
  if (!form.escuela) {
    formErrors.value[index].escuela = 'La escuela es requerida'
    isValid = false
  }
  
  return isValid
}

// Navegación entre pasos
function nextStep() {
  if (currentStep.value === 'welcome') {
    currentStep.value = 'count'
  } else if (currentStep.value === 'count' && childrenCount.value) {
    currentStep.value = 'forms'
  } else if (currentStep.value === 'explain') {
    currentStep.value = 'celebration'
  }
}

function previousStep() {
  if (currentStep.value === 'count') {
    currentStep.value = 'welcome'
  } else if (currentStep.value === 'forms') {
    currentStep.value = 'count'
  } else if (currentStep.value === 'explain') {
    currentStep.value = 'forms'
  }
}

// Navegación entre formularios
function previousForm() {
  if (currentFormIndex.value === 0) {
    currentStep.value = 'count'
  } else {
    currentFormIndex.value--
  }
}

// Enviar formulario actual
async function submitCurrentForm() {
  console.debug('[WelcomeModal] Submit hijo índice', currentFormIndex.value)
  if (!validateCurrentForm()) {
    console.warn('[WelcomeModal] Validación fallida', formErrors.value[currentFormIndex.value])
    return
  }

  submitting.value = true
  const formData = { ...childrenForms.value[currentFormIndex.value] }
  // Asegurar que grado se envía como string para pasar validación backend (string|max:2)
  if (formData.grado !== undefined && formData.grado !== null) {
    formData.grado = String(formData.grado)
  }
  console.debug('[WelcomeModal] Payload /hijos', formData)

  try {
  const resp = await http.post('/hijos', formData)
  console.debug('[WelcomeModal] Respuesta /hijos', resp.data)
  childrenForms.value[currentFormIndex.value]._generated_id = resp.data.id
  // Generar QR real para este hijo (usando datos esenciales)
  await generateRealQR(currentFormIndex.value)

    if (currentFormIndex.value === childrenCount.value - 1) {
      try {
        const upd = await http.post('/update-have-son')
        console.debug('[WelcomeModal] /update-have-son', upd.data)
      } catch (e) {
        console.warn('[WelcomeModal] Error en /update-have-son', e.response?.data || e.message)
      }
  currentStep.value = 'explain'
    } else {
      currentFormIndex.value++
      console.debug('[WelcomeModal] Avanza a formulario', currentFormIndex.value)
    }
  } catch (error) {
    console.error('[WelcomeModal] Error /hijos', error.response?.data || error.message)
    if (!formErrors.value[currentFormIndex.value]) formErrors.value[currentFormIndex.value] = {}
    if (error.response?.status === 422) {
      const serverErrors = error.response.data
      Object.keys(serverErrors).forEach(field => {
        formErrors.value[currentFormIndex.value][field] = Array.isArray(serverErrors[field]) ? serverErrors[field][0] : serverErrors[field]
      })
    } else if (error.response?.status === 401) {
      formErrors.value[currentFormIndex.value]._general = 'Sesión expirada. Inicia sesión nuevamente.'
    } else {
      formErrors.value[currentFormIndex.value]._general = 'Error inesperado. Intenta otra vez.'
    }
  } finally {
    submitting.value = false
  }
}

// Mostrar celebración
function showCelebration() {
  // Cambiar paso para ocultar el overlay 'explain'
  currentStep.value = 'celebration'
  try {
    welcomeModal?.hide()
  } catch (e) {}
  celebrationModal = new Modal(document.getElementById('celebrationModal'))
  celebrationModal.show()
}

// Cerrar celebración
function closeCelebration() {
  try { celebrationModal?.hide() } catch(e) {}
  // Limpiar flag para no volver a mostrar
  try { localStorage.removeItem('showWelcomeModal') } catch(e) {}
  // Navegar y refrescar
  router.push('/').then(()=>{
    setTimeout(()=> window.location.reload(), 150)
  })
}

// Función para mostrar el modal desde el componente padre
function show() {
  welcomeModal = new Modal(document.getElementById('welcomeModal'))
  welcomeModal.show()
}

// Generar QR real basado en datos del formulario
async function generateRealQR(index) {
  const data = childrenForms.value[index]
  const payload = {
    nombre: data.nombre,
    grado: data.grado,
    grupo: data.grupo,
    escuela: data.escuela,
    codigo_qr: data.codigo_qr
  }
  try {
    const url = await QRCode.toDataURL(JSON.stringify(payload), { width: 300, margin: 2 })
    qrPreviews.value[index] = url
  } catch (e) {
    console.error('Error generando QR', e)
  }
}

function downloadQR(index) {
  const url = qrPreviews.value[index]
  if (!url) return
  const link = document.createElement('a')
  link.href = url
  link.download = `hijo_${index + 1}_qr.png`
  link.click()
}

async function solicitarImpresion() {
  requestingPrint.value = true
  printRequestMessage.value = ''
  try {
    const ids = childrenForms.value.map(c => c._generated_id).filter(Boolean)
    const r = await http.post('/solicitar-impresion-qrs', { hijos: ids })
    printRequestMessage.value = 'Solicitud enviada. Descargando credenciales...'
    await generarYDescargarBatch()
    // Tras descarga, pasar a celebración
  setTimeout(() => { showCelebration() }, 800)
  } catch (e) {
    printRequestMessage.value = e.response?.data?.message || 'No se pudo enviar la solicitud.'
  } finally {
    requestingPrint.value = false
  }
}

async function generarYDescargarBatch() {
  for (let i = 0; i < childrenForms.value.length; i++) {
    if (!qrPreviews.value[i]) await generateRealQR(i)
    await descargarCredencialCanvas(i)
  }
}

async function descargarCredencialCanvas(index) {
  const data = childrenForms.value[index]
  const qr = qrPreviews.value[index]
  if (!qr) return
  const canvas = document.createElement('canvas')
  canvas.width = 800
  canvas.height = 500
  const ctx = canvas.getContext('2d')
  // Fondo
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0,0,canvas.width,canvas.height)
  // Borde
  ctx.strokeStyle = '#009FE3'
  ctx.lineWidth = 8
  ctx.strokeRect(10,10,canvas.width-20,canvas.height-20)
  // Título
  ctx.fillStyle = '#009FE3'
  ctx.font = 'bold 36px Arial'
  ctx.fillText('Credencial Transporte Escolar', 40, 70)
  // Datos
  ctx.fillStyle = '#222'
  ctx.font = 'bold 30px Arial'
  ctx.fillText(data.nombre || 'Nombre', 40, 130)
  ctx.font = '24px Arial'
  ctx.fillText(`Grado: ${data.grado || '-'}`, 40, 180)
  ctx.fillText(`Grupo: ${data.grupo || '-'}`, 40, 220)
  ctx.fillText(`Escuela: ${(data.escuela||'').slice(0,40)}`, 40, 260)
  ctx.fillText(`Emergencia 1: ${data.emergencia_1 || '-'}`, 40, 300)
  ctx.fillText(`Emergencia 2: ${data.emergencia_2 || '-'}`, 40, 340)
  ctx.fillStyle = '#555'
  ctx.font = '20px Arial'
  ctx.fillText('Use este código para abordar y validar entradas/salidas', 40, 390)
  // QR
  const qrImg = new Image()
  qrImg.src = qr
  await new Promise(res => { qrImg.onload = res })
  ctx.drawImage(qrImg, 520, 130, 240, 240)
  // Footer
  ctx.fillStyle = '#009FE3'
  ctx.font = 'bold 20px Arial'
  ctx.fillText('TrailynSafe', 40, 450)
  const link = document.createElement('a')
  link.href = canvas.toDataURL('image/png')
  link.download = `credencial_${index+1}.png`
  link.click()
}

// Exponer función para uso externo
defineExpose({ show })
</script>

<style scoped>
/* Animación de confetti */
.confetti-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
}

.confetti {
  position: absolute;
  width: 10px;
  height: 10px;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57);
  animation: confetti-fall 3s linear infinite;
}

.confetti:nth-child(odd) {
  animation-delay: 0.5s;
  background: linear-gradient(45deg, #ff9ff3, #54a0ff, #5f27cd, #00d2d3, #ff9f43);
}

.confetti:nth-child(even) {
  animation-delay: 1s;
  background: linear-gradient(45deg, #a55eea, #26de81, #fd79a8, #fdcb6e, #6c5ce7);
}

@keyframes confetti-fall {
  0% {
    transform: translateY(-100vh) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(720deg);
    opacity: 0;
  }
}

/* Distribuir confetti aleatoriamente */
.confetti:nth-child(1) { left: 10%; animation-delay: 0s; }
.confetti:nth-child(2) { left: 20%; animation-delay: 0.2s; }
.confetti:nth-child(3) { left: 30%; animation-delay: 0.4s; }
.confetti:nth-child(4) { left: 40%; animation-delay: 0.6s; }
.confetti:nth-child(5) { left: 50%; animation-delay: 0.8s; }
.confetti:nth-child(6) { left: 60%; animation-delay: 1s; }
.confetti:nth-child(7) { left: 70%; animation-delay: 1.2s; }
.confetti:nth-child(8) { left: 80%; animation-delay: 1.4s; }
.confetti:nth-child(9) { left: 90%; animation-delay: 1.6s; }
.confetti:nth-child(10) { left: 5%; animation-delay: 1.8s; }

/* Estilos del modal */
.modal-content {
  border-radius: 20px;
}

.form-control:focus,
.form-select:focus {
  border-color: #009FE3;
  box-shadow: 0 0 0 0.2rem rgba(0, 159, 227, 0.25);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Animaciones suaves */
.modal-body > div {
  transition: all 0.3s ease;
}
</style>
