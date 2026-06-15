# Stage 1: Build-Umgebung (Kompiliert TypeScript)
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json ./
RUN npm install --no-audit --progress=false

COPY . .
RUN npm run build

# Stage 2: Produktions-Umgebung mit Nginx
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# 1. Lösche die Nginx-Standarddateien radikal, damit nichts Altes überlebt
RUN rm -rf ./*

# 2. Kopiere die kompilierten JavaScript-Dateien (aus dist oder build)
# Je nachdem, wohin dein tsc-Compiler die JS-Dateien wirft:
COPY --from=builder /app/dist ./ 2>/dev/null || COPY --from=builder /app/build ./ 2>/dev/null || true

# 3. WICHTIG: Kopiere die statische index.html und CSS-Dateien aus dem Quellordner,
# falls sie vom Build-Skript nicht automatisch kopiert wurden.
COPY --from=builder /app/index.html ./
COPY --from=builder /app/*.css ./ 2>/dev/null || true
COPY --from=builder /app/public/ ./ 2>/dev/null || true
COPY --from=builder /app/models ./models 2>/dev/null || true
COPY --from=builder /app/services ./services 2>/dev/null || true

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]