FROM nginx:alpine

# Alten Inhalt restlos löschen
RUN rm -rf /usr/share/nginx/html/*

# Kopiere die HTML-Dateien aus dem quiz-game Unterordner
COPY apps/quiz-game/index.html /usr/share/nginx/html/
COPY apps/quiz-game/bookmarks.html /usr/share/nginx/html/
COPY apps/quiz-game/createCard.html /usr/share/nginx/html/
COPY apps/quiz-game/profile.html /usr/share/nginx/html/

# Kopiere die zugehörigen Ordner
COPY apps/quiz-game/css/ /usr/share/nginx/html/css/
COPY apps/quiz-game/js/ /usr/share/nginx/html/js/

# Falls der assets-Ordner existiert, kopieren, andernfalls leeren Ordner erstellen
COPY apps/quiz-game/assets/ /usr/share/nginx/html/assets/ 2>/dev/null || RUN mkdir -p /usr/share/nginx/html/assets

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]