// Configuraciones de las aplicaciones dinámicas del admin dashboard
import { estadosMexico, municipiosPorEstado, coloniasPorMunicipio } from './estadosMunicipios.js'

export const appConfigs = {
  usuarios: {
    name: 'Usuarios',
    singular: 'Usuario',
    description: 'Gestiona los usuarios del sistema',
    icon: 'bi bi-people-fill',
    searchFields: ['nombre', 'apellidos', 'correo'],
    sortFields: [
      { key: 'nombre', label: 'Nombre' },
      { key: 'apellidos', label: 'Apellidos' },
      { key: 'correo', label: 'Correo' },
      { key: 'fecha_registro', label: 'Fecha de Registro' }
    ],
    displayFields: [
      { 
        key: 'nombre', 
        label: 'Nombre Completo', 
        type: 'avatar',
        icon: 'bi bi-person-circle',
        getValue: (item) => `${item.nombre} ${item.apellidos}`,
        sortable: true
      },
      { key: 'correo', label: 'Correo', icon: 'bi bi-envelope', sortable: true },
      { key: 'telefono', label: 'Teléfono', icon: 'bi bi-phone', sortable: false },
      { key: 'rol', label: 'Rol', type: 'badge', sortable: true },
      { key: 'fecha_registro', label: 'Fecha de Registro', type: 'date', sortable: true }
    ],
    fields: [
      {
        key: 'nombre',
        label: 'Nombre',
        type: 'text',
        required: true,
        placeholder: 'Nombre del usuario',
        icon: 'bi bi-person',
        colClass: 'col-md-6'
      },
      {
        key: 'apellidos',
        label: 'Apellidos',
        type: 'text',
        required: true,
        placeholder: 'Apellidos del usuario',
        icon: 'bi bi-person',
        colClass: 'col-md-6'
      },
      {
        key: 'correo',
        label: 'Correo Electrónico',
        type: 'email',
        required: true,
        placeholder: 'usuario@ejemplo.com',
        icon: 'bi bi-envelope',
        colClass: 'col-md-6'
      },
      {
        key: 'telefono',
        label: 'Teléfono',
        type: 'tel',
        required: false,
        placeholder: '+52 123 456 7890',
        icon: 'bi bi-phone',
        colClass: 'col-md-6'
      },
      {
        key: 'contrasena',
        label: 'Contraseña',
        type: 'password',
        required: true,
        placeholder: 'Mínimo 6 caracteres',
        icon: 'bi bi-lock',
        colClass: 'col-12',
        help: 'En modo edición, deja vacío para mantener la contraseña actual'
      }
    ]
  },

  hijos: {
    name: 'Hijos',
    singular: 'Hijo',
    description: 'Administra los estudiantes del sistema',
    icon: 'bi bi-person-hearts',
    searchFields: ['nombre', 'grado', 'grupo', 'codigo_qr'],
    sortFields: [
      { key: 'nombre', label: 'Nombre' },
      { key: 'grado', label: 'Grado' },
      { key: 'grupo', label: 'Grupo' }
    ],
    displayFields: [
      { 
        key: 'nombre', 
        label: 'Nombre', 
        type: 'avatar',
        icon: 'bi bi-person-circle',
        sortable: true
      },
      { key: 'grado', label: 'Grado', icon: 'bi bi-book', sortable: true },
      { key: 'grupo', label: 'Grupo', icon: 'bi bi-people', sortable: true },
      { key: 'codigo_qr', label: 'Código QR', type: 'code', sortable: false },
      { 
        key: 'padre.nombre', 
        label: 'Padre/Tutor',
        icon: 'bi bi-person-check',
        getValue: (item) => item.padre ? `${item.padre.nombre} ${item.padre.apellidos}` : '-',
        sortable: false
      }
    ],
    fields: [
      {
        key: 'nombre',
        label: 'Nombre Completo',
        type: 'text',
        required: true,
        placeholder: 'Nombre completo del estudiante',
        icon: 'bi bi-person',
        colClass: 'col-md-6'
      },
      {
        key: 'grado',
        label: 'Grado',
        type: 'text',
        required: false,
        placeholder: 'Ej: 5to, Secundaria',
        icon: 'bi bi-book',
        colClass: 'col-md-3'
      },
      {
        key: 'grupo',
        label: 'Grupo',
        type: 'text',
        required: false,
        placeholder: 'Ej: A, B, C',
        icon: 'bi bi-people',
        colClass: 'col-md-3'
      },
      {
        key: 'codigo_qr',
        label: 'Código QR',
        type: 'text',
        required: true,
        placeholder: 'Código QR único',
        icon: 'bi bi-qr-code',
        colClass: 'col-md-6'
      },
      {
        key: 'padre_id',
        label: 'Padre/Tutor',
        type: 'select',
        required: true,
        placeholder: 'Seleccionar padre/tutor',
        icon: 'bi bi-person-check',
        colClass: 'col-md-6',
        relatedKey: 'padres',
        relatedLabel: 'nombre'
      }
    ]
  },

  choferes: {
    name: 'Choferes',
    singular: 'Chofer',
    description: 'Administra los conductores del sistema',
    icon: 'bi bi-person-badge',
    searchFields: ['nombre', 'apellidos', 'numero_licencia', 'correo'],
    sortFields: [
      { key: 'nombre', label: 'Nombre' },
      { key: 'apellidos', label: 'Apellidos' },
      { key: 'numero_licencia', label: 'Licencia' },
      { key: 'estado', label: 'Estado' }
    ],
    displayFields: [
      { 
        key: 'nombre', 
        label: 'Nombre',
        type: 'avatar',
        icon: 'bi bi-person-circle',
        getValue: (item) => `${item.nombre} ${item.apellidos}`,
        sortable: true
      },
      { key: 'numero_licencia', label: 'Licencia', type: 'code', icon: 'bi bi-card-text', sortable: true },
      { key: 'telefono', label: 'Teléfono', icon: 'bi bi-phone', sortable: false },
      { key: 'correo', label: 'Correo', icon: 'bi bi-envelope', sortable: true },
      { key: 'estado', label: 'Estado', type: 'badge', sortable: true }
    ],
    fields: [
      {
        key: 'nombre',
        label: 'Nombre',
        type: 'text',
        required: true,
        placeholder: 'Nombre del chofer',
        icon: 'bi bi-person',
        colClass: 'col-md-6'
      },
      {
        key: 'apellidos',
        label: 'Apellidos',
        type: 'text',
        required: true,
        placeholder: 'Apellidos del chofer',
        icon: 'bi bi-person',
        colClass: 'col-md-6'
      },
      {
        key: 'numero_licencia',
        label: 'Número de Licencia',
        type: 'text',
        required: false,
        placeholder: 'Número de licencia de conducir',
        icon: 'bi bi-card-text',
        colClass: 'col-md-6'
      },
      {
        key: 'curp',
        label: 'CURP',
        type: 'text',
        required: false,
        placeholder: 'CURP (hasta 18 caracteres)',
        icon: 'bi bi-person-badge',
        colClass: 'col-md-6',
        maxlength: 18
      },
      {
        key: 'telefono',
        label: 'Teléfono',
        type: 'tel',
        required: false,
        placeholder: '+52 123 456 7890',
        icon: 'bi bi-phone',
        colClass: 'col-md-6'
      },
      {
        key: 'correo',
        label: 'Correo Electrónico',
        type: 'email',
        required: false,
        placeholder: 'chofer@ejemplo.com',
        icon: 'bi bi-envelope',
        colClass: 'col-md-6'
      },
      {
        key: 'estado',
        label: 'Estado',
        type: 'select',
        required: false,
        placeholder: 'Estado del chofer',
        icon: 'bi bi-flag',
        colClass: 'col-md-12',
        defaultValue: 'disponible',
        options: [
          { value: 'disponible', label: 'Disponible' },
          { value: 'en_ruta', label: 'En Ruta' },
          { value: 'no_activo', label: 'No Activo' }
        ]
      }
    ]
  },

  unidades: {
    name: 'Unidades',
    singular: 'Unidad',
    description: 'Gestiona las unidades de transporte',
    icon: 'bi bi-bus-front',
    searchFields: ['matricula', 'modelo', 'marca', 'numero_serie'],
    sortFields: [
      { key: 'matricula', label: 'Matrícula' },
      { key: 'marca', label: 'Marca' },
      { key: 'modelo', label: 'Modelo' },
      { key: 'anio', label: 'Año' },
      { key: 'capacidad', label: 'Capacidad' },
      { key: 'estado', label: 'Estado' }
    ],
    displayFields: [
      { key: 'imagen', label: 'Imagen', type: 'image', icon: 'bi bi-image', sortable: false },
      { key: 'matricula', label: 'Matrícula', type: 'code', icon: 'bi bi-card-text', sortable: true },
      { key: 'marca', label: 'Marca', icon: 'bi bi-truck', sortable: true },
      { key: 'modelo', label: 'Modelo', icon: 'bi bi-gear', sortable: true },
      { key: 'anio', label: 'Año', icon: 'bi bi-calendar', sortable: true },
      { key: 'color', label: 'Color', icon: 'bi bi-palette', sortable: false },
      { key: 'capacidad', label: 'Capacidad', icon: 'bi bi-people', sortable: true },
      { key: 'estado', label: 'Estado', type: 'badge', sortable: true }
    ],
    fields: [
      {
        key: 'matricula',
        label: 'Matrícula',
        type: 'text',
        required: true,
        placeholder: 'Matrícula del vehículo',
        icon: 'bi bi-card-text',
        colClass: 'col-md-4'
      },
      {
        key: 'descripcion',
        label: 'Descripción',
        type: 'textarea',
        required: false,
        placeholder: 'Descripción de la unidad',
        icon: 'bi bi-card-text',
        colClass: 'col-md-8'
      },
      {
        key: 'marca',
        label: 'Marca',
        type: 'text',
        required: false,
        placeholder: 'Marca del vehículo',
        icon: 'bi bi-truck',
        colClass: 'col-md-4'
      },
      {
        key: 'modelo',
        label: 'Modelo',
        type: 'text',
        required: false,
        placeholder: 'Modelo del vehículo',
        icon: 'bi bi-gear',
        colClass: 'col-md-4'
      },
      {
        key: 'anio',
        label: 'Año',
        type: 'number',
        required: false,
        placeholder: 'Año del vehículo',
        icon: 'bi bi-calendar',
        colClass: 'col-md-4',
        min: 1900,
        max: new Date().getFullYear() + 1
      },
      {
        key: 'color',
        label: 'Color',
        type: 'text',
        required: false,
        placeholder: 'Color del vehículo',
        icon: 'bi bi-palette',
        colClass: 'col-md-4'
      },
      {
        key: 'capacidad',
        label: 'Capacidad',
        type: 'number',
        required: true,
        placeholder: 'Número de pasajeros',
        icon: 'bi bi-people',
        colClass: 'col-md-4',
        min: 1,
        max: 100
      },
      {
        key: 'numero_serie',
        label: 'Número de Serie',
        type: 'text',
        required: false,
        placeholder: 'Número de serie del vehículo',
        icon: 'bi bi-123',
        colClass: 'col-md-4'
      },
      {
        key: 'imagen',
        label: 'Imagen',
        type: 'file',
        required: false,
        placeholder: 'Seleccionar imagen',
        icon: 'bi bi-image',
        colClass: 'col-md-6',
        accept: 'image/*'
      },
      {
        key: 'estado',
        label: 'Estado',
        type: 'select',
        required: false,
        placeholder: 'Estado de la unidad',
        icon: 'bi bi-flag',
        colClass: 'col-md-6',
        defaultValue: 'activo',
        options: [
          { value: 'activo', label: 'Activo' },
          { value: 'en_ruta', label: 'En Ruta' },
          { value: 'mantenimiento', label: 'Mantenimiento' },
          { value: 'inactivo', label: 'Inactivo' }
        ]
      }
    ]
  },

  escuelas: {
    name: 'Escuelas',
    singular: 'Escuela',
    description: 'Administra las escuelas a las que TrailynSafe da servicio',
    icon: 'bi bi-building',
    searchFields: ['nombre', 'direccion', 'telefono', 'contacto'],
    sortFields: [
      { key: 'nombre', label: 'Nombre' },
      { key: 'nivel', label: 'Nivel Educativo' },
      { key: 'estado', label: 'Estado' },
      { key: 'fecha_inicio_servicio', label: 'Fecha de Inicio' }
    ],
    displayFields: [
      { 
        key: 'nombre', 
        label: 'Nombre',
        type: 'avatar',
        icon: 'bi bi-building',
        sortable: true
      },
      { 
        key: 'nivel', 
        label: 'Nivel Educativo',
        icon: 'bi bi-book',
        sortable: true
      },
      { 
        key: 'direccion', 
        label: 'Dirección',
        icon: 'bi bi-geo-alt',
        sortable: false
      },
      { 
        key: 'telefono', 
        label: 'Teléfono',
        icon: 'bi bi-telephone',
        sortable: false
      },
      { 
        key: 'contacto', 
        label: 'Contacto',
        icon: 'bi bi-person-lines-fill',
        sortable: true
      },
      { 
        key: 'estado', 
        label: 'Estado',
        type: 'badge',
        sortable: true
      }
    ],
    fields: [
      {
        key: 'nombre',
        label: 'Nombre de la Escuela',
        type: 'text',
        required: true,
        placeholder: 'Nombre completo de la institución',
        icon: 'bi bi-building',
        colClass: 'col-md-8'
      },
      {
        key: 'clave',
        label: 'Clave (CCT/Código)',
        type: 'text',
        required: false,
        placeholder: 'Clave de Centro de Trabajo',
        icon: 'bi bi-tag',
        colClass: 'col-md-4'
      },
      {
        key: 'nivel',
        label: 'Nivel Educativo',
        type: 'select',
        required: true,
        placeholder: 'Seleccionar nivel',
        icon: 'bi bi-book',
        colClass: 'col-md-6',
        options: [
          { value: 'preescolar', label: 'Preescolar' },
          { value: 'primaria', label: 'Primaria' },
          { value: 'secundaria', label: 'Secundaria' },
          { value: 'preparatoria', label: 'Preparatoria' },
          { value: 'universidad', label: 'Universidad' },
          { value: 'mixto', label: 'Mixto' }
        ]
      },
      {
        key: 'turno',
        label: 'Turno',
        type: 'select',
        required: false,
        placeholder: 'Seleccionar turno',
        icon: 'bi bi-clock',
        colClass: 'col-md-6',
        options: [
          { value: 'matutino', label: 'Matutino' },
          { value: 'vespertino', label: 'Vespertino' },
          { value: 'mixto', label: 'Mixto' },
          { value: 'tiempo_completo', label: 'Tiempo Completo' }
        ]
      },
      {
        key: 'direccion',
        label: 'Dirección',
        type: 'textarea',
        required: true,
        placeholder: 'Dirección completa de la escuela',
        icon: 'bi bi-geo-alt',
        colClass: 'col-md-12'
      },
      {
        key: 'ciudad',
        label: 'Ciudad',
        type: 'text',
        required: false,
        placeholder: 'Ciudad',
        icon: 'bi bi-building',
        colClass: 'col-md-12'
      },
      {
        key: 'estado_republica',
        label: 'Estado',
        type: 'select',
        required: false,
        placeholder: 'Seleccionar estado',
        icon: 'bi bi-map',
        colClass: 'col-md-4',
        options: estadosMexico
      },
      {
        key: 'municipio',
        label: 'Municipio',
        type: 'select',
        required: false,
        placeholder: 'Primero seleccione un estado',
        icon: 'bi bi-geo',
        colClass: 'col-md-4',
        dependsOn: 'estado_republica',
        options: [],
        getOptions: (formData) => {
          if (!formData.estado_republica) return []
          const municipios = municipiosPorEstado[formData.estado_republica] || []
          return municipios.map(m => ({ value: m, label: m }))
        }
      },
      {
        key: 'colonia',
        label: 'Colonia',
        type: 'datalist',
        required: false,
        placeholder: 'Seleccione municipio para ver colonias disponibles',
        icon: 'bi bi-houses',
        colClass: 'col-md-4',
        dependsOn: 'municipio',
        options: [],
        getOptions: (formData) => {
          if (!formData.municipio) return []
          const colonias = coloniasPorMunicipio[formData.municipio] || []
          return colonias.map(c => ({ value: c, label: c }))
        }
      },
      {
        key: 'codigo_postal',
        label: 'Código Postal',
        type: 'text',
        required: false,
        placeholder: '00000',
        icon: 'bi bi-mailbox',
        colClass: 'col-md-4',
        maxlength: 5
      },
      {
        key: 'telefono',
        label: 'Teléfono Principal',
        type: 'tel',
        required: false,
        placeholder: '+52 123 456 7890',
        icon: 'bi bi-telephone',
        colClass: 'col-md-6'
      },
      {
        key: 'correo',
        label: 'Correo Electrónico',
        type: 'email',
        required: false,
        placeholder: 'contacto@escuela.edu.mx',
        icon: 'bi bi-envelope',
        colClass: 'col-md-6'
      },
      {
        key: 'contacto',
        label: 'Nombre del Contacto',
        type: 'text',
        required: false,
        placeholder: 'Director(a) o persona de contacto',
        icon: 'bi bi-person-lines-fill',
        colClass: 'col-md-6'
      },
      {
        key: 'cargo_contacto',
        label: 'Cargo del Contacto',
        type: 'text',
        required: false,
        placeholder: 'Director(a), Subdirector(a), Coordinador(a)',
        icon: 'bi bi-person-badge',
        colClass: 'col-md-6'
      },
      {
        key: 'horario_entrada',
        label: 'Horario de Entrada',
        type: 'time',
        required: false,
        placeholder: '07:00',
        icon: 'bi bi-clock',
        colClass: 'col-md-6'
      },
      {
        key: 'horario_salida',
        label: 'Horario de Salida',
        type: 'time',
        required: false,
        placeholder: '14:00',
        icon: 'bi bi-clock-fill',
        colClass: 'col-md-6'
      },
      {
        key: 'fecha_inicio_servicio',
        label: 'Fecha de Inicio de Servicio',
        type: 'date',
        required: false,
        placeholder: 'Fecha en que se inició el servicio',
        icon: 'bi bi-calendar-check',
        colClass: 'col-md-6'
      },
      {
        key: 'numero_alumnos',
        label: 'Número de Alumnos',
        type: 'number',
        required: false,
        placeholder: 'Alumnos que usan el servicio',
        icon: 'bi bi-people',
        colClass: 'col-md-6',
        min: 0
      },
      {
        key: 'notas',
        label: 'Notas/Observaciones',
        type: 'textarea',
        required: false,
        placeholder: 'Información adicional relevante',
        icon: 'bi bi-card-text',
        colClass: 'col-md-12'
      },
      {
        key: 'estado',
        label: 'Estado del Servicio',
        type: 'select',
        required: true,
        placeholder: 'Estado del servicio',
        icon: 'bi bi-flag',
        colClass: 'col-md-12',
        defaultValue: 'activo',
        options: [
          { value: 'activo', label: 'Activo' },
          { value: 'inactivo', label: 'Inactivo' },
          { value: 'suspendido', label: 'Suspendido' }
        ]
      }
    ]
  },

  respaldos: {
    name: 'Respaldos',
    singular: 'Respaldo',
    description: 'Gestiona los respaldos de la base de datos MongoDB',
    icon: 'bi bi-shield-check',
    searchFields: ['filename'],
    sortFields: [
      { key: 'filename', label: 'Archivo' },
      { key: 'created_at', label: 'Fecha de Creación' },
      { key: 'size_bytes', label: 'Tamaño' }
    ],
    displayFields: [
      { 
        key: 'filename', 
        label: 'Archivo',
        type: 'code',
        icon: 'bi bi-file-earmark-zip',
        sortable: true
      },
      { key: 'size', label: 'Tamaño', type: 'badge', icon: 'bi bi-hdd', sortable: true },
      { 
        key: 'created_at', 
        label: 'Fecha de Creación',
        type: 'date',
        icon: 'bi bi-calendar',
        sortable: true
      },
      { 
        key: 'created_human', 
        label: 'Antigüedad',
        icon: 'bi bi-clock',
        sortable: false
      },
      {
        key: 'actions',
        label: 'Acciones',
        type: 'custom',
        sortable: false,
        customComponent: 'BackupActions'
      }
    ],
    // API endpoint personalizado para respaldos
    apiEndpoint: '/admin/backups',
    // Configuración especial para respaldos
    isBackupApp: true,
    canCreate: true,
    canEdit: false,
    canDelete: true,
    canView: false,
    customActions: [
      {
        name: 'create_backup',
        label: 'Crear Respaldo',
        icon: 'bi bi-plus-circle',
        type: 'primary',
        handler: 'createBackup'
      },
      {
        name: 'cleanup_old',
        label: 'Limpiar Antiguos',
        icon: 'bi bi-trash',
        type: 'warning',
        handler: 'cleanupOld'
      },
      {
        name: 'schedule_backup',
        label: 'Programar Respaldos',
        icon: 'bi bi-clock',
        type: 'info',
        handler: 'scheduleBackup'
      }
    ],
    // Configuración de programación de respaldos
    scheduleConfig: {
      enabled: false,
      frequency: 'daily',
      time: '02:00',
      retention_days: 30,
      cleanup_enabled: true
    }
  }
}

// Función helper para obtener la configuración de una app
export function getAppConfig(appName) {
  return appConfigs[appName] || null
}

// Función helper para obtener todas las apps disponibles
export function getAvailableApps() {
  return Object.keys(appConfigs)
}
