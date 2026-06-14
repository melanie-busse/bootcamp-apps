# Stage 1: Bauen der Angular App
FROM node:22-alpine AS build
WORKDIR /app

COPY apps/darkbay/frontend/package*.json ./
RUN npm install

COPY apps/darkbay/frontend/ .
RUN npm run build -- --configuration=production

# Stage 2: Bereitstellen über Nginx
FROM nginx:alpine
# Kopiert die gebauten statischen Dateien in den Nginx-Standardordner
# HINWEIS: Manchmal baut Angular in 'dist/frontend/browser' oder 'dist/browser'.
# Passe den Quellpfad an, falls dein dist-Ordner anders strukturiert ist.
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
