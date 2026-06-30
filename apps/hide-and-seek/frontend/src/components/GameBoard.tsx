import styled from "styled-components";

import type { GameState } from "../types/GameState.ts";
import { GameCell } from "./GameCell.tsx";
import {
  checkIsCellIce,
  checkIsCellPortal,
  checkIsCellRadarItem,
  checkIsCellSand,
  checkIsCellWall,
} from "../utils/cellUtils.ts";
import { checkIsHider, checkIsSeeker, checkHiderVisibility } from "../utils/playerUtils.ts";

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
          isWall={checkIsCellWall(cellArgs)}
          isIce={checkIsCellIce(cellArgs)}
          isSand={checkIsCellSand(cellArgs)}
          hasPortal={checkIsCellPortal(cellArgs)}
          hasRadarItem={checkIsCellRadarItem(cellArgs)}
          isSeeker={checkIsSeeker(cellArgs)}
          isHider={checkIsHider(cellArgs)}
          showHider={checkHiderVisibility({gameState, role, isRadarActive})}
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