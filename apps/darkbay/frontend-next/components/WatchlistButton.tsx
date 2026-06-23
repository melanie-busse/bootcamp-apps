"use client"

import React, { useState, useTransition } from "react"
import { usePathname } from "next/navigation"

import { addToWatchlistAction, removeFromWatchlistAction } from "@/lib/watchlistActions"
import { Button } from "@/components/ui/button"

interface WatchlistButtonProps {
  auctionId: number
  initialIsWatched: boolean
}

export function WatchlistButton({ auctionId, initialIsWatched }: WatchlistButtonProps) {
  const [isWatched, setIsWatched] = useState(initialIsWatched)
  const [isPending, startTransition] = useTransition()
  const pathname = usePathname()

  const handleToggle = () => {
    startTransition(async () => {
      if (isWatched) {
        const res = await removeFromWatchlistAction(auctionId, pathname)
        if (res.success) setIsWatched(false)
      } else {
        const res = await addToWatchlistAction(auctionId, pathname)
        if (res.success) setIsWatched(true)
      }
    })
  }

  return (
    <Button
      variant="secondary"
      onClick={handleToggle}
      disabled={isPending}
      className={`w-full sm:w-auto font-bold rounded-xl shadow-md border transition-all transition-colors duration-200
      ${
        isWatched
          ? "bg-stone-900 text-stone-100 border-stone-800 hover:bg-stone-800"
          : "bg-stone-900 text-stone-100 border-stone-800 hover:bg-stone-800"
      }`}
    >
      {isPending ? (
        "Lädt..."
      ) : isWatched ? (
        <span className="flex items-center gap-2">
          <span className="text-rose-500 text-lg leading-none">★</span> Von Merkliste entfernen
        </span>
      ) : (
        <span className="flex items-center gap-2">
          <span className="text-amber-400 text-lg leading-none">★</span> Auf die Merkliste
        </span>
      )}
    </Button>
  )
}
