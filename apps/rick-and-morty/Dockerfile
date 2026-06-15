FROM nginx:alpine

# Alten Inhalt restlos löschen
RUN rm -rf /usr/share/nginx/html/*

# Sicherstellen, dass die Zielstruktur für Assets existiert
RUN mkdir -p /usr/share/nginx/html/assets

# Hauptdateien kopieren
COPY apps/rick-and-morty/index.html /usr/share/nginx/html/
COPY apps/rick-and-morty/index.js /usr/share/nginx/html/
COPY apps/rick-and-morty/styles.css /usr/share/nginx/html/

# Ordner-Strukturen kopieren
COPY apps/rick-and-morty/components/ /usr/share/nginx/html/components/

# Falls du doch mal Bilder/Assets im Ordner hast, werden sie hier reingeschoben
# Wenn der lokale Ordner leer oder nicht da ist, ignoriert Docker das dank dem '*' meistens,
# beziehungsweise wir haben den Ordner oben ja schon sicherheitshalber erzeugt.
COPY apps/rick-and-morty/assets/ /usr/share/nginx/html/assets/

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]