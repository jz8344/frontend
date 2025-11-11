<template>
  <div class="dynamic-list-view">
    <!-- View Controls and Settings -->
    <div class="view-controls mb-3">
      <div class="d-flex justify-content-between align-items-center">
        <!-- Left side: View toggle -->
        <div class="btn-group" role="group">
          <button 
            type="button" 
            class="btn btn-outline-secondary"
            :class="{ active: viewMode === 'list' }"
            @click="viewMode = 'list'"
          >
            <i class="bi bi-list"></i>
            Lista
          </button>
          <button 
            type="button" 
            class="btn btn-outline-secondary"
            :class="{ active: viewMode === 'grid' }"
            @click="viewMode = 'grid'"
          >
            <i class="bi bi-grid-3x2"></i>
            Tarjetas
          </button>
        </div>

        <!-- Right side: Sort and Column controls -->
        <div class="d-flex gap-2">
          <!-- Sort Dropdown -->
          <div class="dropdown">
            <button 
              class="btn btn-outline-secondary dropdown-toggle" 
              type="button" 
              data-bs-toggle="dropdown"
            >
              <i class="bi bi-sort-down me-1"></i>
              Ordenar
              <span v-if="sortField" class="badge bg-primary ms-1">
                {{ sortableFields.find(f => f.key === sortField)?.label || config.displayFields?.find(f => f.key === sortField)?.label }}
              </span>
            </button>
            <ul class="dropdown-menu dropdown-menu-end">
              <li class="dropdown-header">Ordenar por</li>
              <li v-for="field in sortableFields" :key="field.key">
                <a 
                  class="dropdown-item" 
                  href="#" 
                  :class="{ 'active-sort': sortField === field.key && sortDirection === 'asc' }"
                  @click.prevent="requestSort(field.key, 'asc')"
                >
                  <i class="bi bi-sort-alpha-down me-2"></i>
                  {{ field.label }} (A-Z)
                </a>
              </li>
              <li v-for="field in sortableFields" :key="field.key + '_desc'">
                <a 
                  class="dropdown-item" 
                  href="#" 
                  :class="{ 'active-sort': sortField === field.key && sortDirection === 'desc' }"
                  @click.prevent="requestSort(field.key, 'desc')"
                >
                  <i class="bi bi-sort-alpha-up me-2"></i>
                  {{ field.label }} (Z-A)
                </a>
              </li>
              <li v-if="sortField"><hr class="dropdown-divider"></li>
              <li v-if="sortField">
                <a 
                  class="dropdown-item text-muted" 
                  href="#" 
                  @click.prevent="requestSort('', '')"
                >
                  <i class="bi bi-arrow-clockwise me-2"></i>
                  Limpiar ordenamiento
                </a>
              </li>
            </ul>
          </div>

          <!-- Column Visibility Dropdown (only for list view) -->
          <div v-if="viewMode === 'list'" class="dropdown">
            <button 
              class="btn btn-outline-secondary dropdown-toggle" 
              type="button" 
              data-bs-toggle="dropdown"
            >
              <i class="bi bi-columns me-1"></i>
              Columnas
            </button>
            <ul class="dropdown-menu dropdown-menu-end p-2" style="min-width: 200px;">
              <li class="dropdown-header">Mostrar/Ocultar Columnas</li>
              <li v-for="field in config.displayFields || []" :key="field.key" class="dropdown-item-text">
                <div class="form-check">
                  <input 
                    class="form-check-input" 
                    type="checkbox" 
                    :id="'col-' + field.key"
                    v-model="visibleColumns[field.key]"
                  >
                  <label class="form-check-label" :for="'col-' + field.key">
                    <i v-if="field.icon" :class="field.icon" class="me-2"></i>
                    {{ field.label }}
                  </label>
                </div>
              </li>
              <li><hr class="dropdown-divider"></li>
              <li>
                <button 
                  class="btn btn-sm btn-outline-primary w-100" 
                  @click="resetColumns"
                >
                  Restablecer
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Grid View -->
    <div v-if="viewMode === 'grid'" class="row g-3">
      <div 
        v-for="item in items" 
        :key="item.id"
        class="col-12 col-sm-6 col-lg-4 col-xl-3"
      >
        <div 
          class="card h-100 item-card" 
          :class="{ 'border-primary': selectedItems.includes(item.id) }"
          @click="toggleSelection(item.id)"
          style="cursor: pointer; transition: all 0.3s ease;"
        >
          <!-- Imagen de la unidad si existe -->
          <div v-if="config.displayFields?.[0]?.type === 'image' && getDisplayValue(item, config.displayFields[0])" class="card-img-top-container">
            <img 
              :src="`http://localhost:8000/${getDisplayValue(item, config.displayFields[0])}`"
              :alt="item.matricula || 'Imagen'"
              class="card-img-top"
              style="height: 150px; object-fit: cover;"
              @error="handleImageError"
            />
          </div>
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <!-- Avatar con iniciales o imagen pequeña -->
              <div v-if="config.displayFields?.[0]?.type !== 'image'" class="item-avatar-letters">
                {{ getInitials(item, getNameField()) }}
              </div>
              <div v-else class="item-avatar-letters bg-light">
                <i class="bi bi-image"></i>
              </div>
              <div class="form-check">
                <input 
                  class="form-check-input" 
                  type="checkbox" 
                  :checked="selectedItems.includes(item.id)"
                  @click.stop
                  @change="toggleSelection(item.id)"
                >
              </div>
            </div>
            
            <h6 class="card-title mb-2">{{ getDisplayValue(item, config.displayFields?.[1] || config.displayFields?.[0]) }}</h6>
            
            <div class="item-details">
              <div 
                v-for="(field, index) in getCardDisplayFields(item)" 
                :key="field.key"
                class="detail-row"
              >
                <small class="text-muted">{{ field.label }}:</small>
                <small class="ms-1">{{ getDisplayValue(item, field) }}</small>
              </div>
            </div>
            
            <div class="card-actions mt-3">
              <button 
                class="btn btn-sm btn-outline-primary me-1" 
                @click.stop="openEditModal(item)"
                title="Editar"
              >
                <i class="bi bi-pencil"></i>
              </button>
              <button 
                class="btn btn-sm btn-outline-danger" 
                @click.stop="deleteItem(item.id)"
                title="Eliminar"
              >
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- List View -->
    <div v-else class="table-container">
      <div class="table-responsive">
        <table class="table table-hover">
          <thead class="table-light">
            <tr>
              <th class="selection-column">
                <div class="form-check">
                  <input 
                    class="form-check-input" 
                    type="checkbox" 
                    :checked="allSelected"
                    :indeterminate="someSelected"
                    @change="toggleAllSelection"
                  >
                </div>
              </th>
              <th 
                v-for="field in visibleDisplayFields" 
                :key="field.key"
                class="sortable-header"
                :class="{ 'sorted-column': sortField === field.key }"
                @click="requestSort(field.key)"
              >
                <div class="d-flex align-items-center">
                  <i v-if="field.icon" :class="field.icon" class="me-2"></i>
                  {{ field.label }}
                  <i 
                    v-if="sortField === field.key" 
                    :class="sortDirection === 'asc' ? 'bi bi-arrow-up' : 'bi bi-arrow-down'"
                    class="ms-2 text-primary"
                  ></i>
                </div>
              </th>
              <th class="actions-column text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="item in items" 
              :key="item.id"
              :class="{ 'table-active': selectedItems.includes(item.id) }"
            >
              <td class="selection-column">
                <div class="form-check">
                  <input 
                    class="form-check-input" 
                    type="checkbox" 
                    :checked="selectedItems.includes(item.id)"
                    @change="toggleSelection(item.id)"
                  >
                </div>
              </td>
              <td v-for="field in visibleDisplayFields" :key="field.key">
                <div v-if="field.type === 'badge'" class="badge-container">
                  <span 
                    class="badge"
                    :class="getBadgeClass(getDisplayValue(item, field))"
                  >
                    {{ getDisplayValue(item, field) }}
                  </span>
                </div>
                <div v-else-if="field.type === 'avatar'" class="d-flex align-items-center">
                  <div class="avatar-sm-table me-2">
                    {{ getInitials(item, field) }}
                  </div>
                  <span>{{ getDisplayValue(item, field) }}</span>
                </div>
                <div v-else-if="field.type === 'image'">
                  <img 
                    v-if="getDisplayValue(item, field)" 
                    :src="`http://localhost:8000/${getDisplayValue(item, field)}`"
                    :alt="item.matricula || 'Imagen'"
                    class="table-image"
                    style="width: 50px; height: 40px; object-fit: cover; border-radius: 4px;"
                    @error="handleImageError"
                  />
                  <span v-else class="text-muted">
                    <i class="bi bi-image"></i> Sin imagen
                  </span>
                </div>
                <div v-else-if="field.type === 'date'">
                  {{ formatDate(getDisplayValue(item, field)) }}
                </div>
                <code v-else-if="field.type === 'code'">
                  {{ getDisplayValue(item, field) }}
                </code>
                <span v-else>
                  {{ getDisplayValue(item, field) }}
                </span>
              </td>
              <td class="actions-column text-center">
                <div class="btn-group btn-group-sm">
                  <button 
                    class="btn btn-outline-primary" 
                    @click="openEditModal(item)"
                    title="Editar"
                  >
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button 
                    class="btn btn-outline-danger" 
                    @click="deleteItem(item.id)"
                    title="Eliminar"
                  >
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="items.length === 0">
              <td :colspan="visibleDisplayFields.length + 2" class="text-center text-muted py-4">
                <div class="d-flex flex-column align-items-center">
                  <i class="bi bi-inbox display-1 text-muted mb-3"></i>
                  <h5 class="text-muted">No hay {{ config.name?.toLowerCase() || 'elementos' }} para mostrar</h5>
                  <p class="text-muted mb-0">Agrega el primer {{ config.singular?.toLowerCase() || 'elemento' }} haciendo clic en el botón "Crear Respaldo"</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

