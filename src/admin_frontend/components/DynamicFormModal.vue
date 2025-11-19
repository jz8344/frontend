<template>
  <div class="modal d-block" tabindex="-1" style="background: rgba(0,0,0,0.5);">
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title d-flex align-items-center">
            <i :class="config.icon" class="me-2"></i>
            {{ isEditing ? `Editar ${config.singular}` : `Nuevo ${config.singular}` }}
          </h5>
          <button type="button" class="btn-close" @click="$emit('close')"></button>
        </div>
        
        <form @submit.prevent="handleSubmit">
          <div class="modal-body">
            <div v-if="error" class="alert alert-danger d-flex align-items-center">
              <i class="bi bi-exclamation-triangle me-2"></i>
              {{ error }}
            </div>
            
            <div class="row g-3">
              <div 
                v-for="field in visibleFields" 
                :key="field.key"
                :class="field.colClass || 'col-md-6'"
              >
                <label class="form-label fw-medium">
                  <i v-if="field.icon" :class="field.icon" class="me-1"></i>
                  {{ field.label }}
                  <span v-if="field.required" class="text-danger">*</span>
                </label>
                
                <!-- Text Input -->
                <input
                  v-if="field.type === 'text' || field.type === 'email' || field.type === 'tel'"
                  v-model="form[field.key]"
                  :type="field.type"
                  class="form-control"
                  :class="{ 'is-invalid': errors[field.key] }"
                  :placeholder="field.placeholder"
                  :required="field.required"
                  :pattern="field.pattern"
                  :minlength="field.minlength"
                  :maxlength="field.maxlength"
                  :readonly="field.readonly || (isEditing && field.editMode === 'readonly')"
                  :disabled="field.readonly || (isEditing && field.editMode === 'readonly')"
                  @input="validateField(field, $event)"
                />
                
                <!-- Number Input -->
                <input
                  v-else-if="field.type === 'number'"
                  v-model.number="form[field.key]"
                  type="number"
                  class="form-control"
                  :class="{ 'is-invalid': errors[field.key] }"
                  :placeholder="field.placeholder"
                  :min="field.min"
                  :max="field.max"
                  :required="field.required"
                />
                
                <!-- Password Input -->
                <div v-else-if="field.type === 'password'" class="input-group">
                  <input
                    v-model="form[field.key]"
                    :type="showPassword[field.key] ? 'text' : 'password'"
                    class="form-control"
                    :class="{ 'is-invalid': errors[field.key] }"
                    :placeholder="field.placeholder"
                    :required="field.required && !isEditing"
                  />
                  <button 
                    type="button" 
                    class="btn btn-outline-secondary"
                    @click="togglePassword(field.key)"
                  >
                    <i :class="showPassword[field.key] ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                  </button>
                </div>
                
                <!-- Select Input -->
                <div v-if="field.type === 'select'">
                  <select
                    v-model="form[field.key]"
                    class="form-select"
                    :class="{ 'is-invalid': errors[field.key] }"
                    :required="field.required"
                    :disabled="loadingOptions[field.key]"
                  >
                    <option value="" disabled>
                      {{ loadingOptions[field.key] ? 'Cargando...' : field.placeholder }}
                    </option>
                    <option 
                      v-for="option in fieldOptions[field.key] || []" 
                      :key="option.value" 
                      :value="option.value"
                    >
                      {{ option.label }}
                    </option>
                  </select>
                  <div v-if="loadingOptions[field.key]" class="form-text">
                    <span class="spinner-border spinner-border-sm me-1"></span>
                    Cargando opciones...
                  </div>
                </div>
                
                <!-- Multiselect Input -->
                <div v-else-if="field.type === 'multiselect'">
                  <div class="multiselect-wrapper border rounded p-2" :class="{ 'is-invalid': errors[field.key] }">
                    <div v-if="loadingOptions[field.key]" class="text-center py-2">
                      <span class="spinner-border spinner-border-sm me-2"></span>
                      Cargando opciones...
                    </div>
                    <div v-else class="multiselect-options" style="max-height: 200px; overflow-y: auto;">
                      <div 
                        v-for="option in fieldOptions[field.key] || []"
                        :key="option.value"
                        class="form-check"
                      >
                        <input
                          :id="`${field.key}_${option.value}`"
                          v-model="form[field.key]"
                          type="checkbox"
                          class="form-check-input"
                          :value="option.value"
                        />
                        <label 
                          :for="`${field.key}_${option.value}`"
                          class="form-check-label user-select-none"
                          style="cursor: pointer;"
                        >
                          {{ option.label }}
                        </label>
                      </div>
                    </div>
                    <div v-if="!loadingOptions[field.key] && (!fieldOptions[field.key] || fieldOptions[field.key].length === 0)" class="text-muted text-center py-2">
                      <i class="bi bi-inbox me-1"></i>
                      No hay opciones disponibles
                    </div>
                  </div>
                  <small v-if="form[field.key]?.length" class="form-text text-muted">
                    <i class="bi bi-check-circle me-1"></i>
                    {{ form[field.key].length }} seleccionada(s)
                  </small>
                </div>
                
                <!-- Datalist Input (autocomplete) -->
                <div v-else-if="field.type === 'datalist'">
                  <input
                    v-model="form[field.key]"
                    type="text"
                    class="form-control"
                    :class="{ 'is-invalid': errors[field.key] }"
                    :placeholder="field.placeholder"
                    :required="field.required"
                    :list="`${field.key}-list`"
                    :disabled="loadingOptions[field.key]"
                  />
                  <datalist :id="`${field.key}-list`">
                    <option 
                      v-for="option in fieldOptions[field.key] || []" 
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </option>
                  </datalist>
                  <div v-if="loadingOptions[field.key]" class="form-text">
                    <span class="spinner-border spinner-border-sm me-1"></span>
                    Cargando opciones...
                  </div>
                </div>
                
                <!-- Autocomplete Search (tipo Odoo) -->
                <div v-else-if="field.type === 'autocomplete-search'" class="autocomplete-search-container">
                  <div class="position-relative">
                    <input
                      v-model="form[field.key]"
                      type="text"
                      class="form-control"
                      :class="{ 'is-invalid': errors[field.key] }"
                      :placeholder="field.placeholder"
                      :required="field.required"
                      @input="handleAutocompleteSearch(field, $event)"
                      @focus="showAutocompleteResults[field.key] = true"
                    />
                    <div 
                      v-if="loadingOptions[field.key]" 
                      class="position-absolute top-50 end-0 translate-middle-y pe-3"
                    >
                      <span class="spinner-border spinner-border-sm text-primary"></span>
                    </div>
                    
                    <!-- Dropdown de resultados -->
                    <div 
                      v-if="showAutocompleteResults[field.key] && autocompleteResults[field.key]?.length > 0"
                      class="autocomplete-results dropdown-menu show w-100 mt-1"
                      style="max-height: 300px; overflow-y: auto;"
                    >
                      <button
                        v-for="result in autocompleteResults[field.key]"
                        :key="result.id"
                        type="button"
                        class="dropdown-item d-flex justify-content-between align-items-start"
                        @click="selectAutocompleteResult(field, result)"
                      >
                        <div class="flex-grow-1">
                          <div class="fw-bold">{{ result.nombre }}</div>
                          <small class="text-muted">
                            {{ result.nivel ? `${result.nivel} - ` : '' }}
                            {{ result.ciudad || result.municipio || '' }}
                          </small>
                        </div>
                        <i class="bi bi-arrow-return-left text-primary"></i>
                      </button>
                    </div>
                  </div>
                  <small class="form-text text-muted">
                    <i class="bi bi-info-circle me-1"></i>
                    Escriba para buscar o crear nueva
                  </small>
                </div>
                
                <!-- Textarea -->
                <textarea
                  v-else-if="field.type === 'textarea'"
                  v-model="form[field.key]"
                  class="form-control"
                  :class="{ 'is-invalid': errors[field.key] }"
                  :placeholder="field.placeholder"
                  :rows="field.rows || 3"
                  :required="field.required"
                  :maxlength="field.maxlength"
                  @input="validateField(field, $event)"
                ></textarea>
                
                <!-- Date Input -->
                <input
                  v-else-if="field.type === 'date'"
                  v-model="form[field.key]"
                  type="date"
                  class="form-control"
                  :class="{ 'is-invalid': errors[field.key] }"
                  :required="field.required"
                />
                
                <!-- Time Input -->
                <input
                  v-else-if="field.type === 'time'"
                  v-model="form[field.key]"
                  type="time"
                  class="form-control"
                  :class="{ 'is-invalid': errors[field.key] }"
                  :required="field.required"
                />
                
                <!-- Checkbox Input -->
                <div v-else-if="field.type === 'checkbox'" class="form-check">
                  <input
                    :id="`checkbox_${field.key}`"
                    v-model="form[field.key]"
                    type="checkbox"
                    class="form-check-input"
                    :class="{ 'is-invalid': errors[field.key] }"
                    :true-value="true"
                    :false-value="false"
                  />
                  <label 
                    :for="`checkbox_${field.key}`" 
                    class="form-check-label user-select-none"
                    style="cursor: pointer;"
                  >
                    {{ field.label }}
                  </label>
                </div>
                
                <!-- File Input -->
                <div v-else-if="field.type === 'file'" class="file-input-container">
                  <input
                    :ref="`file_${field.key}`"
                    type="file"
                    class="form-control"
                    :class="{ 'is-invalid': errors[field.key] }"
                    :accept="field.accept"
                    :required="field.required && !isEditing"
                    @change="handleFileChange(field.key, $event)"
                  />
                  <div v-if="filePreview[field.key]" class="mt-2">
                    <div class="file-preview">
                      <img 
                        v-if="isImage(filePreview[field.key])"
                        :src="filePreview[field.key]" 
                        alt="Preview"
                        class="img-thumbnail"
                        style="max-width: 150px; max-height: 150px;"
                      />
                      <div v-else class="file-info">
                        <i class="bi bi-file-earmark me-2"></i>
                        {{ getFileName(filePreview[field.key]) }}
                      </div>
                    </div>
                  </div>
                  <div v-if="form[field.key] && !filePreview[field.key] && isEditing" class="mt-2">
                    <div class="current-file">
                      <small class="text-muted">Archivo actual:</small>
                      <div class="current-file-preview">
                        <img 
                          v-if="isImage(form[field.key])"
                          :src="getImageUrl(form[field.key])" 
                          alt="Current"
                          class="img-thumbnail"
                          style="max-width: 150px; max-height: 150px;"
                        />
                        <div v-else class="file-info">
                          <i class="bi bi-file-earmark me-2"></i>
                          {{ getFileName(form[field.key]) }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Error message -->
                <div v-if="errors[field.key]" class="invalid-feedback">
                  {{ errors[field.key] }}
                </div>
                
                <!-- Help text for readonly fields in edit mode -->
                <div v-if="isEditing && field.editMode === 'readonly' && field.helpText" class="form-text text-warning">
                  <i class="bi bi-lock me-1"></i>
                  {{ field.helpText }}
                </div>
                
                <!-- Help text -->
                <div v-else-if="field.help" class="form-text">
                  <i class="bi bi-info-circle me-1"></i>
                  {{ field.help }}
                </div>
              </div>
              
              <!-- Botón para cambiar contraseña en modo edición -->
              <div v-if="isEditing && hasPasswordFields" class="col-12">
                <div class="card border-warning">
                  <div class="card-body text-center py-4">
                    <i class="bi bi-key fs-1 text-warning mb-3"></i>
                    <h6 class="mb-2">Contraseña del Usuario</h6>
                    <p class="text-muted small mb-3">
                      La contraseña está protegida y encriptada
                    </p>
                    <button 
                      type="button" 
                      class="btn btn-outline-warning"
                      @click="openPasswordModal"
                    >
                      <i class="bi bi-pencil-square me-2"></i>
                      Cambiar Contraseña
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Modal para cambiar contraseña -->
            <div v-if="showPasswordModal" class="password-modal-overlay">
              <div class="password-modal">
                <div class="modal-header bg-warning bg-opacity-10">
                  <h5 class="modal-title">
                    <i class="bi bi-key me-2"></i>
                    Cambiar Contraseña
                  </h5>
                  <button type="button" class="btn-close" @click="closePasswordModal"></button>
                </div>
                <form @submit.prevent="handlePasswordSubmit">
                  <div class="modal-body">
                    <div v-if="passwordError" class="alert alert-danger">{{ passwordError }}</div>
                    
                    <div class="row g-3">
                      <div class="col-12">
                        <label class="form-label">Nueva Contraseña</label>
                        <div class="input-group">
                          <input 
                            v-model="passwordForm.nueva_contrasena" 
                            :type="showNewPassword ? 'text' : 'password'" 
                            class="form-control" 
                            placeholder="Mínimo 6 caracteres"
                            minlength="6" 
                            required
                          />
                          <button 
                            type="button" 
                            class="btn btn-outline-secondary" 
                            @click="showNewPassword = !showNewPassword"
                          >
                            <i :class="showNewPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                          </button>
                        </div>
                      </div>
                      <div class="col-12">
                        <label class="form-label">Confirmar Nueva Contraseña</label>
                        <div class="input-group">
                          <input 
                            v-model="passwordForm.confirmar_contrasena" 
                            :type="showConfirmPassword ? 'text' : 'password'" 
                            class="form-control" 
                            placeholder="Repetir contraseña"
                            minlength="6" 
                            required
                          />
                          <button 
                            type="button" 
                            class="btn btn-outline-secondary" 
                            @click="showConfirmPassword = !showConfirmPassword"
                          >
                            <i :class="showConfirmPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" @click="closePasswordModal">Cancelar</button>
                    <button type="submit" class="btn btn-warning" :disabled="savingPassword">
                      <span v-if="savingPassword" class="spinner-border spinner-border-sm me-2"></span>
                      <i v-else class="bi bi-check-lg me-2"></i>
                      {{ savingPassword ? 'Actualizando...' : 'Actualizar Contraseña' }}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="$emit('close')">
              <i class="bi bi-x-lg me-2"></i>
              Cancelar
            </button>
            <button type="submit" class="btn btn-primary" :disabled="saving">
              <span v-if="saving" class="spinner-border spinner-border-sm me-2"></span>
              <i v-else :class="isEditing ? 'bi bi-check-lg' : 'bi bi-plus-lg'" class="me-2"></i>
              {{ saving ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue'
import { API_BASE_URL } from '@/config/api'

const props = defineProps({
  config: {
    type: Object,
    required: true
  },
  item: {
    type: Object,
    default: null
  },
  isEditing: {
    type: Boolean,
    default: false
  },
  relatedData: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['save', 'close', 'savePassword'])

// Estado reactivo
const form = reactive({})
const errors = reactive({})
const showPassword = reactive({})
const saving = ref(false)
const error = ref('')

// Estado para archivos
const filePreview = reactive({})
const selectedFiles = reactive({})

// Estado para opciones dinámicas
const fieldOptions = reactive({})
const loadingOptions = reactive({})

// Estado para autocompletado tipo Odoo
const autocompleteResults = reactive({})
const showAutocompleteResults = reactive({})
const autocompleteTimers = reactive({})
const selectedEntity = reactive({})

// Estado para modal de contraseña
const showPasswordModal = ref(false)
const passwordForm = reactive({
  nueva_contrasena: '',
  confirmar_contrasena: ''
})
const passwordError = ref('')
const savingPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

// Computed para campos visibles (excluir contraseñas en modo edición)
const visibleFields = computed(() => {
  return props.config.fields.filter(field => {
    // Ocultar campos de contraseña cuando estamos editando
    if (field.type === 'password' && props.isEditing) {
      return false
    }
    return true
  })
})

// Computed para verificar si hay campos de contraseña
const hasPasswordFields = computed(() => {
  return props.config.fields.some(field => field.type === 'password')
})

// Inicializar formulario
function initializeForm() {
  // Limpiar errores
  Object.keys(errors).forEach(key => delete errors[key])
  error.value = ''
  
  // Inicializar campos del formulario
  props.config.fields.forEach(field => {
    if (props.isEditing && props.item) {
      // Modo edición: cargar valores existentes
      const value = getNestedValue(props.item, field.key)
      // Para multiselect, asegurar que sea array
      if (field.type === 'multiselect') {
        form[field.key] = Array.isArray(value) ? value : (value ? JSON.parse(value) : [])
      } else if (field.type === 'checkbox') {
        form[field.key] = value === true || value === 1 || value === '1'
      } else {
        form[field.key] = value !== undefined && value !== null ? value : (field.default || field.defaultValue || '')
      }
    } else {
      // Modo creación: valores por defecto
      if (field.type === 'multiselect') {
        form[field.key] = []
      } else if (field.type === 'checkbox') {
        form[field.key] = field.defaultValue === true || field.defaultValue === 'true'
      } else {
        form[field.key] = field.defaultValue || field.default || ''
      }
    }
    
    // Inicializar estado de contraseñas
    if (field.type === 'password') {
      showPassword[field.key] = false
    }
  })
  
  // Cargar opciones para campos select, datalist y multiselect
  props.config.fields.forEach(field => {
    if ((field.type === 'select' || field.type === 'datalist' || field.type === 'multiselect') && !field.dependsOn) {
      loadFieldOptions(field)
    }
  })
}

// Función para cargar opciones de campos
async function loadFieldOptions(field) {
  const fieldKey = field.key
  loadingOptions[fieldKey] = true
  let options = []
  
  try {
    // Si el campo tiene una función getOptions, usarla (puede ser async)
    if (field.getOptions && typeof field.getOptions === 'function') {
      const result = field.getOptions(form)
      // Verificar si es una promesa
      options = result instanceof Promise ? await result : result
    } else if (field.options) {
      options = field.options
    } else if (field.relatedKey && props.relatedData[field.relatedKey]) {
      // Obtener opciones de datos relacionados
      options = props.relatedData[field.relatedKey].map(item => ({
        value: item.id,
        label: field.relatedFormat ? 
          field.relatedFormat(item) :
          field.relatedLabel ? 
            field.relatedLabel.split('.').reduce((obj, key) => obj?.[key], item) :
            `${item.nombre || item.name || ''} ${item.apellidos || item.lastname || ''}`.trim()
      }))
    }
    
    fieldOptions[fieldKey] = options
  } catch (err) {
    console.error(`Error loading options for ${fieldKey}:`, err)
    fieldOptions[fieldKey] = []
  } finally {
    loadingOptions[fieldKey] = false
  }
}

// Función para recargar opciones de campos dependientes
function reloadDependentFields(changedFieldKey) {
  const dependentFields = props.config.fields.filter(f => f.dependsOn === changedFieldKey)
  
  for (const field of dependentFields) {
    loadFieldOptions(field)
  }
}

// Métodos
function getNestedValue(obj, path) {
  return path.split('.').reduce((current, key) => current?.[key], obj)
}

function togglePassword(fieldKey) {
  showPassword[fieldKey] = !showPassword[fieldKey]
}

function openPasswordModal() {
  passwordForm.nueva_contrasena = ''
  passwordForm.confirmar_contrasena = ''
  passwordError.value = ''
  showNewPassword.value = false
  showConfirmPassword.value = false
  showPasswordModal.value = true
}

function closePasswordModal() {
  showPasswordModal.value = false
}

function validatePasswords() {
  passwordError.value = ''
  
  if (!passwordForm.nueva_contrasena || passwordForm.nueva_contrasena.length < 6) {
    passwordError.value = 'La nueva contraseña debe tener al menos 6 caracteres'
    return false
  }
  
  if (passwordForm.nueva_contrasena !== passwordForm.confirmar_contrasena) {
    passwordError.value = 'Las contraseñas no coinciden'
    return false
  }
  
  return true
}

async function handlePasswordSubmit() {
  if (!validatePasswords()) {
    return
  }
  
  savingPassword.value = true
  passwordError.value = ''
  
  try {
    // Emitir evento con los datos de contraseña
    emit('savePassword', {
      id: props.item?.id,
      contrasena: passwordForm.nueva_contrasena
    })
    
    closePasswordModal()
  } catch (err) {
    passwordError.value = err.message || 'Error al actualizar contraseña'
  } finally {
    savingPassword.value = false
  }
}

function validateForm() {
  Object.keys(errors).forEach(key => delete errors[key])
  let isValid = true
  
  props.config.fields.forEach(field => {
    const value = form[field.key]
    
    // Validación requerido
    if (field.required) {
      if (field.type === 'password' && props.isEditing) {
        // Para contraseñas en modo edición, no es requerido
        return
      }
      
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        errors[field.key] = `${field.label} es requerido`
        isValid = false
        return
      }
    }
    
    // Validación de email
    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        errors[field.key] = 'Formato de email inválido'
        isValid = false
      }
    }
    
    // Validación de número mínimo
    if (field.type === 'number' && field.min !== undefined && value < field.min) {
      errors[field.key] = `Valor mínimo: ${field.min}`
      isValid = false
    }
    
    // Validación de número máximo
    if (field.type === 'number' && field.max !== undefined && value > field.max) {
      errors[field.key] = `Valor máximo: ${field.max}`
      isValid = false
    }
    
    // Validación de longitud mínima para contraseñas
    if (field.type === 'password' && value && value.length < 6) {
      errors[field.key] = 'Mínimo 6 caracteres'
      isValid = false
    }
    
    // Validaciones personalizadas
    if (field.validation && value) {
      const validationResult = field.validation(value, form)
      if (validationResult !== true) {
        errors[field.key] = validationResult
        isValid = false
      }
    }
  })
  
  return isValid
}

async function handleSubmit() {
  if (!validateForm()) {
    return
  }
  
  saving.value = true
  error.value = ''
  
  try {
    // Preparar datos para enviar - usar FormData si hay archivos
    const hasFiles = Object.keys(selectedFiles).length > 0
    let dataToSend
    
    if (hasFiles) {
      dataToSend = new FormData()
      
      // Agregar campos de formulario
      props.config.fields.forEach(field => {
        let value = form[field.key]
        
        if (field.type === 'file') {
          // Manejar archivos
          if (selectedFiles[field.key]) {
            dataToSend.append(field.key, selectedFiles[field.key])
          }
        } else {
          // Para modo edición, solo enviar campos que han cambiado o que no son contraseñas vacías
          if (props.isEditing) {
            if (field.type === 'password' && (!value || value.trim() === '')) {
              return
            }
            // No enviar campos de archivo si no hay archivo nuevo seleccionado
            if (field.type === 'file' && !selectedFiles[field.key]) {
              return
            }
          }
          
          // Para campos tipo time, asegurar formato HH:MM:SS
          if (field.type === 'time' && value && value.length === 5) {
            value = value + ':00'
          }
          
          // Solo enviar valores no vacíos o requeridos
          if (value !== null && value !== undefined && value !== '') {
            dataToSend.append(field.key, value)
          } else if (field.required && field.defaultValue !== undefined) {
            let defaultVal = field.defaultValue
            // Agregar :00 a valores default de time si es necesario
            if (field.type === 'time' && defaultVal && defaultVal.length === 5) {
              defaultVal = defaultVal + ':00'
            }
            dataToSend.append(field.key, defaultVal)
          }
        }
      })
    } else {
      // Sin archivos, usar objeto normal
      const cleanedData = {}
      
      props.config.fields.forEach(field => {
        let value = form[field.key]
        
        // Para modo edición, no enviar contraseñas vacías ni archivos sin cambios
        if (props.isEditing) {
          if (field.type === 'password' && (!value || value.trim() === '')) {
            return
          }
          if (field.type === 'file' && !selectedFiles[field.key]) {
            return
          }
        }
        
        // Para campos tipo time, asegurar formato HH:MM:SS
        if (field.type === 'time' && value && value.length === 5) {
          value = value + ':00'
        }
        
        // Solo enviar valores no vacíos, o valores requeridos con default
        if (value !== null && value !== undefined && value !== '') {
          cleanedData[field.key] = value
        } else if (field.required && field.defaultValue !== undefined) {
          let defaultVal = field.defaultValue
          // Agregar :00 a valores default de time si es necesario
          if (field.type === 'time' && defaultVal && defaultVal.length === 5) {
            defaultVal = defaultVal + ':00'
          }
          cleanedData[field.key] = defaultVal
        } else if (field.type === 'number' && value === '') {
          // Para números, no enviar strings vacíos
          return
        }
      })
      
      dataToSend = cleanedData
    }
    
    emit('save', dataToSend)
  } catch (err) {
    error.value = err.message || 'Error al guardar'
  } finally {
    saving.value = false
  }
}

// Función para validar un campo en tiempo real
function validateField(field, event) {
  const value = event.target.value
  const fieldKey = field.key
  
  // Limpiar error previo
  delete errors[fieldKey]
  
  // Si el campo tiene pattern, validar
  if (field.pattern && value) {
    const regex = new RegExp(field.pattern)
    if (!regex.test(value)) {
      errors[fieldKey] = field.validationMessage || 'Formato inválido'
      return false
    }
  }
  
  // Validar longitud mínima
  if (field.minlength && value && value.length < field.minlength) {
    errors[fieldKey] = `Mínimo ${field.minlength} caracteres`
    return false
  }
  
  // Validar longitud máxima
  if (field.maxlength && value && value.length > field.maxlength) {
    // Truncar el valor
    form[fieldKey] = value.substring(0, field.maxlength)
    return false
  }
  
  return true
}

// Funciones para autocompletado tipo Odoo
async function handleAutocompleteSearch(field, event) {
  const query = event.target.value
  const fieldKey = field.key
  
  // Limpiar timer anterior
  if (autocompleteTimers[fieldKey]) {
    clearTimeout(autocompleteTimers[fieldKey])
  }
  
  // Si no hay suficientes caracteres, limpiar resultados
  if (!query || query.length < (field.minSearchLength || 3)) {
    autocompleteResults[fieldKey] = []
    showAutocompleteResults[fieldKey] = false
    return
  }
  
  // Debounce: esperar 300ms antes de buscar
  autocompleteTimers[fieldKey] = setTimeout(async () => {
    try {
      loadingOptions[fieldKey] = true
      
      // Construir endpoint, asegurando que comience con /api
      let endpoint = field.searchEndpoint || `/${field.entityType || 'entity'}/search`
      if (!endpoint.startsWith('/api')) {
        endpoint = '/api' + endpoint
      }
      
      const response = await fetch(`${API_BASE_URL}${endpoint}?q=${encodeURIComponent(query)}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
          'Accept': 'application/json'
        }
      })
      
      if (response.ok) {
        const results = await response.json()
        autocompleteResults[fieldKey] = results
        showAutocompleteResults[fieldKey] = true
      }
    } catch (error) {
      console.error('Error searching:', error)
      autocompleteResults[fieldKey] = []
    } finally {
      loadingOptions[fieldKey] = false
    }
  }, 300)
}

function selectAutocompleteResult(field, result) {
  const fieldKey = field.key
  
  // Guardar la entidad seleccionada
  selectedEntity[fieldKey] = result
  
  // Llenar el campo nombre
  form[fieldKey] = result.nombre
  
  // Auto-llenar todos los campos del formulario con los datos de la entidad
  Object.keys(result).forEach(key => {
    if (key in form && key !== 'id') {
      form[key] = result[key]
    }
  })
  
  // Ocultar resultados
  showAutocompleteResults[fieldKey] = false
  autocompleteResults[fieldKey] = []
  
  // Recargar campos dependientes si es necesario
  if (result.estado_republica) {
    reloadDependentFields('estado_republica')
  }
  if (result.municipio) {
    reloadDependentFields('municipio')
  }
}

// Click fuera para cerrar autocomplete
if (typeof document !== 'undefined') {
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.autocomplete-search-container')) {
      Object.keys(showAutocompleteResults).forEach(key => {
        showAutocompleteResults[key] = false
      })
    }
  })
}

// Funciones para manejo de archivos
function handleFileChange(fieldKey, event) {
  const file = event.target.files[0]
  if (file) {
    selectedFiles[fieldKey] = file
    
    // Crear preview si es imagen
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        filePreview[fieldKey] = e.target.result
      }
      reader.readAsDataURL(file)
    } else {
      filePreview[fieldKey] = file.name
    }
  } else {
    delete selectedFiles[fieldKey]
    delete filePreview[fieldKey]
  }
}

function getImageUrl(imagePath) {
  if (!imagePath) return ''
  
  // Si la URL ya es completa (http:// o https://), devolverla tal cual
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath
  }
  
  // Si es una ruta relativa, agregar el API_BASE_URL
  return `${API_BASE_URL}/${imagePath}`
}

function isImage(filePath) {
  if (!filePath) return false
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp']
  return imageExtensions.some(ext => filePath.toLowerCase().includes(ext))
}

function getFileName(filePath) {
  if (!filePath) return ''
  return filePath.split('/').pop() || filePath
}

// Watchers
watch(() => props.item, initializeForm, { immediate: true })
watch(() => props.isEditing, initializeForm)

// Watcher para estado_republica - recargar municipios y limpiar campos dependientes
watch(() => form.estado_republica, (newEstado, oldEstado) => {
  if (newEstado !== oldEstado) {
    // Limpiar campos dependientes
    if (form.municipio) form.municipio = ''
    if (form.colonia) form.colonia = ''
    
    // Recargar opciones de municipios
    reloadDependentFields('estado_republica')
  }
})

// Watcher para municipio - recargar colonias
watch(() => form.municipio, (newMunicipio, oldMunicipio) => {
  if (newMunicipio !== oldMunicipio) {
    // Limpiar colonia
    if (form.colonia) form.colonia = ''
    
    // Recargar opciones de colonias
    reloadDependentFields('municipio')
  }
})

// Watcher para unidad_id - actualizar capacidad automáticamente (solo para viajes)
watch(() => form.unidad_id, (newUnidadId) => {
  if (newUnidadId && props.config.name === 'Viajes') {
    // Buscar la unidad seleccionada en relatedData
    const unidades = props.relatedData?.unidades || []
    const unidadSeleccionada = unidades.find(u => u.id === parseInt(newUnidadId))
    
    if (unidadSeleccionada && unidadSeleccionada.numero_asientos) {
      form.capacidad_maxima = parseInt(unidadSeleccionada.numero_asientos)
      console.log('Capacidad actualizada:', form.capacidad_maxima, 'desde unidad:', unidadSeleccionada.numero_unidad)
    }
  }
})

// Inicializar al montar
initializeForm()
</script>

<style scoped>
.modal-content {
  border: none;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  background-color: var(--bs-body-bg);
  color: var(--bs-body-color);
}

.modal-header {
  background: linear-gradient(45deg, #f8f9fa, #e9ecef);
  border-bottom: 1px solid #dee2e6;
  border-radius: 12px 12px 0 0;
}

[data-bs-theme="dark"] .modal-header {
  background: linear-gradient(45deg, #343a40, #495057);
  border-bottom-color: #495057;
}

.modal-title {
  color: #495057;
  font-weight: 600;
}

[data-bs-theme="dark"] .modal-title {
  color: var(--bs-light);
}

.form-label {
  color: #495057;
  font-size: 0.9rem;
}

[data-bs-theme="dark"] .form-label {
  color: var(--bs-light);
}

.form-control, .form-select {
  border: 1px solid #85bbf1;
  border-radius: 8px;
  transition: all 0.3s ease;
  background-color: var(--bs-body-bg);
  color: var(--bs-body-color);
}

[data-bs-theme="dark"] .form-control, 
[data-bs-theme="dark"] .form-select {
  background-color: var(--bs-dark);
  border-color: #495057;
  color: var(--bs-light);
}

.form-control:focus, .form-select:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 0.25rem rgba(0, 123, 255, 0.25);
  background-color: var(--bs-body-bg);
  color: var(--bs-body-color);
}

[data-bs-theme="dark"] .form-control:focus, 
[data-bs-theme="dark"] .form-select:focus {
  background-color: var(--bs-dark);
  color: var(--bs-light);
}

.btn {
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(45deg, #007bff, #0056b3);
  border: none;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 123, 255, 0.3);
}

.btn-secondary {
  background: #6c757d;
  border: none;
}

.btn-outline-secondary {
  border-color: #ced4da;
}

[data-bs-theme="dark"] .btn-outline-secondary {
  border-color: #495057;
  color: var(--bs-light);
}

.invalid-feedback {
  display: block;
  font-size: 0.875rem;
}

.form-text {
  font-size: 0.8rem;
  color: #6c757d;
}

[data-bs-theme="dark"] .form-text {
  color: rgba(255, 255, 255, 0.6);
}

.alert {
  border-radius: 8px;
}

.input-group .btn {
  border-radius: 0 8px 8px 0;
}

/* File input styles */
.file-input-container {
  position: relative;
}

.file-preview {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

[data-bs-theme="dark"] .file-preview {
  background: var(--bs-dark);
  border-color: #495057;
}

.current-file {
  padding: 8px;
  background: #e8f4f8;
  border-radius: 8px;
  border: 1px solid #bee5eb;
}

[data-bs-theme="dark"] .current-file {
  background: #1a2332;
  border-color: #2c3e50;
}

.current-file-preview {
  margin-top: 8px;
}

.file-info {
  display: flex;
  align-items: center;
  color: #495057;
  font-size: 0.9rem;
}

[data-bs-theme="dark"] .file-info {
  color: var(--bs-light);
}

.img-thumbnail {
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.input-group .form-control {
  border-radius: 8px 0 0 8px;
}

/* Select options styles */
.form-select option {
  color: #000000 !important;
  background-color: #ffffff !important;
}

.form-select option:disabled {
  color: #6c757d !important;
}

[data-bs-theme="dark"] .form-select option {
  color: #ffffff !important;
  background-color: #2d3748 !important;
}

[data-bs-theme="dark"] .form-select option:disabled {
  color: #6c757d !important;
}

/* Password modal styles */
.password-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1060;
  display: flex;
  align-items: center;
  justify-content: center;
}

.password-modal {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

[data-bs-theme="dark"] .password-modal {
  background: var(--bs-dark);
  color: var(--bs-light);
}

.password-modal .modal-header {
  background: linear-gradient(45deg, #fff3cd, #ffeaa7);
  border-bottom: 1px solid #ffeaa7;
  border-radius: 12px 12px 0 0;
  padding: 1rem 1.5rem;
}

[data-bs-theme="dark"] .password-modal .modal-header {
  background: linear-gradient(45deg, #495057, #6c757d);
  border-bottom-color: #6c757d;
}

.password-modal .modal-body {
  padding: 1.5rem;
}

.password-modal .modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #dee2e6;
}

[data-bs-theme="dark"] .password-modal .modal-footer {
  border-top-color: #495057;
}

/* Autocomplete Search Styles */
.autocomplete-search-container {
  position: relative;
}

.autocomplete-results {
  position: absolute;
  z-index: 1050;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: 1px solid var(--bs-border-color);
  background: var(--bs-body-bg);
}

.autocomplete-results .dropdown-item {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--bs-border-color);
  cursor: pointer;
  transition: all 0.2s;
}

.autocomplete-results .dropdown-item:last-child {
  border-bottom: none;
}

.autocomplete-results .dropdown-item:hover {
  background: var(--bs-primary-bg-subtle);
  transform: translateX(4px);
}

[data-bs-theme="dark"] .autocomplete-results {
  background: var(--bs-dark);
  border-color: #495057;
}

[data-bs-theme="dark"] .autocomplete-results .dropdown-item {
  border-bottom-color: #495057;
}

[data-bs-theme="dark"] .autocomplete-results .dropdown-item:hover {
  background: #2d3748;
}

@media (max-width: 768px) {
  .modal-dialog {
    margin: 1rem;
  }
  
  .modal-content {
    border-radius: 8px;
  }
  
  .modal-header {
    border-radius: 8px 8px 0 0;
  }
  
  .password-modal {
    width: 95%;
    margin: 1rem;
  }
}
</style>
