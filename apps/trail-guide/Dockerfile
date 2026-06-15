# Stage 1: TypeScript kompilieren
FROM node:20-alpine AS builder
WORKDIR /app

COPY apps/trail-guide/package*.json ./
RUN npm install

COPY apps/trail-guide/ ./
RUN npm run build

# Stage 2: Laufzeit-Umgebung
FROM node:20-alpine
WORKDIR /app

COPY apps/trail-guide/package*.json ./
RUN npm install --omit=dev

# 1. Den echten Pfad der Views kopieren (liegt direkt im Projekt-Root!)
COPY apps/trail-guide/views/ ./views/

# 2. Den public-Ordner (falls vorhanden) mitnehmen
COPY apps/trail-guide/public/ ./public/ 2>/dev/null || true

# 3. Den kompilierten Code holen
# Falls ein dist-Ordner existiert, kopieren wir ihn.
# Falls tsc die Dateien direkt in src/ kompiliert hat, kopieren wir einfach das gebaute src/ mit den JS-Dateien.
COPY --from=builder /app/dist/ ./dist/ 2>/dev/null || COPY --from=builder /app/src/ ./src/

# Den Daten-Ordner für die SQLite-Datenbank erstellen
RUN mkdir -p data

EXPOSE 3000
CMD ["node", "dist/index.js"]