const props = defineProps({
  config: {
    type: Object,
    required: true
  },
  items: {
    type: Array,
    default: () => []
  },
  selectedItems: {
    type: Array,
    default: () => []
  },
  sortField: {
    type: String,
    default: ''
  },
  sortDirection: {
    type: String,
    default: 'asc'
  }
})

const emit = defineEmits(['toggleSelection', 'selectAll', 'clearSelection', 'openEditModal', 'deleteItem', 'sort'])

// Estado reactivo
const viewMode = ref('list')
const visibleColumns = ref({})

// Computed
const allSelected = computed(() => {
  return props.items.length > 0 && props.selectedItems.length === props.items.length
})

const someSelected = computed(() => {
  return props.selectedItems.length > 0 && props.selectedItems.length < props.items.length
})

const visibleDisplayFields = computed(() => {
  if (!props.config || !props.config.displayFields) return []
  return props.config.displayFields.filter(field => visibleColumns.value[field.key] !== false)
})

const sortableFields = computed(() => {
  if (!props.config) return []
  // Usar sortFields si existe, o filtrar displayFields que son ordenables
  return props.config.sortFields || props.config.displayFields?.filter(f => f.sortable !== false) || []
})

// Métodos
function initializeColumns() {
  if (!props.config || !props.config.displayFields) return
  
  const columns = {}
  props.config.displayFields.forEach(field => {
    columns[field.key] = true
  })
  visibleColumns.value = columns
}

