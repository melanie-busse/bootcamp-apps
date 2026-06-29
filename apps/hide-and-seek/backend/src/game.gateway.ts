import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  OnGatewayDisconnect,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private waitingSocket: Socket | null = null;
  private socketRegistry = new Map<
    string,
    { roomId: string; role: 'seeker' | 'hider' }
  >();

  // Service über Dependency Injection injizieren
  constructor(private readonly gameService: GameService) {}

  handleConnection(client: Socket) {
    console.log(`[Matchmaking] Neuer Client: ${client.id}`);

    if (!this.waitingSocket) {
      const newRoomId = `room_${Math.random().toString(36).substring(2, 9)}`;
      client.join(newRoomId);
      this.waitingSocket = client;
      this.socketRegistry.set(client.id, { roomId: newRoomId, role: 'hider' });
      client.emit('match_status', {
        status: 'waiting',
        message: 'Warte auf einen Mitspieler... ⏳',
      });
    } else {
      const player1 = this.waitingSocket;
      const player2 = client;

      const registryEntry = this.socketRegistry.get(player1.id);
      if (!registryEntry) return;
      const roomId = registryEntry.roomId;

      player2.join(roomId);

      const p1IsSeeker = Math.random() < 0.5;
      const p1Role = p1IsSeeker ? 'seeker' : 'hider';
      const p2Role = p1IsSeeker ? 'hider' : 'seeker';

      this.socketRegistry.set(player1.id, { roomId, role: p1Role });
      this.socketRegistry.set(player2.id, { roomId, role: p2Role });

      this.waitingSocket = null;

      // 1. Spiel-Zustand im Service erstellen
      const seekerId = p1Role === 'seeker' ? player1.id : player2.id;
      const hiderId = p1Role === 'hider' ? player1.id : player2.id;
      const initialGameState = this.gameService.createGame(
        roomId,
        seekerId,
        hiderId,
      );

      // 2. Beiden Clients sagen, wer sie sind
      player1.emit('match_status', { status: 'start', role: p1Role, roomId });
      player2.emit('match_status', { status: 'start', role: p2Role, roomId });

      // 3. Den echten Game State an den ganzen Raum broadcasten
      this.server.to(roomId).emit('game_update', initialGameState);

      console.log(`[Game] Spiel gestartet in Raum ${roomId}`);
    }
  }

  handleDisconnect(client: Socket) {
    if (this.waitingSocket?.id === client.id) {
      this.waitingSocket = null;
    }
    const registration = this.socketRegistry.get(client.id);
    if (registration) {
      this.gameService.deleteGame(registration.roomId);
    }
    this.socketRegistry.delete(client.id);
  }
}
