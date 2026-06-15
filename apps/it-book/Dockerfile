# Stage 1: Build-Umgebung (TypeScript kompilieren)
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

# Wir kopieren alles in eine temporäre Struktur und bauen die Ordner
# für Nginx exakt so auf, wie die index.html es verlangt.
COPY --from=builder /app /app-tmp
RUN cp /app-tmp/index.html ./ && \
    mkdir -p dist src && \
    cp -r /app-tmp/dist/* ./dist/ 2>/dev/null || true && \
    cp -r /app-tmp/src/* ./src/ 2>/dev/null || true && \
    cp -r /app-tmp/public* ./public/ 2>/dev/null || true

# Temporären Ordner löschen
RUN rm -rf /app-tmp

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]