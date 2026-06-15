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

# Wir nutzen RUN cp, um flexibel zu kopieren.
# Das "|| true" am Ende verhindert JEDEN Abbruch, falls ein Ordner fehlt.
COPY --from=builder /app /app-tmp
RUN cp /app-tmp/index.html ./ && \
    cp /app-tmp/*.css ./ 2>/dev/null || true && \
    cp /app-tmp/src/*.css ./ 2>/dev/null || true && \
    cp /app-tmp/src/*.js ./ 2>/dev/null || true && \
    cp -r /app-tmp/dist/* ./ 2>/dev/null || true && \
    cp -r /app-tmp/build/* ./ 2>/dev/null || true && \
    cp -r /app-tmp/public/* ./public/ 2>/dev/null || true

# Temporären Ordner wieder löschen
RUN rm -rf /app-tmp

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]