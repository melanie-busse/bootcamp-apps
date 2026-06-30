import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class MatchmakingService {
  private waitingSocket: Socket | null = null;
  private socketRegistry = new Map<
    string,
    { roomId: string; role: 'seeker' | 'hider' }
  >();

  addPlayer(client: Socket) {
    if (!this.waitingSocket) {
      const newRoomId = `room_${Math.random().toString(36).substring(2, 9)}`;
      client.join(newRoomId);
      this.waitingSocket = client;
      this.socketRegistry.set(client.id, { roomId: newRoomId, role: 'hider' });

      return { status: 'waiting', message: 'Warte auf einen Mitspieler... ⏳' };
    }

    const player1 = this.waitingSocket;
    const player2 = client;

    const registryEntry = this.socketRegistry.get(player1.id);
    if (!registryEntry) {
      return { status: 'waiting', message: 'Fehler beim Matchmaking... ⏳' };
    }

    const roomId = registryEntry.roomId;

    const p1IsSeeker = Math.random() < 0.5;
    const p1Role = p1IsSeeker ? 'seeker' : 'hider';
    const p2Role = p1IsSeeker ? 'hider' : 'seeker';

    this.socketRegistry.set(player1.id, { roomId, role: p1Role });
    this.socketRegistry.set(player2.id, { roomId, role: p2Role });

    this.waitingSocket = null;

    return {
      status: 'start',
      gameInfo: {
        roomId,
        player1,
        player2,
        p1Role,
        p2Role,
        seekerId: p1Role === 'seeker' ? player1.id : player2.id,
        hiderId: p1Role === 'hider' ? player1.id : player2.id,
      },
    };
  }

  getPlayer(socketId: string) {
    return this.socketRegistry.get(socketId);
  }

  removePlayer(socketId: string): string | null {
    if (this.waitingSocket?.id === socketId) {
      this.waitingSocket = null;
    }
    const registration = this.socketRegistry.get(socketId);
    this.socketRegistry.delete(socketId);
    return registration ? registration.roomId : null;
  }
}
