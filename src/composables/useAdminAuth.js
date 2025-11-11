import { ref, computed } from 'vue'
import http, { API_BASE_URL } from '@/config/api.js'
import { admin, loginAdmin, logoutAdmin } from '@/store/session.js'

const loading = ref(false)
const error = ref(null)

const setupAxiosInterceptors = () => {
  http.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('admin_token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  // Interceptor para respuestas
  http.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Token expirado o inválido para cualquier petición de admin
        console.log('Token inválido o expirado, redirigiendo al login')
        logoutAdmin()
        if (window.location.pathname.startsWith('/admin/') && window.location.pathname !== '/admin/login') {
          window.location.href = '/admin/login'
        }
      }
      return Promise.reject(error)
    }
  )
}

export const useAdminAuth = () => {
  const isAuthenticated = computed(() => !!admin.value && !!localStorage.getItem('admin_token'))
  
  const adminData = computed(() => admin.value)

  const adminName = computed(() => {
    if (admin.value) {
      return `${admin.value.nombre} ${admin.value.apellidos}`.trim()
    }
    return 'Demo Company'
  })

  const initializeAuth = async () => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      logoutAdmin()
      return false
    }

    try {
      loading.value = true
      console.log('Validando sesión con token:', token)
      
      // Asegurar que el token se envíe en la petición
      const response = await http.get('/admin/sesion', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      console.log('Respuesta de validación:', response.data)
      
      if (response.data.admin) {
        loginAdmin(response.data.admin)
        console.log('Sesión válida, admin:', response.data.admin)
        return true
      } else {
        console.log('Sesión inválida')
        logoutAdmin()
        return false
      }
    } catch (err) {
      console.error('Error validando sesión de admin:', err)
      logoutAdmin()
      return false
    } finally {
      loading.value = false
    }
  }

  const validateSession = async () => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      return false
    }

    try {
      const response = await http.get('/admin/validar-sesion')
      return response.data.authenticated === true
    } catch (err) {
      console.error('Error validando sesión:', err)
      return false
    }
  }

  const login = async (email, password) => {
    try {
      loading.value = true
      error.value = null
      
      console.log('Intentando login con:', { email })
      
      const response = await http.post('/admin/login', {
        email: email, // Cambiar de 'correo' a 'email' para coincidir con el backend
        password: password
      })
      
      console.log('Respuesta del login:', response.data)
      
      if (response.data.token && response.data.admin) {
        localStorage.setItem('admin_token', response.data.token)
        loginAdmin(response.data.admin)
        console.log('Admin logueado correctamente:', response.data.admin)
        return { success: true, data: response.data }
      } else {
        throw new Error('Respuesta inválida del servidor')
      }
    } catch (err) {
      console.error('Error en login:', err)
      const errorMessage = err.response?.data?.error || err.response?.data?.message || 'Error al iniciar sesión'
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    try {
      // Intentar cerrar sesión en el servidor
      await http.post('/admin/sesiones/cerrar-actual')
    } catch (err) {
      console.warn('Error cerrando sesión en el servidor:', err)
    } finally {
      // Limpiar datos locales siempre
      logoutAdmin()
    }
  }

  const updateProfile = async (profileData) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await http.post('/admin/editar-perfil', profileData)
      
      if (response.data.admin) {
        loginAdmin(response.data.admin)
        return { success: true, message: response.data.message }
      }
      
      return { success: true, message: 'Perfil actualizado correctamente' }
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Error al actualizar perfil'
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      loading.value = false
    }
  }

  const changePassword = async (passwordData) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await http.post('/admin/actualizar-contrasena', passwordData)
      
      return { success: true, message: response.data.message }
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Error al cambiar contraseña'
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      loading.value = false
    }
  }

  return {
    // Estado
    loading,
    error,
    isAuthenticated,
    adminData,
    adminName,
    
    // Métodos
    initializeAuth,
    validateSession,
    login,
    logout,
    updateProfile,
    changePassword,
    setupAxiosInterceptors
  }
}
