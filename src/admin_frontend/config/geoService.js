// Servicio para obtener datos geográficos de México desde APIs públicas
import axios from 'axios'

// API alternativas para datos de México
const APIS = {
  // API de estados y municipios (gratuita y confiable)
  estados: 'https://api-sepomex.hckdrk.mx/query/get_estados',
  municipios: 'https://api-sepomex.hckdrk.mx/query/get_municipio_por_estado',
  colonias: 'https://api-sepomex.hckdrk.mx/query/get_colonia_por_cp',
  
  // API alternativa de INEGI (más completa)
  inegi_estados: 'https://gaia.inegi.org.mx/wscatgeo/mgee/',
  inegi_municipios: 'https://gaia.inegi.org.mx/wscatgeo/mgem/'
}

// Cache en memoria para evitar llamadas repetidas
const cache = {
  estados: null,
  municipios: {},
  colonias: {}
}

/**
 * Obtener todos los estados de México
 */
export async function getEstados() {
  if (cache.estados) {
    return cache.estados
  }

  try {
    // Intentar con API de SEPOMEX
    const response = await axios.get(APIS.estados)
    
    if (response.data && Array.isArray(response.data)) {
      cache.estados = response.data.map(estado => ({
        value: normalizeString(estado),
        label: estado
      }))
      return cache.estados
    }
  } catch (error) {
    console.warn('Error obteniendo estados desde API:', error)
  }

  // Fallback a datos locales si falla la API
  return getEstadosLocal()
}

/**
 * Obtener municipios de un estado específico
 */
export async function getMunicipiosByEstado(estado) {
  if (!estado) return []
  
  const cacheKey = normalizeString(estado)
  if (cache.municipios[cacheKey]) {
    return cache.municipios[cacheKey]
  }

  try {
    // API de SEPOMEX requiere el nombre del estado
    const estadoNombre = typeof estado === 'string' ? estado : estado.label
    const response = await axios.get(`${APIS.municipios}/${encodeURIComponent(estadoNombre)}`)
    
    if (response.data && Array.isArray(response.data)) {
      cache.municipios[cacheKey] = response.data.map(mun => ({
        value: mun,
        label: mun
      }))
      return cache.municipios[cacheKey]
    }
  } catch (error) {
    console.warn('Error obteniendo municipios desde API:', error)
  }

  // Fallback a datos locales si falla la API
  return getMunicipiosLocal(estado)
}

/**
 * Obtener colonias por código postal
 */
export async function getColoniasByCP(codigoPostal) {
  if (!codigoPostal || codigoPostal.length !== 5) return []
  
  const cacheKey = codigoPostal
  if (cache.colonias[cacheKey]) {
    return cache.colonias[cacheKey]
  }

  try {
    const response = await axios.get(`${APIS.colonias}/${codigoPostal}`)
    
    if (response.data && response.data.response && Array.isArray(response.data.response.asentamiento)) {
      cache.colonias[cacheKey] = response.data.response.asentamiento.map(col => col)
      return cache.colonias[cacheKey]
    }
  } catch (error) {
    console.warn('Error obteniendo colonias desde API:', error)
  }

  return []
}

/**
 * Obtener información completa por código postal (colonias, municipio, estado, ciudad)
 */
export async function getInfoByCP(codigoPostal) {
  if (!codigoPostal || codigoPostal.length !== 5) return null

  try {
    const response = await axios.get(`${APIS.colonias}/${codigoPostal}`)
    
    if (response.data && response.data.response) {
      const data = response.data.response
      return {
        colonias: Array.isArray(data.asentamiento) ? data.asentamiento : [],
        municipio: data.municipio || '',
        estado: data.estado || '',
        ciudad: data.ciudad || data.municipio || '',
        codigoPostal: data.codigo_postal || codigoPostal
      }
    }
  } catch (error) {
    console.warn('Error obteniendo info por CP desde API:', error)
  }

  return null
}

/**
 * Buscar colonias por municipio (para autocompletado)
 */
export async function searchColoniasByMunicipio(municipio, search = '') {
  if (!municipio) return []
  
  // Esta funcionalidad requiere conocer el CP, por lo que retornamos
  // sugerencias basadas en colonias comunes
  return getColoniasLocalByMunicipio(municipio, search)
}

// ============ FUNCIONES DE FALLBACK CON DATOS LOCALES ============

function normalizeString(str) {
  if (!str) return ''
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, '_')
}

function getEstadosLocal() {
  return [
    { value: 'aguascalientes', label: 'Aguascalientes' },
    { value: 'baja_california', label: 'Baja California' },
    { value: 'baja_california_sur', label: 'Baja California Sur' },
    { value: 'campeche', label: 'Campeche' },
    { value: 'chiapas', label: 'Chiapas' },
    { value: 'chihuahua', label: 'Chihuahua' },
    { value: 'cdmx', label: 'Ciudad de México' },
    { value: 'coahuila', label: 'Coahuila' },
    { value: 'colima', label: 'Colima' },
    { value: 'durango', label: 'Durango' },
    { value: 'guanajuato', label: 'Guanajuato' },
    { value: 'guerrero', label: 'Guerrero' },
    { value: 'hidalgo', label: 'Hidalgo' },
    { value: 'jalisco', label: 'Jalisco' },
    { value: 'mexico', label: 'Estado de México' },
    { value: 'michoacan', label: 'Michoacán' },
    { value: 'morelos', label: 'Morelos' },
    { value: 'nayarit', label: 'Nayarit' },
    { value: 'nuevo_leon', label: 'Nuevo León' },
    { value: 'oaxaca', label: 'Oaxaca' },
    { value: 'puebla', label: 'Puebla' },
    { value: 'queretaro', label: 'Querétaro' },
    { value: 'quintana_roo', label: 'Quintana Roo' },
    { value: 'san_luis_potosi', label: 'San Luis Potosí' },
    { value: 'sinaloa', label: 'Sinaloa' },
    { value: 'sonora', label: 'Sonora' },
    { value: 'tabasco', label: 'Tabasco' },
    { value: 'tamaulipas', label: 'Tamaulipas' },
    { value: 'tlaxcala', label: 'Tlaxcala' },
    { value: 'veracruz', label: 'Veracruz' },
    { value: 'yucatan', label: 'Yucatán' },
    { value: 'zacatecas', label: 'Zacatecas' }
  ]
}

function getMunicipiosLocal(estado) {
  // Importar datos locales como fallback
  const { municipiosPorEstado } = require('./estadosMunicipios.js')
  const key = typeof estado === 'string' ? estado : estado.value
  const municipios = municipiosPorEstado[key] || []
  return municipios.map(m => ({ value: m, label: m }))
}

function getColoniasLocalByMunicipio(municipio, search = '') {
  // Importar datos locales como fallback
  const { coloniasPorMunicipio } = require('./estadosMunicipios.js')
  const colonias = coloniasPorMunicipio[municipio] || []
  
  if (search) {
    const searchLower = search.toLowerCase()
    return colonias.filter(c => c.toLowerCase().includes(searchLower))
  }
  
  return colonias
}

// Exportar también las funciones locales para uso directo
export { getEstadosLocal, getMunicipiosLocal, getColoniasLocalByMunicipio }
