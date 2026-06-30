import { Injectable } from '@nestjs/common';

export interface Position {
  x: number;
  y: number;
}

export interface PortalPair {
  p1: Position;
  p2: Position;
}

export interface GameState {
  roomId: string;
  seekerId: string;
  hiderId: string;
  seekerPos: Position;
  hiderPos: Position;
  walls: Position[];
  iceCells: Position[];
  sandCells: Position[];
  portals: PortalPair[];
  radarItems: Position[]; // 📡 Geändert zu einem Array für mehrere Items!
  radarActiveUntil: number;
  timeLeft: number;
  status: 'waiting' | 'running' | 'finished';
  winner: 'seeker' | 'hider' | null;
  itemSpawnTimer: number; // ⏳ Interner Server-Counter für den Respawn
}

@Injectable()
export class GameService {
  private games = new Map<string, GameState>();
  private playerCooldowns = new Map<string, number>();

  createGame(roomId: string, seekerId: string, hiderId: string): GameState {
    const newGame: GameState = {
      roomId,
      seekerId,
      hiderId,
      seekerPos: { x: 0, y: 0 },
      hiderPos: { x: 9, y: 9 },
      walls: [
        { x: 2, y: 2 }, { x: 2, y: 3 }, { x: 2, y: 4 },
        { x: 7, y: 5 }, { x: 7, y: 6 }, { x: 7, y: 7 },
      ],
      iceCells: [
        { x: 4, y: 4 }, { x: 4, y: 1 }, { x: 4, y: 5 }, { x: 5, y: 5 },
      ],
      sandCells: [
        { x: 1, y: 7 }, { x: 2, y: 7 }, { x: 3, y: 7 },
      ],
      portals: [
        { p1: { x: 0, y: 5 }, p2: { x: 9, y: 4 } }
      ],
      radarItems: [
        { x: 5, y: 2 } // Erstes Item zum Start
      ],
      radarActiveUntil: 0,
      timeLeft: 45,
      status: 'running',
      winner: null,
      itemSpawnTimer: 15, // Alle 15 Sekunden ein neues Item
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

  // Hilfsmethode: Prüft, ob eine Koordinate komplett frei von statischen Elementen ist
  private isCellOccupied(game: GameState, x: number, y: number): boolean {
    if (this.isWall(game, x, y)) return true;
    if (game.iceCells.some(c => c.x === x && c.y === y)) return true;
    if (game.sandCells.some(c => c.x === x && c.y === y)) return true;
    if (game.portals.some(p => (p.p1.x === x && p.p1.y === y) || (p.p2.x === x && p.p2.y === y))) return true;
    if (game.radarItems.some(i => i.x === x && i.y === y)) return true;
    return false;
  }

  movePlayer(
      roomId: string,
      playerId: string,
      direction: 'up' | 'down' | 'left' | 'right',
  ): GameState | undefined {
    const game = this.games.get(roomId);
    if (!game || game.status !== 'running') return undefined;

    const currentCooldown = this.playerCooldowns.get(playerId) || 0;
    if (Date.now() < currentCooldown) return game;

    const isSeeker = game.seekerId === playerId;
    let nextPos = isSeeker ? { ...game.seekerPos } : { ...game.hiderPos };

    switch (direction) {
      case 'up': if (nextPos.y > 0) nextPos.y--; break;
      case 'down': if (nextPos.y < 9) nextPos.y++; break;
      case 'left': if (nextPos.x > 0) nextPos.x--; break;
      case 'right': if (nextPos.x < 9) nextPos.x++; break;
    }

    if (!this.isWall(game, nextPos.x, nextPos.y)) {

      // 🧊 EIS-LOGIK
      const isOnIce = game.iceCells.some((ice) => ice.x === nextPos.x && ice.y === nextPos.y);
      if (isOnIce) {
        switch (direction) {
          case 'up': if (nextPos.y > 0) nextPos.y--; break;
          case 'down': if (nextPos.y < 9) nextPos.y++; break;
          case 'left': if (nextPos.x > 0) nextPos.x--; break;
          case 'right': if (nextPos.x < 9) nextPos.x++; break;
        }
        if (this.isWall(game, nextPos.x, nextPos.y)) {
          nextPos = isSeeker ? { ...game.seekerPos } : { ...game.hiderPos };
          switch (direction) {
            case 'up': if (nextPos.y > 0) nextPos.y--; break;
            case 'down': if (nextPos.y < 9) nextPos.y++; break;
            case 'left': if (nextPos.x > 0) nextPos.x--; break;
            case 'right': if (nextPos.x < 9) nextPos.x++; break;
          }
        }
      }

      // 🌀 PORTAL-LOGIK
      for (const portal of game.portals) {
        if (nextPos.x === portal.p1.x && nextPos.y === portal.p1.y) {
          nextPos = { ...portal.p2 };
          break;
        } else if (nextPos.x === portal.p2.x && nextPos.y === portal.p2.y) {
          nextPos = { ...portal.p1 };
          break;
        }
      }

      if (isSeeker) {
        game.seekerPos = nextPos;
      } else {
        game.hiderPos = nextPos;
      }

      // 🦥 SAND-LOGIK
      const isOnSand = game.sandCells.some((sand) => sand.x === nextPos.x && sand.y === nextPos.y);
      if (isOnSand) {
        this.playerCooldowns.set(playerId, Date.now() + 1000);
      }

      // 📡 MEHRERE RADAR-ITEMS: Prüfen, ob ein Item aufgesammelt wurde
      const itemIndex = game.radarItems.findIndex(item => item.x === nextPos.x && item.y === nextPos.y);
      if (itemIndex !== -1) {
        game.radarItems.splice(itemIndex, 1); // Entfernt das spezifische Item aus dem Array
        game.radarActiveUntil = Date.now() + 4000;
      }

      // Kollisionsprüfung
      if (game.seekerPos.x === game.hiderPos.x && game.seekerPos.y === game.hiderPos.y) {
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
    game.itemSpawnTimer--;

    // ⏳ Wenn der Timer abläuft, spawne ein neues Item an einer freien Stelle
    if (game.itemSpawnTimer <= 0) {
      game.itemSpawnTimer = 15; // Timer zurücksetzen

      let spawned = false;
      let attempts = 0;

      // Maximal 50 Versuche, um eine freie Zelle zu finden (Verhindert Endlosschleifen)
      while (!spawned && attempts < 50) {
        const randomX = Math.floor(Math.random() * 10);
        const randomY = Math.floor(Math.random() * 10);

        if (!this.isCellOccupied(game, randomX, randomY)) {
          game.radarItems.push({ x: randomX, y: randomY });
          spawned = true;
        }
        attempts++;
      }
    }

    if (game.timeLeft <= 0) {
      game.status = 'finished';
      game.winner = 'hider';
    }

    return game;
  }

  deleteGame(roomId: string): void {
    this.games.delete(roomId);
    this.playerCooldowns.clear();
  }
}