function resetColumns() {
  initializeColumns()
}

function getNameField() {
  // Buscar el primer campo que sea de tipo nombre o que contenga 'nombre'
  if (!props.config || !props.config.displayFields) return null
  
  return props.config.displayFields.find(field => 
    field.type === 'avatar' || 
    field.key.includes('nombre') || 
    field.key.includes('name')
  ) || props.config.displayFields[0]
}

function getDisplayValue(item, field) {
  // Si el campo tiene una función getValue personalizada, usarla
  if (field.getValue && typeof field.getValue === 'function') {
    return field.getValue(item)
  }
  
  let value = field.key.split('.').reduce((obj, key) => obj?.[key], item)
  
  if (value === null || value === undefined) {
    return '-'
  }
  
  // Formateo específico por tipo
  if (field.type === 'boolean') {
    return value ? 'Sí' : 'No'
  }
  
  if (field.type === 'currency') {
    return new Intl.NumberFormat('es-MX', { 
      style: 'currency', 
      currency: 'MXN' 
    }).format(value)
  }
  
  return value
}

function getInitials(item, field) {
  const value = getDisplayValue(item, field)
  if (typeof value !== 'string') return '??'
  
  const words = value.trim().split(' ')
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase()
  }
  return (value[0] + (value[1] || '')).toUpperCase()
}

