<template>
  <div id="app">
    <router-view :key="$route.fullPath" />
    <WelcomeModal ref="welcomeModalRef" />
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { onMounted, ref, watch } from 'vue'
import WelcomeModal from '@/components/WelcomeModal.vue'
import http from '@/config/api.js'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

const $route = useRoute()
const welcomeModalRef = ref(null)

async function maybeShowWelcomeModal(source = 'initial') {
  const token = localStorage.getItem('token')
  const flag = localStorage.getItem('showWelcomeModal')
  if (!token || !flag) return
  if ($route.path.startsWith('/admin')) return
  if ($route.path !== '/') return // Solo en home

  try {
    const resp = await http.get('/hvson')
    if (resp.data && resp.data.have_son === false) {
      if (welcomeModalRef.value) {
        console.debug('[WelcomeModal] Mostrando modal (fuente:', source, ')')
        welcomeModalRef.value.show()
      } else {
        console.warn('[WelcomeModal] Ref no disponible todavía, reintentando...')
        setTimeout(() => maybeShowWelcomeModal('retry-ref'), 300)
      }
    } else {
      // Usuario ya tiene hijos, limpiar flag
      localStorage.removeItem('showWelcomeModal')
    }
  } catch (e) {
    console.warn('No se pudo verificar have_son:', e)
  } finally {
    // Siempre limpiar flag para evitar loops si ya mostramos
    localStorage.removeItem('showWelcomeModal')
  }
}

onMounted(() => {
  // Intento inicial (por si ya hay flag al cargar app)
  setTimeout(() => maybeShowWelcomeModal('mounted'), 400)
})

// Vigilar cambios de ruta (incluye post-login)
watch(() => $route.fullPath, () => {
  setTimeout(() => maybeShowWelcomeModal('route-watch'), 150)
})
</script>

<style scoped>
#app {
  font-family: 'Montserrat', sans-serif;
}
</style>