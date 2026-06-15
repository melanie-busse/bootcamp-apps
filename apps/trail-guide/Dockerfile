# Stage 1: TypeScript kompilieren
FROM node:20-alpine AS builder
WORKDIR /app

# Dependencies installieren
COPY apps/trail-guide/package*.json ./
RUN npm install

# Komplette App kopieren und bauen
COPY apps/trail-guide/ ./
RUN npm run build

# Stage 2: Laufzeit-Umgebung
FROM node:20-alpine
WORKDIR /app

# Nur Production-Dependencies
COPY apps/trail-guide/package*.json ./
RUN npm install --omit=dev

# Wir kopieren jetzt einfach die benötigten Ordner direkt aus dem /app-Verzeichnis des Builders
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/src/views /app/src/views

# Den Daten-Ordner für die SQLite-Datenbank erstellen
RUN mkdir -p data

EXPOSE 3000
CMD ["node", "dist/index.js"]