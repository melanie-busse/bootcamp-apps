"use client"

import React, { useActionState } from "react"

import { createAuctionAction } from "@/lib/auctionActions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function CreateAuctionPage() {
  const [state, formAction, isPending] = useActionState(createAuctionAction, null)

  const getMinDateTime = () => {
    const now = new Date()
    now.setHours(now.getHours() + 1)
    return now.toISOString().slice(0, 16)
  }

  const inputClasses =
    "bg-stone-950/60 border-stone-700 text-stone-100 placeholder:text-stone-500 focus-visible:ring-amber-500 focus-visible:border-amber-500 rounded-xl"

  return (
    <div className="container mx-auto flex items-center justify-center p-6 min-h-[calc(100vh-8rem)]">
      <Card
        className="w-full max-w-xl border-none bg-cover bg-center bg-no-repeat text-stone-100 shadow-2xl rounded-2xl border border-stone-800"
        style={{ backgroundImage: "url('/images/schiefer-hintergrund.jpg')" }}
      >
        <CardHeader className="p-6 sm:p-8 pb-4">
          <CardTitle className="text-2xl font-black uppercase tracking-wide text-amber-500">
            Neue Auktion starten
          </CardTitle>
          <CardDescription className="text-stone-300 font-medium mt-1">
            Biete deine Schmuggelware auf dem NextBay-Marktplatz an.
          </CardDescription>
        </CardHeader>

        <form action={formAction}>
          <CardContent className="space-y-5 p-6 sm:p-8 pt-0">
            {state?.error && (
              <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-sm text-rose-400 font-semibold">
                {state.error}
              </div>
            )}

            <div className="space-y-2">
              <label
                htmlFor="title"
                className="block mb-2 text-xs uppercase tracking-wider text-stone-300 font-bold"
              >
                Titel des Artikels
              </label>
              <Input
                id="title"
                name="title"
                type="text"
                placeholder="z. B. Unknackbares Kryptofon"
                required
                disabled={isPending}
                className={inputClasses}
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="description"
                className="block mb-2 text-xs uppercase tracking-wider text-stone-300 font-bold"
              >
                Beschreibung
              </label>
              <Textarea
                id="description"
                name="description"
                placeholder="Zustand und Herkunft..."
                rows={4}
                required
                disabled={isPending}
                className={inputClasses}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label
                  htmlFor="startPrice"
                  className="block mb-2 text-xs uppercase tracking-wider text-stone-300 font-bold"
                >
                  Startpreis (€)
                </label>
                <Input
                  id="startPrice"
                  name="startPrice"
                  type="number"
                  min="1"
                  placeholder="100"
                  required
                  disabled={isPending}
                  className={inputClasses}
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="endDate"
                  className="block mb-2 text-xs uppercase tracking-wider text-stone-300 font-bold"
                >
                  Auktionsende
                </label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="datetime-local"
                  min={getMinDateTime()}
                  required
                  disabled={isPending}
                  className={inputClasses}
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-end gap-3 border-t border-stone-800/60 p-6 sm:p-8 pt-4">
            <Button
              type="submit"
              disabled={isPending}
              className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-stone-950 font-black uppercase tracking-wider py-3 px-6 rounded-xl shadow-md transition-all text-sm transform hover:scale-[1.01]"
            >
              {isPending ? "Erstelle Auktion..." : "Auktion veröffentlichen"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
