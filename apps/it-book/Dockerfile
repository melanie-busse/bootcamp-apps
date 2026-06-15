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

# Lösche die Nginx-Standarddateien radikal
RUN rm -rf ./*

# WICHTIG: Die index.html aus dem Hauptverzeichnis kopieren
COPY --from=builder /app/index.html ./

# Trick mit Wildcard: Kopiert den Inhalt von dist oder build, falls sie existieren.
# Wenn sie leer sind, stürzt Docker dank des Sternchens nicht ab.
COPY --from=builder /app/dist* ./
COPY --from=builder /app/build* ./

# CSS-Dateien kopieren (falls vorhanden)
COPY --from=builder /app/*.css ./

# Ganze Verzeichnisse kopieren (falls vorhanden)
# Durch den Punkt am Ende kopiert Docker das Verzeichnis nur, wenn es da ist.
COPY --from=builder /app/public* ./public/
COPY --from=builder /app/models* ./models/
COPY --from=builder /app/services* ./services/

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]