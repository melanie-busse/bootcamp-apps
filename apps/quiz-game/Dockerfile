# Stage 1: Build-Umgebung
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json ./
RUN npm install --no-audit --progress=false

COPY . .
# Falls die App kein Build-Skript braucht (weil es reines Vanilla JS ist),
# kannst du die Zeile RUN npm run build einfach löschen oder auskommentieren!
RUN npm run build 2>/dev/null || true

# Stage 2: Produktions-Umgebung mit Nginx
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

# Temporär kopieren
COPY --from=builder /app /app-tmp

# Kopiert alle HTML-Dateien sowie die Assets-, CSS- und JS-Ordner
RUN cp /app-tmp/*.html ./ && \
    cp -r /app-tmp/assets/* ./assets/ 2>/dev/null || true && \
    cp -r /app-tmp/css/* ./css/ 2>/dev/null || true && \
    cp -r /app-tmp/js/* ./js/ 2>/dev/null || true

RUN rm -rf /app-tmp

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]