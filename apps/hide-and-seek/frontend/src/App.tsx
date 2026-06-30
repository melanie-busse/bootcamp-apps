import { GameHeader } from "./components/GameHeader";
import { GameBoard } from "./components/GameBoard";
import { useGame } from "./hooks/useGame.ts";
import GameOver from "./components/GameOver.tsx";
import styled from "styled-components";

export default function App() {
  const { status, role, message, gameState } = useGame();

  return (
    <AppContainer>
      <h1>Hide & Seek 🙈</h1>

      {status === "connecting" && <p>{message}</p>}
      {status === "waiting" && <StyledH3>{message}</StyledH3>}

      {status === "start" && gameState && (
        <Playground>
          <GameHeader role={role} timeLeft={gameState.timeLeft} />

          <GameBoard gameState={gameState} role={role} />

          {Date.now() < gameState.radarActiveUntil && (
             <Radar className="radar-blink">
              📡 RADAR AKTIV - VERSTECKER SICHTBAR!
            </Radar>
          )}

          <GameOver gameState={gameState} role={role} />
        </Playground>
      )}
    </AppContainer>
  );
}

const AppContainer = styled.div`
  padding: 2rem;
  text-align: center;
 `;

const StyledH3 = styled.h3`
  color: var(--color-h3);
`;

const Radar = styled.div`
  color: var(--color-portal); 
  font-weight: bold;
  margin-top: 1rem;
`;

const Playground = styled.div`
  position: relative;
  display: inline-block;
`;
