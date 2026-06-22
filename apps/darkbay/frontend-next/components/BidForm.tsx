"use client"

import { useActionState, useEffect, useRef } from "react"

import { placeBidAction } from "@/lib/bidActions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface BidFormProps {
  auctionId: number
  currentPrice: number
}

export default function BidForm({ auctionId, currentPrice }: BidFormProps) {
  const [state, formAction, isPending] = useActionState(placeBidAction, null)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset()
    }
  }, [state])

  return (
    <form action={formAction} ref={formRef} className="space-y-4">
      <input type="hidden" name="auctionId" value={auctionId} />
      <input type="hidden" name="currentPrice" value={currentPrice} />

      {state?.error && (
        <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive font-medium">
          {state.error}
        </div>
      )}

      {state?.success && (
        <div className="rounded-md bg-green-500/15 p-3 text-sm text-green-500 font-medium">
          Gebot erfolgreich abgegeben!
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="amount" className="text-sm font-medium">
          Dein Gebot (€)
        </label>
        <Input
          id="amount"
          name="amount"
          type="number"
          min={currentPrice + 1}
          placeholder={`${currentPrice + 5}`}
          required
          disabled={isPending}
        />
      </div>
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Sende Gebot..." : "Gebot verbindlich abgeben"}
      </Button>
    </form>
  )
}
