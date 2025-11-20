import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './assets/css/dark-mode.css'

// Cargar Google Maps API dinámicamente
const loadGoogleMaps = () => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  if (!apiKey) {
    console.warn('Google Maps API Key no configurada')
    return
  }
  
  const script = document.createElement('script')
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
  script.async = true
  script.defer = true
  document.head.appendChild(script)
}

// Inicializar tema oscuro antes de montar la app
const initTheme = () => {
  const darkMode = localStorage.getItem('darkMode') === 'true'
  const theme = darkMode ? 'dark' : 'light'
  document.documentElement.setAttribute('data-bs-theme', theme)
  document.body.setAttribute('data-bs-theme', theme)
}

// Ejecutar inmediatamente para evitar flash
initTheme()
loadGoogleMaps()

const app = createApp(App)
app.use(router)
app.mount('#app')