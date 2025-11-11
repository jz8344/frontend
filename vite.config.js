import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  server: {
    host: '0.0.0.0',     // escucha en todas las IPs
    port: 5173,          // cámbialo si ya está ocupado
    strictPort: true,    // falla si el puerto está ocupado (útil para no andar adivinando)
    cors: true,
    // Si el HMR no conecta desde otro dispositivo:
    // hmr: { host: 'TU_IP_LOCAL', protocol: 'ws', port: 5173 },
    // allowedHosts: ['TU_IP_LOCAL', 'localhost'],
  },
  preview: {
    host: '0.0.0.0',
    port: 5173,
  },
})
