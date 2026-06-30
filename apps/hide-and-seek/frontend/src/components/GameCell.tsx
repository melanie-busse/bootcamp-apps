import styled from "styled-components";

interface GameCellProps {
  isWall: boolean;
  isIce: boolean;
  isSand: boolean;
  hasPortal: boolean;
  hasRadarItem: boolean;
  isSeeker: boolean;
  isHider: boolean;
  showHider: boolean;
}

export function GameCell({
  isWall,
  isIce,
  isSand,
  hasPortal,
  hasRadarItem,
  isSeeker,
  isHider,
  showHider,
}: GameCellProps) {
  let backgroundVar = "var(--color-floor)";
  if (isWall) backgroundVar = "var(--color-wall)";
  else if (hasPortal) backgroundVar = "var(--color-portal)";
  else if (isIce) backgroundVar = "var(--color-ice)";
  else if (isSand) backgroundVar = "var(--color-sand)";

  if (isSeeker) backgroundVar = "var(--color-seeker)";
  else if (isHider && showHider) backgroundVar = "var(--color-hider)";

   return (
    <StyledGridCell $bgColor={backgroundVar} $hasPortal={hasPortal}>
      {isSeeker && "🔍"}
      {!isSeeker && isHider && showHider && "📦"}

      {!isSeeker && (!isHider || !showHider) && (
        <>
          {isWall && "🧱"}
          {hasPortal && "🌀"}
          {hasRadarItem && "📡"}
          {!hasPortal && !hasRadarItem && isIce && "❄️"}
          {!hasPortal && !hasRadarItem && isSand && "⏳"}
        </>
      )}
    </StyledGridCell>
  );
}


const StyledGridCell = styled.div<{ $bgColor: string; $hasPortal: boolean }>`
  width: 40px;
  height: 40px;
  border: 1px solid #ccc;
  background-color: ${(props) => props.$bgColor};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  box-shadow: ${(props) =>
    props.$hasPortal ? "0 0 8px #a855f7 inset" : "none"};
`;
