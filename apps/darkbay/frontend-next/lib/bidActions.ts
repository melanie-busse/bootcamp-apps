"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

const DARKBAY_API_URL = process.env.DARKBAY_API_URL

export async function placeBidAction(prevState: any, formData: FormData) {
  const auctionId = Number(formData.get("auctionId"))
  const currentPrice = Number(formData.get("currentPrice"))
  const amount = Number(formData.get("amount"))

  if (!amount || amount <= currentPrice) {
    return { error: "Dein Gebot muss höher sein als das aktuelle Gebot." }
  }

  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    const response = await fetch(`${DARKBAY_API_URL}/offers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        amount,
        auctionId,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("[Backend Error Details]:", errorData)

      return {
        error: errorData.message || `Fehler vom Server (Status ${response.status}).`,
      }
    }

    revalidatePath(`/auctions/${auctionId}`)
    revalidatePath("/")

    return { success: true, error: null }
  } catch (err) {
    return { error: "Verbindungsfehler zum Backend." }
  }
}
