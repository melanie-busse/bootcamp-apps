import styled from "styled-components";

interface GameHeaderProps {
  role: "seeker" | "hider" | null;
  timeLeft: number;
}

export function GameHeader({ role, timeLeft }: GameHeaderProps) {
   const isUrgent = timeLeft <= 10;

  return (
    <Container>
      <div>
        Du bist:{" "}
        <RoleText $role={role}>
          {role === "seeker" ? "SUCHENDER" : "VERSTECKER"}
        </RoleText>
      </div>
      <TimerText $isUrgent={isUrgent} className={isUrgent ? "radar-blink" : ""}>
        Zeit übrig: {timeLeft}s
      </TimerText>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  font-size: 1.1rem;
`;

const RoleText = styled.strong<{ $role: "seeker" | "hider" | null }>`
  color: ${(props) =>
    props.$role === "seeker" ? "var(--color-seeker)" : "var(--color-hider)"};
`;

const TimerText = styled.div<{ $isUrgent: boolean }>`
  font-weight: bold;
  color: ${(props) =>
    props.$isUrgent ? "var(--color-seeker)" : "var(--color-text)"};
  transition: color 0.3s ease;
`;
