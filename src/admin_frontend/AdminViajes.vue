<template>
  <div class="viajes-container">
    <div class="header">
      <h2>Gestión de Viajes</h2>
      <div class="header-actions">
        <button @click="showNotificationsPanel = true" class="btn-notification" title="Ver notificaciones">
          <i class="bi bi-bell-fill"></i>
          <span v-if="unreadCount > 0" class="notification-badge">{{ unreadCount }}</span>
        </button>
        <button @click="openModal('create')" class="btn-primary">
          <i class="icon-plus"></i> Nuevo Viaje
        </button>
      </div>
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
          <tr v-for="viaje in viajes" :key="viaje.id" :class="{'row-plantilla': viaje.es_plantilla}">
            <td>
              <div v-if="viaje.es_plantilla">
                <span class="badge badge-recurrente">🔄 Recurrente</span>
                <div class="dias-small">{{ formatDiasSemana(viaje.dias_semana) }}</div>
              </div>
              <div v-else>
                {{ formatDate(viaje.fecha_viaje) }}
                <div v-if="viaje.parent_viaje_id" class="badge-instancia">📌 Instancia</div>
              </div>
            </td>
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
              <span v-if="!viaje.es_plantilla" class="badge">{{ viaje.ninos_confirmados || 0 }} / {{ viaje.capacidad_maxima }}</span>
              <span v-else class="badge badge-secondary">Plantilla</span>
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
                  v-if="viaje.es_plantilla || viaje.estado === 'pendiente' || viaje.estado === 'confirmaciones_abiertas'"
                  @click="openModal('edit', viaje)" 
                  class="btn-icon" 
                  title="Editar">
                  ✏️
                </button>
                <button 
                  v-if="!viaje.es_plantilla && viaje.estado === 'pendiente'"
                  @click="abrirConfirmaciones(viaje.id)" 
                  class="btn-icon btn-success" 
                  title="Abrir confirmaciones">
                  🔓
                </button>
                <button 
                  v-if="!viaje.es_plantilla && viaje.estado === 'confirmaciones_abiertas'"
                  @click="cerrarConfirmaciones(viaje.id)" 
                  class="btn-icon btn-warning" 
                  title="Cerrar confirmaciones">
                  🔒
                </button>
                <button 
                  v-if="viaje.es_plantilla || (viaje.estado !== 'en_curso' && viaje.estado !== 'completado')"
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
              <label>Turno *</label>
              <select v-model="formData.turno" required>
                <option value="">Seleccionar turno</option>
                <option value="matutino">Matutino (Mañana)</option>
                <option value="vespertino">Vespertino (Tarde)</option>
              </select>
            </div>

            <div class="form-group">
              <label>Tipo de Viaje</label>
              <select v-model="formData.tipo_viaje" disabled>
                <option value="ida">Ida (Casa → Escuela)</option>
                <option value="retorno">Retorno (Escuela → Casa)</option>
              </select>
              <small>Los viajes de retorno se crean automáticamente</small>
            </div>

            <div class="form-group">
              <label>{{ esViajeRecurrente ? 'Fecha de Inicio *' : 'Fecha del Viaje *' }}</label>
              <input 
                type="date" 
                v-model="formData.fecha_viaje" 
                required
                :min="today">
              <small v-if="esViajeRecurrente">Fecha a partir de la cual comienza la recurrencia</small>
            </div>

            <div class="form-group">
              <label>Capacidad Máxima *</label>
              <input 
                type="number" 
                v-model.number="formData.capacidad_maxima" 
                min="1"
                required
                :placeholder="formData.unidad_id ? 'Auto (de unidad)' : 'Ingrese capacidad'"
                :readonly="!!formData.unidad_id">
              <small v-if="selectedUnidadCapacidad">Capacidad de unidad: {{ selectedUnidadCapacidad }} asientos</small>
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

            <!-- Sección de Viaje Recurrente -->
            <div class="form-group full-width">
              <label class="checkbox-label">
                <input type="checkbox" v-model="esViajeRecurrente">
                <strong>Viaje Recurrente (Lunes a Viernes)</strong>
              </label>
            </div>

            <div v-if="esViajeRecurrente" class="form-group">
              <label>Fecha de Finalización</label>
              <input 
                type="date" 
                v-model="formData.fecha_fin" 
                :min="formData.fecha_viaje">
              <small>Fecha hasta la que se repite el viaje (Lun-Vie)</small>
            </div>

            <div v-if="!esViajeRecurrente" class="form-group full-width">
              <label>Días de la Semana (viaje único)</label>
              <div class="dias-semana">
                <label v-for="dia in diasSemana" :key="dia.value" class="dia-checkbox">
                  <input 
                    type="checkbox" 
                    :value="dia.value" 
                    v-model="formData.dias_semana"
                    :disabled="esViajeRecurrente">
                  {{ dia.label }}
                </label>
              </div>
              <small>Selecciona los días en que se realiza este viaje</small>
            </div>

            <!-- Sección de Confirmación Automática -->
            <div class="form-group full-width">
              <label class="checkbox-label">
                <input type="checkbox" v-model="formData.confirmacion_automatica">
                <strong>Confirmación Automática</strong>
              </label>
              <small>Al abrir confirmaciones, usa la ubicación guardada del niño automáticamente</small>
            </div>

            <!-- Sección de Viaje de Retorno -->
            <div v-if="formData.tipo_viaje === 'ida'" class="form-group full-width">
              <label class="checkbox-label">
                <input type="checkbox" v-model="formData.crear_retorno">
                <strong>Crear Viaje de Retorno Automático</strong>
              </label>
            </div>

            <div v-if="formData.crear_retorno && formData.tipo_viaje === 'ida'" class="retorno-section">
              <h4>⚙️ Configuración del Viaje de Retorno</h4>
              <div class="form-grid">
                <div class="form-group">
                  <label>Inicio Confirmación (Retorno)</label>
                  <input 
                    type="time" 
                    v-model="formData.hora_inicio_confirmacion_retorno"
                    placeholder="12:00">
                </div>
                <div class="form-group">
                  <label>Fin Confirmación (Retorno)</label>
                  <input 
                    type="time" 
                    v-model="formData.hora_fin_confirmacion_retorno"
                    placeholder="12:30">
                </div>
                <div class="form-group">
                  <label>Inicio Viaje (Retorno)</label>
                  <input 
                    type="time" 
                    v-model="formData.hora_inicio_retorno"
                    placeholder="13:00">
                </div>
                <div class="form-group">
                  <label>Llegada Estimada (Retorno)</label>
                  <input 
                    type="time" 
                    v-model="formData.hora_llegada_retorno"
                    placeholder="15:00">
                </div>
              </div>
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

  <!-- Panel de Notificaciones -->
  <NotificationsPanel 
    :is-visible="showNotificationsPanel"
    @close="showNotificationsPanel = false"
  />
