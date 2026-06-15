FROM node:20-alpine
WORKDIR /app

# 1. Projektdaten kopieren (ausgehend vom Hauptverzeichnis)
COPY apps/trail-guide/package*.json ./

# 2. Alle Abhängigkeiten installieren
RUN npm install

# 3. Den Rest der App kopieren
COPY apps/trail-guide/ ./

# 4. TypeScript in JavaScript kompilieren
RUN npm run build

# 5. Den Datenordner für SQLite anlegen
RUN mkdir -p data

EXPOSE 3000

# Da wir im selben Container bleiben, starten wir einfach
CMD ["npm", "start"]