# Recap Project 2 - Trail Guide

## Lernziele
* **Full-Stack Integration:** Kombinieren von Routing, Middleware, MVC, Nunjucks und SQLite zu einer einzigen, funktionsfähigen Anwendung.
* **Hybride Responses:** Bereitstellen von HTML-Seiten und JSON-Antworten aus derselben Express-App und derselben Modellschicht.
* **Datenbank-Beziehungen:** Verwenden einer One-to-Many-Beziehung in SQLite und Auslesen der Daten mittels `INNER JOIN`.
* **API-Security:** Schützen von Schreib-Endpunkten einer öffentlichen API durch eine Header-basierte Schlüsselprüfung.
* **Class-less CSS:** Styling einer semantischen HTML-Seite mit [pico.css](https://picocss.com/) ohne eigene Custom-Klassen.

## Übersicht
Dieses Recap-Projekt führt die bisherigen Backend-Themen (HTTP, Express, Middleware, MVC, Templates und SQL) in einer Anwendung zusammen. Ziel ist es, die Architektur ohne Schritt-für-Schritt-Anleitung eigenständig zu implementieren.

Das Projekt **Trail Guide** ist ein Verzeichnis für Wanderwege und besteht aus drei Oberflächen:
1.  **Öffentliche Website:** Besucher können Wanderwege durchsuchen.
2.  **Admin-Panel:** Administratoren verwalten den Katalog über HTML-Formulare.
3.  **Öffentliche API:** Externe Entwickler können über den Endpunkt `/api` Daten im JSON-Format abrufen und manipulieren.

Alle Oberflächen teilen sich dieselbe Codebasis (Express), dieselbe SQLite-Datenbank und dieselben Modelle. Nur die Controller und das jeweilige Antwortformat unterscheiden sich.

## Datenmodell
Das Schema besteht aus zwei Tabellen:
-   `regions`: Speichert Gebiete (z. B. "Bayerische Alpen", "Schottisches Hochland") inkl. Land.
-   `trails`: Enthält die Wanderwege und verweist per Fremdschlüssel auf eine Region.

Durch den Einsatz von `INNER JOIN` enthalten alle Ausgaben (Website & API) automatisch die zugehörigen Regions-Informationen.

## Styling
Das Projekt nutzt **pico.css**. Durch das Einbinden via CDN wird reines semantisches HTML (`<header>`, `<nav>`, `<article>`, `<form>`, `<table>`) automatisch ansprechend gestaltet, sodass kein manuelles CSS nötig ist.

## Projektstruktur
Das Projekt ist in vier Phasen unterteilt, die nacheinander bearbeitet werden sollten:
1.  **Setup & Datenbank:** Grundgerüst und Tabellenschema.
2.  **Öffentliche Website:** Read-only Zugriff für Besucher.
3.  **Admin-Panel:** Schreibzugriff über Formulare.
4.  **Öffentliche API:** JSON-Schnittstelle mit Authentifizierung.
    README.md
    README.md wird angezeigt.