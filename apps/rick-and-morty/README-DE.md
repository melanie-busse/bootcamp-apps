Recap-Projekt 3: Rick and Morty App
In diesem Projekt erstellen Sie eine Single-Page-App zum Durchsuchen aller Charaktere aus der beliebten TV-Serie Rick and Morty.

Dies ist ein Gruppenprojekt, daher erstellen Sie nur ein Projekt pro Gruppe gemäß der Anleitung im Template-Abschnitt.
​

Überblick
Diese Single-Page-App ermöglicht es Nutzern, alle Charaktere aus Rick and Morty zu durchstöbern. Die App enthält ein Suchfeld zur Filterung der Charaktere, und alle relevanten Ergebnisse werden nach einer Suche angezeigt. Ein einfaches Paginierungssystem mit „Nächste“- und „Vorherige“-Navigationsbuttons erleichtert das Browsen großer Ergebnismengen.
​

API
Wir holen alle Charakterdaten aus einer speziell für Rick and Morty entwickelten REST-API. Die API-Dokumentation finden Sie hier.
​

❗️ Hinweis: Diese API verwendet Pagination, d. h. nur 20 Charaktere werden pro Anfrage zurückgegeben.
​

Template
Öffnen Sie Ihr Terminal und navigieren Sie zum Ordner, in dem sich all Ihre Projekte befinden.

Führen Sie den folgenden Befehl aus, um ein neues Projekt basierend auf einem Template zu erstellen:

bash
npx ghcd@latest wd-bootcamp/web-exercises/tree/main/sessions/recap-project-3/rick-and-morty-app -i
Erstellen Sie ein neues leeres Repository auf GitHub und fügen Sie alle Gruppenmitglieder als Kollaborateure hinzu.

Verknüpfen Sie Ihr lokales Remote-Repository mit dem erstellten Repository auf Ihrem Computer und pushen Sie den Code.

Jedes Gruppenmitglied klont das Repository auf seinen lokalen Rechner.

Folgen Sie den Anweisungen in der README.md-Datei.

💡 Vergessen Sie nicht, auf Feature-Branches zu arbeiten, sonst könnten Merge-Konflikte entstehen!

Deployment Ihres Projekts
🚀 Projekt-Deployment auf GitHub Pages ist erforderlich: Bitte beachten Sie die Deployment-Richtlinien in der Dokumentation Ihres Repositories für detaillierte Anweisungen.

Aufgaben
1. Daten von der API abrufen
   Lassen Sie uns mit dem Abrufen von Charakterdaten aus der API beginnen, die wir später dynamisch für Charakterkarten verwenden.

Erstellen Sie in der index.js eine Funktion namens fetchCharacters.

Verwenden Sie Ihr Wissen über Fetching, um die ersten 20 Charaktere aus der API zu holen. Den korrekten API-Endpunkt finden Sie in den Docs.

Loggen Sie die abgerufenen Daten in der fetchCharacters-Funktion in die Konsole.

Rufen Sie fetchCharacters auf und prüfen Sie die Browser-Konsole, um sicherzustellen, dass die Daten korrekt abgerufen werden.
​

2. Character Card Component
   Derzeit enthält das HTML eine hartcodierte Charakterkarte für Rick Sanchez. Statt sie hart zu codieren, erstellen wir die Karte dynamisch mit JavaScript.

Schreiben Sie in CharacterCard.js und exportieren Sie eine Funktion namens createCharacterCard.

Verwenden Sie innerHTML, um das HTML der Karte zu generieren. Schneiden und fügen Sie den relevanten HTML-Code der Karte aus der index.html in Ihre Funktion ein.

Stellen Sie sicher, dass createCharacterCard ein neu erstelltes <li>-Element zurückgibt, das eine Charakterkarte darstellt.

In index.js rufen Sie die createCharacterCard-Funktion auf und hängen ihren Rückgabewert an den bestehenden cardContainer an.

Sobald implementiert, sollte die Rick-Sanchez-Karte nicht mehr hartcodiert in index.html sein, sondern dynamisch mit JavaScript erstellt werden.

3. Character Card Component dynamisch machen
   Derzeit gibt die CharacterCard-Funktion immer den Charakter Rick Sanchez zurück. Aktualisieren Sie sie, damit sie Karten für beliebige Charaktere generieren kann.

Ändern Sie die CharacterCard-Funktion in CharacterCard.js so, dass sie die Charakterdaten als Argument akzeptiert.

Stellen Sie sicher, dass folgende Elemente der Karte dynamisch basierend auf den Charakterdaten aktualisiert werden:

die src des Bildes,

der Name des Charakters,

der Status, Typ und Auftritte.

💡 Hinweis: Die Auftritte können aus einem anderen Schlüssel im Charakter-Objekt abgeleitet werden.

Wechseln Sie zur index.js.

Entfernen Sie den console.log und die einzelne angehängte CharacterCard.

Aktualisieren Sie die fetchCharacters-Funktion, um eine Array-Methode zu verwenden, die für jeden Charakter eine Karte erstellt und an den cardContainer anhängt.

Stellen Sie sicher, dass der cardContainer jedes Mal geleert wird, wenn neue Charaktere abgerufen werden (HINWEIS: Sie können innerHTML = '' verwenden).

Sobald implementiert, sollte Ihre App 20 Charakterkarten dynamisch anzeigen.

4. Pagination
   Super Arbeit! Aber wir wollen nicht nur 20 Charaktere sehen, sondern alle! Implementieren wir also die Pagination.

Fügen Sie den String ?page=<pageIndex> zum Ende der Fetch-URL hinzu, um die jeweilige Seite von Charakteren zu erhalten.

Verwenden Sie die State-Variable page, um den aktuellen Seitenindex zu tracken.

