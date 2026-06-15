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

# 2. Alle CSS-Dateien flach kopieren (ohne || true)
COPY --from=builder /app/*.css ./
COPY --from=builder /app/src/*.css ./

# 3. Alle kompilierten JS-Dateien flach kopieren
# Wir nehmen einfach den kompletten dist-Ordner-Inhalt, falls er existiert
COPY --from=builder /app/dist* ./
COPY --from=builder /app/build* ./

# 4. Statische Assets kopieren (falls vorhanden)
COPY --from=builder /app/public* ./public/

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]