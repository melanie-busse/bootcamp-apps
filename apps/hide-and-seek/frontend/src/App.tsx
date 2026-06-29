import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

type MatchStatus = "connecting" | "waiting" | "start";

interface Position {
  x: number;
  y: number;
}

interface GameState {
  seekerPos: Position;
  hiderPos: Position;
  walls: Position[]; // 🧱
  iceCells: Position[]; // 🧊
  sandCells: Position[]; // 🦥
  timeLeft: number;
  status: "waiting" | "running" | "finished";
  winner: "seeker" | "hider" | null;
}

let socket: Socket; // Socket außerhalb definieren, damit der Event-Listener Zugriff hat

export default function App() {
  const [status, setStatus] = useState<MatchStatus>("connecting");
  const [role, setRole] = useState<"seeker" | "hider" | null>(null);
  const [message, setMessage] = useState<string>("Verbinde zum Server...");
  const [gameState, setGameState] = useState<GameState | null>(null);

  useEffect(() => {
    const apiUrl =
      import.meta.env.VITE_API_URL ||
      "https://hide-and-seek-api.melanie-busse.de/";

    socket = io(apiUrl, {
      transports: ["websocket", "polling"],
      secure: apiUrl.startsWith("https"),
    });

    socket.on(
      "match_status",
      (data: {
        status: MatchStatus;
        role?: "seeker" | "hider";
        message?: string;
      }) => {
        setStatus(data.status);
        if (data.message) setMessage(data.message);
        if (data.role) setRole(data.role);
      }
    );

    socket.on("game_update", (state: GameState) => {
      setGameState(state);
    });

    socket.on("player_disconnected", (data: { message: string }) => {
      alert(data.message);
      window.location.reload();
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Keyboard Event-Listener für Bewegungen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (status !== "start" || !gameState || gameState.status !== "running")
        return;

      let direction: "up" | "down" | "left" | "right" | null = null;

      if (e.key === "ArrowUp" || e.key === "w") direction = "up";
      if (e.key === "ArrowDown" || e.key === "s") direction = "down";
      if (e.key === "ArrowLeft" || e.key === "a") direction = "left";
      if (e.key === "ArrowRight" || e.key === "d") direction = "right";

      if (direction) {
        e.preventDefault(); // Verhindert Scrollen der Seite bei Pfeiltasten
        socket.emit("move", { direction });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [status, gameState]);

  const renderGrid = () => {
    if (!gameState) return null;

    const isCellWall = (x: number, y: number) =>
      gameState.walls?.some((w) => w.x === x && w.y === y);
    // Hilfsfunktionen für die neuen Zellen:
    const isCellIce = (x: number, y: number) =>
      gameState.iceCells?.some((i) => i.x === x && i.y === y);
    const isCellSand = (x: number, y: number) =>
      gameState.sandCells?.some((s) => s.x === x && s.y === y);

    const cells = [];
    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        const isWall = isCellWall(x, y);
        const isIce = isCellIce(x, y);
        const isSand = isCellSand(x, y);

        const isSeeker =
          gameState.seekerPos.x === x && gameState.seekerPos.y === y;
        const isHider =
          gameState.hiderPos.x === x && gameState.hiderPos.y === y;

        // Hintergrundfarbe dynamisch bestimmen
        let bgColor = "#fafafa";
        if (isWall) bgColor = "#555555";
        else if (isSeeker) bgColor = "#f44336";
        else if (isHider) bgColor = "#4caf50";
        else if (isIce)
          bgColor = "#a5f3fc"; // Schönes helles Eisblau
        else if (isSand) bgColor = "#fef08a"; // Sanftes Sandgelb

        cells.push(
          <div
            key={`${x}-${y}`}
            style={{
              width: "40px",
              height: "40px",
              border: "1px solid #ccc",
              backgroundColor: bgColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.2rem",
            }}
          >
            {isSeeker && "🔍"}
            {isHider && "📦"}
            {isWall && "🧱"}
            {!isSeeker && !isHider && isIce && "❄️"}
            {!isSeeker && !isHider && isSand && "⏳"}
          </div>
        );
      }
    }
    return cells;
  };

  return (
    <div
      style={{ padding: "2rem", fontFamily: "sans-serif", textAlign: "center" }}
    >
      <h1>Hide & Seek 🙈</h1>

      {status === "connecting" && <p>{message}</p>}
      {status === "waiting" && <h3 style={{ color: "#ff9800" }}>{message}</h3>}

      {status === "start" && gameState && (
        <div style={{ position: "relative", display: "inline-block" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "1rem",
              fontSize: "1.1rem",
            }}
          >
            <div>
              Du bist:{" "}
              <strong
                style={{ color: role === "seeker" ? "#f44336" : "#4caf50" }}
              >
                {role === "seeker" ? "SUCHENDER" : "VERSTECKER"}
              </strong>
            </div>
            <div
              style={{
                fontWeight: "bold",
                color: gameState.timeLeft <= 10 ? "red" : "black",
              }}
            >
              Zeit übrig: {gameState.timeLeft}s
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(10, 40px)",
              gridTemplateRows: "repeat(10, 40px)",
              gap: "2px",
              backgroundColor: "#eee",
              padding: "10px",
              borderRadius: "8px",
            }}
          >
            {renderGrid()}
          </div>

          {/* Game Over Screen Overlay */}
          {gameState.status === "finished" && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0,0,0,0.85)",
                color: "white",
                borderRadius: "8px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px",
              }}
            >
              <h2>Spiel vorbei!</h2>
              <p style={{ fontSize: "1.3rem", margin: "10px 0" }}>
                {gameState.winner === role
                  ? "🎉 DU HAST GEWONNEN! 🎉"
                  : "❌ DU HAST VERLOREN! ❌"}
              </p>
              <p style={{ color: "#aaa", fontSize: "0.9rem" }}>
                {gameState.winner === "seeker"
                  ? "Der Suchender hat den Verstecker gefangen!"
                  : "Die Zeit ist abgelaufen, der Verstecker entkam!"}
              </p>
              <button
                onClick={() => window.location.reload()}
                style={{
                  marginTop: "1rem",
                  padding: "10px 20px",
                  fontSize: "1rem",
                  cursor: "pointer",
                  borderRadius: "5px",
                  border: "none",
                  background: "#2196f3",
                  color: "white",
                }}
              >
                Nochmal spielen
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
