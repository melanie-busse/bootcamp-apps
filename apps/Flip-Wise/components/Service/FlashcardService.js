import { mutate } from "swr";

export const API_FLASHCARDS = "/api/flashcards";

export async function addFlashcard(data) {
  try {
    const response = await fetch(API_FLASHCARDS, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      console.error(`Error creating flashcard:`, response.statusText);
      return;
    }

    await mutate(API_FLASHCARDS);
  } catch (error) {
    console.error(`Error creating:`, error);
  }
}

export async function updateFlashcard(data, id) {
  try {
    const response = await fetch(`${API_FLASHCARDS}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data }),
    });

    if (!response.ok) {
      console.error(`Error updating flashcard:`, response.statusText);
      return;
    }

    await mutate(`${API_FLASHCARDS}/${id}`);
  } catch (error) {
    console.error(`Error updating:`, error);
  }
}

export async function setFlashcardIsAnswered(value, id) {
  try {
    const response = await fetch(`${API_FLASHCARDS}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        isCorrectlyAnswered: Boolean(value),
      }),
    });

    if (!response.ok) {
      console.error(`Error updating flashcard:`, response.statusText);
      return;
    }

    await mutate(`${API_FLASHCARDS}/${id}`);
    await mutate(API_FLASHCARDS);
  } catch (error) {
    console.error(`Error updating:`, error);
  }
}

export async function deleteFlashcard(id) {
  try {
    const response = await fetch(`${API_FLASHCARDS}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      console.error("Deleting flashcard failed:", response.statusText);
      return;
    }

    await mutate(`${API_FLASHCARDS}/${id}`);
  } catch (error) {
    console.error("Deleting failed:", error);
  }
}

export function getFlashcardsFromCollection(flashcards, name) {
  return flashcards.filter((flashcard) => flashcard.collection === name);
}

export function getUnansweredFlashcards(flashcards) {
  return flashcards.filter((flashcard) => !flashcard.isCorrectlyAnswered);
}

export function getAnsweredFlashcards(flashcards) {
  return flashcards.filter((flashcard) => flashcard.isCorrectlyAnswered);
}

export function addColorToFlashcards(flashcards, collections) {
  return flashcards.map((flashcard) => ({
    ...flashcard,
    color:
      collections.find((c) => c._id === flashcard.collection)?.color || "#CCC",
    collection: collections.find((c) => c._id === flashcard.collection)?.name,
  }));
}
