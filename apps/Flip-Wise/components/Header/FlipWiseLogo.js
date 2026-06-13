import styled, { keyframes } from "styled-components";

export default function FlipWiseLogo({ flipKey, onClick }) {
  return (
    <LogoContainer onClick={onClick}>
      <PerspectiveWrapper>
        <FlipWord key={`flip-${flipKey}`} $flipDirection="up">
          Flip
        </FlipWord>
      </PerspectiveWrapper>
      <PerspectiveWrapper>
        <FlipWord key={`wise-${flipKey}`} $flipDirection="down">
          Wise
        </FlipWord>
      </PerspectiveWrapper>
    </LogoContainer>
  );
}

const flipUpAndBack = keyframes`
  0% {
    transform: rotateX(0deg);
    opacity: 1;
  }
  25% {
    transform: rotateX(90deg);
    opacity: 0;
  }
  50% {
    transform: rotateX(180deg);
    opacity: 1;
  }
  75% {
    transform: rotateX(90deg);
    opacity: 0;
  }
  100% {
    transform: rotateX(0deg);
    opacity: 1;
  }
`;

const flipDownAndBack = keyframes`
  0% {
    transform: rotateX(0deg);
    opacity: 1;
  }
  25% {
    transform: rotateX(-90deg);
    opacity: 0;
  }
  50% {
    transform: rotateX(-180deg);
    opacity: 1;
  }
  75% {
    transform: rotateX(-90deg);
    opacity: 0;
  }
  100% {
    transform: rotateX(0deg);
    opacity: 1;
  }
`;

const PerspectiveWrapper = styled.span`
  display: inline-block;
  perspective: 400px;
`;

const FlipWord = styled.span`
  display: inline-block;
  background: linear-gradient(135deg, #e0fffa 0%, #3ecfb2 50%, #e0fffa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 0 12px rgba(62, 207, 178, 0.7));
  animation: ${({ $flipDirection }) =>
      $flipDirection === "up" ? flipUpAndBack : flipDownAndBack}
    1.2s ease-in-out both;
`;

const LogoContainer = styled.h1`
  font-family: "permanent marker", sans-serif;
  font-size: clamp(2.5rem, 6vw, 5rem);
  font-weight: 400;
  letter-spacing: 0.04em;
  text-transform: none;
  margin: 0;
  cursor: pointer;
  user-select: none;
  gap: 0.15em;

  display: inline-flex;
  align-items: baseline;
  justify-content: center;
  width: 100%;

  &:hover span span {
    filter: drop-shadow(0 0 18px rgba(62, 207, 178, 0.95)) brightness(1.2);
  }
`;
