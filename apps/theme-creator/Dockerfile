# Stage 1: Build mit Node
FROM node:20-alpine AS builder
WORKDIR /app

# Da der Kontext das Hauptverzeichnis ist, kopieren wir gezielt die App-Dateien
COPY apps/theme-creator/package*.json ./
RUN npm ci --no-audit --progress=false

COPY apps/theme-creator/ ./

# Vite-Build triggern (erzeugt den dist/ Ordner)
RUN npm run build

# Stage 2: Webserver mit Nginx
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

# Kopiere das Build-Ergebnis aus Stage 1 in den Nginx
COPY --from=builder /app/dist .

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]