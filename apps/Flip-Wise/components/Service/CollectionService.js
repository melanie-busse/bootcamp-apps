import { mutate } from "swr";

export const API_COLLECTIONS = "/api/collections";


export async function addCollection(data) {
  try {
    const response = await fetch(API_COLLECTIONS, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      console.error(`Error creating collection:`, response.statusText);
      return;
    }

    await mutate(API_COLLECTIONS);
  } catch (error) {
    console.error(`Error creating:`, error);
  }
}

export async function updateCollection(data, id) {
  try {
    const response = await fetch(`${API_COLLECTIONS}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data }),
    });

    if (!response.ok) {
      console.error(`Error updating collection:`, response.statusText);
      return;
    }

    await mutate(`${API_COLLECTIONS}/${id}`);
    await mutate(API_COLLECTIONS)
  } catch (error) {
    console.error(`Error updating:`, error);
  }
}

export async function deleteCollection(id) {
  try {
    const response = await fetch(`${API_COLLECTIONS}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      console.error("Deleting collection failed:", response.statusText);
      return;
    }
    await mutate(API_COLLECTIONS);
  } catch (error) {
    console.error("Deleting failed", error);
  }
}
