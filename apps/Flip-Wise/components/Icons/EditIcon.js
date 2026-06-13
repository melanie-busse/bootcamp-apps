import styled from "styled-components";

export default function editIcon({ onEdit }) {

  return (
    <EditIconStyled
      onClick={(e) => {
        e.stopPropagation();
        onEdit();
      }}
      title="Edit"
      aria-label="Edit card">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
    </EditIconStyled>
  );
}

const EditIconStyled = styled.div`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  opacity: 0.85;
  transition: opacity 0.15s,
  background 0.15s;

  &:hover {
    opacity: 1;
    background: rgba(255, 255, 255, 0.2);
  }

  &:active {
    background: rgba(255, 255, 255, 0.35);
  }
`;
