FROM node:22-alpine

WORKDIR /app

# 1. Kopiere die package.json gezielt aus dem cyber-chat-Ordner
COPY apps/cyber-chat/package*.json ./

# 2. Abhängigkeiten installieren
RUN npm install

# 3. Kopiere den gesamten Code von Cyber-Chat in den Container
COPY apps/cyber-chat/ .

# 4. Altes dist löschen (falls vorhanden) und frisch bauen
RUN rm -rf dist
RUN npm run build

EXPOSE 3000

# Startbefehl für NestJS
CMD ["node", "dist/main.js"]