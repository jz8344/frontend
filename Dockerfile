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

# Exponer puerto
EXPOSE 5173

# Comando de inicio
CMD ["node", "server.js"]
