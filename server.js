import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5173;
const distPath = join(__dirname, 'dist');

// Verificar que la carpeta dist existe
if (!existsSync(distPath)) {
  console.error('❌ Error: La carpeta dist no existe. Ejecuta "npm run build" primero.');
  process.exit(1);
}

// Health check endpoint (antes de static files)
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    port: PORT 
  });
});

// Servir archivos estáticos de la carpeta dist
app.use(express.static(distPath, {
  maxAge: '1d',
  etag: true
}));

// Manejar todas las rutas (para Vue Router en modo history)
app.get('*', (req, res) => {
  res.sendFile(join(distPath, 'index.html'));
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Servidor corriendo en puerto ${PORT}`);
  console.log(`🌐 Sirviendo desde: ${distPath}`);
  console.log(`🚀 Aplicación lista`);
  console.log(`💚 Health check disponible en /health`);
});

// Manejo de errores
server.on('error', (error) => {
  console.error('❌ Error al iniciar servidor:', error);
  process.exit(1);
});

// Manejo de señales de terminación
const shutdown = (signal) => {
  console.log(`\n⚠️  Recibida señal ${signal}, cerrando servidor gracefully...`);
  server.close(() => {
    console.log('✅ Servidor cerrado correctamente');
    process.exit(0);
  });
  
  // Forzar cierre después de 10 segundos
  setTimeout(() => {
    console.error('❌ Forzando cierre del servidor');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Mantener el proceso vivo
process.on('uncaughtException', (error) => {
  console.error('❌ Excepción no capturada:', error);
  shutdown('uncaughtException');
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Promise rechazada no manejada:', reason);
});
