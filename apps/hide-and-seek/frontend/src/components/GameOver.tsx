import type { GameState } from "../types/GameState.ts";
import styled from "styled-components";

interface GameOverProps {
  gameState: GameState;
  role: "seeker" | "hider" | null;
}

export default function GameOver({ gameState, role }: GameOverProps) {
  if (gameState.status !== "finished") return null;

  return (
    <Container>
      <h2>Spiel vorbei!</h2>
      <Result>
        {gameState.winner === role
          ? "🎉 DU HAST GEWONNEN! 🎉"
          : "❌ DU HAST VERLOREN! ❌"}
      </Result>
      <ResultText>
        {gameState.winner === "seeker"
          ? "Der Suchender hat den Verstecker gefangen!"
          : "Die Zeit ist abgelaufen, der Verstecker entkam!"}
      </ResultText>
      <NewGameButton onClick={() => window.location.reload()}>
        Nochmal spielen
      </NewGameButton>
    </Container>
  );
}

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  margin: 0;
  background-color: rgba(0, 0, 0, 0.85);
  color: white;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 10; 
`;

const Result = styled.p`
  font-size: 1.3rem;
  margin: 10px 0;
`;

const ResultText = styled.p`
  color: #aaa;
  font-size: 0.9rem;
`;

const NewGameButton = styled.button`
  margin-top: 1rem;
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
  border: none;
  background: var(--color-button-bg);
  color: var(--color-button-text);
  border-radius: 4px;

  &:hover {
    background: var(--color-button-bg-hover);
  }
`;