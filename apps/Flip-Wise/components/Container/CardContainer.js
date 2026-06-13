import styled from "styled-components";

export default function CardContainer({ children, className, ...props }) {
  return (
    <StyledCardContainer className={className} {...props}>
      {children}
    </StyledCardContainer>
  );
}

const StyledCardContainer = styled.button`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  padding: 0;
  background: transparent;
  border: none;
`;
