# Stage 1: Build-Umgebung
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json ./
RUN npm install --no-audit --progress=false

COPY . .
RUN npm run build

# Stage 2: Produktions-Umgebung mit Nginx
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Radikal aufräumen
RUN rm -rf ./*

# 1. HTML kopieren
COPY --from=builder /app/index.html ./

# 2. Alle CSS-Dateien flach kopieren (sucht im Root und in src)
COPY --from=builder /app/*.css ./
COPY --from=builder /app/src/*.css ./ 2>/dev/null || true

# 3. Alle kompilierten JS-Dateien aus dist/build flach in den Hauptordner kopieren
COPY --from=builder /app/dist/*.js ./ 2>/dev/null || true
COPY --from=builder /app/build/*.js ./ 2>/dev/null || true
COPY --from=builder /app/*.js ./ 2>/dev/null || true

# 4. Die restlichen Ordner kopieren
COPY --from=builder /app/models ./models 2>/dev/null || true
COPY --from=builder /app/services ./services 2>/dev/null || true
COPY --from=builder /app/public* ./public/

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]