</template>

<script>
import axios from 'axios';
import NotificationsPanel from './components/NotificationsPanel.vue';
import { useNotifications } from '@/composables/useNotifications';

export default {
  name: 'AdminViajes',
  components: {
    NotificationsPanel
  },
  setup() {
    const { notifyCreated, notifyUpdated, notifyDeleted, addNotification, notifications, unreadCount } = useNotifications();
    return { notifyCreated, notifyUpdated, notifyDeleted, addNotification, notifications, unreadCount };
  },
  data() {
    return {
      viajes: [],
      escuelas: [],
      choferes: [],
      unidades: [],
      showModal: false,
      showDetailsModal: false,
      showNotificationsPanel: false,
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
        turno: '',
        tipo_viaje: 'ida',
        hora_inicio_confirmacion: '06:00',
        hora_fin_confirmacion: '06:30',
        hora_inicio_viaje: '06:45',
        hora_llegada_estimada: '08:00',
        fecha_viaje: '',
        fecha_fin: '',
        notas: '',
        capacidad_maxima: null,
        dias_semana: [],
        confirmacion_automatica: false,
        crear_retorno: false,
        hora_inicio_confirmacion_retorno: '',
        hora_fin_confirmacion_retorno: '',
        hora_inicio_retorno: '',
        hora_llegada_retorno: ''
      },
      esViajeRecurrente: false,
      diasSemana: [
        { label: 'Lun', value: 1 },
        { label: 'Mar', value: 2 },
        { label: 'Mié', value: 3 },
        { label: 'Jue', value: 4 },
        { label: 'Vie', value: 5 },
        { label: 'Sáb', value: 6 },
        { label: 'Dom', value: 0 }
      ]
    };
  },
  computed: {
    today() {
      return new Date().toISOString().split('T')[0];
    },
    selectedUnidadCapacidad() {
      if (!this.formData.unidad_id) return null;
      const unidad = this.unidades.find(u => u.id === this.formData.unidad_id);
      return unidad?.numero_asientos || null;
    }
  },
  watch: {
    'formData.unidad_id'(newVal) {
      if (newVal) {
        // Convertir a número para comparación
        const unidadId = parseInt(newVal);
        const unidad = this.unidades.find(u => u.id === unidadId);
        console.log('Unidad seleccionada:', unidad);
        if (unidad && unidad.numero_asientos) {
          this.formData.capacidad_maxima = parseInt(unidad.numero_asientos);
          console.log('Capacidad asignada:', this.formData.capacidad_maxima);
        }
      } else {
        // Si se deselecciona la unidad, permitir edición manual
        this.formData.capacidad_maxima = null;
      }
    },
    esViajeRecurrente(newVal) {
      if (newVal) {
        // Si es recurrente, establecer lunes a viernes automáticamente
        this.formData.dias_semana = [1, 2, 3, 4, 5];
        // Sugerir fecha fin (1 mes después)
        if (this.formData.fecha_viaje && !this.formData.fecha_fin) {
          const fechaInicio = new Date(this.formData.fecha_viaje);
          const fechaFin = new Date(fechaInicio);
          fechaFin.setMonth(fechaFin.getMonth() + 1);
          this.formData.fecha_fin = fechaFin.toISOString().split('T')[0];
        }
      } else {
        // Si no es recurrente, limpiar fecha_fin
        this.formData.fecha_fin = '';
      }
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
        // Cargar datos del viaje
        this.formData = {
          id: viaje.id,
          nombre_ruta: viaje.nombre_ruta,
          escuela_id: viaje.escuela_id,
          chofer_id: viaje.chofer_id || '',
          unidad_id: viaje.unidad_id || '',
          turno: viaje.turno || '',
          tipo_viaje: viaje.tipo_viaje || 'ida',
          hora_inicio_confirmacion: viaje.hora_inicio_confirmacion,
          hora_fin_confirmacion: viaje.hora_fin_confirmacion,
          hora_inicio_viaje: viaje.hora_inicio_viaje,
          hora_llegada_estimada: viaje.hora_llegada_estimada,
          fecha_viaje: viaje.fecha_viaje,
          fecha_fin: viaje.fecha_fin || '',
          notas: viaje.notas || '',
          capacidad_maxima: viaje.capacidad_maxima,
          dias_semana: Array.isArray(viaje.dias_semana) ? viaje.dias_semana : [],
          confirmacion_automatica: viaje.confirmacion_automatica || false,
          crear_retorno: false, // No mostrar en edición
          hora_inicio_confirmacion_retorno: '',
          hora_fin_confirmacion_retorno: '',
          hora_inicio_retorno: '',
          hora_llegada_retorno: ''
        };
        
        // Detectar si es viaje recurrente (tiene fecha_fin o dias_semana incluye Lun-Vie)
        const diasLunVie = [1, 2, 3, 4, 5];
        const tieneTodosLosDias = diasLunVie.every(dia => 
          this.formData.dias_semana.includes(dia)
        );
        this.esViajeRecurrente = tieneTodosLosDias && !!viaje.fecha_fin;
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
        turno: '',
        tipo_viaje: 'ida',
        hora_inicio_confirmacion: '06:00',
        hora_fin_confirmacion: '06:30',
        hora_inicio_viaje: '06:45',
        hora_llegada_estimada: '08:00',
        fecha_viaje: '',
        fecha_fin: '',
        notas: '',
        capacidad_maxima: null,
        dias_semana: [],
        confirmacion_automatica: false,
        crear_retorno: false,
        hora_inicio_confirmacion_retorno: '',
        hora_fin_confirmacion_retorno: '',
        hora_inicio_retorno: '',
        hora_llegada_retorno: ''
      };
      this.esViajeRecurrente = false;
    },
    async submitForm() {
      this.loading = true;
      try {
        // Preparar datos para enviar
        const dataToSend = { ...this.formData };
        dataToSend.es_recurrente = this.esViajeRecurrente;
        
        // Si no hay unidad, asegurar que capacidad_maxima sea requerida
        if (!dataToSend.unidad_id && !dataToSend.capacidad_maxima) {
          this.$toast?.error('Debes seleccionar una unidad o ingresar capacidad máxima');
          this.loading = false;
          return;
        }
        
        // Convertir IDs a números
        if (dataToSend.escuela_id) dataToSend.escuela_id = parseInt(dataToSend.escuela_id);
        if (dataToSend.chofer_id) dataToSend.chofer_id = parseInt(dataToSend.chofer_id);
        if (dataToSend.unidad_id) dataToSend.unidad_id = parseInt(dataToSend.unidad_id);
        if (dataToSend.capacidad_maxima) dataToSend.capacidad_maxima = parseInt(dataToSend.capacidad_maxima);
        
        // Limpiar strings vacíos
        if (dataToSend.chofer_id === '') dataToSend.chofer_id = null;
        if (dataToSend.unidad_id === '') dataToSend.unidad_id = null;
        if (dataToSend.notas === '') dataToSend.notas = null;
        if (dataToSend.fecha_fin === '') dataToSend.fecha_fin = null;
        
        console.log('Sending data:', dataToSend);
        
        if (this.modalMode === 'create') {
          const response = await axios.post('/api/admin/viajes', dataToSend);
          console.log('Create response:', response.data);
          this.$toast?.success('Viaje creado exitosamente');
          this.notifyCreated('viaje', dataToSend.nombre_ruta);
        } else {
          const response = await axios.put(`/api/admin/viajes/${dataToSend.id}`, dataToSend);
          console.log('Update response:', response.data);
          this.$toast?.success('Viaje actualizado exitosamente');
          this.notifyUpdated('viaje', dataToSend.nombre_ruta);
        }
        this.closeModal();
        this.loadViajes();
      } catch (error) {
        console.error('Error al guardar viaje:', error);
        console.error('Error response:', error.response?.data);
        
        // Mostrar errores de validación
        if (error.response?.data?.errors) {
          const errors = error.response.data.errors;
          console.log('Validation errors:', errors);
          const firstError = Object.values(errors)[0][0];
          this.$toast?.error(firstError);
        } else {
          this.$toast?.error(error.response?.data?.message || 'Error al guardar viaje');
        }
      } finally {
        this.loading = false;
      }
    },
    formatDiasSemana(dias) {
        if (!dias || dias.length === 0) return 'N/A';
        // Ordenar días: Lun(1)..Sáb(6), Dom(0)
        const diasOrdenados = [...dias].sort((a, b) => {
            const aVal = a === 0 ? 7 : a;
            const bVal = b === 0 ? 7 : b;
            return aVal - bVal;
        });
        
        const map = {0: 'Dom', 1: 'Lun', 2: 'Mar', 3: 'Mié', 4: 'Jue', 5: 'Vie', 6: 'Sáb'};
        return diasOrdenados.map(d => map[d]).join(', ');
    },
    async deleteViaje(id) {
      const viaje = this.viajes.find(v => v.id === id);
      const nombreViaje = viaje?.nombre_ruta || `ID ${id}`;
      
      if (!confirm('¿Está seguro de eliminar este viaje?')) return;

      try {
        await axios.delete(`/api/admin/viajes/${id}`);
        this.$toast?.success('Viaje eliminado exitosamente');
        this.notifyDeleted('viaje', nombreViaje);
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
        const viaje = this.viajes.find(v => v.id === id);
        await axios.post(`/api/admin/viajes/${id}/abrir-confirmaciones`);
        this.$toast?.success('Periodo de confirmaciones abierto');
        
        // Generar notificación en el panel
        this.addNotification(
          '🔓 Confirmaciones Abiertas',
          `Se han abierto las confirmaciones para el viaje: ${viaje?.nombre_ruta || 'ID ' + id}`,
          'success',
          'viaje',
          id
        );
        
        this.loadViajes();
      } catch (error) {
        console.error('Error:', error);
        this.$toast?.error(error.response?.data?.message || 'Error al abrir confirmaciones');
      }
    },
    async cerrarConfirmaciones(id) {
      try {
        const viaje = this.viajes.find(v => v.id === id);
        await axios.post(`/api/admin/viajes/${id}/cerrar-confirmaciones`);
        this.$toast?.success('Periodo de confirmaciones cerrado');
        
        // Generar notificación en el panel
        this.addNotification(
          '🔒 Confirmaciones Cerradas',
          `Se han cerrado las confirmaciones para el viaje: ${viaje?.nombre_ruta || 'ID ' + id}`,
          'info',
          'viaje',
          id
        );
        
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

.header-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.btn-notification {
  position: relative;
  padding: 10px 15px;
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  cursor: pointer;
  font-size: 18px;
  transition: all 0.3s ease;
  color: #495057;
}

.btn-notification:hover {
  background: #e9ecef;
  border-color: #adb5bd;
  color: #007bff;
}

.notification-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #dc3545;
  color: white;
  border-radius: 50%;
  padding: 2px 6px;
  font-size: 11px;
  font-weight: bold;
  min-width: 18px;
  text-align: center;
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

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  user-select: none;
}

.checkbox-label input[type="checkbox"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.dias-semana {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  margin-top: 10px;
}

.dia-checkbox {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.dia-checkbox:hover {
  background: #f8f9fa;
}

.dia-checkbox input:checked + span {
  font-weight: bold;
}

.retorno-section {
  background: #f0f8ff;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #b3d9ff;
  margin-top: 15px;
}

.retorno-section h4 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #0066cc;
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
