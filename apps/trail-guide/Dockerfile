# Step 1: TypeScript kompilieren
FROM node:20-alpine AS builder
WORKDIR /app

# Package-Dateien kopieren und install triggern
COPY apps/trail-guide/package*.json ./
RUN npm install

# Komplette App kopieren
COPY apps/trail-guide/ ./

# Hier zwingen wir tsc, die Ausgabe in den Ordner "dist" zu schreiben!
RUN ./node_modules/.bin/tsc --outDir dist

# Step 2: Das schlanke Produktions-Image
FROM node:20-alpine
WORKDIR /app

COPY apps/trail-guide/package*.json ./
RUN npm install --omit=dev

# Jetzt existiert der Ordner zu 100%
COPY --from=builder /app/dist ./dist

# Kopiere die statischen Assets und Views
COPY apps/trail-guide/views ./views
COPY apps/trail-guide/public ./public
COPY apps/trail-guide/data ./data

EXPOSE 3000

CMD ["node", "dist/index.js"]