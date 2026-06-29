# Recap Project 5 – Hide and Seek

In diesem Recap-Projekt baust du ein Hide-and-Seek-Spiel (Verstecken-Spiel) für zwei Spieler. Gespielt wird auf einem Grid aus Zellen, auf dem sich jeder Spieler in Echtzeit Zelle für Zelle bewegen kann. Wenn es dem suchenden Spieler gelingt, auf das Feld zu ziehen, auf dem sich der andere Spieler befindet, gewinnt er. Wenn es dem versteckenden Spieler gelingt, dem anderen Spieler auszuweichen, bis der Timer abläuft, gewinnt er.

Du baust dieses Projekt mit folgenden Technologien:

* NestJS für das Backend
* React oder Next.js für das Frontend
* Socket.io für die Real-Time-Kommunikation

Jeder durchnummerierte Abschnitt hält die App lauffähig und bringt etwas Neues – sodass jeder Abschnitt einen sinnvollen Commit darstellt.

Starter:

```
npx ghcd@latest wd-bootcamp/asd-challenges/tree/main/challenges/recap-project-5 hide-and-seek
```

## 1 Project Setup and a First Connection

Bring den Starter zum Laufen. Führe im Repo-Root `bun install` aus, dann `bun run dev`. Beide Apps starten, und das Öffnen des Frontends unter `http://localhost:5173` loggt eine Connection im Backend-Terminal.

Die Verbindung ist offen, trägt aber noch nichts. Beweise, dass sie in beide Richtungen funktioniert. Emittiere vom Client aus ein Test-Event, sobald sich der Socket verbindet. Füge auf dem Server einen Handler für dieses Event hinzu, der loggt, was er empfangen hat, und eine Antwort emittiert. Höre auf dem Client auf diese Antwort und logge sie.

Initialisiere ein Git-Repository, veröffentliche es auf GitHub und teile es im entsprechenden Discord-Thread.

**Fertig, wenn:** das Laden des Frontends einen Socket öffnet, der Server das Test-Event des Clients loggt, und der Client die Antwort des Servers loggt.

