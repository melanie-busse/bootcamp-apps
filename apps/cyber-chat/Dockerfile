# 1. Eine existierende Node-Version wählen (z.B. 20 oder 22)
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

# Abhängigkeiten installieren
RUN npm install

COPY . .

# Altes dist löschen und neu bauen
RUN rm -rf dist
RUN npm run build

# Zeigt uns beim Build im GitHub-Protokoll, wo die main.js genau liegt
RUN ls -la dist

EXPOSE 3000

# Falls dein NestJS-Build die main.js direkt in dist/main.js ablegt,
# passe den Pfad hier an zu: ["node", "dist/main.js"]
CMD ["node", "dist/src/main.js"]