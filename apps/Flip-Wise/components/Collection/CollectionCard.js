import HeaderContainer from "@/components/Container/HeaderContainer";
import CardContainer from "@/components/Container/CardContainer";
import BodyContainer from "@/components/Container/BodyContainer";
import styled from "styled-components";
import { useRouter } from "next/router";
import CardWrapper from "../Container/CardWrapper";
import * as GiIcons from "react-icons/gi";
import { deleteCollection } from "../Service/CollectionService";
import CollectionCardForm from "./CollectionCardForm";
import { useState } from "react";
import { useSession } from "next-auth/react";

export default function CollectionCard({
  collection,
  flashcardCount,
  correctFlashcardCount,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const Icon = GiIcons[collection.icon];
  const { data: session } = useSession();

  if (isEditing) {
    return (
      <CollectionCardForm
        onClose={() => setIsEditing(false)}
        initialData={{
          id: collection._id,
          name: collection.name,
          color: collection.color,
          icon: collection.icon,
        }}
      />
    );
  }

  return (
    <CardWrapper color={collection.color}>
      <CardContainer
        color={collection.color}
        onClick={() => router.push(`/collections/${collection.name}`)}
      >
        <HeaderContainer
          color={collection.color}
          headline=""
          onEdit={() => setIsEditing(true)}
          onDelete={() => {
            if (
              window.confirm("Are you sure you want to delete this flashcard?")
            ) {
              deleteCollection(collection._id);
            }
          }}
        />
        <BodyContainer>
          <Title>
            {Icon && <Icon />} {collection.name}
          </Title>
          <Info>{flashcardCount} cards</Info>
          {session ? (
            <Info>{correctFlashcardCount} correctly answered</Info>
          ) : null}
        </BodyContainer>
      </CardContainer>
    </CardWrapper>
  );
}

const Title = styled.h2`
  font-size: 2.5rem;
  font-weight: bold;
  color: ${({ color }) => color};
  font-family: "Caveat", cursive;
`;

const Info = styled.div`
  font-size: 1rem;
  font-weight: 700;
  color: #666;
  font-family: "Quicksand", sans-serif;
`;