Resource: [NestJS Gateways](https://docs.nestjs.com/websockets/gateways)

## 2 Rooms & Matchmaking

Ein Match braucht genau zwei Spieler, die nur voneinander hören, nicht von allen anderen, die mit dem Server verbunden sind.

* Wenn sich ein Client verbindet, platziere ihn in einem Game-Room. Starte einen neuen Room, wenn keiner wartet, und füge den nächsten Spieler dem Room hinzu, der bereits einen Spieler enthält.
* Nutze Socket.io Rooms, damit du nur an die zwei Sockets eines einzelnen Matches broadcasten kannst.
* Sobald ein Room zwei Spieler enthält, weise einem die Seeker-Rolle und dem anderen die Hider-Rolle zu, und sag jedem Client, welche Rolle er hat.
* Behalte den Überblick, welchen Room und welche Rolle jeder Socket hat. Der Server braucht das bei jedem späteren Event, um zu wissen, wer sich bewegt und welches Match aktualisiert werden muss. Eine Map von Socket-ID zu Room und Rolle reicht aus.
* Starte das Spiel erst, wenn der zweite Spieler eintrifft. Bis dahin wartet der erste Spieler.

**Fertig, wenn:** zwei Browser-Tabs zu einem Room gepaart werden und jedem gesagt wird, ob er der Seeker oder der Hider ist, während ein dritter Tab auf einen Partner wartet.

**Design-Frage:** Wenn sich viele Spieler verbinden, wie weißt du, welche zwei zum selben Match gehören, und wie verhinderst du, dass die Messages eines Matches in ein anderes durchsickern?

Resource: [Socket.io Rooms](https://socket.io/docs/v4/rooms/)

## 3 Authoritative Game State and the Grid

Der Server hält den echten Game State.
Die Clients zeichnen ihn nur in das Grid.

* Mache das Spiel zum Einstieg zu einem 10×10-Grid.
* Definiere den State, den ein Match auf dem Server braucht:
    * die Position jedes Spielers auf dem Grid
    * wer der Seeker und wer der Hider ist
    * den Status des Spiels
    * die verbleibende Zeit.
* Für den Status brauchst du mindestens einen `running`- und einen `finished`-Wert. Ein `waiting`-Wert, für die Zeit bevor der zweite Spieler beitritt, ist ebenfalls nützlich.
* Entscheide die Startpositionen, zum Beispiel den Seeker in einer Ecke und den Hider in der gegenüberliegenden, und lege sie bei Beginn des Matches in den State.
* Halte diesen State an einem Ort auf dem Server, zum Beispiel in einem In-Memory-Service, der alle aktiven Matches verwaltet, statt auf der Gateway-Instanz oder an eine einzelne Connection gebunden.
* Broadcaste den initialen State an beide Spieler im Room.
* Rendere im Frontend das Grid aus dem empfangenen State und markiere, wo jeder Spieler steht.

**Fertig, wenn:** beide Clients ein 10×10-Grid mit den zwei Spielern auf ihren Startzellen zeigen, gezeichnet aus dem State, den der Server gesendet hat.

**State-Frage:** Manche Daten müssen gespeichert werden, wie die Koordinaten eines Spielers. Manche Werte lassen sich aus diesen Daten berechnen, etwa ob zwei Spieler dieselbe Zelle belegen. Was gehört in den gespeicherten State, und was solltest du bei Bedarf berechnen?

Resource: [Socket.io Emitting Events](https://socket.io/docs/v4/emitting-events/)

## 4 Movement and the Message Protocol

Lass jetzt die Spieler sich bewegen, mit dem Server als Gatekeeper für jeden Schritt.

* Fange Pfeiltasten-Eingaben im Frontend ab und emittiere eine Move-Intention, zum Beispiel eine Richtung wie `"up"` oder `"left"`, statt einer fertigen Koordinate.
* Entferne den Key-Listener, wenn die Komponente unmountet, und lies den aktuellsten State, wenn eine Taste gedrückt wird, damit du nicht mit einer veralteten Kopie arbeitest.
* Finde auf dem Server heraus, welcher Spieler den Move über seinen Socket gesendet hat, ermittle die Zielzelle, und prüfe den Move dann, bevor du ihn anwendest: Das Spiel muss laufen, und das Ziel muss innerhalb des 10×10-Grids bleiben.
* Aktualisiere die Position des sich bewegenden Spielers im State und broadcaste den neuen State an den Room, damit beide Clients neu rendern.

**Fertig, wenn:** das Drücken von Pfeiltasten deinen eigenen Spieler auf beiden Bildschirmen bewegt, und ein Move, der das Grid verlassen würde, ignoriert wird.

**Protokoll-Frage:** Was muss ein Move-Event eigentlich mittragen? Und warum ist es sicherer, die Richtung zu senden, die der Spieler gedrückt hat, und den Server die neue Position berechnen zu lassen, statt die neuen Koordinaten direkt vom Browser zu senden?

Resource: [Socket.io Client API](https://socket.io/docs/v4/client-api/)

## 5 Winning, the Timer, and Game Over

Gib dem Match eine Uhr und einen Weg, zu enden.

* Starte einen Countdown auf dem Server, wenn das Match beginnt, und sende die verbleibende Zeit an beide Clients, während sie runterzählt. Lege eine Spiellänge fest, z. B. 60 Sekunden (du kannst sie später anpassen).
* Prüfe nach jedem Move, ob der Seeker jetzt dieselbe Zelle mit dem Hider teilt. Wenn ja, gewinnt der Seeker.
* Wenn der Timer null erreicht, ohne dass es zu einem Fang kam, gewinnt der Hider.
* Setze einen Gewinner im State, broadcaste eine Game-Over-Message, und lass beide Clients das Ergebnis anzeigen und aufhören, Moves zu senden.

**Design-Frage:** Warum müssen Timer und Fang-Check auf dem Server laufen statt in jedem Browser? Stell dir vor, was passieren würde, wenn der Client eines Spielers seine eigene Uhr betreibt.

Resource: [NestJS Gateways - Message Handling](https://docs.nestjs.com/websockets/gateways#multiple-responses)

## 6 Disconnects and Playing Again

Ein echtes Spiel muss es überstehen, wenn ein Spieler seinen Tab schließt.

* Implementiere `handleDisconnect` auf dem Gateway. Wenn ein Spieler mitten im Spiel geht, sag es dem anderen Spieler und beende das Match. Lass den verbleibenden Spieler nicht hängen.
* Behandle den Fall, dass der Spieler geht, während er noch allein auf einen Partner wartet. Leere diesen leeren Room, damit der nächste Spieler, der sich verbindet, nicht in einen Room ohne jemanden gematcht wird.
* Räume den Match-State und den Timer auf, damit kein veraltetes Match auf dem Server weiterläuft.
* Biete einen Weg an, erneut zu spielen, entweder indem du den wartenden Spieler zurück ins Matchmaking schickst oder den Room für eine neue Runde zurücksetzt.

**Fertig, wenn:** das Schließen des Tabs eines Spielers das Match für den anderen Spieler sauber beendet, ein Spieler, der den Warteraum verlässt, ihn für die nächste Person freigibt, und ein beendetes Match eine neue Runde starten kann.

**Design-Frage:** Ein Disconnect kann zu unterschiedlichen Zeitpunkten passieren, mitten im Spiel oder während ein Spieler noch allein wartet. Was muss in jedem Fall aufgeräumt werden, und was geht für den nächsten Spieler schief, wenn du das überspringst?

Resource: [NestJS Gateways - Lifecycle Hooks](https://docs.nestjs.com/websockets/gateways#lifecycle-hooks)

## Bonus Challenges

Wähle eine oder mehrere, sobald das Hauptspiel funktioniert.

* **Walls:** Füge Zellen hinzu, die die Spieler nicht betreten können. Platziere sie im Server-State, weise Moves in sie hinein zurück, und zeichne sie auf dem Grid, damit beide Spieler dieselben Hindernisse sehen.
* **Special Cells:** Füge Terrain hinzu, das die Bewegung verändert, zum Beispiel:
    * Eis, das den Spieler eine zusätzliche Zelle in die Richtung trägt, in die er sich bewegt hat
    * Dornen
    * Sand
    * füge hier deine eigene Idee ein, sei kreativ 🧐
* **Items:** Verteile Pickups auf dem Spielfeld, die das Match verändern, wenn ein Spieler darauf landet, zum Beispiel:
    * ein Speed-Boost
    * ein Freeze, der den Gegner für einen Moment stoppt
    * zusätzliche Zeit auf der Uhr
    * füge hier deine eigene Idee ein, sei kreativ 🧐
    * Der Server besitzt die Regeln für das Spawnen von Items und das Anwenden ihrer Effekte.
* **Portals:** Lass einen Spieler zwei verknüpfte Portale platzieren. Das Betreten eines Portals bewegt den Spieler zum anderen.
* **Maze mit umgedrehter Logik:** Verwandle das Grid in ein Labyrinth aus Wänden, vergrößere das Spielfeld und kehre das Ziel um. Jetzt sind beide Spieler voreinander versteckt und müssen sich auf derselben Zelle treffen, um gemeinsam zu gewinnen, bevor der Timer abläuft.
* **Deine eigene Idee:** Entwerfe eine neue Mechanik und begründe sie. Halte die Regeln auf dem Server, wo kein Client sie überschreiben kann.