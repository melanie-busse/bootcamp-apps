"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

const DARKBAY_API_URL = process.env.DARKBAY_API_URL || "http://localhost:3000"

async function getAuthToken() {
  const cookieStore = await cookies()
  return cookieStore.get("token")?.value
}

export async function getWatchlist() {
  const token = await getAuthToken()
  if (!token) return []

  try {
    const response = await fetch(`${DARKBAY_API_URL}/users/watchlist`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      next: { revalidate: 0 },
    })

    if (!response.ok) return []

    const data = await response.json()

    return data.watchlist || []
  } catch (err) {
    return []
  }
}

export async function addToWatchlistAction(auctionId: number, path: string) {
  const token = await getAuthToken()
  if (!token) return { error: "Nicht autorisiert" }

  try {
    const response = await fetch(`${DARKBAY_API_URL}/users/watchlist/${auctionId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) return { error: "Konnte nicht hinzugefügt werden" }

    revalidatePath(path)
    return { success: true }
  } catch (err) {
    return { error: "Netzwerkfehler" }
  }
}

export async function removeFromWatchlistAction(auctionId: number, path: string) {
  const token = await getAuthToken()
  if (!token) return { error: "Nicht autorisiert" }

  try {
    const response = await fetch(`${DARKBAY_API_URL}/users/watchlist/${auctionId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) return { error: "Konnte nicht entfernt werden" }

    revalidatePath(path)
    return { success: true }
  } catch (err) {
    return { error: "Netzwerkfehler" }
  }
}
