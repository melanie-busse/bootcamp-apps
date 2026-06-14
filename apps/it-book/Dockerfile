# Stage 1: Build-Umgebung
FROM node:20-alpine AS builder
WORKDIR /app

# Nur die package.json der App kopieren
COPY package.json ./

# Da die package-lock im Hauptverzeichnis liegt, installieren wir hier
# die in der package.json definierten Module direkt ohne Lock-Zwang
RUN npm install --no-audit --progress=false

# Den restlichen Quellcode der App kopieren
COPY . .

# Den Produktions-Build ausführen
RUN npm run build

# Stage 2: Produktions-Umgebung mit Nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]