#!/bin/sh
# Script de verificación para Railway

echo "🔍 Verificando build..."

# Verificar que existe la carpeta dist
if [ ! -d "dist" ]; then
  echo "❌ Error: La carpeta dist no existe"
  exit 1
fi

# Verificar que existe index.html
if [ ! -f "dist/index.html" ]; then
  echo "❌ Error: dist/index.html no existe"
  exit 1
fi

# Verificar que existe server.js
if [ ! -f "server.js" ]; then
  echo "❌ Error: server.js no existe"
  exit 1
fi

echo "✅ Verificación exitosa"
echo "📁 Contenido de dist:"
ls -lh dist/ | head -n 10

echo "🚀 Iniciando servidor..."
exec node server.js
