import ListContainer from "@/components/Container/ListContainer";
import CollectionCard from "@/components/Collection/CollectionCard";
import { getCollectionStats } from "@/components/Service/CollectionService";
import { useSession } from "next-auth/react";

export default function CollectionList({ flashcards, collections, children }) {
  const { data: session } = useSession();
  const userCollections = session
    ? collections.filter((collection) => collection.owner === session.user.id)
    : collections.filter((collection) => collection.owner === "default");
  return <ListContainer>{children}</ListContainer>;
}
