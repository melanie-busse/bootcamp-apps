Hier ist eine schrittweise Anleitung für das Rick and Morty App Projekt:

📋 Schritt-für-Schritt Anleitung
Phase 1: Projekt Setup
Terminal öffnen und zum Projekte-Ordner navigieren

Template erstellen:

bash
npx ghcd@latest wd-bootcamp/web-exercises/tree/main/sessions/recap-project-3/rick-and-morty-app -i
GitHub Repository erstellen (leer, Gruppenmitglieder als Collaborators hinzufügen)

Remote verknüpfen und Code pushen

Gruppenmitglieder klonen das Repository lokal

README.md Anweisungen befolgen

Phase 2: Grundfunktionalität
Schritt 1: API Daten abrufen

text
index.js: fetchCharacters() Funktion erstellen
• API Endpoint: https://rickandmortyapi.com/api/character
• Erste 20 Charaktere fetchen
• Konsole loggen ✓
Schritt 2: CharacterCard Komponente

text
CharacterCard.js: createCharacterCard() Funktion
• HTML aus index.html kopieren
• <li> Element zurückgeben
• In index.js: 1x aufrufen + anhängen
Schritt 3: Dynamische Karten

text
CharacterCard.js: Parameter character akzeptieren
Aktualisieren: image.src, name, status, species, episode.length
index.js:
• cardContainer.innerHTML = ''
• data.results.map(createCharacterCard).forEach(append)
Phase 3: Navigation & Suche
Schritt 4: Pagination

text
State-Variablen: let page = 1, maxPage = 0
URL: `?page=${page}`
Event Listener Next/Prev Buttons:
• Grenzen prüfen (1 bis maxPage)
• page ++/--
• fetchCharacters() aufrufen
• Anzeige: "Seite X von Y" aktualisieren
Schritt 5: Suchleiste

text
Search Form: 'submit' Event Listener
• searchQuery = input.value
• URL: `?page=1&name=${searchQuery}`
• Bei Suche: page = 1, maxPage = apiInfo.pages
Phase 4: Bonus (optional)
Schritt 6: Code Refactoring

text
HTML entfernen, JS generieren:
• NavButton(onClick)
• NavPagination()
• SearchBar(onSubmit)
Alle Container in index.js verfügbar ✓
Schritt 7: Styling

text
• Farben + Fonts experimentieren
• Lesbarkeit sicherstellen  
• CSS Animationen hinzufügen
• Konsistentes Design
• Mobile Responsive ✓
• Feedback einholen
🚀 Deployment
text
GitHub Pages aktivieren gemäß:
https://github.com/wd-bootcamp/cohort-template/blob/main/docs/deployment-github-pages.md
💡 Tipps für Gruppenarbeit
Feature Branches verwenden (git checkout -b feature/pagination)

npm i und npm run start lokal testen

Live Preview (VS Code Extension) nutzen

Ergebnis: Voll funktionale Single-Page-App mit API, Suche, Pagination und responsivem Design!