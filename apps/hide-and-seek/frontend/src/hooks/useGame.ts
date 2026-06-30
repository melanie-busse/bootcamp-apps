import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import type { GameState, MatchStatus } from "../types/GameState.ts";

let socket: Socket;

export function useGame() {
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
        e.preventDefault();
        socket.emit("move", { direction });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [status, gameState]);

  return { status, role, message, gameState };
}
