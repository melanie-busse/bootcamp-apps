import styled from "styled-components";

export default function CardWrapper({ children, color, isFlipping }) {
  return (
    <StyledCardWrapper color={color} $isFlipping={isFlipping}>
      {children}
    </StyledCardWrapper>
  );
}

const StyledCardWrapper = styled.div`
  border: 3px solid ${({ color }) => color};
  border-radius: 20px;
  overflow: clip;
  font-family: "Caveat", cursive;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 0;
  height: 300px;
  overflow-clip-margin: 1px;
  transform: ${({ $isFlipping }) =>
    $isFlipping ? "rotateY(90deg)" : "rotateY(0)"};
  transition: transform 0.2s ease-in-out;
`;
