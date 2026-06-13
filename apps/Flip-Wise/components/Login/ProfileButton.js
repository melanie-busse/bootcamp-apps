import styled from "styled-components";

export default function ProfileButton({ children, onClick }) {
  return (
    <StyledProfileButton onClick={onClick}>{children}</StyledProfileButton>
  );
}

const StyledProfileButton = styled.button`
  position: absolute;
  right: 40px;
  border: none;
  border-radius: 99px;
  overflow: hidden;
  padding: 0;
  height: 50%;
  aspect-ratio: 1;
  cursor: pointer;
  &:hover {
    filter: contrast(0.8);
  }
`;