Im info-Teil der empfangenen Daten finden Sie die maximale Seitenzahl.

Fügen Sie einen Event Listener zu jedem der Next- und Prev-Buttons hinzu, der Folgendes tut:

Verhindert, dass der Seitenindex höher als der maximale Seitenindex oder unter 1 geht,

Erhöht / verringert den Seitenindex,

Ruft die fetchCharacters-Funktion auf.

Aktualisieren Sie die Paginierungsanzeige jedes Mal, wenn Charaktere abgerufen werden, um die aktuelle Seite und die maximale Seite anzuzeigen.
​

5. Die Suchleiste
   Jetzt wollen wir noch mehr Funktionalität. Wir wollen einzelne Charaktere durch Eingeben ihres Namens in die Suchleiste finden.

Erstellen Sie einen 'submit'-Event Listener auf der Suchleiste.

Aktualisieren Sie die State-Variable searchQuery mit dem aktuellen Text in der Suchleiste jedes Mal, wenn dieser Event ausgelöst wird.

Ändern Sie die Fetch-URL erneut, indem Sie ein weiteres URL-codiertes Attribut name hinzufügen: Hängen Sie &name=<searchQuery> an die URL an. Wenn die Suchanfrage ein leerer String ist, wird sie von der API ignoriert, also machen Sie sich keine Sorgen.

Lösen Sie nun die Funktion fetchCharacters aus, wann immer ein Submit-Event stattfindet.

💡 Beim Verwenden der Suchleiste können die abgerufenen Ergebnisse weniger Seiten als der volle Datensatz haben. Um das zu handhaben:

Aktualisieren Sie maxPage auf den Wert info.pages aus der API-Antwort.

Setzen Sie page auf 1, wenn eine neue Suche eingereicht wird.
​

Bonus
6. Code refactoring
   Sie haben es geschafft: Ihre App funktioniert wie erwartet. 🚀✨

Allerdings wollen wir unseren Code aufräumen, damit nicht alles in einer einzigen JavaScript-Datei steht.

Die Next- und Prev-Buttons sowie die Pagination und die Suchleiste sind derzeit hartcodiert in der index.html. Entfernen Sie den HTML-Code und generieren Sie sie via JavaScript. Verwenden Sie die jeweiligen JavaScript-Component-Dateien dafür.

Die Component-Funktionen sollten NavButton, NavPagination und SearchBar heißen und die erstellten Elemente zurückgeben.

HINWEIS: Es ist herausfordernd, die Event-Listener-Funktionen für diese Components richtig zu implementieren. Verwenden Sie einen extra Eingabeparameter onClick oder onSubmit in Ihren Components.

Rufen Sie die Create-Funktionen in Ihrer index.js auf, um die UI-Components zu generieren. Sie müssen hier die Event-Listener-Callback-Funktionen als anonyme Arrow-Funktionen oder als benannte Funktionen angeben. Verwenden Sie sie als Argument für onClick oder onSubmit.

Hängen Sie die erstellten Components an den richtigen Stellen in Ihrem HTML an. Alle Container-Elemente sind bereits in der index.js verfügbar.

7. Ihr Projekt stylen
   Herzlichen Glückwunsch, dass Ihr Projekt läuft! Nehmen Sie es jetzt auf die nächste Stufe, indem Sie mit kreativen Designelementen Flair und Persönlichkeit hinzufügen. Dieser Bonus fokussiert sich auf die Verbesserung des visuellen Appeals Ihrer Seite. Folgen Sie diesen Schritten, um Ihrem Projekt den extra Touch zu verleihen:

Schritt 1: Experimentieren Sie mit Farben und Schriften
Seien Sie mutig mit Ihrer Farbpalette und Schriftwahl. Erkunden Sie Kombinationen, die harmonieren und zum Thema Ihres Projekts passen. Eine harmonische Farbskala und gut gewählte Schriften tragen erheblich zum Gesamteindruck bei.

Schritt 2: Lesbarkeit priorisieren
Während Sie kreativ werden, stellen Sie sicher, dass Ihre Seite leicht lesbar und navigierbar bleibt. Lesbarkeit ist entscheidend für eine positive Nutzererfahrung. Halten Sie einen guten Kontrast zwischen Text und Hintergrund und wählen Sie Schriftgrößen, die für Nutzer angenehm sind.

Schritt 3: Animationen nutzen
Führen Sie dynamische Elemente durch Animationen ein. Ob subtile Übergänge oder auffällige Effekte – Animationen können Ihr Projekt lebendig machen. Erwägen Sie CSS-Animationen oder JavaScript-Bibliotheken für den gewünschten visuellen Impact.

Schritt 4: Konsistenz ist entscheidend
Halten Sie eine konsistente Designsprache in Ihrem gesamten Projekt. Das umfasst einen einheitlichen Stil für Buttons, Navigationslemente und andere interaktive Components. Konsistenz schafft ein poliertes und professionelles Erscheinungsbild.

Schritt 5: Mobile Responsiveness
Vergessen Sie nicht die Mobile-Erfahrung! Testen Sie Ihr Projekt auf verschiedenen Geräten, um sicherzustellen, dass Ihre Styling-Anpassungen auf Desktop und Mobile großartig aussehen. Responsive Design ist entscheidend, um ein breiteres Publikum zu erreichen.

Schritt 6: Feedback einholen
Sobald Sie Ihre Styling-Verbesserungen implementiert haben, holen Sie Feedback von Kollegen oder Freunden ein. Frische Perspektiven können wertvolle Einblicke geben und Ihnen helfen, Ihr Design zu optimieren.

Denken Sie daran, dieser Bonus geht um Kreativität – viel Spaß dabei! Schieben Sie Grenzen, aber behalten Sie die Nutzererfahrung im Blick. Viel Erfolg beim Styling!