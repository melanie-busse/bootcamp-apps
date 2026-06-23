"use client"

import React, { useActionState } from "react"
import Link from "next/link"

import { registerAction } from "@/lib/authActions"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(registerAction, null)

  const inputClasses =
    "bg-stone-950/60 border-stone-700 text-stone-100 placeholder:text-stone-500 focus-visible:ring-amber-500 focus-visible:border-amber-500 rounded-xl"

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card
        className="w-full max-w-md border-none bg-cover bg-center bg-no-repeat text-stone-100 shadow-2xl rounded-2xl border border-stone-800"
        style={{ backgroundImage: "url('/images/schiefer-hintergrund.jpg')" }}
      >
        <CardHeader className="p-6 sm:p-8 pb-4 text-center">
          <CardTitle className="text-2xl font-black uppercase tracking-wide text-amber-500">
            Konto erstellen
          </CardTitle>
          <CardDescription className="text-stone-300 font-medium mt-1">
            Erstelle eine anonyme Identität für NextBay.
          </CardDescription>
        </CardHeader>

        <form action={formAction}>
          <CardContent className="space-y-5 p-6 sm:p-8 pt-0">
            {state?.error && (
              <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-sm text-rose-400 font-semibold text-center">
                {state.error}
              </div>
            )}

            <div className="space-y-2">
              <label
                htmlFor="username"
                className="block mb-2 text-xs uppercase tracking-wider text-stone-300 font-bold"
              >
                Benutzername
              </label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="Wähle dein Pseudonym"
                required
                disabled={isPending}
                className={inputClasses}
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block mb-2 text-xs uppercase tracking-wider text-stone-300 font-bold"
              >
                Passwort
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                disabled={isPending}
                className={inputClasses}
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4 p-6 sm:p-8 pt-0">
            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-amber-500 hover:bg-amber-600 text-stone-950 font-black uppercase tracking-wider py-3 rounded-xl shadow-md transition-all text-sm transform hover:scale-[1.01]"
            >
              {isPending ? "Registriere..." : "Konto erstellen"}
            </Button>

            <p className="text-xs text-center text-stone-300 font-medium">
              Bereits registriert?{" "}
              <Link
                href="/login"
                className="text-amber-500 font-bold underline hover:text-amber-300 transition-colors"
              >
                Hier einloggen
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
