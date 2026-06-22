"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const DARKBAY_API_URL = process.env.DARKBAY_API_URL || "http://localhost:3030";

interface AuthResponse {
    accessToken?: string;
    access_token?: string;
}

// 1. LOGIN ACTION
export async function loginAction(prevState: any, formData: FormData) {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    if (!username || !password) {
        return { error: "Bitte fülle alle Felder aus." };
    }

    try {
        const response = await fetch(`${DARKBAY_API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            if (response.status === 401) {
                return { error: "Ungültiger Benutzername oder Passwort." };
            }
            return { error: "Ein Fehler ist aufgetreten. Bitte versuche es später erneut." };
        }

        const data: AuthResponse = await response.json();
        const token = data.accessToken || data.access_token;

        if (!token) {
            return { error: "Kein Token vom Server erhalten." };
        }

        // Token im httpOnly-Cookie auf dem Server speichern (Challenge 5)
        const cookieStore = await cookies();
        cookieStore.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24, // 1 Tag gültig
            path: "/",
        });

    } catch (err) {
        return { error: "Verbindung zum DarkBay-Backend fehlgeschlagen." };
    }

    // Weiterleitung nach erfolgreichem Login (außerhalb des try-catch wegen Next.js Internals)
    redirect("/");
}

// 2. REGISTER ACTION
export async function registerAction(prevState: any, formData: FormData) {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    if (!username || !password) {
        return { error: "Bitte fülle alle Felder aus." };
    }

    try {
        const response = await fetch(`${DARKBAY_API_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            if (response.status === 409) {
                return { error: "Dieser Benutzername existiert bereits." };
            }
            return { error: "Registrierung fehlgeschlagen." };
        }
    } catch (err) {
        return { error: "Verbindung zum DarkBay-Backend fehlgeschlagen." };
    }

    redirect("/login");
}

// 3. LOGOUT ACTION
export async function logoutAction() {
    const cookieStore = await cookies();
    cookieStore.delete("token");
    redirect("/login");
}