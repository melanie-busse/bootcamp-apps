"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const DARKBAY_API_URL = process.env.DARKBAY_API_URL || "http://localhost:3000";

export async function createAuctionAction(prevState: any, formData: FormData) {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const startPrice = Number(formData.get("startPrice"));
    const endDateInput = formData.get("endDate") as string;

    if (!title || !description || !startPrice || !endDateInput) {
        return { error: "Bitte fülle alle Pflichtfelder aus." };
    }

    const endDate = new Date(endDateInput).toISOString();

    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return { error: "Du bist nicht autorisiert. Bitte logge dich neu ein." };
        }

        const response = await fetch(`${DARKBAY_API_URL}/auctions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ title, description, startPrice, endDate }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return { error: errorData.message || "Auktion konnte nicht erstellt werden." };
        }

        revalidatePath("/");
    } catch (err) {
        return { error: "Verbindungsfehler zum Backend." };
    }

    redirect("/");
}