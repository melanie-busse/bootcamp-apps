import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

type MatchStatus = 'connecting' | 'waiting' | 'start';

interface Position {
  x: number;
  y: number;
}

interface GameState {
  seekerPos: Position;
  hiderPos: Position;
  status: string;
}

export default function App() {
  const [status, setStatus] = useState<MatchStatus>('connecting');
  const [role, setRole] = useState<'seeker' | 'hider' | null>(null);
  const [message, setMessage] = useState<string>('Verbinde zum Server...');
  const [gameState, setGameState] = useState<GameState | null>(null);

  useEffect(() => {
    const socket: Socket = io('http://localhost:3000');

    socket.on('match_status', (data: { status: MatchStatus; role?: 'seeker' | 'hider'; message?: string }) => {
      setStatus(data.status);
      if (data.message) setMessage(data.message);
      if (data.role) setRole(data.role);
    });

    // Auf Spiel-Updates vom Server hören
    socket.on('game_update', (state: GameState) => {
      setGameState(state);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Erstellt ein flaches Array für ein 10x10 Grid (100 Zellen)
  const renderGrid = () => {
    if (!gameState) return null;

    const cells = [];
    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        const isSeeker = gameState.seekerPos.x === x && gameState.seekerPos.y === y;
        const isHider = gameState.hiderPos.x === x && gameState.hiderPos.y === y;

        cells.push(
            <div
                key={`${x}-${y}`}
                style={{
                  width: '40px',
                  height: '40px',
                  border: '1px solid #ccc',
                  backgroundColor: isSeeker ? '#f44336' : isHider ? '#4caf50' : '#fafafa',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '1.2rem',
                  transition: 'background-color 0.1s ease',
                }}
            >
              {isSeeker && '🔍'}
              {isHider && '📦'}
            </div>
        );
      }
    }
    return cells;
  };

  return (
      <div style={{ padding: '2rem', fontFamily: 'sans-serif', textAlign: 'center' }}>
        <h1>Hide & Seek 🙈</h1>

        {status === 'connecting' && <p>{message}</p>}
        {status === 'waiting' && <h3 style={{ color: '#ff9800' }}>{message}</h3>}

        {status === 'start' && gameState && (
            <div>
              <p style={{ fontSize: '1.1rem' }}>
                Du bist: <strong style={{ color: role === 'seeker' ? '#f44336' : '#4caf50' }}>
                {role === 'seeker' ? 'SUCHENDER (🔍)' : 'VERSTECKER (📦)'}
              </strong>
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(10, 40px)',
                gridTemplateRows: 'repeat(10, 40px)',
                gap: '2px',
                justifyContent: 'center',
                marginTop: '1.5rem',
                backgroundColor: '#eee',
                padding: '10px',
                borderRadius: '8px',
                inlineSize: 'max-content',
                margin: '0 auto'
              }}>
                {renderGrid()}
              </div>
            </div>
        )}
      </div>
  );
}