<template>
  <AdminLayout 
    page-title="Configuración del Sistema"
    page-description="Ajustes y configuraciones administrativas"
    :loading="loading"
    @search="handleSearch"
    @showNotifications="handleNotifications"
    @showHistory="handleHistory"
  >
    <div class="row">
      <div class="col-md-6">
        <div class="card shadow-sm border-0">
          <div class="card-header">
            <h5 class="mb-0">Configuración General</h5>
          </div>
          <div class="card-body">
            <p>Configuraciones del sistema en desarrollo...</p>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="card shadow-sm border-0">
          <div class="card-header">
            <h5 class="mb-0">Ajustes de Seguridad</h5>
          </div>
          <div class="card-body">
            <p>Configuraciones de seguridad en desarrollo...</p>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref } from 'vue'
import AdminLayout from './layouts/AdminLayout.vue'

const loading = ref(false)

const handleSearch = (query) => {
  console.log('Buscar:', query)
}

const handleNotifications = () => {
  console.log('Mostrar notificaciones')
}

const handleHistory = () => {
  console.log('Mostrar historial')
}
</script>
