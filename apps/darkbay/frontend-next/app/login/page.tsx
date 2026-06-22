"use client";

import React, { useActionState } from "react";
import Link from "next/link";
import { loginAction } from "@/lib/authActions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
    // Verknüpft die Server Action mit dem UI-State für Fehler
    const [state, formAction, isPending] = useActionState(loginAction, null);

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
            <Card className="w-full max-w-md border-border bg-card shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-foreground">NextBay Login</CardTitle>
                    <CardDescription>Tritt ein in den Untergrund-Marktplatz.</CardDescription>
                </CardHeader>

                <form action={formAction}>
                    <CardContent className="space-y-4">
                        {state?.error && (
                            <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive font-medium">
                                {state.error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label htmlFor="username" className="text-sm font-medium text-foreground">
                                Benutzername
                            </label>
                            <Input
                                id="username"
                                name="username"
                                type="text"
                                placeholder="Dein Handle"
                                required
                                disabled={isPending}
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium text-foreground">
                                Passwort
                            </label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                required
                                disabled={isPending}
                            />
                        </div>
                    </CardContent>

                    <CardFooter className="flex flex-col gap-4">
                        <Button type="submit" className="w-full" disabled={isPending}>
                            {isPending ? "Logge ein..." : "Anmelden"}
                        </Button>

                        <p className="text-xs text-center text-muted-foreground">
                            Noch kein Profil?{" "}
                            <Link href="/register" className="text-primary underline hover:text-primary/90">
                                Jetzt registrieren
                            </Link>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}