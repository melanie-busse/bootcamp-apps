import React from "react"
import Link from "next/link"

import { getWatchlist } from "@/lib/watchlistActions"

export const revalidate = 0 // Kein Cache, immer live laden

export default async function WatchlistPage() {
  const watchlist = await getWatchlist()

  return (
    <div className="container mx-auto p-6 min-h-[calc(100vh-8rem)] max-w-7xl">
      <div className="mb-8 max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-black tracking-wide uppercase text-amber-500">
          Meine Merkliste
        </h1>
        <p className="text-stone-100 font-bold mt-1 text-sm md:text-base [text-shadow:_0_2px_4px_rgba(0,0,0,0.8)]">
          Hier behältst du deine favorisierte Schmuggelware im Auge.
        </p>
      </div>

      {watchlist.length === 0 ? (
        <div className="max-w-7xl mx-auto px-4">
          <div className="relative flex flex-col justify-center items-center overflow-hidden shadow-2xl bg-[url('/images/pergament.jpg')] bg-[length:100%_100%] bg-no-repeat bg-center rounded-3xl p-8 text-center min-h-[520px]">
            <div className="w-[82%] mx-auto flex flex-col justify-center items-center h-full pt-8">
              <h2 className="mt-12 text-2xl font-black mb-2 text-red-800 uppercase tracking-wide">
                Deine Merkliste ist noch leer
              </h2>
              <p className="text-base text-amber-950 font-semibold mb-8 px-4 leading-relaxed max-w-md">
                Stöbere auf dem Marktplatz und merke dir interessante Auktionen.
              </p>
              <Link
                href="/"
                className="inline-block w-[35%] text-center bg-[#A04024] text-amber-300 py-3 rounded-xl hover:bg-[#B84A2A] transition-all text-sm font-black uppercase tracking-widest shadow-lg"
              >
                Zum Marktplatz
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10 max-w-7xl mx-auto px-4 mt-4 md:mt-6 lg:mt-12">
          {watchlist.map((auction: any) => (
            <div
              key={auction.id}
              className="relative flex flex-col justify-between overflow-hidden shadow-2xl bg-[url('/images/pergament.jpg')] bg-[length:100%_100%] bg-no-repeat bg-center rounded-3xl p-8 text-center min-h-[520px] animate-in fade-in duration-300 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
            >
              <div className="w-[82%] mx-auto flex flex-col justify-between h-full pt-8">
                <div>
                  <h2 className="mt-20 text-2xl font-black mb-1 text-red-800 uppercase tracking-wide line-clamp-2">
                    {auction.title}
                  </h2>

                  <hr className="border-t border-dashed border-amber-950/40 my-4" />

                  <p className="text-base text-amber-950 font-semibold line-clamp-5 mb-4 px-4 leading-relaxed">
                    {auction.description}
                  </p>
                </div>

                <div className="mt-auto pb-16">
                  <div className="flex justify-between items-center text-sm font-extrabold uppercase tracking-wider text-amber-950 mb-5 px-12">
                    <span>
                      Startpreis:{" "}
                      <span className="font-black text-amber-900">{auction.startPrice} €</span>
                    </span>
                    <span className="text-red-700 font-black text-base">
                      Aktuell: {auction.currentPrice} €
                    </span>
                  </div>

                  <div className="flex justify-center">
                    <Link
                      href={`/auctions/${auction.id}`}
                      className="inline-block w-[55%] mx-auto text-center bg-[#A04024] text-amber-300 py-3 rounded-xl hover:bg-[#B84A2A] hover:text-amber-300 transition-all text-sm font-black uppercase tracking-widest shadow-lg transform hover:scale-[1.01]"
                    >
                      Auktion ansehen
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
