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

RUN rm -rf ./*

# Temporär kopieren
COPY --from=builder /app /app-tmp

# HIER DIE ÄNDERUNG: Wir kopieren ALLE .html Dateien (*.html statt nur index.html)
RUN cp /app-tmp/*.html ./ && \
    mkdir -p dist src && \
    cp -r /app-tmp/dist/* ./dist/ 2>/dev/null || true && \
    cp -r /app-tmp/src/* ./src/ 2>/dev/null || true && \
    cp -r /app-tmp/public* ./public/ 2>/dev/null || true

RUN rm -rf /app-tmp

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]