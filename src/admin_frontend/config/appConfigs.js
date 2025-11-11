// Configuraciones de las aplicaciones dinámicas del admin dashboard
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

  rutas: {
    name: 'Rutas',
    singular: 'Ruta',
    description: 'Administra las rutas de transporte',
    icon: 'bi bi-geo-alt',
    searchFields: ['nombre', 'chofer.nombre', 'unidad.matricula'],
    sortFields: [
      { key: 'nombre', label: 'Nombre' },
      { key: 'estado', label: 'Estado' },
      { key: 'horario', label: 'Horario' }
    ],
    displayFields: [
      { key: 'nombre', label: 'Nombre', icon: 'bi bi-signpost', sortable: true },
      { 
        key: 'chofer.nombre', 
        label: 'Chofer',
        type: 'avatar',
        icon: 'bi bi-person-badge',
        getValue: (item) => item.chofer ? `${item.chofer.nombre} ${item.chofer.apellidos}` : '-',
        sortable: true
      },
      { 
        key: 'unidad.matricula', 
        label: 'Unidad',
        type: 'code',
        icon: 'bi bi-bus-front',
        sortable: true
      },
      { key: 'horario', label: 'Horario', icon: 'bi bi-clock', sortable: true },
      { key: 'estado', label: 'Estado', type: 'badge', sortable: true }
    ],
    fields: [
      {
        key: 'nombre',
        label: 'Nombre de la Ruta',
        type: 'text',
        required: true,
        placeholder: 'Nombre descriptivo de la ruta',
        icon: 'bi bi-signpost',
        colClass: 'col-md-6'
      },
      {
        key: 'chofer_id',
        label: 'Chofer',
        type: 'select',
        required: true,
        placeholder: 'Seleccionar chofer',
        icon: 'bi bi-person-badge',
        colClass: 'col-md-6',
        relatedKey: 'choferes',
        relatedLabel: 'nombre'
      },
      {
        key: 'unidad_id',
        label: 'Unidad',
        type: 'select',
        required: true,
        placeholder: 'Seleccionar unidad',
        icon: 'bi bi-bus-front',
        colClass: 'col-md-4',
        relatedKey: 'unidades',
        relatedLabel: 'matricula'
      },
      {
        key: 'horario',
        label: 'Horario',
        type: 'text',
        required: false,
        placeholder: 'Ej: 7:00 AM - 8:00 AM',
        icon: 'bi bi-clock',
        colClass: 'col-md-4'
      },
      {
        key: 'inicio',
        label: 'Punto de Inicio',
        type: 'text',
        required: false,
        placeholder: 'Dirección de inicio',
        icon: 'bi bi-geo-alt',
        colClass: 'col-md-6'
      },
      {
        key: 'fin',
        label: 'Punto Final',
        type: 'text',
        required: false,
        placeholder: 'Dirección de destino',
        icon: 'bi bi-geo-alt-fill',
        colClass: 'col-md-6'
      },
      {
        key: 'rango',
        label: 'Rango (km)',
        type: 'number',
        required: true,
        placeholder: 'Distancia en kilómetros',
        icon: 'bi bi-rulers',
        colClass: 'col-md-6',
        min: 0,
        max: 1000
      },
      {
        key: 'estado',
        label: 'Estado',
        type: 'select',
        required: true,
        placeholder: 'Estado de la ruta',
        icon: 'bi bi-flag',
        colClass: 'col-md-6',
        options: [
          { value: 'activa', label: 'Activa' },
          { value: 'inactiva', label: 'Inactiva' },
          { value: 'completada', label: 'Completada' }
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
