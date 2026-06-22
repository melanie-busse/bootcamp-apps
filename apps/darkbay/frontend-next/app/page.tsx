import Link from "next/link"

import { getAuctions } from "@/lib/auctionsService"
import { Auction } from "@/types/auction"

export default async function HomePage() {
  const rawData = await getAuctions()
  const auctions: Auction[] = rawData?.items || []

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-foreground">NextBay Marketplace</h1>

      {auctions.length === 0 ? (
        <p className="text-muted-foreground">Aktuell gibt es keine aktiven Auktionen.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {auctions.map((auction) => (
            <div
              key={auction.id}
              className="border border-border p-4 rounded-lg bg-card text-card-foreground shadow-sm animate-in fade-in duration-300"
            >
              <h2 className="text-xl font-semibold mb-2">{auction.title}</h2>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                {auction.description}
              </p>
              <div className="flex justify-between items-center text-sm mb-4">
                <span>Startpreis: {auction.startPrice} €</span>
                <span className="font-bold text-primary">Aktuell: {auction.currentPrice} €</span>
              </div>

              <Link
                href={`/auctions/${auction.id}`}
                className="inline-block w-full text-center bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/90 transition-colors text-sm font-medium"
              >
                Auktion ansehen
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
