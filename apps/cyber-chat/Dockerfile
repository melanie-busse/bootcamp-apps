FROM node:26-alpine

WORKDIR /app

COPY package*.json ./

# Wir installieren ALLE Abhängigkeiten (auch das Nest-CLI aus den devDependencies wird gebraucht!)
RUN npm install

COPY . .

# Sicherstellen, dass das alte dist weg ist, und frisch bauen
RUN rm -rf dist
RUN npm run build

# Lass uns beim Bauen im Terminal anzeigen, was wirklich im dist-Ordner gelandet ist!
# Das hilft uns beim Debuggen, falls es immer noch hakt.
RUN ls -la dist

EXPOSE 3000

# HIER DIE ÄNDERUNG: Wir starten direkt aus dem src-Unterordner heraus!
CMD ["node", "dist/src/main.js"]