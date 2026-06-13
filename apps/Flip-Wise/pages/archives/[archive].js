import FlashcardList from "@/components/Flashcard/FlashcardList";
import useSWR from "swr";
import { useRouter } from "next/router";
import Headline from "@/components/Headline/Headline";
import styled from "styled-components";
import { useSession } from "next-auth/react";
import {
  addColorToFlashcards,
  getAnsweredFlashcards,
} from "@/components/Service/FlashcardService";

export default function CollectionArchive() {
  const router = useRouter();
  const { archive } = router.query;

  const { data: session } = useSession();

  const {
    data: flashcards,
    isLoading: loadingFlashcards,
    error: errorFlashcards,
  } = useSWR(`/api/flashcards`);

  const {
    data: unfilteredCollections,
    isLoading: loadingCollections,
    error: errorCollections,
  } = useSWR(`/api/collections`);

  const error = errorFlashcards || errorCollections;
  const isLoading = loadingFlashcards || loadingCollections;

  if (error) {
    return <div>Fehler beim Laden: {error.message} (Retry?)</div>;
  }

  if (isLoading || !flashcards || !unfilteredCollections) {
    return <h1>Loading...</h1>;
  }

  const collections = session
    ? unfilteredCollections.filter(
        (collection) => collection.owner === session.user.id
      )
    : unfilteredCollections.filter(
        (collection) => collection.owner === "default"
      );

  const currentCollection = collections.find(
    (collection) => collection.name === archive
  );

  if (!currentCollection) {
    return (
      <>
        <Headline headline={"404"}></Headline>
        <StyledErrorMessage>
          No collection with the name {archive} found
        </StyledErrorMessage>
      </>
    );
  }

  const flashcardsFromCollection = addColorToFlashcards(
    flashcards.filter(
      (flashcard) => flashcard.collection === currentCollection._id
    ),
    collections
  );
  const filteredFlashcards = getAnsweredFlashcards(flashcardsFromCollection);
  const isEmpty = flashcardsFromCollection.length === 0;

  return (
    <>
      <Headline headline={`${archive} Archive`}></Headline>

      <FlashcardList
        flashcards={filteredFlashcards}
        collections={collections}
        isArchive={true}
      />
    </>
  );
}
const StyledErrorMessage = styled.p`
  text-align: center;
`;
