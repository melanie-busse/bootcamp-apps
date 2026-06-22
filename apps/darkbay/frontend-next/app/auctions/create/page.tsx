"use client";

import React, { useActionState } from "react";
import { createAuctionAction } from "@/lib/auctionActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function CreateAuctionPage() {
    const [state, formAction, isPending] = useActionState(createAuctionAction, null);

    const getMinDateTime = () => {
        const now = new Date();
        now.setHours(now.getHours() + 1);
        return now.toISOString().slice(0, 16);
    };

    return (
        <div className="container mx-auto flex items-center justify-center p-6 min-h-[calc(100vh-8rem)]">
            <Card className="w-full max-w-xl border-border bg-card shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Neue Auktion starten</CardTitle>
                    <CardDescription>Biete deine Schmuggelware auf dem NextBay-Marktplatz an.</CardDescription>
                </CardHeader>

                <form action={formAction}>
                    <CardContent className="space-y-4">
                        {state?.error && (
                            <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive font-medium">
                                {state.error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label htmlFor="title" className="text-sm font-medium">Titel des Artikels</label>
                            <Input id="title" name="title" type="text" placeholder="z. B. Unknackbares Kryptofon" required disabled={isPending} />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="description" className="text-sm font-medium">Beschreibung</label>
                            <Textarea id="description" name="description" placeholder="Zustand und Herkunft..." rows={4} required disabled={isPending} />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="startPrice" className="text-sm font-medium">Startpreis (€)</label>
                                <Input id="startPrice" name="startPrice" type="number" min="1" placeholder="100" required disabled={isPending} />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="endDate" className="text-sm font-medium">Auktionsende</label>
                                <Input id="endDate" name="endDate" type="datetime-local" min={getMinDateTime()} required disabled={isPending} />
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter className="flex justify-end gap-3 border-t border-border pt-4">
                        <Button type="submit" className="w-full sm:w-auto" disabled={isPending}>
                            {isPending ? "Erstelle Auktion..." : "Auktion veröffentlichen"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}