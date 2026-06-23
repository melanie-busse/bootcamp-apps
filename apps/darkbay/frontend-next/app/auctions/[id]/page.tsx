import { notFound } from "next/navigation"

import { getAuctionById, getOffersForAuction } from "@/lib/auctionsService"
import { isAuthenticated } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import BidForm from "@/components/BidForm"
import { getWatchlist } from "@/lib/watchlistActions"
import { WatchlistButton } from "@/components/WatchlistButton"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function AuctionDetailPage({ params }: PageProps) {
  const { id } = await params
  const auctionIdNumeric = Number(id)

  let auction
  let offers = []
  let isWatched = false
  const loggedIn = await isAuthenticated()

  try {
    const [auctionData, offersData, watchlist] = await Promise.all([
      getAuctionById(id),
      getOffersForAuction(id),
      getWatchlist(),
    ])

    auction = auctionData
    offers = Array.isArray(offersData) ? offersData : []

    isWatched = watchlist.some((item: any) => item.id === auctionIdNumeric)
  } catch (error) {
    notFound()
  }

  return (
    <div className="container mx-auto p-6 max-w-5xl space-y-8 ">
      {/* Hier ist die korrekte min-h-[800px] und die gefixte Background-Size */}
      <div className="w-full bg-[url('/images/pergament.jpg')] bg-[length:100%_100%] bg-no-repeat shadow-2xl pt-32 pb-16 px-12 md:px-24 min-h-[800px] flex flex-col justify-between relative">
        <Card className="border-none bg-transparent shadow-none h-full flex flex-col grow">
          <CardHeader className="p-0 pb-6 relative shrink-0">
            {loggedIn && (
              <div className="flex justify-end w-full absolute top-0 right-0 z-10">
                <WatchlistButton auctionId={auctionIdNumeric} initialIsWatched={isWatched} />
              </div>
            )}

            <div className="pt-20 ps-10 pe-10 border-b border-stone-900/10 pb-4 w-full">
              <CardTitle className="text-2xl md:text-4xl font-black text-[#8B1E0F] uppercase tracking-wide">
                {auction.title}
              </CardTitle>
            </div>

            <CardDescription className="ps-10 text-stone-700 font-bold text-sm tracking-wide">
              Endet am: {new Date(auction.endDate).toLocaleString("de-DE")}
            </CardDescription>
          </CardHeader>

          <CardContent className="p-0 ps-10 flex flex-col pe-10 md:flex-row justify-between items-start gap-8 mt-2 grow">
            <div className="space-y-2 bg-stone-900/5 p-5 rounded-2xl border border-stone-900/5 flex-1 w-full">
              <p className=" text-stone-900 font-medium leading-relaxed whitespace-pre-wrap text-base">
                {auction.description}
              </p>
            </div>

            <div className="w-full md:w-auto text-center bg-stone-900/5 py-5 px-4 rounded-2xl border border-stone-900/10 backdrop-blur-xs min-w-[170px] md:max-w-[200px] shrink-0 flex flex-col justify-center items-center">
              <p className="text-xs uppercase tracking-wider text-stone-600 font-bold leading-none mb-1">
                Aktuelles Gebot
              </p>
              <p className="text-3xl font-black text-[#8B1E0F] my-1">{auction.currentPrice} €</p>
              <p className="text-xs text-stone-600 font-bold border-t border-stone-900/10 pt-2 mt-1 w-full text-center">
                Startpreis: {auction.startPrice} €
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card
          className="border-none bg-cover bg-center bg-no-repeat text-stone-100 shadow-xl p-6 rounded-2xl border border-stone-800"
          style={{ backgroundImage: "url('/images/schiefer-hintergrund.jpg')" }}
        >
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-xl font-bold text-amber-500 uppercase tracking-wide">
              Gebot abgeben
            </CardTitle>
            <CardDescription className="text-stone-300 font-medium">
              Biete mehr als das aktuelle Gebot von{" "}
              <span className="text-amber-400 font-bold">{auction.currentPrice} €</span>.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 mt-2">
            {loggedIn ? (
              <BidForm auctionId={auction.id} currentPrice={auction.currentPrice} />
            ) : (
              <p className="text-sm text-stone-400 italic font-medium">
                Du musst eingeloggt sein, um auf diese Auktion bieten zu können.
              </p>
            )}
          </CardContent>
        </Card>

        <Card
          className="border-none bg-cover bg-center bg-no-repeat text-stone-100 shadow-xl p-6 rounded-2xl border border-stone-800"
          style={{ backgroundImage: "url('/images/schiefer-hintergrund.jpg')" }}
        >
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-xl font-bold text-amber-500 uppercase tracking-wide">
              Gebotshistorie
            </CardTitle>
            <CardDescription className="text-stone-300 font-medium">
              Bisherige Gebote für diesen Artikel
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 mt-2">
            {offers.length === 0 ? (
              <p className="text-sm text-stone-400 italic font-medium py-2">
                Noch keine Gebote abgegeben.
              </p>
            ) : (
              /* max-h-300 wurde hier zu max-h-[300px] korrigiert */
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-stone-700">
                {offers.map((offer: any) => (
                  <div
                    key={offer.id}
                    className="flex justify-between items-center p-3 rounded-xl bg-stone-950/40 border border-stone-800/60 text-stone-200"
                  >
                    <div>
                      <span className="font-bold block text-stone-100">
                        Bieter #{offer.bidder || "Anonym"}
                      </span>
                      <span className="text-xs text-stone-400">
                        {new Date(offer.createdAt).toLocaleString("de-DE")}
                      </span>
                    </div>
                    <span className="font-black text-amber-400 text-lg">{offer.amount} €</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
