import type { GameState } from "../types/GameState.ts";

export interface CellProps {
  gameState: GameState;
  x: number;
  y: number;
}

export function isCellWall({ gameState, x, y }: CellProps): boolean {
  return gameState.walls?.some((w) => w.x === x && w.y === y) ?? false;
}

export function isCellIce({ gameState, x, y }: CellProps): boolean {
  return gameState.iceCells?.some((i) => i.x === x && i.y === y) ?? false;
}


export function isCellSand({ gameState, x, y }: CellProps): boolean {
  return gameState.sandCells?.some((s) => s.x === x && s.y === y) ?? false;
}

export function isCellPortal({ gameState, x, y }: CellProps): boolean {
  return (
    gameState.portals?.some(
      (p) => (p.p1.x === x && p.p1.y === y) || (p.p2.x === x && p.p2.y === y)
    ) ?? false
  );
}

export function isCellRadarItem({ gameState, x, y }: CellProps): boolean {
  return (
    gameState.radarItems?.some((item) => item.x === x && item.y === y) ?? false
  );
}
