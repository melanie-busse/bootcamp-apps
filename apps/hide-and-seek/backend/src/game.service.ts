import { Injectable } from '@nestjs/common';

export interface Position {
  x: number;
  y: number;
}

export interface GameState {
  roomId: string;
  seekerId: string;
  hiderId: string;
  seekerPos: Position;
  hiderPos: Position;
  timeLeft: number;
  status: 'waiting' | 'running' | 'finished';
  winner: 'seeker' | 'hider' | null;
}

@Injectable()
export class GameService {
  private games = new Map<string, GameState>();

  createGame(roomId: string, seekerId: string, hiderId: string): GameState {
    const newGame: GameState = {
      roomId,
      seekerId,
      hiderId,
      seekerPos: { x: 0, y: 0 },
      hiderPos: { x: 9, y: 9 },
      timeLeft: 45, // 45 Sekunden Timer für die Runde
      status: 'running',
      winner: null,
    };

    this.games.set(roomId, newGame);
    return newGame;
  }

  getGame(roomId: string): GameState | undefined {
    return this.games.get(roomId);
  }

  movePlayer(
    roomId: string,
    playerId: string,
    direction: 'up' | 'down' | 'left' | 'right',
  ): GameState | undefined {
    const game = this.games.get(roomId);
    if (!game || game.status !== 'running') return undefined;

    const isSeeker = game.seekerId === playerId;
    const currentPos = isSeeker ? { ...game.seekerPos } : { ...game.hiderPos };

    // Neue Position berechnen
    switch (direction) {
      case 'up':
        if (currentPos.y > 0) currentPos.y--;
        break;
      case 'down':
        if (currentPos.y < 9) currentPos.y++;
        break;
      case 'left':
        if (currentPos.x > 0) currentPos.x--;
        break;
      case 'right':
        if (currentPos.x < 9) currentPos.x++;
        break;
    }

    // Position im State aktualisieren
    if (isSeeker) {
      game.seekerPos = currentPos;
    } else {
      game.hiderPos = currentPos;
    }

    // Kollisionsprüfung: Hat der Seeker den Hider gefangen?
    if (
      game.seekerPos.x === game.hiderPos.x &&
      game.seekerPos.y === game.hiderPos.y
    ) {
      game.status = 'finished';
      game.winner = 'seeker';
    }

    return game;
  }

  // Wird vom Gateway jede Sekunde aufgerufen
  tick(roomId: string): GameState | undefined {
    const game = this.games.get(roomId);
    if (!game || game.status !== 'running') return undefined;

    game.timeLeft--;

    if (game.timeLeft <= 0) {
      game.status = 'finished';
      game.winner = 'hider'; // Zeit abgelaufen -> Hider gewinnt!
    }

    return game;
  }

  deleteGame(roomId: string): void {
    this.games.delete(roomId);
  }
}
