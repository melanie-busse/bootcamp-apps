import Link from "next/link"

import { getAuctions } from "@/lib/auctionsService"
import { Auction } from "@/types/auction"

export default async function HomePage() {
  const rawData = await getAuctions()
  const auctions: Auction[] = rawData?.items || []

  return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10 max-w-7xl mx-auto px-4 mt-4 md:mt-6 lg:mt-12">
          {auctions.map((auction) => (
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
                              <span>Startpreis: <span className="font-black text-amber-900">{auction.startPrice} €</span></span>
                              <span className="text-red-700 font-black text-base">Aktuell: {auction.currentPrice} €</span>
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
  )
}