# Step 1: TypeScript kompilieren
FROM node:20-alpine AS builder
WORKDIR /app

COPY apps/trail-guide/package*.json ./
RUN npm install

COPY apps/trail-guide/ ./
RUN npm run build

# Step 2: Das schlanke Produktions-Image
FROM node:20-alpine
WORKDIR /app

COPY apps/trail-guide/package*.json ./
RUN npm install --omit=dev

# Durch die tsconfig-Änderung ist der dist-Ordner jetzt garantiert da
COPY --from=builder /app/dist ./dist
COPY apps/trail-guide/views ./views
COPY apps/trail-guide/public ./public
COPY apps/trail-guide/data ./data

EXPOSE 3000

# Startet deine kompilierte Hauptdatei (src/app.ts -> dist/app.js)
CMD ["node", "dist/app.js"]