import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export default function App() {
  const [serverMessage, setServerMessage] = useState<string>(
    "Warte auf Server-Antwort..."
  );

  useEffect(() => {
    // Verbindung zum NestJS Backend aufbauen
    const socket: Socket = io("http://localhost:3000");

    socket.on("connect", () => {
      console.log("[Frontend] Verbunden! Socket-ID:", socket.id);

      // Event an den Server senden
      socket.emit("ping_test", { message: "Hallo vom Vite-Client! 👋" });
    });

    // Auf die Antwort vom Server hören
    socket.on("pong_test", (data: { message: string }) => {
      console.log("[Frontend] Antwort erhalten:", data);
      setServerMessage(data.message);
    });

    // Verbindung trennen, wenn die Komponente unmountet
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div
      style={{ padding: "2rem", fontFamily: "sans-serif", textAlign: "center" }}
    >
      <h1>Hide & Seek 🙈</h1>
      <p>Schau in deine Browser-Konsole und ins Terminal!</p>
      <div
        style={{
          padding: "1rem",
          background: "#e0f7fa",
          borderRadius: "8px",
          display: "inline-block",
          marginTop: "1rem",
        }}
      >
        <strong>Server-Antwort:</strong> {serverMessage}
      </div>
    </div>
  );
}
