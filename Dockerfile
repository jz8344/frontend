# Dockerfile para Railway - Frontend Vue con Express
FROM node:20-alpine

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY . .

# Build de producción
RUN npm run build

# Comando de inicio - cambiar temporalmente para test
CMD ["node", "test-server.js"]
