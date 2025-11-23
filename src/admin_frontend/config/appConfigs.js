// Configuraciones de las aplicaciones dinámicas del admin dashboard
import { estadosMexico, municipiosPorEstado, coloniasPorMunicipio } from './estadosMunicipios.js'

export const appConfigs = {
  usuarios: {
    name: 'Usuarios',
    singular: 'Usuario',
    description: 'Gestiona los usuarios del sistema',
    icon: 'bi bi-people-fill',
    searchFields: ['nombre', 'apellidos', 'correo', 'telefono', 'rol'],
    sortFields: [
      { key: 'nombre', label: 'Nombre' },
      { key: 'apellidos', label: 'Apellidos' },
      { key: 'correo', label: 'Correo' },
      { key: 'telefono', label: 'Teléfono' },
      { key: 'rol', label: 'Rol' },
      { key: 'fecha_registro', label: 'Fecha de Registro' }
    ],
    displayFields: [
      { 
        key: 'nombre', 
        label: 'Nombre', 
        type: 'avatar',
        icon: 'bi bi-person-circle',
        sortable: true
      },
      { 
        key: 'apellidos', 
        label: 'Apellidos', 
        icon: 'bi bi-person', 
        sortable: true 
      },
      { key: 'correo', label: 'Correo', icon: 'bi bi-envelope', sortable: true },
      { key: 'telefono', label: 'Teléfono', icon: 'bi bi-phone', sortable: true },
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
        colClass: 'col-md-6',
        autoFormat: 'lowercase'
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
        maxlength: 10,
        autoFormat: 'number'
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
        key: 'escuela.nombre', 
        label: 'Escuela',
        icon: 'bi bi-building',
        getValue: (item) => item.escuela ? item.escuela.nombre : '-',
        sortable: false
      },
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
        maxlength: 50,
        readonly: true,
        editMode: 'readonly',
        helpText: 'El código QR no puede modificarse una vez creado',
        autoFormat: 'uppercase'
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
      },
      {
        key: 'escuela_id',
        label: 'Escuela',
        type: 'select',
        required: false,
        placeholder: 'Seleccionar escuela',
        icon: 'bi bi-building',
        colClass: 'col-md-6',
        relatedKey: 'escuelas',
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
        maxlength: 20,
        autoFormat: 'uppercase'
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
        maxlength: 18,
        autoFormat: 'uppercase'
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
        maxlength: 10,
        autoFormat: 'number'
      },
      {
        key: 'correo',
        label: 'Correo Electrónico',
        type: 'email',
        required: false,
        placeholder: 'chofer@ejemplo.com',
        icon: 'bi bi-envelope',
        colClass: 'col-md-6',
        autoFormat: 'lowercase'
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
    searchFields: ['matricula', 'modelo', 'marca', 'numero_serie', 'color', 'capacidad', 'anio'],
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
        maxlength: 15,
        autoFormat: 'uppercase'
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
        pattern: '^[A-Z0-9\\s\\-]+$',
        validationMessage: 'Solo letras mayúsculas, números, espacios y guiones',
        autoFormat: 'uppercase'
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
        placeholder: 'Alfanumérico sin espacios',
        icon: 'bi bi-123',
        colClass: 'col-md-4',
        pattern: '^[A-Z0-9\\-]+$',
        validationMessage: 'Solo letras mayúsculas, números y guiones',
        maxlength: 30,
        autoFormat: 'uppercase'
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
        placeholder: 'Alfanumérico',
        icon: 'bi bi-tag',
        colClass: 'col-md-4',
        pattern: '^[A-Z0-9]+$',
        validationMessage: 'Solo letras mayúsculas y números',
        maxlength: 20,
        autoFormat: 'uppercase'
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
        type: 'address-map',
        required: true,
        placeholder: 'Ingresa la dirección o haz clic en "📍 Ubicar en Mapa"',
        icon: 'bi bi-geo-alt',
        colClass: 'col-md-12',
        pattern: '^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\\s.,#°/\\-]+$',
        validationMessage: 'Solo letras, números y símbolos de dirección (#, /, -, .)',
        rows: 3
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
        maxlength: 5,
        autoFormat: 'number'
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
        maxlength: 10,
        autoFormat: 'number'
      },
      {
        key: 'correo',
        label: 'Correo Electrónico',
        type: 'email',
        required: false,
        placeholder: 'contacto@escuela.edu.mx',
        icon: 'bi bi-envelope',
        colClass: 'col-md-6',
        autoFormat: 'lowercase'
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
  },

  viajes: {
    name: 'Viajes',
    singular: 'Viaje',
    description: 'Gestiona las rutas de transporte escolar',
    icon: 'bi bi-bus-front-fill',
    searchFields: ['nombre_ruta', 'tipo_viaje', 'estado'],
    sortFields: [
      { key: 'nombre_ruta', label: 'Nombre de Ruta' },
      { key: 'fecha_especifica', label: 'Fecha' },
      { key: 'horario_salida', label: 'Horario' },
      { key: 'estado', label: 'Estado' },
      { key: 'tipo_viaje', label: 'Tipo' }
    ],
    displayFields: [
      { 
        key: 'nombre_ruta', 
        label: 'Ruta', 
        type: 'avatar',
        icon: 'bi bi-signpost-2-fill',
        sortable: true
      },
      { 
        key: 'tipo_viaje', 
        label: 'Tipo', 
        type: 'badge', 
        sortable: true,
        badgeMap: {
          'unico': { text: 'Único', variant: 'info' },
          'recurrente': { text: 'Recurrente', variant: 'primary' }
        }
      },
      { 
        key: 'escuela.nombre', 
        label: 'Escuela', 
        icon: 'bi bi-building',
        sortable: false 
      },
      { 
        key: 'horario_salida', 
        label: 'Horario', 
        icon: 'bi bi-clock',
        sortable: true 
      },
      { 
        key: 'turno', 
        label: 'Turno', 
        type: 'badge',
        sortable: true,
        badgeMap: {
          'matutino': { text: 'Matutino', variant: 'warning' },
          'vespertino': { text: 'Vespertino', variant: 'info' }
        }
      },
      { 
        key: 'capacidad_info', 
        label: 'Capacidad', 
        icon: 'bi bi-people',
        format: (item) => `${item.capacidad_actual}/${item.capacidad_maxima}`,
        sortable: false 
      },
      { 
        key: 'estado', 
        label: 'Estado', 
        type: 'badge', 
        sortable: true,
        badgeMap: {
          'abierto': { text: 'Abierto', variant: 'success' },
          'cerrado': { text: 'Cerrado', variant: 'secondary' },
          'en_curso': { text: 'En Curso', variant: 'primary' },
          'completado': { text: 'Completado', variant: 'info' },
          'cancelado': { text: 'Cancelado', variant: 'danger' }
        }
      }
    ],
    fields: [
      {
        key: 'nombre_ruta',
        label: 'Nombre de la Ruta',
        type: 'text',
        required: true,
        placeholder: 'Ej: Ruta Centro - Escuela Primaria',
        icon: 'bi bi-signpost-2',
        colClass: 'col-12',
        maxlength: 100
      },
      {
        key: 'tipo_viaje',
        label: 'Tipo de Viaje',
        type: 'select',
        required: true,
        options: [
          { value: 'unico', label: 'Único (fecha específica)' },
          { value: 'recurrente', label: 'Recurrente (días de la semana)' }
        ],
        icon: 'bi bi-calendar-check',
        colClass: 'col-md-6',
        help: 'Selecciona si el viaje es para una fecha específica o se repite semanalmente'
      },
      {
        key: 'escuela_id',
        label: 'Escuela',
        type: 'autocomplete',
        required: true,
        apiEndpoint: '/admin/escuelas',
        displayField: 'nombre',
        searchFields: ['nombre', 'clave'],
        icon: 'bi bi-building',
        colClass: 'col-md-6',
        placeholder: 'Buscar escuela...',
        help: 'Selecciona la escuela destino del viaje'
      },
      {
        key: 'unidad_id',
        label: 'Unidad',
        type: 'autocomplete',
        required: true,
        apiEndpoint: '/admin/unidades',
        displayField: 'matricula',
        secondaryField: 'modelo',
        searchFields: ['matricula', 'modelo'],
        icon: 'bi bi-bus-front',
        colClass: 'col-md-6',
        placeholder: 'Buscar unidad...',
        help: 'Selecciona el vehículo asignado'
      },
      {
        key: 'chofer_id',
        label: 'Chofer',
        type: 'autocomplete',
        required: true,
        apiEndpoint: '/admin/choferes',
        displayField: 'nombre',
        secondaryField: 'apellidos',
        searchFields: ['nombre', 'apellidos', 'numero_licencia'],
        icon: 'bi bi-person-vcard',
        colClass: 'col-md-6',
        placeholder: 'Buscar chofer...',
        help: 'Selecciona el conductor asignado'
      },
      {
        key: 'fecha_especifica',
        label: 'Fecha del Viaje',
        type: 'date',
        required: false,
        icon: 'bi bi-calendar-event',
        colClass: 'col-md-6',
        showIf: { field: 'tipo_viaje', value: 'unico' },
        help: 'Fecha única en la que se realizará el viaje'
      },
      {
        key: 'dias_activos',
        label: 'Días Activos',
        type: 'multi-select',
        required: false,
        options: [
          { value: 'Lunes', label: 'Lunes' },
          { value: 'Martes', label: 'Martes' },
          { value: 'Miércoles', label: 'Miércoles' },
          { value: 'Jueves', label: 'Jueves' },
          { value: 'Viernes', label: 'Viernes' },
          { value: 'Sábado', label: 'Sábado' },
          { value: 'Domingo', label: 'Domingo' }
        ],
        icon: 'bi bi-calendar-week',
        colClass: 'col-12',
        showIf: { field: 'tipo_viaje', value: 'recurrente' },
        help: 'Selecciona los días de la semana en que opera el viaje'
      },
      {
        key: 'fecha_inicio_vigencia',
        label: 'Fecha Inicio Vigencia',
        type: 'date',
        required: false,
        icon: 'bi bi-calendar-check',
        colClass: 'col-md-6',
        showIf: { field: 'tipo_viaje', value: 'recurrente' },
        help: 'Fecha desde la que el viaje estará activo'
      },
      {
        key: 'fecha_fin_vigencia',
        label: 'Fecha Fin Vigencia',
        type: 'date',
        required: false,
        icon: 'bi bi-calendar-x',
        colClass: 'col-md-6',
        showIf: { field: 'tipo_viaje', value: 'recurrente' },
        help: 'Fecha hasta la que el viaje estará activo'
      },
      {
        key: 'horario_salida',
        label: 'Horario de Salida',
        type: 'time',
        required: true,
        icon: 'bi bi-clock',
        colClass: 'col-md-6',
        help: 'Hora a la que sale el transporte'
      },
      {
        key: 'turno',
        label: 'Turno',
        type: 'select',
        required: true,
        options: [
          { value: 'matutino', label: 'Matutino' },
          { value: 'vespertino', label: 'Vespertino' }
        ],
        icon: 'bi bi-sun',
        colClass: 'col-md-6'
      },
      {
        key: 'capacidad_maxima',
        label: 'Capacidad Máxima',
        type: 'number',
        required: true,
        min: 1,
        max: 100,
        icon: 'bi bi-people',
        colClass: 'col-md-6',
        help: 'Número máximo de estudiantes permitidos'
      },
      {
        key: 'estado',
        label: 'Estado del Viaje',
        type: 'select',
        required: false,
        options: [
          { value: 'abierto', label: 'Abierto' },
          { value: 'cerrado', label: 'Cerrado' },
          { value: 'en_curso', label: 'En Curso' },
          { value: 'completado', label: 'Completado' },
          { value: 'cancelado', label: 'Cancelado' }
        ],
        icon: 'bi bi-check-circle',
        colClass: 'col-md-6',
        editOnly: true,
        help: 'Estado actual del viaje'
      },
      {
        key: 'descripcion',
        label: 'Descripción',
        type: 'textarea',
        required: false,
        placeholder: 'Información adicional del viaje...',
        icon: 'bi bi-card-text',
        colClass: 'col-12',
        rows: 2,
        maxlength: 500
      },
      {
        key: 'notas',
        label: 'Notas Administrativas',
        type: 'textarea',
        required: false,
        placeholder: 'Notas internas...',
        icon: 'bi bi-pencil-square',
        colClass: 'col-12',
        rows: 2,
        maxlength: 500
      }
    ],
    customActions: [
      {
        name: 'ver_solicitudes',
        label: 'Ver Solicitudes',
        icon: 'bi bi-list-check',
        type: 'info',
        itemAction: true
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
