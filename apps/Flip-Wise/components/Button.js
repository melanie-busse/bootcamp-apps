import styled from "styled-components";

export const StyledButton = styled.button`
  flex: 1;
  padding: 11px 20px;
  border: 2px solid #222;
  border-radius: 10px;
  font-family: "Caveat", cursive;
  font-size: 1.2rem;
  font-weight: 700;
  cursor: pointer;
  transition:
    transform 0.1s,
    box-shadow 0.1s;
  &:active {
    transform: translate(2px, 2px);
    box-shadow: none;
  }
`;
