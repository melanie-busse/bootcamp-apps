FROM nginx:alpine

# Lösche den falschen Inhalt komplett
RUN rm -rf /usr/share/nginx/html/*

# Kopiere gezielt NUR den Inhalt aus dem quiz-game Ordner
# (Egal ob Docker aus dem Root oder dem Unterordner baut)
COPY apps/quiz-game/index.html /usr/share/nginx/html/ 2>/dev/null || COPY index.html /usr/share/nginx/html/
COPY apps/quiz-game/bookmarks.html /usr/share/nginx/html/ 2>/dev/null || COPY bookmarks.html /usr/share/nginx/html/ 2>/dev/null || true
COPY apps/quiz-game/createCard.html /usr/share/nginx/html/ 2>/dev/null || COPY createCard.html /usr/share/nginx/html/ 2>/dev/null || true
COPY apps/quiz-game/profile.html /usr/share/nginx/html/ 2>/dev/null || COPY profile.html /usr/share/nginx/html/ 2>/dev/null || true

# Ordner kopieren
COPY apps/quiz-game/css/ /usr/share/nginx/html/css/ 2>/dev/null || COPY css/ /usr/share/nginx/html/css/
COPY apps/quiz-game/js/ /usr/share/nginx/html/js/ 2>/dev/null || COPY js/ /usr/share/nginx/html/js/
COPY apps/quiz-game/assets/ /usr/share/nginx/html/assets/ 2>/dev/null || COPY assets/ /usr/share/nginx/html/assets/ 2>/dev/null || true

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]