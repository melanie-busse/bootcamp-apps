import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
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
  // Speichert die Timer-Intervalle für die Räume
  private intervals = new Map<string, NodeJS.Timeout>();

  constructor(private readonly gameService: GameService) {}

  handleConnection(client: Socket) {
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

      const seekerId = p1Role === 'seeker' ? player1.id : player2.id;
      const hiderId = p1Role === 'hider' ? player1.id : player2.id;
      const initialGameState = this.gameService.createGame(
        roomId,
        seekerId,
        hiderId,
      );

      player1.emit('match_status', { status: 'start', role: p1Role, roomId });
      player2.emit('match_status', { status: 'start', role: p2Role, roomId });
      this.server.to(roomId).emit('game_update', initialGameState);

      // --- GAME LOOP START ---
      const interval = setInterval(() => {
        const updatedGame = this.gameService.tick(roomId);
        if (updatedGame) {
          this.server.to(roomId).emit('game_update', updatedGame);

          if (updatedGame.status === 'finished') {
            this.clearGameInterval(roomId);
          }
        }
      }, 1000);

      this.intervals.set(roomId, interval);
    }
  }

  @SubscribeMessage('move')
  handleMove(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { direction: 'up' | 'down' | 'left' | 'right' },
  ) {
    const registry = this.socketRegistry.get(client.id);
    if (!registry) return;

    const updatedGame = this.gameService.movePlayer(
      registry.roomId,
      client.id,
      data.direction,
    );
    if (updatedGame) {
      // Broadcast des neuen Zustands an alle Spieler im Raum
      this.server.to(registry.roomId).emit('game_update', updatedGame);

      if (updatedGame.status === 'finished') {
        this.clearGameInterval(registry.roomId);
      }
    }
  }

  handleDisconnect(client: Socket) {
    if (this.waitingSocket?.id === client.id) {
      this.waitingSocket = null;
    }
    const registration = this.socketRegistry.get(client.id);
    if (registration) {
      this.clearGameInterval(registration.roomId);
      this.gameService.deleteGame(registration.roomId);
      // Den verbleibenden Spieler im Raum benachrichtigen, falls der andere geht
      this.server
        .to(registration.roomId)
        .emit('player_disconnected', {
          message: 'Dein Mitspieler hat das Spiel verlassen.',
        });
    }
    this.socketRegistry.delete(client.id);
  }

  private clearGameInterval(roomId: string) {
    const interval = this.intervals.get(roomId);
    if (interval) {
      clearInterval(interval);
      this.intervals.delete(roomId);
    }
  }
}
