"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const DARKBAY_API_URL = process.env.DARKBAY_API_URL || "http://localhost:3000";

export async function placeBidAction(prevState: any, formData: FormData) {
  // Werte aus dem Formular ziehen und in Zahlen umwandeln
  const auctionId = Number(formData.get("auctionId"));
  const currentPrice = Number(formData.get("currentPrice"));
  const amount = Number(formData.get("amount"));

  if (!amount || amount <= currentPrice) {
    return { error: "Dein Gebot muss höher sein als das aktuelle Gebot." };
  }

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    // UPDATE: Route geändert auf /offers & auctionId wandert in den Body
    const response = await fetch(`${DARKBAY_API_URL}/offers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        amount,
        auctionId // Wird vom CreateOfferDto im Backend erwartet
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("[Backend Error Details]:", errorData);

      // Hier fangen wir die Fehlermeldungen ab, die du im Controller definiert hast (z.B. Eigenbieten verboten)
      return {
        error: errorData.message || `Fehler vom Server (Status ${response.status}).`
      };
    }

    // Cache für die Detailseite und Startseite ungültig machen, damit die neuen Preise sofort da sind
    revalidatePath(`/auctions/${auctionId}`);
    revalidatePath("/");

    return { success: true, error: null };

  } catch (err) {
    return { error: "Verbindungsfehler zum Backend." };
  }
}