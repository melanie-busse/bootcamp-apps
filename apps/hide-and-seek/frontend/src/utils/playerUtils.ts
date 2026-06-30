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
export function checkIsSeeker({ gameState, x, y}: playerProps){
  return gameState.seekerPos.x === x && gameState.seekerPos.y === y;
}

export function checkIsHider({ gameState, x, y }: playerProps) {
  return gameState.hiderPos.x === x && gameState.hiderPos.y === y;
}

export function checkHiderVisibility({
  gameState,
  role,
  isRadarActive,
}: showHiderProps) {
  return role === "hider" || gameState.status === "finished" || isRadarActive;
}
