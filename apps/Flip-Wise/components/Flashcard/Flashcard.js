import styled from "styled-components";
import { useState } from "react";

import FlashcardQuestion from "@/components/Flashcard/FlashcardQuestion";
import FlashcardAnswer from "@/components/Flashcard/FlashcardAnswer";
import HeaderContainer from "@/components/Container/HeaderContainer";
import CardContainer from "@/components/Container/CardContainer";
import BodyContainer from "@/components/Container/BodyContainer";
import FlashcardForm from "@/components/Flashcard/FlashcardForm";
import { StyledButton } from "@/components/Button";
import CardWrapper from "../Container/CardWrapper";
import { setFlashcardIsAnswered } from "@/components/Service/FlashcardService";
import { useSession } from "next-auth/react";

export default function Flashcard({
  id,
  collection,
  collections,
  color,
  question,
  answer,
  onDelete,
  isArchive,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isShowingAnswer, setIsShowingAnswer] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const { data: session } = useSession();

  function flipFlashcard() {
    setIsFlipping(true);
    setTimeout(() => {
      setIsShowingAnswer(!isShowingAnswer);
    }, 100);
    setTimeout(() => {
      setIsFlipping(false);
    }, 200);
  }

  function handleDelete() {
    if (window.confirm("Are you sure you want to delete this flashcard?")) {
      onDelete();
    }
  }

  async function setIsAnswered(value) {
    await setFlashcardIsAnswered(value, id);
  }

  if (isEditing) {
    return (
      <FlashcardForm
        onClose={() => setIsEditing(false)}
        initialData={{ id, collection, question, answer }}
        collections={collections}
      />
    );
  }

  return (
    <CardWrapper color={color} isFlipping={isFlipping}>
      <FlashcardContainer
        color={color}
        $isShowingAnswer={isShowingAnswer}
        onClick={flipFlashcard}
      >
        <HeaderContainer
          color={color}
          headline={collection}
          onEdit={() => setIsEditing(true)}
          onDelete={handleDelete}
        />
        <BodyContainer
          $isShowingAnswer={isShowingAnswer}
          $isArchive={isArchive}
          color={color}
        >
          {isShowingAnswer ? (
            <FlashcardAnswer answer={answer} />
          ) : (
            <FlashcardQuestion question={question} />
          )}
        </BodyContainer>
      </FlashcardContainer>

      {session ? (
        isArchive ? (
          <ButtonCorrectlyAnswered
            onClick={() => setIsAnswered(false)}
            $isShowingAnswer={isShowingAnswer}
          >
            Mark as Incorrect
          </ButtonCorrectlyAnswered>
        ) : isShowingAnswer ? (
          <ButtonCorrectlyAnswered
            onClick={() => setIsAnswered(true)}
            $isShowingAnswer={isShowingAnswer}
          >
            Mark as Correct
          </ButtonCorrectlyAnswered>
        ) : null
      ) : null}
    </CardWrapper>
  );
}

const FlashcardContainer = styled(CardContainer)`
  background-color: ${({ $isShowingAnswer }) =>
    $isShowingAnswer ? ({ color }) => color : "#fff"};
  transform: ${({ $isFlipping }) =>
    $isFlipping ? "rotateY(90deg)" : "rotateY(0)"};
  transition: transform 0.2s ease-in-out;
`;

const ButtonCorrectlyAnswered = styled(StyledButton)`
  background-color: ${({ $isShowingAnswer }) =>
    $isShowingAnswer ? "transparent" : "#ddd"};
  color: ${({ $isShowingAnswer }) => ($isShowingAnswer ? "#fff" : "#000")};
  border-color: #fff;
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translate(-50%);

  &:hover {
    color: ${({ $isShowingAnswer }) => ($isShowingAnswer ? "#ddd" : "#333")};
    border-color: ${({ $isShowingAnswer }) =>
      $isShowingAnswer ? "#ddd" : "#fff"};
  }

  &:active {
    transform: translate(-48%, 2px);
  }
`;
