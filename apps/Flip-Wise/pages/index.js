import useSWR from "swr";
import Collapsible from "@/components/Collapsible";
import CollectionCardForm from "@/components/Collection/CollectionCardForm";
import ListContainer from "@/components/Container/ListContainer";
import { useSession } from "next-auth/react";
import CollectionCard from "@/components/Collection/CollectionCard";

export default function HomePage() {
  const { data: session } = useSession();

  const {
    data: flashcards,
    isLoading: loadingFlashcards,
    error: errorFlashcards,
  } = useSWR(`/api/flashcards`);

  const {
    data: collections,
    isLoading: loadingCollections,
    error: errorCollections,
  } = useSWR(`/api/collections`);

  const error = errorFlashcards || errorCollections;
  const isLoading = loadingFlashcards || loadingCollections;

  if (error) {
    return <div>Fehler beim Laden: {error.message} (Retry?)</div>;
  }

  if (isLoading || !flashcards || !collections) {
    return <h1>Loading...</h1>;
  }

  const user = session ? session.user.id : "default";
  const userCollections = collections.filter(
    (collection) => collection.owner === user
  );

  return (
    <ListContainer>
      <Collapsible label="+ Add Collection">
        {({ onClose }) => (
          <CollectionCardForm collections={collections} onClose={onClose} />
        )}
      </Collapsible>
      {userCollections.map((collection) => {
        const cardsInCollection = flashcards.filter(
          (card) => card.collection === collection._id
        );

        const totalCount = cardsInCollection.length;

        const correctlyAnsweredCount = cardsInCollection.filter(
          (card) => card.isCorrectlyAnswered === true
        ).length;

        return (
          <CollectionCard
            key={collection.name}
            collection={collection}
            flashcardCount={totalCount}
            correctFlashcardCount={correctlyAnsweredCount}
          />
        );
      })}
    </ListContainer>
  );
}
