# Stage 1: Build mit Node
FROM node:20-alpine AS builder
WORKDIR /app

# Wir kopieren die package.json (und die package-lock.json, falls sie doch da wäre)
COPY apps/theme-creator/package*.json ./

# Wechsel von 'npm ci' auf normales 'npm install'
RUN npm install --no-audit --progress=false

# Restliche App-Dateien kopieren
COPY apps/theme-creator/ ./

# Vite-Build triggern
RUN npm run build

# Stage 2: Webserver mit Nginx
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

RUN rm -rf ./*
COPY --from=builder /app/dist .

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]