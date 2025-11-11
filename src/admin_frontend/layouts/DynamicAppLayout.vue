<template>
  <div class="dynamic-app-layout">
    <!-- Navbar admin fijo -->
    <AdminNavbar 
      :page-title="appConfig.name"
      :user-name="userName"
      :notification-count="notificationCount"
      @search="handleGlobalSearch"
      @showNotifications="handleNotifications"
      @showHistory="handleHistory"
      @logout="handleLogout"
    />

    <!-- Main content -->
    <main class="main-content">
      <div class="container-fluid p-0">
        <!-- App Header -->
        <div class="app-header">
          <div class="container-fluid">
            <div class="row align-items-center py-3">
              <div class="col">
                <div class="d-flex align-items-center">
                  <i :class="appConfig.icon" class="app-icon me-3"></i>
                  <div>
                    <h1 class="app-title mb-0">{{ appConfig.name }}</h1>
                    <p class="app-description text-muted mb-0">{{ appConfig.description }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Controls Bar -->
        <div class="controls-bar">
          <div class="container-fluid">
            <div class="row align-items-center py-3">
              <!-- Left side actions -->
              <div class="col-md-6">
                <div class="d-flex gap-2 align-items-center">
                  <button 
                    class="btn btn-primary d-flex align-items-center" 
                    @click="openCreateModal"
                  >
                    <i class="bi bi-plus-lg me-2"></i>
                    Nuevo {{ appConfig.singular }}
                  </button>
                  <button 
                    class="btn btn-outline-danger d-flex align-items-center" 
                    :disabled="!selectedItems.length" 
                    @click="deleteSelected"
                  >
                    <i class="bi bi-trash me-2"></i>
                    Eliminar ({{ selectedItems.length }})
                  </button>
                </div>
              </div>

              <!-- Right side controls -->
              <div class="col-md-6">
                <div class="row g-2 align-items-center">
                  <!-- Search box -->
                  <div class="col">
                    <div class="search-container">
                      <i class="bi bi-search search-icon"></i>
                      <input 
                        v-model="searchQuery"
                        type="text" 
                        class="form-control search-input"
                        :placeholder="`Buscar por ${appConfig.searchFields.join(', ')}...`"
                        @input="handleSearch"
                      />
                      <button 
                        v-if="searchQuery" 
                        class="btn btn-sm btn-outline-secondary clear-search"
                        @click="clearSearch"
                      >
                        <i class="bi bi-x"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Content Area -->
        <div class="content-area">
          <div class="container-fluid">
            <!-- Loading state -->
            <div v-if="loading" class="text-center py-5">
              <div class="spinner-border text-primary mb-3" role="status">
                <span class="visually-hidden">Cargando...</span>
              </div>
              <p class="text-muted">Cargando {{ appConfig.name.toLowerCase() }}...</p>
            </div>

            <!-- Content slot -->
            <slot 
              v-else
              :items="filteredItems"
              :selected-items="selectedItems"
              :toggle-selection="toggleSelection"
              :select-all="selectAll"
              :clear-selection="clearSelection"
              :open-edit-modal="openEditModal"
              :delete-item="deleteItem"
            ></slot>
          </div>
        </div>
      </div>
    </main>

    <!-- Dynamic Form Modal -->
    <DynamicFormModal
      v-if="showModal"
      :config="appConfig"
      :item="editingItem"
      :is-editing="isEditing"
      :related-data="relatedData"
      @save="handleSave"
      @savePassword="handleSavePassword"
      @close="closeModal"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AdminNavbar from '../components/AdminNavbar.vue'
import DynamicFormModal from '../components/DynamicFormModal.vue'
import { useAdminAuth } from '@/composables/useAdminAuth.js'

const props = defineProps({
  appConfig: {
    type: Object,
    required: true
  },
  items: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  relatedData: {
    type: Object,
    default: () => ({})
  },
  userName: {
    type: String,
    default: ''
  },
  notificationCount: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits([
  'search', 
  'sort', 
  'create', 
  'update', 
  'delete', 
  'deleteSelected',
  'savePassword',
  'showNotifications',
  'showHistory'
])

const router = useRouter()
const { logout: adminLogout } = useAdminAuth()

// Estado reactivo
const searchQuery = ref('')
const sortField = ref('')
const sortDirection = ref('asc')
const selectedItems = ref([])
const showModal = ref(false)
const editingItem = ref(null)
const isEditing = ref(false)

// Computed
const filteredItems = computed(() => {
  let filtered = [...props.items]
  
  // Aplicar filtro de búsqueda
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(item => {
      return props.appConfig.searchFields.some(field => {
        const value = getNestedValue(item, field)
        return value && value.toString().toLowerCase().includes(query)
      })
    })
  }
  
  // Aplicar ordenamiento
  if (sortField.value) {
    filtered.sort((a, b) => {
      const aVal = getNestedValue(a, sortField.value) || ''
      const bVal = getNestedValue(b, sortField.value) || ''
      
      if (sortDirection.value === 'asc') {
        return aVal.toString().localeCompare(bVal.toString())
      } else {
        return bVal.toString().localeCompare(aVal.toString())
      }
    })
  }
  
  return filtered
})

// Métodos
function getNestedValue(obj, path) {
  return path.split('.').reduce((current, key) => current?.[key], obj)
}

function handleSearch() {
  emit('search', searchQuery.value)
}

function clearSearch() {
  searchQuery.value = ''
  handleSearch()
}

function setSortField(field, direction) {
  sortField.value = field
  sortDirection.value = direction
  emit('sort', { field, direction })
}

function toggleSelection(id) {
  const index = selectedItems.value.indexOf(id)
  if (index >= 0) {
    selectedItems.value.splice(index, 1)
  } else {
    selectedItems.value.push(id)
  }
}

function selectAll() {
  selectedItems.value = [...filteredItems.value.map(item => item.id)]
}

function clearSelection() {
  selectedItems.value = []
}

function openCreateModal() {
  editingItem.value = null
  isEditing.value = false
  showModal.value = true
}

function openEditModal(item) {
  editingItem.value = { ...item }
  isEditing.value = true
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  editingItem.value = null
  isEditing.value = false
}

function handleSave(data) {
  if (isEditing.value) {
    emit('update', { id: editingItem.value.id, data })
  } else {
    emit('create', data)
  }
  closeModal()
}

function handleSavePassword(passwordData) {
  emit('savePassword', passwordData)
}

function deleteItem(id) {
  if (confirm(`¿Estás seguro de eliminar este ${props.appConfig.singular.toLowerCase()}?`)) {
    emit('delete', id)
  }
}

function deleteSelected() {
  if (confirm(`¿Estás seguro de eliminar ${selectedItems.value.length} ${props.appConfig.name.toLowerCase()}?`)) {
    emit('deleteSelected', [...selectedItems.value])
    selectedItems.value = []
  }
}

function handleGlobalSearch(query) {
  searchQuery.value = query
  handleSearch()
}

function handleNotifications() {
  emit('showNotifications')
}

function handleHistory() {
  emit('showHistory')
}

async function handleLogout() {
  try {
    await adminLogout()
    router.push('/admin/login')
  } catch (error) {
    console.error('Error al cerrar sesión:', error)
    router.push('/admin/login')
  }
}

// Lifecycle
onMounted(async () => {
  // Inicializar Bootstrap dropdowns
  setTimeout(() => {
    try {
      import('bootstrap').then(({ Dropdown, Tooltip }) => {
        // Inicializar todos los dropdowns
        const dropdownElements = document.querySelectorAll('[data-bs-toggle="dropdown"]')
        dropdownElements.forEach(el => {
          new Dropdown(el)
        })
        
        // Inicializar tooltips
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

// Watchers
watch(() => props.items, () => {
  // Limpiar selecciones cuando cambian los items
  selectedItems.value = selectedItems.value.filter(id => 
    props.items.some(item => item.id === id)
  )
})

defineExpose({
  clearSelection,
  selectAll,
  openCreateModal,
  openEditModal
})
</script>

<style scoped>
.dynamic-app-layout {
  min-height: 100vh;
  background: var(--bs-body-bg);
  color: var(--bs-body-color);
}

[data-bs-theme="dark"] .dynamic-app-layout {
  background: var(--bs-dark);
}

.main-content {
  margin-top: 76px;
  min-height: calc(100vh - 76px);
}

.app-header {
  background: var(--bs-body-bg);
  border-bottom: 1px solid var(--bs-border-color);
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

[data-bs-theme="dark"] .app-header {
  background: var(--bs-dark);
  border-bottom-color: #495057;
  box-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.app-icon {
  font-size: 2.5rem;
  color: #6f42c1;
  background: linear-gradient(45deg, #6f42c1, #007bff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.app-title {
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--bs-body-color);
}

.app-description {
  font-size: 0.95rem;
  color: var(--bs-secondary-color);
}

.controls-bar {
  background: var(--bs-body-bg);
  border-bottom: 1px solid var(--bs-border-color);
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

[data-bs-theme="dark"] .controls-bar {
  background: var(--bs-dark);
  border-bottom-color: #495057;
}

.search-container {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
  z-index: 10;
}

.search-input {
  padding-left: 40px;
  padding-right: 40px;
  border: 1px solid var(--bs-border-color);
  border-radius: 8px;
  background: var(--bs-body-bg);
  color: var(--bs-body-color);
  transition: all 0.3s ease;
}

[data-bs-theme="dark"] .search-input {
  background: #2d3748;
  border-color: #495057;
  color: var(--bs-light);
}

.search-input:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 0.25rem rgba(0, 123, 255, 0.25);
  background: var(--bs-body-bg);
}

[data-bs-theme="dark"] .search-input:focus {
  background: #2d3748;
}

.clear-search {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: transparent;
  padding: 4px 8px;
  font-size: 0.875rem;
  color: var(--bs-body-color);
}

.content-area {
  background: var(--bs-body-bg);
  min-height: calc(100vh - 200px);
  padding: 20px 0;
}

[data-bs-theme="dark"] .content-area {
  background: var(--bs-dark);
}

.btn {
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(45deg, #007bff, #0056b3);
  border: none;
  box-shadow: 0 2px 4px rgba(0, 123, 255, 0.3);
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 123, 255, 0.4);
}

.btn-outline-danger:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.dropdown-menu {
  border: none;
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
  border-radius: 8px;
  background: var(--bs-body-bg);
}

[data-bs-theme="dark"] .dropdown-menu {
  background: var(--bs-dark);
  box-shadow: 0 4px 16px rgba(0,0,0,0.3);
}

.dropdown-item {
  padding: 8px 16px;
  transition: all 0.2s ease;
  color: var(--bs-body-color);
}

.dropdown-item:hover {
  background: #f8f9fa;
  color: #007bff;
}

[data-bs-theme="dark"] .dropdown-item:hover {
  background: #495057;
  color: var(--bs-primary);
}

/* Table styles for dark mode */
[data-bs-theme="dark"] .table {
  color: var(--bs-light);
}

[data-bs-theme="dark"] .table-striped > tbody > tr:nth-of-type(odd) > td,
[data-bs-theme="dark"] .table-striped > tbody > tr:nth-of-type(odd) > th {
  background-color: rgba(255, 255, 255, 0.05);
}

[data-bs-theme="dark"] .table-hover > tbody > tr:hover > td,
[data-bs-theme="dark"] .table-hover > tbody > tr:hover > th {
  background-color: rgba(255, 255, 255, 0.1);
}

/* Card styles for dark mode */
[data-bs-theme="dark"] .card {
  background: #2d3748;
  border-color: #495057;
  color: var(--bs-light);
}

@media (max-width: 768px) {
  .main-content {
    margin-top: 60px;
  }
  
  .app-title {
    font-size: 1.5rem;
  }
  
  .app-icon {
    font-size: 2rem;
  }
  
  .controls-bar .row {
    flex-direction: column;
    gap: 12px;
  }
  
  .controls-bar .col-md-6:first-child {
    order: 2;
  }
  
  .controls-bar .col-md-6:last-child {
    order: 1;
  }
}
</style>
