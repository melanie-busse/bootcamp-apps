# Stage 1: Build-Umgebung
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json ./
RUN npm install --no-audit --progress=false

COPY . .
RUN npm run build

# Stage 2: Produktions-Umgebung mit Nginx
FROM nginx:alpine

# Falls dein Build-Ordner "dist" heißt:
COPY --from=builder /app/dist /usr/share/nginx/html

# FALLBACK: Falls dein Build-Ordner stattdessen "build" heißt,
# überschreibe den Ordner zur Sicherheit mit diesem:
COPY --from=builder /app/build /usr/share/nginx/html 2>/dev/null || true

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]