function formatDate(value) {
  if (!value) return '-'
  try {
    return new Date(value).toLocaleDateString('es-MX')
  } catch {
    return value
  }
}

function getBadgeClass(value) {
  if (typeof value !== 'string') return 'bg-secondary'
  
  const statusClasses = {
    'activo': 'bg-success',
    'inactivo': 'bg-secondary',
    'pendiente': 'bg-warning',
    'completado': 'bg-primary',
    'cancelado': 'bg-danger',
    'activa': 'bg-success',
    'inactiva': 'bg-secondary',
    'completada': 'bg-primary'
  }
  
  return statusClasses[value.toLowerCase()] || 'bg-secondary'
}

function toggleSelection(id) {
  emit('toggleSelection', id)
}

function toggleAllSelection() {
  if (allSelected.value) {
    emit('clearSelection')
  } else {
    emit('selectAll')
  }
}

function openEditModal(item) {
  emit('openEditModal', item)
}

function deleteItem(id) {
  emit('deleteItem', id)
}

function requestSort(field, direction = null) {
  if (!field) {
    // Limpiar ordenamiento
    emit('sort', { field: '', direction: '' })
    return
  }
  
  const newDirection = direction || (props.sortField === field && props.sortDirection === 'asc' ? 'desc' : 'asc')
  emit('sort', { field, direction: newDirection })
}

function getCardDisplayFields(item) {
  if (!props.config || !props.config.displayFields) return []
  
  // Para las tarjetas, si el primer campo es una imagen, mostramos los siguientes campos
  const startIndex = props.config.displayFields[0]?.type === 'image' ? 2 : 1
  return props.config.displayFields.slice(startIndex, startIndex + 3)
}

function handleImageError(event) {
  event.target.style.display = 'none'
  // Crear un placeholder
  const placeholder = document.createElement('div')
  placeholder.className = 'image-placeholder text-center text-muted'
  placeholder.style.cssText = 'width: 50px; height: 40px; display: flex; align-items: center; justify-content: center; background: #f8f9fa; border-radius: 4px; border: 1px dashed #dee2e6;'
  placeholder.innerHTML = '<i class="bi bi-image"></i>'
  event.target.parentNode.replaceChild(placeholder, event.target)
}

// Lifecycle
onMounted(() => {
  // initializeColumns() se llamará en el watcher cuando config esté disponible
  
  // Inicializar Bootstrap dropdowns
  setTimeout(() => {
    try {
      // Importar Bootstrap de forma dinámica para asegurar que esté disponible
      import('bootstrap').then(({ Dropdown, Tooltip }) => {
        // Inicializar dropdowns
        const dropdownElements = document.querySelectorAll('[data-bs-toggle="dropdown"]')
        dropdownElements.forEach(el => {
          new Dropdown(el)
        })
        
        // Inicializar tooltips si los hay
        const tooltipElements = document.querySelectorAll('[title]')
        tooltipElements.forEach(el => {
          new Tooltip(el)
        })
      })
    } catch (error) {
      console.warn('Error inicializando Bootstrap:', error)
    }
  }, 100)
})

// Watch para reinicializar columnas cuando cambie la configuración
watch(() => props.config, (newConfig) => {
  if (newConfig && newConfig.displayFields) {
    initializeColumns()
  }
}, { deep: true, immediate: true })

// Watch para reinicializar Bootstrap cuando cambie el modo de vista
watch(() => viewMode.value, () => {
  setTimeout(() => {
    try {
      import('bootstrap').then(({ Dropdown }) => {
        const dropdownElements = document.querySelectorAll('[data-bs-toggle="dropdown"]')
        dropdownElements.forEach(el => {
          new Dropdown(el)
        })
      })
    } catch (error) {
      console.warn('Error reinicializando Bootstrap:', error)
    }
  }, 100)
})
</script>

<style scoped>
.dynamic-list-view {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin-bottom: 24px;
}

.view-controls {
  display: flex;
  justify-content: flex-end;
}

.btn-group .btn.active {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.3);
}

.btn-outline-secondary {
  border: 1px solid #dee2e6;
  transition: all 0.3s ease;
}

