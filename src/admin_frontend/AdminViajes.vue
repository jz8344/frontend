<template>
  <div class="viajes-container">
    <div class="header">
      <h2>Gestión de Viajes</h2>
      <button @click="openModal('create')" class="btn-primary">
        <i class="icon-plus"></i> Nuevo Viaje
      </button>
    </div>

    <!-- Filtros -->
    <div class="filters">
      <div class="filter-group">
        <label>Fecha</label>
        <input type="date" v-model="filters.fecha" @change="loadViajes">
      </div>
      <div class="filter-group">
        <label>Estado</label>
        <select v-model="filters.estado" @change="loadViajes">
          <option value="">Todos</option>
          <option value="pendiente">Pendiente</option>
          <option value="confirmaciones_abiertas">Confirmaciones Abiertas</option>
          <option value="confirmaciones_cerradas">Confirmaciones Cerradas</option>
          <option value="en_curso">En Curso</option>
          <option value="completado">Completado</option>
          <option value="cancelado">Cancelado</option>
        </select>
      </div>
      <div class="filter-group">
        <label>Escuela</label>
        <select v-model="filters.escuela_id" @change="loadViajes">
          <option value="">Todas</option>
          <option v-for="escuela in escuelas" :key="escuela.id" :value="escuela.id">
            {{ escuela.nombre }}
          </option>
        </select>
      </div>
      <button @click="clearFilters" class="btn-secondary">Limpiar Filtros</button>
    </div>

    <!-- Tabla de Viajes -->
    <div class="table-container">
      <table v-if="viajes.length > 0">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Nombre Ruta</th>
            <th>Escuela</th>
            <th>Chofer</th>
            <th>Unidad</th>
            <th>Horario</th>
            <th>Confirmaciones</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="viaje in viajes" :key="viaje.id">
            <td>{{ formatDate(viaje.fecha_viaje) }}</td>
            <td>{{ viaje.nombre_ruta }}</td>
            <td>{{ viaje.escuela?.nombre || 'N/A' }}</td>
            <td>{{ viaje.chofer ? `${viaje.chofer.nombre} ${viaje.chofer.apellidos}` : 'Sin asignar' }}</td>
            <td>{{ viaje.unidad?.numero_unidad || 'Sin asignar' }}</td>
            <td>
              <div class="horarios">
                <small>Conf: {{ viaje.hora_inicio_confirmacion }} - {{ viaje.hora_fin_confirmacion }}</small><br>
                <small>Viaje: {{ viaje.hora_inicio_viaje }} - {{ viaje.hora_llegada_estimada }}</small>
              </div>
            </td>
            <td>
              <span class="badge">{{ viaje.ninos_confirmados || 0 }} / {{ viaje.capacidad_maxima }}</span>
            </td>
            <td>
              <span :class="'status-badge status-' + viaje.estado">
                {{ getEstadoLabel(viaje.estado) }}
              </span>
            </td>
            <td>
              <div class="action-buttons">
                <button @click="viewViaje(viaje)" class="btn-icon" title="Ver detalles">
                  👁️
                </button>
                <button 
                  v-if="viaje.estado === 'pendiente' || viaje.estado === 'confirmaciones_abiertas'"
                  @click="openModal('edit', viaje)" 
                  class="btn-icon" 
                  title="Editar">
                  ✏️
                </button>
                <button 
                  v-if="viaje.estado === 'pendiente'"
                  @click="abrirConfirmaciones(viaje.id)" 
                  class="btn-icon btn-success" 
                  title="Abrir confirmaciones">
                  🔓
                </button>
                <button 
                  v-if="viaje.estado === 'confirmaciones_abiertas'"
                  @click="cerrarConfirmaciones(viaje.id)" 
                  class="btn-icon btn-warning" 
                  title="Cerrar confirmaciones">
                  🔒
                </button>
                <button 
                  v-if="viaje.estado !== 'en_curso' && viaje.estado !== 'completado'"
                  @click="deleteViaje(viaje.id)" 
                  class="btn-icon btn-danger" 
                  title="Eliminar">
                  🗑️
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else class="no-data">
        <p>No hay viajes registrados</p>
      </div>
    </div>

    <!-- Modal de Crear/Editar -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ modalMode === 'create' ? 'Nuevo Viaje' : 'Editar Viaje' }}</h3>
          <button @click="closeModal" class="btn-close">×</button>
        </div>
        <form @submit.prevent="submitForm">
          <div class="form-grid">
            <div class="form-group">
              <label>Nombre de la Ruta *</label>
              <input 
                type="text" 
                v-model="formData.nombre_ruta" 
                required
                placeholder="Ej: Ruta Norte Matutina">
            </div>

            <div class="form-group">
              <label>Escuela *</label>
              <select v-model="formData.escuela_id" required>
                <option value="">Seleccionar escuela</option>
                <option v-for="escuela in escuelas" :key="escuela.id" :value="escuela.id">
                  {{ escuela.nombre }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label>Chofer</label>
              <select v-model="formData.chofer_id">
                <option value="">Sin asignar</option>
                <option v-for="chofer in choferes" :key="chofer.id" :value="chofer.id">
                  {{ chofer.nombre }} {{ chofer.apellidos }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label>Unidad</label>
              <select v-model="formData.unidad_id">
                <option value="">Sin asignar</option>
                <option v-for="unidad in unidades" :key="unidad.id" :value="unidad.id">
                  {{ unidad.numero_unidad }} - {{ unidad.modelo }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label>Fecha del Viaje *</label>
              <input 
                type="date" 
                v-model="formData.fecha_viaje" 
                required
                :min="today">
            </div>

            <div class="form-group">
              <label>Capacidad Máxima</label>
              <input 
                type="number" 
                v-model="formData.capacidad_maxima" 
                min="1"
                placeholder="30">
            </div>

            <div class="form-group">
              <label>Inicio Confirmación *</label>
              <input 
                type="time" 
                v-model="formData.hora_inicio_confirmacion" 
                required>
              <small>Hora de inicio del período de confirmación</small>
            </div>

            <div class="form-group">
              <label>Fin Confirmación *</label>
              <input 
                type="time" 
                v-model="formData.hora_fin_confirmacion" 
                required>
              <small>Hora de cierre del período de confirmación</small>
            </div>

            <div class="form-group">
              <label>Inicio de Viaje *</label>
              <input 
                type="time" 
                v-model="formData.hora_inicio_viaje" 
                required>
              <small>Hora en que el chofer inicia el viaje</small>
            </div>

            <div class="form-group">
              <label>Llegada Estimada *</label>
              <input 
                type="time" 
                v-model="formData.hora_llegada_estimada" 
                required>
              <small>Hora estimada de llegada a la escuela</small>
            </div>

            <div class="form-group full-width">
              <label>Notas</label>
              <textarea 
                v-model="formData.notas" 
                rows="3"
                placeholder="Observaciones adicionales sobre el viaje..."></textarea>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" @click="closeModal" class="btn-secondary">Cancelar</button>
            <button type="submit" class="btn-primary" :disabled="loading">
              {{ loading ? 'Guardando...' : 'Guardar' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal de Detalles -->
    <div v-if="showDetailsModal" class="modal-overlay" @click.self="showDetailsModal = false">
      <div class="modal-content modal-large">
        <div class="modal-header">
          <h3>Detalles del Viaje</h3>
          <button @click="showDetailsModal = false" class="btn-close">×</button>
        </div>
        <div class="details-content" v-if="selectedViaje">
          <div class="details-grid">
            <div class="detail-item">
              <strong>Nombre:</strong>
              <span>{{ selectedViaje.nombre_ruta }}</span>
            </div>
            <div class="detail-item">
              <strong>Escuela:</strong>
              <span>{{ selectedViaje.escuela?.nombre }}</span>
            </div>
            <div class="detail-item">
              <strong>Fecha:</strong>
              <span>{{ formatDate(selectedViaje.fecha_viaje) }}</span>
            </div>
            <div class="detail-item">
              <strong>Estado:</strong>
              <span :class="'status-badge status-' + selectedViaje.estado">
                {{ getEstadoLabel(selectedViaje.estado) }}
              </span>
            </div>
          </div>

          <h4>Confirmaciones ({{ selectedViaje.confirmaciones?.length || 0 }})</h4>
          <table v-if="selectedViaje.confirmaciones && selectedViaje.confirmaciones.length > 0">
            <thead>
              <tr>
                <th>Hijo</th>
                <th>Padre</th>
                <th>Dirección</th>
                <th>QR Escaneado</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="conf in selectedViaje.confirmaciones" :key="conf.id">
                <td>{{ conf.hijo?.nombre }} {{ conf.hijo?.apellidos }}</td>
                <td>{{ conf.usuario?.nombre }} {{ conf.usuario?.apellidos }}</td>
                <td>{{ conf.direccion_recogida }}</td>
                <td>{{ conf.qr_escaneado ? '✅' : '❌' }}</td>
                <td>{{ conf.estado }}</td>
              </tr>
            </tbody>
          </table>
          <p v-else class="no-data">No hay confirmaciones para este viaje</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'AdminViajes',
  data() {
    return {
      viajes: [],
      escuelas: [],
      choferes: [],
      unidades: [],
      showModal: false,
      showDetailsModal: false,
      modalMode: 'create',
      loading: false,
      selectedViaje: null,
      filters: {
        fecha: '',
        estado: '',
        escuela_id: ''
      },
      formData: {
        nombre_ruta: '',
        escuela_id: '',
        chofer_id: '',
        unidad_id: '',
        hora_inicio_confirmacion: '06:00',
        hora_fin_confirmacion: '06:30',
        hora_inicio_viaje: '06:45',
        hora_llegada_estimada: '08:00',
        fecha_viaje: '',
        notas: '',
        capacidad_maxima: 30
      }
    };
  },
  computed: {
    today() {
      return new Date().toISOString().split('T')[0];
    }
  },
  mounted() {
    this.loadViajes();
    this.loadEscuelas();
    this.loadChoferes();
    this.loadUnidades();
  },
  methods: {
    async loadViajes() {
      try {
        const params = {};
        if (this.filters.fecha) params.fecha_viaje = this.filters.fecha;
        if (this.filters.estado) params.estado = this.filters.estado;
        if (this.filters.escuela_id) params.escuela_id = this.filters.escuela_id;

        const response = await axios.get('/api/admin/viajes', { params });
        this.viajes = response.data.data;
      } catch (error) {
        console.error('Error al cargar viajes:', error);
        this.$toast?.error('Error al cargar viajes');
      }
    },
    async loadEscuelas() {
      try {
        const response = await axios.get('/api/admin/escuelas');
        this.escuelas = response.data.data;
      } catch (error) {
        console.error('Error al cargar escuelas:', error);
      }
    },
    async loadChoferes() {
      try {
        const response = await axios.get('/api/admin/choferes');
        this.choferes = response.data.data;
      } catch (error) {
        console.error('Error al cargar choferes:', error);
      }
    },
    async loadUnidades() {
      try {
        const response = await axios.get('/api/admin/unidades');
        this.unidades = response.data.data;
      } catch (error) {
        console.error('Error al cargar unidades:', error);
      }
    },
    openModal(mode, viaje = null) {
      this.modalMode = mode;
      if (mode === 'edit' && viaje) {
        this.formData = { ...viaje };
      } else {
        this.resetForm();
      }
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.resetForm();
    },
    resetForm() {
      this.formData = {
        nombre_ruta: '',
        escuela_id: '',
        chofer_id: '',
        unidad_id: '',
        hora_inicio_confirmacion: '06:00',
        hora_fin_confirmacion: '06:30',
        hora_inicio_viaje: '06:45',
        hora_llegada_estimada: '08:00',
        fecha_viaje: '',
        notas: '',
        capacidad_maxima: 30
      };
    },
    async submitForm() {
      this.loading = true;
      try {
        if (this.modalMode === 'create') {
          await axios.post('/api/admin/viajes', this.formData);
          this.$toast?.success('Viaje creado exitosamente');
        } else {
          await axios.put(`/api/admin/viajes/${this.formData.id}`, this.formData);
          this.$toast?.success('Viaje actualizado exitosamente');
        }
        this.closeModal();
        this.loadViajes();
      } catch (error) {
        console.error('Error al guardar viaje:', error);
        this.$toast?.error(error.response?.data?.message || 'Error al guardar viaje');
      } finally {
        this.loading = false;
      }
    },
    async deleteViaje(id) {
      if (!confirm('¿Está seguro de eliminar este viaje?')) return;

      try {
        await axios.delete(`/api/admin/viajes/${id}`);
        this.$toast?.success('Viaje eliminado exitosamente');
        this.loadViajes();
      } catch (error) {
        console.error('Error al eliminar viaje:', error);
        this.$toast?.error(error.response?.data?.message || 'Error al eliminar viaje');
      }
    },
    async viewViaje(viaje) {
      try {
        const response = await axios.get(`/api/admin/viajes/${viaje.id}`);
        this.selectedViaje = response.data.data;
        this.showDetailsModal = true;
      } catch (error) {
        console.error('Error al cargar detalles:', error);
        this.$toast?.error('Error al cargar detalles del viaje');
      }
    },
    async abrirConfirmaciones(id) {
      try {
        await axios.post(`/api/admin/viajes/${id}/abrir-confirmaciones`);
        this.$toast?.success('Periodo de confirmaciones abierto');
        this.loadViajes();
      } catch (error) {
        console.error('Error:', error);
        this.$toast?.error(error.response?.data?.message || 'Error al abrir confirmaciones');
      }
    },
    async cerrarConfirmaciones(id) {
      try {
        await axios.post(`/api/admin/viajes/${id}/cerrar-confirmaciones`);
        this.$toast?.success('Periodo de confirmaciones cerrado');
        this.loadViajes();
      } catch (error) {
        console.error('Error:', error);
        this.$toast?.error(error.response?.data?.message || 'Error al cerrar confirmaciones');
      }
    },
    clearFilters() {
      this.filters = {
        fecha: '',
        estado: '',
        escuela_id: ''
      };
      this.loadViajes();
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('es-MX');
    },
    getEstadoLabel(estado) {
      const labels = {
        'pendiente': 'Pendiente',
        'confirmaciones_abiertas': 'Confirmaciones Abiertas',
        'confirmaciones_cerradas': 'Confirmaciones Cerradas',
        'en_curso': 'En Curso',
        'completado': 'Completado',
        'cancelado': 'Cancelado'
      };
      return labels[estado] || estado;
    }
  }
};
</script>

<style scoped>
.viajes-container {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.filters {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  padding: 15px;
  background: #f5f5f5;
  border-radius: 8px;
}

.filter-group {
  display: flex;
  flex-direction: column;
}

.filter-group label {
  font-size: 12px;
  margin-bottom: 5px;
  color: #666;
}

.filter-group input,
.filter-group select {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.table-container {
  overflow-x: auto;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: #f8f9fa;
}

th, td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #dee2e6;
}

.horarios {
  font-size: 12px;
}

.badge {
  background: #e9ecef;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-pendiente { background: #ffc107; color: #000; }
.status-confirmaciones_abiertas { background: #28a745; color: #fff; }
.status-confirmaciones_cerradas { background: #17a2b8; color: #fff; }
.status-en_curso { background: #007bff; color: #fff; }
.status-completado { background: #6c757d; color: #fff; }
.status-cancelado { background: #dc3545; color: #fff; }

.action-buttons {
  display: flex;
  gap: 5px;
}

.btn-icon {
  padding: 5px 10px;
  border: none;
  background: #f8f9fa;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.btn-icon:hover {
  background: #e9ecef;
}

.btn-success { background: #28a745; color: white; }
.btn-warning { background: #ffc107; }
.btn-danger { background: #dc3545; color: white; }

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  padding: 20px;
  max-width: 800px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-large {
  max-width: 1000px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.btn-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  margin-bottom: 5px;
  font-weight: 500;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-group small {
  font-size: 11px;
  color: #666;
  margin-top: 2px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.btn-primary {
  padding: 10px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-primary:hover {
  background: #0056b3;
}

.btn-secondary {
  padding: 10px 20px;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.no-data {
  text-align: center;
  padding: 40px;
  color: #666;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-bottom: 20px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.detail-item strong {
  color: #666;
  font-size: 12px;
}

.details-content h4 {
  margin: 20px 0 10px 0;
}
</style>
