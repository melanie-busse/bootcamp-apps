import { cookies } from "next/headers";

const DARKBAY_API_URL = process.env.DARKBAY_API_URL || "http://localhost:3030";

export async function fetchAPI(path: string, options: RequestInit = {}) {
    const url = `${DARKBAY_API_URL}${path}`;

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const headers = new Headers(options.headers);
    headers.set("Content-Type", "application/json");

    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    const response = await fetch(url, {
        ...options,
        headers,
    });

    if (!response.ok) {
        throw new Error(`DarkBay API Error: ${response.status}`);
    }

    return response.json();
}

export async function isAuthenticated(): Promise<boolean> {
    const cookieStore = await cookies();
    return cookieStore.has("token");
}