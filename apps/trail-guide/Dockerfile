# Step 1: TypeScript kompilieren
FROM node:20-alpine AS builder
WORKDIR /app

# Package-Dateien kopieren und install triggern
COPY apps/trail-guide/package*.json ./
RUN npm install

# Komplette App kopieren
COPY apps/trail-guide/ ./

# Jetzt explizit kompilieren mit Pfad-Angabe zur Sicherheit
RUN ./node_modules/.bin/tsc

# Step 2: Das schlanke Produktions-Image
FROM node:20-alpine
WORKDIR /app

COPY apps/trail-guide/package*.json ./
RUN npm install --omit=dev

# Kopiere die kompilierten JS-Dateien aus der ersten Stufe
COPY --from=builder /app/dist ./dist

# Kopiere die statischen Assets und Views (die direkt im Hauptverzeichnis liegen)
COPY apps/trail-guide/views ./views
COPY apps/trail-guide/public ./public
COPY apps/trail-guide/data ./data

EXPOSE 3000

CMD ["node", "dist/index.js"]