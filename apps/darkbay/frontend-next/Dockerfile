# Stage 1: Bauen der Next.js App
FROM node:22-alpine AS build
WORKDIR /app

# 1. Erst die Packages kopieren und installieren (nutzt den Docker-Cache optimal)
COPY apps/darkbay/frontend-next/package*.json ./
RUN npm install

# 2. Den restlichen Quellcode des Next.js-Projekts kopieren
COPY apps/darkbay/frontend-next/ .

# 3. Umgebungsvariablen für den Build setzen
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

# 4. Next.js App bauen (erzeugt den standalone-Ordner)
RUN npm run build

# Stage 2: Bereitstellen des Node.js-Servers
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Kopiert die schlanken Standalone-Dateien aus der Build-Stage
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public

EXPOSE 3000

# Next.js Server starten statt Nginx
CMD ["node", "server.js"]