import React from "react"
import Link from "next/link"

import { getWatchlist } from "@/lib/watchlistActions"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { buttonVariants } from "@/components/ui/button"

export const revalidate = 0 // Kein Cache, immer live laden

export default async function WatchlistPage() {
  const watchlist = await getWatchlist()

  return (
    <div className="container mx-auto p-6 min-h-[calc(100vh-8rem)]">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Meine Merkliste</h1>
        <p className="text-muted-foreground">
          Hier behältst du deine favorisierte Schmuggelware im Auge.
        </p>
      </div>

      {watchlist.length === 0 ? (
        <Card className="border-dashed border-2 bg-card/50 flex flex-col items-center justify-center p-12 text-center">
          <CardTitle className="text-xl mb-2">Deine Merkliste ist noch leer</CardTitle>
          <CardDescription className="mb-4">
            Stöbere auf dem Marktplatz und merke dir interessante Auktionen.
          </CardDescription>
          <Link href="/" className={buttonVariants({ variant: "default" })}>
            Zum Marktplatz
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {watchlist.map((auction: any) => (
            <Card key={auction.id} className="flex flex-col border-border bg-card shadow-md">
              <CardHeader>
                <CardTitle className="text-xl line-clamp-1">{auction.title}</CardTitle>
                <CardDescription>
                  Endet am: {new Date(auction.endDate).toLocaleString("de-DE")}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-1">
                <div className="text-sm font-medium text-muted-foreground mb-1">
                  Aktuelles Gebot
                </div>
                <div className="text-3xl font-extrabold text-primary">{auction.currentPrice} €</div>
              </CardContent>

              <CardFooter className="border-t border-border pt-4 bg-muted/20">
                <Link
                  href={`/auctions/${auction.id}`}
                  className={buttonVariants({ variant: "outline", className: "w-full" })}
                >
                  Auktion ansehen
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
