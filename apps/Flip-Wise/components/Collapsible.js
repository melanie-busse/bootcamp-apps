import { useState } from "react";
import styled from "styled-components";

export default function Collapsible({ label, children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {isOpen ? (
        children({ onClose: () => setIsOpen(false) })
      ) : (
        <ToggleButton onClick={() => setIsOpen(true)}>{label}</ToggleButton>
      )}
    </>
  );
}

const ToggleButton = styled.button`
  width: 100%;
  height: 100%;
  min-height: 200px;
  border: 3px dashed #2d8c6e;
  border-radius: 20px;
  font-family: "Caveat", cursive;
  font-size: 1.5rem;
  font-weight: 700;
  cursor: pointer;
  background: #2d8c6e22;
  color: #2d8c6e;
  transition:
    background 0.2s,
    transform 0.1s;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  &:hover {
    background: #2d8c6e44;
    transform: scale(1.01);
  }

  &:active {
    transform: scale(0.99);
  }
`;
