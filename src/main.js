import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './assets/css/dark-mode.css'

// Inicializar tema oscuro antes de montar la app
const initTheme = () => {
  const darkMode = localStorage.getItem('darkMode') === 'true'
  const theme = darkMode ? 'dark' : 'light'
  document.documentElement.setAttribute('data-bs-theme', theme)
  document.body.setAttribute('data-bs-theme', theme)
}

// Ejecutar inmediatamente para evitar flash
initTheme()

const app = createApp(App)
app.use(router)
app.mount('#app')