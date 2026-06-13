import styled from "styled-components";

export default function ListContainer({children}) {
    return (
        <StyledListContainer>
            {children}
        </StyledListContainer>
    );
}

const StyledListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  padding: 2rem;
  justify-content: flex-start;
  align-content: flex-start;
  max-width: 900px;
  margin: 0 auto;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 1rem;
  }
`;