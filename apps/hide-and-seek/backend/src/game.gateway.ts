import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } }) // CORS erlauben für Vite
export class GameGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`[Backend] Spieler verbunden: ${client.id}`);
  }

  @SubscribeMessage('ping_test')
  handlePing(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
    console.log('[Backend] Empfangen vom Client:', data);

    // Antwort zurück an genau diesen Client senden
    client.emit('pong_test', { message: 'Hallo vom NestJS-Server! 🚀' });
  }
}
