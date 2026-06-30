import styled from "styled-components";

import type { GameState } from "../types/GameState.ts";
import { GameCell } from "./GameCell.tsx";
import {
  isCellIce,
  isCellPortal,
  isCellRadarItem,
  isCellSand,
  isCellWall,
} from "../utils/cellUtils.ts";
import { isHider, isSeeker, showHider } from "../utils/playerUtils.ts";

interface GameBoardProps {
  gameState: GameState;
  role: "seeker" | "hider" | null;
}

export function GameBoard({ gameState, role }: GameBoardProps) {

  const cells = [];

  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      const cellArgs = { gameState, x, y };
      const isRadarActive = Date.now() < (gameState?.radarActiveUntil ?? 0);

      cells.push(
        <GameCell
          key={`${x}-${y}`}
          isWall={isCellWall(cellArgs)}
          isIce={isCellIce(cellArgs)}
          isSand={isCellSand(cellArgs)}
          hasPortal={isCellPortal(cellArgs)}
          hasRadarItem={isCellRadarItem(cellArgs)}
          isSeeker={isSeeker(cellArgs)}
          isHider={isHider(cellArgs)}
          showHider={showHider({gameState, role, isRadarActive})}
        />
      );
    }
  }

  return <GridContainer>{cells}</GridContainer>;
}

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(10, 40px);
  grid-template-rows: repeat(10, 40px);
  gap: 2px;
  background-color: #eee;
  padding: 10px;
  border-radius: 8px;
`;