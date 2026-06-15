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

# Kompilierten Code & die Views (Templates) kopieren
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/views ./src/views

# Den Daten-Ordner für die SQLite-Datenbank erstellen
RUN mkdir -p data

EXPOSE 3000
CMD ["node", "dist/index.js"]