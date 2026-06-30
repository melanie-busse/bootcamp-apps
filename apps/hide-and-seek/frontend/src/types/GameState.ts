export type MatchStatus = "connecting" | "waiting" | "start";

export interface Position {
  x: number;
  y: number;
}

interface PortalPair {
  p1: Position;
  p2: Position;
}

export interface GameState {
  seekerPos: Position;
  hiderPos: Position;
  walls: Position[]; // 🧱
  iceCells: Position[]; // 🧊
  sandCells: Position[]; // 🦥
  portals: PortalPair[]; // 🌀
  radarItems: Position[]; // 📡
  radarActiveUntil: number; // 📡
  timeLeft: number;
  status: "waiting" | "running" | "finished";
  winner: "seeker" | "hider" | null;
}
