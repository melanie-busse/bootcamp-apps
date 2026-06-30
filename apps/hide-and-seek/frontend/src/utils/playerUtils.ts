import type { GameState } from "../types/GameState.ts";

export interface playerProps {
  gameState: GameState;
  x: number;
  y: number;
}

export interface showHiderProps {
  gameState: GameState;
  role: "seeker" | "hider" | null;
  isRadarActive: boolean;
}
export function isSeeker({ gameState, x, y}: playerProps){
  return gameState.seekerPos.x === x && gameState.seekerPos.y === y;
}

export function isHider({ gameState, x, y }: playerProps) {
  return gameState.hiderPos.x === x && gameState.hiderPos.y === y;
}

export function showHider({ gameState, role, isRadarActive }: showHiderProps) {
  return role === "hider" || gameState.status === "finished" || isRadarActive;
}
