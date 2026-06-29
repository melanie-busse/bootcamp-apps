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
  // Alle aktiven Spiele im RAM speichern
  private games = new Map<string, GameState>();

  createGame(roomId: string, seekerId: string, hiderId: string): GameState {
    const newGame: GameState = {
      roomId,
      seekerId,
      hiderId,
      // Startpositionen: Seeker oben links (0,0), Hider unten rechts (9,9)
      seekerPos: { x: 0, y: 0 },
      hiderPos: { x: 9, y: 9 },
      timeLeft: 60,
      status: 'running',
      winner: null,
    };

    this.games.set(roomId, newGame);
    return newGame;
  }

  getGame(roomId: string): GameState | undefined {
    return this.games.get(roomId);
  }

  deleteGame(roomId: string): void {
    this.games.delete(roomId);
  }
}
