# Stage 1: Build-Umgebung
FROM node:20-alpine AS builder
WORKDIR /app

# Abhängigkeiten kopieren und installieren
COPY package*.json ./
RUN npm ci

# Quellcode kopieren und Build ausführen
COPY . .
RUN npm run build

# Stage 2: Produktions-Umgebung (schlankes Nginx)
FROM nginx:alpine
# Kopiert die gebauten statischen Dateien (passe 'dist' an, falls dein Build-Ordner 'build' oder 'public' heißt)
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]