# Let's create a beautiful, structured Markdown file with the content requested by the user, incorporating all steps, answers to questions, and architecture overviews.

markdown_content = """# Recap Project 5 – Hide and Seek (Projekt-Leitfaden)

Dieses Dokument dient als strukturierter Leitfaden, Entwicklungs-Roadmap und Dokumentation der Architekturfragen für das **Hide-and-Seek-Spiel** mit **NestJS**, **React/Next.js** und **Socket.io**.

---

## 🧭 Entwicklungs-Roadmap & Commit-Struktur

Jeder Abschnitt ist so konzipiert, dass die App lauffähig bleibt und einen sinnvollen, in sich geschlossenen Git-Commit darstellt.

### 1. Project Setup and a First Connection
* **Ziel:** Infrastruktur zum Laufen bringen und bidirektionale Kommunikation nachweisen.
* **Backend (NestJS):** Erstellen eines Gateways mit dem `@WebSocketGateway()` Decorator.
* **Client (React):** Initialisieren von `socket.io-client` (wichtig: außerhalb der Render-Schleife oder via `useRef`/`useEffect`, um mehrfache Verbindungen zu verhindern).
* **Test-Protokoll:**
    * *Client* sendet bei Verbindung ein `ping`-Event: `socket.emit('ping', { message: 'Hello Server' })`
    * *Server* empfängt via `@SubscribeMessage('ping')`, loggt es im Terminal und antwortet: `client.emit('pong', { message: 'Hello Client' })`
    * *Client* empfängt `pong` und loggt es im Browser.
* **Commit-Inhalt:** Lauffähiger Socket-Handshake in beide Richtungen.

### 2. Rooms & Matchmaking
* **Ziel:** Spieler paarweise in isolierten Räumen zusammenführen.
* **Logik:** Der Server hält eine Referenz auf einen wartenden Socket (`private waitingSocket: Socket | null = null;`).
    * *Spieler 1 verbindet sich:* `waitingSocket` ist leer $\rightarrow$ Erzeuge eine eindeutige `roomId` (z.B. via `crypto.randomUUID()`), füge den Client mit `client.join(roomId)` hinzu und setze `this.waitingSocket = client;`.
    * *Spieler 2 verbindet sich:* `waitingSocket` existiert $\rightarrow$ Füge Spieler 2 demselben Raum hinzu (`client.join(roomId)`), lose die Rollen (Seeker / Hider) aus, spedere den State und sende `game_start` an den Raum via `this.server.to(roomId).emit(...)`. Setze `waitingSocket = null;`.
* **Commit-Inhalt:** Zwei Tabs werden gematcht und erhalten ihre Rollen; ein dritter Tab wartet.

### 3. Authoritative Game State and the Grid
* **Ziel:** Der Server wird zur *Single Source of Truth* für den Spielzustand. Ein 10×10 Grid wird gerendert.
* **Architektur:** Erstellung eines `GameService` (`@Injectable()`), der alle aktiven Spiele in einer Map verwaltet (`private games = new Map<string, GameState>();`). Das Gateway delegiert die Logik an diesen Service.
* **State-Struktur:**
    ```
```text?code_stdout&code_event_index=2
File successfully created!

```typescript
    interface GameState {
      roomId: string;
      seekerId: string;
      hiderId: string;
      seekerPos: { x: number; y: number };
      hiderPos: { x: number; y: number };
      timeLeft: number;
      status: 'waiting' | 'running' | 'finished';
      winner: 'seeker' | 'hider' | null;
    }
    ```
* **Ablauf:** Bei Match-Start werden Startpositionen (z.B. Seeker bei `[0,0]`, Hider bei `[9,9]`) festgelegt und der initiale State an den Raum gebroadcastet. Das Frontend rendert das Grid rein basierend auf diesen Daten.

### 4. Movement and the Message Protocol
* **Ziel:** Spieler bewegen sich feldweise über die Pfeiltasten. Der Server validiert jeden Schritt.
* **Frontend:** Ein globaler Event-Listener lauscht auf `keydown`. Bei Pfeiltasten wird **ausschließlich** die Richtung gesendet: `socket.emit('move', { direction: 'up' })`.
* **Backend:** Das Gateway fängt das Event ab, ermittelt über die Socket-ID den Raum und die Rolle des Spielers, berechnet die hypothetische neue Position im `GameService` und validiert:
    1. Läuft das Spiel (`status === 'running'`)?
    2. Liegt das Ziel innerhalb der Grid-Grenzen ($0 \le x, y \le 9$)?
    3. (Bonus) Ist das Feld blockiert?
    Wenn valide: State aktualisieren und neuen State an den Raum senden.

### 5. Winning, the Timer, and Game Over
* **Ziel:** Implementierung von Siegbedingungen und einer Spielzeituhr.
* **Server-Timer:** Beim Start des Matches startet der Server ein `setInterval()`, das jede Sekunde `timeLeft` um 1 verringert und den aktualisierten Zustand broadcastet. Bei `timeLeft === 0` gewinnt der Hider.
* **Kollisionsprüfung:** Nach jeder Bewegung prüft der Server: `if (seekerPos.x === hiderPos.x && seekerPos.y === hiderPos.y)`. Wenn wahr, gewinnt der Seeker.
* **Game Over:** Status wird auf `finished` gesetzt, der Timer per `clearInterval()` gestoppt und das Endergebnis an die Clients übermittelt. Das Frontend deaktiviert die Steuerung.

### 6. Disconnects and Playing Again
* **Ziel:** Robuster Umgang mit Verbindungsabbrüchen und Ermöglichen neuer Runden.
* **Disconnect-Handling:** Implementierung von `handleDisconnect(client: Socket)` im Gateway.
    * War der Socket im Warteraum? $\rightarrow$ `waitingSocket = null;`
    * War der Socket in einem aktiven Spiel? $\rightarrow$ Sende dem verbleibenden Spieler eine Benachrichtigung ("Gegner hat das Spiel verlassen"), setze das Spiel auf `finished`, räume das `setInterval` auf und lösche das Spiel aus der Memory-Map.
* **Play Again:** Ein Event `play_again` setzt den Spieler zurück in den Matchmaking-Pool oder initialisiert den Raum neu.

---

## 💬 Beantwortung der Konzept- & Designfragen

### 1. Design-Frage (Rooms & Matchmaking)
> **Frage:** Wenn sich viele Spieler verbinden, wie weißt du, welche zwei zum selben Match gehören, und wie verhinderst du, dass die Messages eines Matches in ein anderes durchsickern?

* **Antwort:** Der Server führt eine zentrale Registrierung (z.B. eine Map `socketToGame = new Map<string, { roomId: string, role: 'seeker' | 'hider' }>()`). Sobald ein Socket ein Event sendet, wird dessen Socket-ID in der Map nachgeschlagen, um die zugehörige `roomId` zu finden. 
* Das Durchsickern von Nachrichten wird verhindert, indem im NestJS Gateway **niemals global** emittiert wird (`this.server.emit()`), sondern immer streng scoped auf den Raum bezogen: `this.server.to(roomId).emit()`. Dadurch stellt Socket.io auf Protokollebene sicher, dass nur Sockets innerhalb dieses Raums die Datenpakete erhalten.

### 2. State-Frage (Authoritative Game State)
> **Frage:** Manche Daten müssen gespeichert werden, wie die Koordinaten eines Spielers. Manche Werte lassen sich aus diesen Daten berechnen, etwa ob zwei Spieler dieselbe Zelle belegen. Was gehört in den gespeicherten State, und was solltest du bei Bedarf berechnen?

* **Antwort:** In den persistenten bzw. In-Memory State gehören ausschließlich **Rohdaten**, welche die minimale, unteilbare Wahrheit abbilden (*Single Source of Truth*). Dazu zählen: `seekerPos`, `hiderPos`, `timeLeft` und der grundlegende `status`.
* **Berechnet werden sollten alle derivativen Zustände (abgeleitete Werte)**, wie zum Beispiel `isCaptured` (`seekerPos.x === hiderPos.x && ...`) oder ob ein Spiel unentschieden ist. Würde man `isCaptured` als separates Flag im State speichern, läuft man Gefahr einer *State-Inkonsistenz* (z.B. die Positionen sind identisch, aber durch einen Bug wurde das Flag nicht auf `true` gesetzt). Abgeleitete Werte werden dynamisch in den Gettern des Services oder direkt vor dem Senden an den Client ermittelt.

### 3. Protokoll-Frage (Movement & Message Protocol)
> **Frage:** Was muss ein Move-Event eigentlich mittragen? Und warum ist es sicherer, die Richtung zu senden, die der Spieler gedrückt hat, und den Server die neue Position berechnen zu lassen, statt die neuen Koordinaten direkt vom Browser zu senden?

* **Antwort:** Das Move-Event muss extrem minimalistisch sein. Es reicht das Senden der Intention, z.B. `{ direction: 'up' | 'down' | 'left' | 'right' }`.
* **Sicherheitsaspekt (Authoritative Server Pattern):** Der Client darf niemals die Hoheit über Spielregeln oder Positionen haben. Würde der Client fertige Koordinaten senden (`{ nextX: 5, nextY: 6 }`), könnte ein Angreifer den JavaScript-Code im Browser manipulieren oder Pakete manipulieren, um sich teleportieren zu können, durch Wände zu gehen (Noclip) oder den Gegner direkt anzuspringen. Wenn der Client nur die Richtung funkt, bleibt der Server der unbestechliche Schiedsrichter, der die physikalischen Grenzen und Regeln des Spiels erzwingt.

### 4. Design-Frage (Winning & Timer)
> **Frage:** Warum müssen Timer und Fang-Check auf dem Server laufen statt in jedem Browser? Stell dir vor, was passieren würde, wenn der Client eines Spielers seine eigene Uhr betreibt.

* **Antwort:** Lägen Timer und Fang-Check auf dem Client, käme es durch Netzwerklatenzen (Ping) und unterschiedliche Hardware-Renditen unweigerlich zu einer **Desynchronisation**. Wenn Spieler A einen Ping von 20ms und Spieler B einen von 150ms hat, läuft die Zeit im Browser von Spieler B leicht verzögert ab. 
* *Szenario:* Der Hider wird in allerletzter Sekunde gefangen. Der Browser des Hiders meldet "Zeit abgelaufen, Hider gewinnt!", während der Browser des Seekers meldet "Gefangen, Seeker gewinnt!". Da es im Multiplayer nur eine unparteiische Wahrheit geben kann, muss der Server die Zeit zentral dekrementieren und die Kollisionen auf Basis des Server-States auswerten.

### 5. Design-Frage (Disconnects & Cleanup)
> **Frage:** Ein Disconnect kann zu unterschiedlichen Zeitpunkten passieren, mitten im Spiel oder während ein Spieler noch allein wartet. Was muss in jedem Fall aufgeräumt werden, und was geht für den nächsten Spieler schief, wenn du das überspringst?

* **Antwort:** Aufgeräumt werden müssen:
    1. Die Referenz auf den global wartenden Socket (`waitingSocket = null`), falls der wartende Spieler geht.
    2. Die Server-seitigen `setInterval`-Instanzen für den Timer des jeweiligen Raums.
    3. Die Zuordnungs-Maps (`socketToGame` und die Spiel-Instanz im `GameService`).
* **Konsequenzen bei fehlendem Cleanup:**
    * Wird der `waitingSocket` nicht geleert, versucht der Server den nächsten neuen Spieler mit einer "toten" Socket-Verbindung zu matchen. Das Spiel startet nie, und der neue Spieler hängt im Ladebildschirm fest.
    * Werden die Timer (`setInterval`) nicht gelöscht, laufen sie als **Memory Leak** unendlich im Hintergrund weiter, verbrauchen CPU-Leistung und versuchen, Daten an geschlossene Sockets zu senden, was zu Server-Abstürzen oder Performance-Einbrüchen führt.

---

## 🚀 Grundstruktur des Backends (Architektur-Tipp)

Um eine saubere Trennung von Netzwerk-Infrastruktur (Gateway) und Spiellogik (Service) zu wahren, empfiehlt sich folgende NestJS-Struktur:

### Game-Service (`game.service.ts`)
```typescript
import { Injectable } from '@nestjs/common';
import { GameState } from './interfaces/game.interface';

@Injectable()
export class GameService {
  private games = new Map<string, GameState>();
  private waitingSocketId: string | null = null;

  // Methoden zur Verwaltung des Spielzyklus
  createGame(roomId: string, player1Id: string, player2Id: string): GameState { ... }
  getGame(roomId: string): GameState | undefined { ... }
  movePlayer(roomId: string, playerId: string, direction: string): GameState { ... }
  deleteGame(roomId: string) { ... }
}