.btn-outline-secondary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Sort dropdown styles */
.dropdown-item.active-sort {
  background-color: #e3f2fd;
  color: #1976d2;
  font-weight: 600;
}

.dropdown-item.active-sort:hover {
  background-color: #bbdefb;
}

/* Grid View Styles */
.item-card {
  border: 1px solid #e9ecef;
  border-radius: 12px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.item-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.item-card.border-primary {
  border-width: 2px !important;
  box-shadow: 0 4px 16px rgba(13, 110, 253, 0.25);
  transform: translateY(-2px);
}

/* Avatar con iniciales para grid */
.item-avatar-letters {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  letter-spacing: 1px;
}

.detail-row {
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  padding: 2px 0;
}

.card-actions {
  border-top: 1px solid #f8f9fa;
  padding-top: 12px;
  margin-top: 12px;
}

/* Table View Styles */
.table-container {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e9ecef;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.table {
  margin-bottom: 0;
}

.table thead th {
  background-color: #f8f9fa;
  border-bottom: 2px solid #e9ecef;
  font-weight: 600;
  color: #495057;
  padding: 16px 12px;
  position: relative;
}

.table tbody td {
  padding: 14px 12px;
  vertical-align: middle;
  border-bottom: 1px solid #f1f3f4;
}

.table tbody tr {
  transition: all 0.2s ease;
}

.table tbody tr:hover {
  background-color: #f8f9fa;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.sortable-header {
  cursor: pointer;
  user-select: none;
  transition: all 0.2s ease;
}

.sortable-header:hover {
  background-color: #e9ecef !important;
  transform: translateY(-1px);
}

.sorted-column {
  background-color: #e3f2fd !important;
  box-shadow: inset 0 0 0 2px #2196f3;
  position: relative;
}

.sorted-column::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, rgba(33, 150, 243, 0.1), rgba(33, 150, 243, 0.05));
  pointer-events: none;
}

.selection-column {
  width: 50px;
  text-align: center;
}

.actions-column {
  width: 120px;
}

.form-check-input:indeterminate {
  background-color: #007bff;
  border-color: #007bff;
}

/* Badge styles */
.badge-container .badge {
  font-size: 0.75rem;
  padding: 6px 10px;
  border-radius: 8px;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Avatar styles para tabla */
.avatar-sm-table {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  letter-spacing: 0.5px;
}

/* Button styles */
.btn-group-sm .btn {
  border-radius: 6px;
  transition: all 0.3s ease;
}

.btn-outline-primary:hover {
  background-color: #007bff;
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 123, 255, 0.3);
}

.btn-outline-danger:hover {
  background-color: #dc3545;
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(220, 53, 69, 0.3);
}

/* Column visibility dropdown */
.dropdown-menu {
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  border: 1px solid #e9ecef;
}

.dropdown-item-text {
  padding: 8px 16px;
}

.form-check-label {
  cursor: pointer;
  font-size: 0.875rem;
}

.form-check-input:checked {
  background-color: #007bff;
  border-color: #007bff;
}

/* Responsive */
@media (max-width: 768px) {
  .dynamic-list-view {
    padding: 16px;
    margin-bottom: 16px;
  }
  
  .view-controls {
    justify-content: center;
    margin-bottom: 16px;
  }
  
  .view-controls .d-flex {
    flex-direction: column;
    gap: 12px;
  }
  
  .item-card {
    margin-bottom: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .table-responsive {
    font-size: 0.875rem;
  }
  
  .table thead th,
  .table tbody td {
    padding: 8px 6px;
  }
  
  .actions-column {
    width: 80px;
  }
  
  .btn-group-sm .btn {
    padding: 4px 8px;
  }
  
  .item-avatar-letters {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }
  
  .avatar-sm-table {
    width: 28px;
    height: 28px;
    font-size: 0.7rem;
  }
}

@media (max-width: 576px) {
  .detail-row {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .item-details {
    font-size: 0.875rem;
  }
  
  .dropdown-menu {
    min-width: 180px !important;
  }
}

/* Animaciones */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.item-card,
.table tbody tr {
  animation: fadeIn 0.3s ease-out;
}

/* Efectos hover mejorados */
.btn:hover {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.card:hover {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
