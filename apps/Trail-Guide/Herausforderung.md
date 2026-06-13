# Backend Recap Project – Challenges

Dies ist das Abschlussprojekt für das Backend-Modul. Du baust die **Trail Guide**-Anwendung: Eine Express-App, die eine öffentliche Website, ein Admin-Panel und eine JSON-API bereitstellt – alles basierend auf derselben SQLite-Datenbank und derselben Modellschicht.

Das Projekt ist in vier Teile gegliedert. Bearbeite sie nacheinander, da jeder Teil auf dem vorherigen aufbaut.

---

## 1. Datenbank und Setup
**Ziel:** Ein Projektgerüst mit Datenbankanbindung, einem funktionierenden Nunjucks-Layout (pico.css) und einer initialisierten SQLite-Datei.

### Projekt-Setup
* **Initialisierung:** Neues npm-Projekt erstellen.
* **Dependencies:** `express`, `nunjucks`, `sqlite`, `sqlite3`, `sanitize-html`.
* **Dev-Dependencies:** `@types/*`, `tsx`, `typescript`.
* **Scripts:** `tsconfig.json` anlegen und ein `dev`-Skript (`tsx watch src/app.ts`) hinzufügen.
* **Environment:** `.env` Datei für `PORT`, `DB_PATH` und `API_KEY` erstellen. Laden via `tsx --env-file=.env`.

### Struktur & Daten
* **Ordner:** `src/` (app, routes, controllers, models, middleware), `views/` (macros, admin), `public/`.
* **Daten:** `data`-Ordner herunterladen und `db:seed` Skript in `package.json` anlegen:  
  `"db:seed": "sqlite3 data/trail-guide.db < data/seed.sql"`
* **DB-Modul:** `src/models/db.ts` mit `connectDB`, `getDB` und `closeDB` erstellen.
* **Lifecycle:** `connectDB()` beim Start aufrufen; `SIGINT`/`SIGTERM` zum Schließen der Verbindung nutzen.

---

## 2. Website
**Ziel:** Eine öffentlich zugängliche Website (Read-only) zum Durchsuchen von Wanderwegen und Regionen.

### Modelle
* **regionModel.ts:** `getAllRegions()`, `getRegionBySlug(slug)`.
* **trailModel.ts:** `getAllTrails()`, `getTrailBySlug(slug)`, `getTrailsByRegionId(id)`.
* **SQL:** Nutze `INNER JOIN`, um Regionsdaten (Name, Land) direkt mit abzufragen. Verwende **parameterisierte Abfragen**.

### Routen & Controller
* `GET /`: Startseite (alle Wege).
* `GET /trails/:slug`: Detailansicht eines Weges.
* `GET /regions`: Liste aller Regionen.
* `GET /regions/:slug`: Region-Detailseite mit gefilterten Wegen.

### Views & Middleware
* **Templates:** `views/index.html`, `trail.html`, `regions.html`, `region.html` (alle erben von `base.html`).
* **Macros:** `views/macros/trailCard.html` für die konsistente Darstellung von Wanderwegen.
* **Logger:** `middleware/logger.ts` erstellen, um Anfragen in `logs/access.log` zu speichern.

---

## 3. Admin-Panel
**Ziel:** HTML-basiertes CRUD für Wanderwege unter `/admin`.

* **Routen (adminRoutes.ts):**
    * `GET /admin`: Tabellarische Übersicht mit Action-Buttons.
    * `GET/POST /admin/trails/new`: Formular für neue Einträge.
    * `GET/POST /admin/trails/:id/edit`: Bearbeitungsmodus.
    * `POST /admin/trails/:id/delete`: Löschfunktion.
* **Modelle:** `getTrailById`, `addTrail`, `updateTrail`, `deleteTrail` hinzufügen. Slugs automatisch basierend auf dem Titel aktualisieren.
* **Formulare:** Regionen via Dropdown (Select) aus der DB laden. `express.urlencoded` für das Parsing aktivieren.

---

## 4. Öffentliche REST-API
**Ziel:** Eine JSON-Schnittstelle unter `/api`. Lesezugriff für alle, Schreibzugriff nur mit API-Key.

### Endpunkte
* `GET /api/trails`: Liste aller Wege (inkl. Filter für `?region` und `?difficulty`).
* `GET /api/trails/:slug`: Einzelner Weg mit Regions-Join.
* `POST /api/trails`: Erstellen (JSON Body, Key erforderlich).
* `PATCH /api/trails/:id`: Teilweise Aktualisierung (Key erforderlich).
* `DELETE /api/trails/:id`: Löschen (Key erforderlich).

### Sicherheit & Validierung
* **Middleware:** `middleware/apiKey.ts` prüft den Header `x-api-key`.
* **Status Codes:** * `201` für Erstellung.
    * `204` für erfolgreiches Löschen.
    * `400` bei fehlenden Feldern.
    * `401` bei falschem API-Key.
    * `404` wenn Datensätze nicht existieren.

---

## Bonus-Herausforderungen
* **Tags (Many-to-Many):** Eigene Tabellen für Tags und deren Verknüpfung.
* **Suche:** `?q=` Parameter für die Titelsuche via SQL `LIKE`.
* **Pagination:** `?page` und `?pageSize` Unterstützung.
* **Rate Limiting:** Schreibzugriffe pro API-Key limitieren (Status `429`).
  CHALLENGES.md
  CHALLENGES.md wird angezeigt.