FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Alten Nginx-Standardkram löschen
RUN rm -rf ./*

# Kopiere einfach ALLES aus dem aktuellen Repository-Ordner direkt in den Nginx-HTML-Ordner
COPY . .

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]