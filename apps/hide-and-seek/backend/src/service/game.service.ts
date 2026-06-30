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
  radarItems: Position[];
  radarActiveUntil: number;
  timeLeft: number;
  status: 'waiting' | 'running' | 'finished';
  winner: 'seeker' | 'hider' | null;
  itemSpawnTimer: number;
}

@Injectable()
export class GameService {
  private games = new Map<string, GameState>();
  private playerCooldowns = new Map<string, number>();
  private intervals = new Map<string, NodeJS.Timeout>();

  createGame(
    roomId: string,
    seekerId: string,
    hiderId: string,
    onTick: (state: GameState) => void,
  ): GameState {
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
      portals: [{ p1: { x: 0, y: 5 }, p2: { x: 9, y: 4 } }],
      radarItems: [{ x: 5, y: 2 }],
      radarActiveUntil: 0,
      timeLeft: 45,
      status: 'running',
      winner: null,
      itemSpawnTimer: 15,
    };

    this.games.set(roomId, newGame);

    const interval = setInterval(() => {
      const updatedGame = this.tick(roomId);
      if (updatedGame) {
        onTick(updatedGame);

        if (updatedGame.status === 'finished') {
          this.stopAndCleanGame(roomId);
        }
      }
    }, 1000);

    this.intervals.set(roomId, interval);

    return newGame;
  }

  getGame(roomId: string): GameState | undefined {
    return this.games.get(roomId);
  }

  private isWall(game: GameState, x: number, y: number): boolean {
    return game.walls.some((wall) => wall.x === x && wall.y === y);
  }

  private isCellOccupied(game: GameState, x: number, y: number): boolean {
    if (this.isWall(game, x, y)) return true;
    if (game.iceCells.some((c) => c.x === x && c.y === y)) return true;
    if (game.sandCells.some((c) => c.x === x && c.y === y)) return true;
    if (
      game.portals.some(
        (p) => (p.p1.x === x && p.p1.y === y) || (p.p2.x === x && p.p2.y === y),
      )
    )
      return true;
    if (game.radarItems.some((i) => i.x === x && i.y === y)) return true;
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
      // 🧊 EIS-LOGIK
      const isOnIce = game.iceCells.some(
        (ice) => ice.x === nextPos.x && ice.y === nextPos.y,
      );
      if (isOnIce) {
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
        if (this.isWall(game, nextPos.x, nextPos.y)) {
          nextPos = isSeeker ? { ...game.seekerPos } : { ...game.hiderPos };
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
      const isOnSand = game.sandCells.some(
        (sand) => sand.x === nextPos.x && sand.y === sand.y,
      );
      if (isOnSand) {
        this.playerCooldowns.set(playerId, Date.now() + 1000);
      }

      // 📡 RADAR-ITEMS
      const itemIndex = game.radarItems.findIndex(
        (item) => item.x === nextPos.x && item.y === nextPos.y,
      );
      if (itemIndex !== -1) {
        game.radarItems.splice(itemIndex, 1);
        game.radarActiveUntil = Date.now() + 4000;
      }

      if (
        game.seekerPos.x === game.hiderPos.x &&
        game.seekerPos.y === game.hiderPos.y
      ) {
        game.status = 'finished';
        game.winner = 'seeker';
        this.stopAndCleanGame(roomId); // Sofort Loop stoppen
      }
    }

    return game;
  }

  tick(roomId: string): GameState | undefined {
    const game = this.games.get(roomId);
    if (!game || game.status !== 'running') return undefined;

    game.timeLeft--;
    game.itemSpawnTimer--;

    if (game.itemSpawnTimer <= 0) {
      game.itemSpawnTimer = 15;

      let spawned = false;
      let attempts = 0;

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

  stopAndCleanGame(roomId: string): void {
    const interval = this.intervals.get(roomId);
    if (interval) {
      clearInterval(interval);
      this.intervals.delete(roomId);
    }

    const game = this.games.get(roomId);
    if (game) {
      this.playerCooldowns.delete(game.seekerId);
      this.playerCooldowns.delete(game.hiderId);
    }

    this.games.delete(roomId);
  }
}
