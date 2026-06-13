import styled from "styled-components";
import EditIcon from "../Icons/EditIcon";
import DeleteIcon from "../Icons/DeleteIcon";
import { useSession } from "next-auth/react";

export default function HeaderContainer({ color, headline, onEdit, onDelete }) {
  const { data: session } = useSession();
  return (
    <Header color={color}>
      <Headline>{headline}</Headline>
      {session ? (
        <IconGroup>
          <EditIcon onEdit={onEdit} />
          <DeleteIcon onDelete={onDelete} />
        </IconGroup>
      ) : null}
    </Header>
  );
}

const Header = styled.div`
  background-color: ${({ color }) => color};
  padding: 0.8rem 1.2rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 55px;
`;

const Headline = styled.div`
  color: white;
  font-size: 1.8rem;
  font-weight: bold;
  line-height: 1;
  font-family: "Caveat", cursive;
`;

const IconGroup = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.4rem;
`;
