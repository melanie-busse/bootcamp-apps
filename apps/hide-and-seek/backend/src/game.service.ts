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
  walls: Position[]; // 🧱
  iceCells: Position[]; // 🧊
  sandCells: Position[]; // 🦥
  timeLeft: number;
  status: 'waiting' | 'running' | 'finished';
  winner: 'seeker' | 'hider' | null;
}

@Injectable()
export class GameService {
  private games = new Map<string, GameState>();

  // 🦥 Speichert, bis zu welchem Zeitstempel (in ms) ein Spieler blockiert ist
  private playerCooldowns = new Map<string, number>();

  createGame(roomId: string, seekerId: string, hiderId: string): GameState {
    const newGame: GameState = {
      roomId,
      seekerId,
      hiderId,
      seekerPos: { x: 0, y: 0 },
      hiderPos: { x: 9, y: 9 },
      walls: [
        { x: 2, y: 2 },
        { x: 2, y: 3 },
        { x: 2, y: 4 },
        { x: 7, y: 5 },
        { x: 7, y: 6 },
        { x: 7, y: 7 },
      ],
      iceCells: [
        { x: 4, y: 4 },
        { x: 4, y: 1 },
        { x: 4, y: 5 },
        { x: 5, y: 5 },
      ],
      sandCells: [
        { x: 1, y: 7 },
        { x: 2, y: 7 },
        { x: 3, y: 7 },
      ],
      timeLeft: 45,
      status: 'running',
      winner: null,
    };

    this.games.set(roomId, newGame);
    return newGame;
  }

  getGame(roomId: string): GameState | undefined {
    return this.games.get(roomId);
  }

  private isWall(game: GameState, x: number, y: number): boolean {
    return game.walls.some((wall) => wall.x === x && wall.y === y);
  }

  movePlayer(
      roomId: string,
      playerId: string,
      direction: 'up' | 'down' | 'left' | 'right',
  ): GameState | undefined {
    const game = this.games.get(roomId);
    if (!game || game.status !== 'running') return undefined;

    // 🦥 SAND-CHECK 1: Ist der Spieler aktuell noch verlangsamt/festgesteckt?
    const currentCooldown = this.playerCooldowns.get(playerId) || 0;
    if (Date.now() < currentCooldown) {
      // Cooldown läuft noch -> Ignoriere die Bewegung komplett
      return game;
    }

    const isSeeker = game.seekerId === playerId;
    const currentPos = isSeeker ? { ...game.seekerPos } : { ...game.hiderPos };

    const nextPos = { ...currentPos };

    switch (direction) {
      case 'up':
        if (nextPos.y > 0) nextPos.y--;
        break;
      case 'down':
        if (nextPos.y < 9) nextPos.y++;
        break;
      case 'left':
        if (nextPos.x > 0) nextPos.x--;
        break;
      case 'right':
        if (nextPos.x < 9) nextPos.x++;
        break;
    }

    if (!this.isWall(game, nextPos.x, nextPos.y)) {
      if (isSeeker) {
        game.seekerPos = nextPos;
      } else {
        game.hiderPos = nextPos;
      }

      // 🧊 EIS-LOGIK
      const isOnIce = game.iceCells.some(
          (ice) => ice.x === nextPos.x && ice.y === nextPos.y,
      );

      if (isOnIce) {
        const icePos = { ...nextPos };
        switch (direction) {
          case 'up':
            if (icePos.y > 0) icePos.y--;
            break;
          case 'down':
            if (icePos.y < 9) icePos.y++;
            break;
          case 'left':
            if (icePos.x > 0) icePos.x--;
            break;
          case 'right':
            if (icePos.x < 9) icePos.x++;
            break;
        }

        if (!this.isWall(game, icePos.x, icePos.y)) {
          if (isSeeker) {
            game.seekerPos = icePos;
          } else {
            game.hiderPos = icePos;
          }
        }
      }

      // 🦥 SAND-LOGIK 2: Ist der Spieler auf einer Sand-Zelle gelandet?
      // (Wir prüfen die finale Position, falls er über das Eis reingeschlittert ist)
      const finalPos = isSeeker ? game.seekerPos : game.hiderPos;
      const isOnSand = game.sandCells.some(
          (sand) => sand.x === finalPos.x && sand.y === finalPos.y,
      );

      if (isOnSand) {
        // Setze einen Cooldown von 1000 Millisekunden (1 Sekunde) ab jetzt
        this.playerCooldowns.set(playerId, Date.now() + 1000);
      }

      // Kollisionsprüfung
      if (
          game.seekerPos.x === game.hiderPos.x &&
          game.seekerPos.y === game.hiderPos.y
      ) {
        game.status = 'finished';
        game.winner = 'seeker';
      }
    }

    return game;
  }

  tick(roomId: string): GameState | undefined {
    const game = this.games.get(roomId);
    if (!game || game.status !== 'running') return undefined;

    game.timeLeft--;

    if (game.timeLeft <= 0) {
      game.status = 'finished';
      game.winner = 'hider';
    }

    return game;
  }

  deleteGame(roomId: string): void {
    this.games.delete(roomId);
    // Aufräumen, wenn das Spiel gelöscht wird
    this.playerCooldowns.clear();
  }
}