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
import {GameService} from "./service/game.service";
import {MatchmakingService} from "./service/matchmaking.service";

@WebSocketGateway({ cors: { origin: '*' } })
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly gameService: GameService,
    private readonly matchmakingService: MatchmakingService,
  ) {}

  handleConnection(client: Socket) {
    const match = this.matchmakingService.addPlayer(client);

    if (match.status === 'waiting') {
      client.emit('match_status', {
        status: 'waiting',
        message: match.message,
      });
      return;
    }

    if (match.status === 'start' && match.gameInfo) {
      const { roomId, player1, player2, p1Role, p2Role, seekerId, hiderId } =
        match.gameInfo;

      player2.join(roomId);

      const initialGameState = this.gameService.createGame(
        roomId,
        seekerId,
        hiderId,
        (updatedGame) => {
          this.server.to(roomId).emit('game_update', updatedGame);
        },
      );

      player1.emit('match_status', { status: 'start', role: p1Role, roomId });
      player2.emit('match_status', { status: 'start', role: p2Role, roomId });
      this.server.to(roomId).emit('game_update', initialGameState);
    }
  }

  @SubscribeMessage('move')
  handleMove(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { direction: 'up' | 'down' | 'left' | 'right' },
  ) {
    const player = this.matchmakingService.getPlayer(client.id);
    if (!player) return;

    const updatedGame = this.gameService.movePlayer(
      player.roomId,
      client.id,
      data.direction,
    );
    if (updatedGame) {
      this.server.to(player.roomId).emit('game_update', updatedGame);
    }
  }

  handleDisconnect(client: Socket) {
    const roomId = this.matchmakingService.removePlayer(client.id);
    if (roomId) {
      this.gameService.stopAndCleanGame(roomId);
      this.server.to(roomId).emit('player_disconnected', {
        message: 'Dein Mitspieler hat das Spiel verlassen.',
      });
    }
  }
}
