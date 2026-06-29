import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  OnGatewayDisconnect,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';


@WebSocketGateway({ cors: { origin: '*' } })
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  // Wartender Spieler, der auf einen Partner hofft
  private waitingSocket: Socket | null = null;

  // Spickzettel für den Server: Welcher Socket gehört zu welchem Raum und hat welche Rolle?
  private socketRegistry = new Map<
    string,
    { roomId: string; role: 'seeker' | 'hider' }
  >();

  handleConnection(client: Socket) {
    console.log(`[Matchmaking] Neuer Client verbunden: ${client.id}`);

    // Wenn kein Spieler wartet, wird dieser Client zum Wartenden
    if (!this.waitingSocket) {
      const newRoomId = `room_${Math.random().toString(36).substring(2, 9)}`;

      client.join(newRoomId);
      this.waitingSocket = client;

      this.socketRegistry.set(client.id, { roomId: newRoomId, role: 'hider' }); // Vorläufige Rolle, wird gleich validiert

      client.emit('match_status', {
        status: 'waiting',
        message: 'Warte auf einen Mitspieler... ⏳',
      });
      console.log(`[Matchmaking] ${client.id} wartet in Raum: ${newRoomId}`);
    }
    // Wenn bereits jemand wartet, matchen wir die beiden!
    else {
      const player1 = this.waitingSocket;
      const player2 = client;

      // Hol dir die Raum-ID, die wir für Spieler 1 erstellt haben
      const registryEntry = this.socketRegistry.get(player1.id);
      if (!registryEntry) return;
      const roomId = registryEntry.roomId;

      // Spieler 2 dem selben Raum hinzufügen
      player2.join(roomId);

      // Rollen zufällig verteilen
      const p1IsSeeker = Math.random() < 0.5;
      const p1Role = p1IsSeeker ? 'seeker' : 'hider';
      const p2Role = p1IsSeeker ? 'hider' : 'seeker';

      // Maps aktualisieren
      this.socketRegistry.set(player1.id, { roomId, role: p1Role });
      this.socketRegistry.set(player2.id, { roomId, role: p2Role });

      // Matchmaking-Warteraum leeren
      this.waitingSocket = null;

      // Beiden Spielern Bescheid geben, dass es losgeht und wer sie sind!
      player1.emit('match_status', { status: 'start', role: p1Role, roomId });
      player2.emit('match_status', { status: 'start', role: p2Role, roomId });

      console.log(
        `[Matchmaking] Match gestartet in ${roomId}! Seeker: ${p1IsSeeker ? player1.id : player2.id}`,
      );
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`[Matchmaking] Client getrennt: ${client.id}`);

    // Falls der wartende Spieler einfach den Tab schließt:
    if (this.waitingSocket?.id === client.id) {
      this.waitingSocket = null;
    }

    this.socketRegistry.delete(client.id);
  }
}
