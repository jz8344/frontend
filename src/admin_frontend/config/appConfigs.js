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
        placeholder: 'Solo letras',
        icon: 'bi bi-person',
        colClass: 'col-md-6',
        pattern: '^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]+$',
        validationMessage: 'Solo se permiten letras y espacios'
      },
      {
        key: 'grado',
        label: 'Grado',
        type: 'text',
        required: false,
        placeholder: 'Alfanumérico (ej: 5to, 1ro Secundaria)',
        icon: 'bi bi-book',
        colClass: 'col-md-3',
        pattern: '^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\\s]+$',
        validationMessage: 'Solo letras, números y espacios'
      },
      {
        key: 'grupo',
        label: 'Grupo',
        type: 'text',
        required: false,
        placeholder: 'Letras o números (ej: A, B, 1)',
        icon: 'bi bi-people',
        colClass: 'col-md-3',
        pattern: '^[a-zA-Z0-9]+$',
        validationMessage: 'Solo letras y números sin espacios',
        maxlength: 5
      },
      {
        key: 'codigo_qr',
        label: 'Código QR',
        type: 'text',
        required: true,
        placeholder: 'Alfanumérico único',
        icon: 'bi bi-qr-code',
        colClass: 'col-md-6',
        pattern: '^[A-Z0-9\\-]+$',
        validationMessage: 'Solo letras mayúsculas, números y guiones',
        maxlength: 50
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
        placeholder: 'Solo letras',
        icon: 'bi bi-person',
        colClass: 'col-md-6',
        pattern: '^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]+$',
        validationMessage: 'Solo se permiten letras y espacios'
      },
      {
        key: 'apellidos',
        label: 'Apellidos',
        type: 'text',
        required: true,
        placeholder: 'Solo letras',
        icon: 'bi bi-person',
        colClass: 'col-md-6',
        pattern: '^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]+$',
        validationMessage: 'Solo se permiten letras y espacios'
      },
      {
        key: 'numero_licencia',
        label: 'Número de Licencia',
        type: 'text',
        required: false,
        placeholder: 'Alfanumérico',
        icon: 'bi bi-card-text',
        colClass: 'col-md-6',
        pattern: '^[A-Z0-9]+$',
        validationMessage: 'Solo letras mayúsculas y números',
        maxlength: 20
      },
      {
        key: 'curp',
        label: 'CURP',
        type: 'text',
        required: false,
        placeholder: '18 caracteres (ej: ABCD123456HDFRLL01)',
        icon: 'bi bi-person-badge',
        colClass: 'col-md-6',
        pattern: '^[A-Z]{4}[0-9]{6}[HM][A-Z]{5}[0-9]{2}$',
        validationMessage: 'Formato CURP inválido',
        minlength: 18,
        maxlength: 18
      },
      {
        key: 'telefono',
        label: 'Teléfono',
        type: 'tel',
        required: false,
        placeholder: '10 dígitos',
        icon: 'bi bi-phone',
        colClass: 'col-md-6',
        pattern: '^[0-9]{10}$',
        validationMessage: 'Debe contener exactamente 10 dígitos',
        minlength: 10,
        maxlength: 10
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
        placeholder: 'Alfanumérico sin espacios',
        icon: 'bi bi-card-text',
        colClass: 'col-md-4',
        pattern: '^[A-Z0-9\\-]+$',
        validationMessage: 'Solo letras mayúsculas, números y guiones',
        maxlength: 15
      },
      {
        key: 'descripcion',
        label: 'Descripción',
        type: 'textarea',
        required: false,
        placeholder: 'Descripción de la unidad',
        icon: 'bi bi-card-text',
        colClass: 'col-md-8',
        maxlength: 500
      },
      {
        key: 'marca',
        label: 'Marca',
        type: 'text',
        required: false,
        placeholder: 'Solo letras',
        icon: 'bi bi-truck',
        colClass: 'col-md-4',
        pattern: '^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]+$',
        validationMessage: 'Solo se permiten letras y espacios'
      },
      {
        key: 'modelo',
        label: 'Modelo',
        type: 'text',
        required: false,
        placeholder: 'Alfanumérico',
        icon: 'bi bi-gear',
        colClass: 'col-md-4',
        pattern: '^[a-zA-Z0-9\\s\\-]+$',
        validationMessage: 'Solo letras, números, espacios y guiones'
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
        placeholder: 'Solo letras',
        icon: 'bi bi-palette',
        colClass: 'col-md-4',
        pattern: '^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]+$',
        validationMessage: 'Solo se permiten letras y espacios'
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
        type: 'autocomplete-search',
        required: true,
        placeholder: 'Buscar o crear nueva escuela...',
        icon: 'bi bi-building',
        colClass: 'col-md-8',
        searchEndpoint: '/admin/escuelas/search',
        minSearchLength: 3,
        entityType: 'escuela'
      },
      {
        key: 'clave',
        label: 'Clave (CCT/Código)',
        type: 'text',
        required: false,
        placeholder: 'Solo números',
        icon: 'bi bi-tag',
        colClass: 'col-md-4',
        pattern: '^[0-9]+$',
        validationMessage: 'Solo se permiten números',
        maxlength: 20
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
        placeholder: 'Calle, número, referencias (letras, números y símbolos #/-)',
        icon: 'bi bi-geo-alt',
        colClass: 'col-md-12',
        pattern: '^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\\s.,#°/\\-]+$',
        validationMessage: 'Solo letras, números y símbolos de dirección (#, /, -, .)'
      },
      {
        key: 'ciudad',
        label: 'Ciudad',
        type: 'text',
        required: false,
        placeholder: 'Solo letras',
        icon: 'bi bi-building',
        colClass: 'col-md-12',
        pattern: '^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]+$',
        validationMessage: 'Solo se permiten letras y espacios',
        maxlength: 100
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
        placeholder: '5 dígitos',
        icon: 'bi bi-mailbox',
        colClass: 'col-md-4',
        pattern: '^[0-9]{5}$',
        validationMessage: 'Debe contener exactamente 5 dígitos',
        minlength: 5,
        maxlength: 5
      },
      {
        key: 'telefono',
        label: 'Teléfono Principal',
        type: 'tel',
        required: false,
        placeholder: '10 dígitos (ej: 5512345678)',
        icon: 'bi bi-telephone',
        colClass: 'col-md-6',
        pattern: '^[0-9]{10}$',
        validationMessage: 'Debe contener exactamente 10 dígitos',
        minlength: 10,
        maxlength: 10
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

  viajes: {
    name: 'Viajes',
    singular: 'Viaje',
    description: 'Gestiona las rutas y viajes escolares',
    icon: 'bi bi-geo-alt-fill',
    searchFields: ['nombre_ruta', 'escuela.nombre', 'chofer.nombre', 'unidad.numero_unidad'],
    sortFields: [
      { key: 'fecha_viaje', label: 'Fecha' },
      { key: 'nombre_ruta', label: 'Nombre Ruta' },
      { key: 'estado', label: 'Estado' },
      { key: 'hora_inicio_viaje', label: 'Hora Inicio' }
    ],
    displayFields: [
      { 
        key: 'fecha_viaje', 
        label: 'Fecha',
        type: 'date',
        icon: 'bi bi-calendar',
        sortable: true
      },
      { 
        key: 'nombre_ruta', 
        label: 'Nombre Ruta',
        icon: 'bi bi-signpost',
        sortable: true
      },
      { 
        key: 'escuela.nombre', 
        label: 'Escuela',
        icon: 'bi bi-building',
        getValue: (item) => item.escuela?.nombre || 'Sin asignar',
        sortable: false
      },
      { 
        key: 'chofer', 
        label: 'Chofer',
        icon: 'bi bi-person-badge',
        getValue: (item) => item.chofer ? `${item.chofer.nombre} ${item.chofer.apellidos}` : 'Sin asignar',
        sortable: false
      },
      { 
        key: 'unidad.numero_unidad', 
        label: 'Unidad',
        icon: 'bi bi-bus-front',
        getValue: (item) => item.unidad?.numero_unidad || 'Sin asignar',
        sortable: false
      },
      { 
        key: 'hora_inicio_viaje', 
        label: 'Hora Inicio',
        type: 'time',
        icon: 'bi bi-clock',
        sortable: true
      },
      { 
        key: 'confirmaciones', 
        label: 'Confirmaciones',
        icon: 'bi bi-people',
        getValue: (item) => `${item.ninos_confirmados || 0} / ${item.capacidad_maxima}`,
        sortable: false
      },
      { 
        key: 'estado', 
        label: 'Estado',
        type: 'badge',
        sortable: true,
        getValue: (item) => {
          const badges = {
            'pendiente': { text: 'Pendiente', class: 'bg-warning text-dark' },
            'confirmaciones_abiertas': { text: 'Confirmaciones Abiertas', class: 'bg-success' },
            'confirmaciones_cerradas': { text: 'Confirmaciones Cerradas', class: 'bg-info' },
            'en_curso': { text: 'En Curso', class: 'bg-primary' },
            'completado': { text: 'Completado', class: 'bg-secondary' },
            'cancelado': { text: 'Cancelado', class: 'bg-danger' }
          }
          return badges[item.estado] || { text: item.estado, class: 'bg-secondary' }
        }
      }
    ],
    fields: [
      {
        key: 'nombre_ruta',
        label: 'Nombre de la Ruta',
        type: 'text',
        required: true,
        placeholder: 'Ej: Ruta Norte Matutina',
        icon: 'bi bi-signpost',
        colClass: 'col-md-12'
      },
      {
        key: 'escuela_id',
        label: 'Escuela',
        type: 'select',
        required: true,
        placeholder: 'Seleccionar escuela',
        icon: 'bi bi-building',
        colClass: 'col-md-6',
        relatedKey: 'escuelas',
        relatedLabel: 'nombre'
      },
      {
        key: 'chofer_id',
        label: 'Chofer',
        type: 'select',
        required: false,
        placeholder: 'Seleccionar chofer',
        icon: 'bi bi-person-badge',
        colClass: 'col-md-6',
        relatedKey: 'choferes',
        relatedLabel: 'nombre',
        relatedFormat: (item) => `${item.nombre} ${item.apellidos}`
      },
      {
        key: 'unidad_id',
        label: 'Unidad',
        type: 'select',
        required: false,
        placeholder: 'Seleccionar unidad',
        icon: 'bi bi-bus-front',
        colClass: 'col-md-6',
        relatedKey: 'unidades',
        relatedLabel: 'matricula',
        getValue: (item) => `${item.matricula} - ${item.modelo || item.marca || ''}`
      },
      {
        key: 'fecha_viaje',
        label: 'Fecha del Viaje',
        type: 'date',
        required: true,
        placeholder: 'Fecha del viaje',
        icon: 'bi bi-calendar',
        colClass: 'col-md-6',
        min: new Date().toISOString().split('T')[0]
      },
      {
        key: 'capacidad_maxima',
        label: 'Capacidad Máxima',
        type: 'number',
        required: false,
        placeholder: '30',
        icon: 'bi bi-people',
        colClass: 'col-md-6',
        min: 1,
        max: 100,
        defaultValue: 30
      },
      {
        key: 'hora_inicio_confirmacion',
        label: 'Inicio Confirmación',
        type: 'time',
        required: true,
        placeholder: '06:00',
        icon: 'bi bi-clock',
        colClass: 'col-md-6',
        defaultValue: '06:00',
        help: 'Hora de inicio del período de confirmación'
      },
      {
        key: 'hora_fin_confirmacion',
        label: 'Fin Confirmación',
        type: 'time',
        required: true,
        placeholder: '06:30',
        icon: 'bi bi-clock-fill',
        colClass: 'col-md-6',
        defaultValue: '06:30',
        help: 'Hora de cierre del período de confirmación'
      },
      {
        key: 'hora_inicio_viaje',
        label: 'Inicio de Viaje',
        type: 'time',
        required: true,
        placeholder: '06:45',
        icon: 'bi bi-play-circle',
        colClass: 'col-md-6',
        defaultValue: '06:45',
        help: 'Hora en que el chofer inicia el viaje'
      },
      {
        key: 'hora_llegada_estimada',
        label: 'Llegada Estimada',
        type: 'time',
        required: true,
        placeholder: '08:00',
        icon: 'bi bi-flag-fill',
        colClass: 'col-md-6',
        defaultValue: '08:00',
        help: 'Hora estimada de llegada a la escuela'
      },
      {
        key: 'notas',
        label: 'Notas',
        type: 'textarea',
        required: false,
        placeholder: 'Observaciones adicionales sobre el viaje...',
        icon: 'bi bi-card-text',
        colClass: 'col-md-12',
        rows: 3
      }
    ],
    apiEndpoint: '/admin/viajes',
    canCreate: true,
    canEdit: true,
    canDelete: true,
    canView: true,
    customActions: [
      {
        name: 'abrir-confirmaciones',
        label: 'Abrir Confirmaciones',
        icon: 'bi bi-unlock',
        type: 'success',
        itemAction: true,
        visibleWhen: (item) => item.estado === 'pendiente',
        endpoint: (id) => `/admin/viajes/${id}/abrir-confirmaciones`,
        method: 'POST',
        successMessage: 'Periodo de confirmaciones abierto'
      },
      {
        name: 'cerrar-confirmaciones',
        label: 'Cerrar Confirmaciones',
        icon: 'bi bi-lock',
        type: 'warning',
        itemAction: true,
        visibleWhen: (item) => item.estado === 'confirmaciones_abiertas',
        endpoint: (id) => `/admin/viajes/${id}/cerrar-confirmaciones`,
        method: 'POST',
        successMessage: 'Periodo de confirmaciones cerrado'
      },
      {
        name: 'ver-confirmaciones',
        label: 'Ver Confirmaciones',
        icon: 'bi bi-list-check',
        type: 'info',
        itemAction: true,
        visibleWhen: (item) => ['confirmaciones_abiertas', 'confirmaciones_cerradas', 'en_curso', 'completado'].includes(item.estado),
        customHandler: true
      }
    ]
  },

  respaldos: {
    name: 'Respaldos',
    singular: 'Respaldo',
    description: 'Gestiona los respaldos de la base de datos PostgreSQL',
    icon: 'bi bi-shield-check',
    searchFields: ['nombre', 'descripcion'],
    sortFields: [
      { key: 'nombre', label: 'Nombre' },
      { key: 'tipo', label: 'Tipo' },
      { key: 'formato', label: 'Formato' },
      { key: 'tamano', label: 'Tamaño' },
      { key: 'created_at', label: 'Fecha' }
    ],
    displayFields: [
      { 
        key: 'nombre', 
        label: 'Archivo',
        type: 'code',
        icon: 'bi bi-file-earmark-zip',
        sortable: true
      },
      { 
        key: 'tipo', 
        label: 'Tipo',
        type: 'badge',
        icon: 'bi bi-tag',
        sortable: true,
        getValue: (item) => {
          const badges = {
            'completo': { text: 'Completo', class: 'bg-primary' },
            'tablas': { text: 'Tablas', class: 'bg-info' },
            'estructura': { text: 'Estructura', class: 'bg-secondary' }
          }
          return badges[item.tipo] || { text: item.tipo, class: 'bg-secondary' }
        }
      },
      { 
        key: 'formato', 
        label: 'Formato',
        type: 'badge',
        icon: 'bi bi-file-earmark',
        sortable: true,
        getValue: (item) => {
          return { text: item.formato.toUpperCase(), class: 'bg-dark' }
        }
      },
      { 
        key: 'tamano_formateado', 
        label: 'Tamaño',
        icon: 'bi bi-hdd',
        sortable: true
      },
      { 
        key: 'created_by', 
        label: 'Creado Por',
        icon: 'bi bi-person',
        sortable: false
      },
      { 
        key: 'created_at', 
        label: 'Fecha',
        type: 'datetime',
        icon: 'bi bi-calendar',
        sortable: true
      }
    ],
    fields: [
      {
        key: 'tipo',
        label: 'Tipo de Backup',
        type: 'select',
        required: true,
        placeholder: 'Seleccionar tipo',
        icon: 'bi bi-database',
        colClass: 'col-md-12',
        options: [
          { value: 'completo', label: 'Completo - Toda la base de datos' },
          { value: 'tablas', label: 'Por Tablas - Selección específica' },
          { value: 'estructura', label: 'Solo Estructura - Sin datos' }
        ]
      },
      {
        key: 'tablas',
        label: 'Seleccionar Tablas',
        type: 'multiselect',
        required: false,
        placeholder: 'Seleccionar tablas...',
        icon: 'bi bi-table',
        colClass: 'col-md-12',
        dependsOn: 'tipo',
        visibleWhen: (formData) => formData.tipo === 'tablas',
        options: [],
        getOptions: async () => {
          try {
            const response = await fetch(`${window.location.origin}/api/admin/backups/tables`, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
                'Accept': 'application/json'
              }
            })
            if (response.ok) {
              const tables = await response.json()
              return tables.map(t => ({ value: t, label: t }))
            }
          } catch (error) {
            console.error('Error loading tables:', error)
          }
          return []
        }
      },
      {
        key: 'formato',
        label: 'Formato de Compresión',
        type: 'select',
        required: true,
        placeholder: 'Seleccionar formato',
        icon: 'bi bi-file-zip',
        colClass: 'col-md-12',
        defaultValue: 'sql',
        options: [
          { value: 'sql', label: 'SQL - Sin comprimir' },
          { value: 'gz', label: 'GZ - Compresión Gzip' },
          { value: 'zip', label: 'ZIP - Compresión ZIP' }
        ]
      },
      {
        key: 'descripcion',
        label: 'Descripción (Opcional)',
        type: 'textarea',
        required: false,
        placeholder: 'Ej: Backup antes de actualización...',
        icon: 'bi bi-card-text',
        colClass: 'col-md-12',
        rows: 3,
        maxlength: 500
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
    hasDownload: true,
    hasRestore: true,
    customActions: [
      {
        name: 'download',
        label: 'Descargar',
        icon: 'bi bi-download',
        type: 'primary',
        itemAction: true
      },
      {
        name: 'restore',
        label: 'Restaurar',
        icon: 'bi bi-arrow-counterclockwise',
        type: 'success',
        itemAction: true,
        requiresConfirmation: true,
        confirmationMessage: '¿Está seguro de restaurar este backup? Esta acción reemplazará todos los datos actuales.'
      },
      {
        name: 'cleanup',
        label: 'Limpiar Antiguos',
        icon: 'bi bi-trash',
        type: 'warning',
        globalAction: true
      }
    ]
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
