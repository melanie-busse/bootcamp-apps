import styled from "styled-components";

export default function BodyContainer({ children, className, ...props }) {
  return (
    <StyledBodyContainer className={className} {...props}>
      {children}
    </StyledBodyContainer>
  );
}

const StyledBodyContainer = styled.div`
  padding: 1.5rem 1.8rem;
  flex: 1 1 0;
  background-color: ${({ $isShowingAnswer }) =>
    $isShowingAnswer ? ({ color }) => color : "#fff"};
  display: ${({ $isShowingAnswer, $isArchive }) =>
    $isArchive ? "block" : $isShowingAnswer ? "block" : "flex"};
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 0.5rem;
`;
