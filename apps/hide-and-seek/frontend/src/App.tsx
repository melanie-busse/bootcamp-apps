import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

type MatchStatus = "connecting" | "waiting" | "start";

export default function App() {
  const [status, setStatus] = useState<MatchStatus>("connecting");
  const [role, setRole] = useState<"seeker" | "hider" | null>(null);
  const [message, setMessage] = useState<string>("Verbinde zum Server...");

  useEffect(() => {
    const socket: Socket = io("http://localhost:3000");

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

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div
      style={{ padding: "2rem", fontFamily: "sans-serif", textAlign: "center" }}
    >
      <h1>Hide & Seek 🙈</h1>

      {status === "connecting" && <p>{message}</p>}

      {status === "waiting" && (
        <div
          style={{
            padding: "1.5rem",
            background: "#fff3e0",
            borderRadius: "8px",
            display: "inline-block",
          }}
        >
          <h3>{message}</h3>
        </div>
      )}

      {status === "start" && (
        <div
          style={{
            padding: "2rem",
            background: role === "seeker" ? "#ffebee" : "#e8f5e9",
            border: `2px solid ${role === "seeker" ? "#f44336" : "#4caf50"}`,
            borderRadius: "8px",
            display: "inline-block",
          }}
        >
          <h2>Spiel gestartet! 🎉</h2>
          <p style={{ fontSize: "1.25rem" }}>
            Deine Rolle:{" "}
            <strong>
              {role === "seeker" ? "SUCHENDER 🔍" : "VERSTECKER 📦"}
            </strong>
          </p>
          <p style={{ color: "#666" }}>Warte auf das Grid in Abschnitt 3...</p>
        </div>
      )}
    </div>
  );
}
