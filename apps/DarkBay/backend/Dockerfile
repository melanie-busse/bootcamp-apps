FROM node:22-alpine

WORKDIR /app

# Die package.json gezielt aus dem backend-Ordner holen
COPY apps/DarkBay/backend/package*.json ./
RUN npm install

# Den restlichen Backend-Code kopieren
COPY apps/DarkBay/backend/ .

RUN rm -rf dist
RUN npm run build

EXPOSE 3000

CMD ["node", "dist/main.js"]