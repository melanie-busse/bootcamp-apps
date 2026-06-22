"use client";

import React, { useState, useTransition } from "react";
import { usePathname } from "next/navigation";
import { addToWatchlistAction, removeFromWatchlistAction } from "@/lib/watchlistActions";
import { Button } from "@/components/ui/button";

interface WatchlistButtonProps {
    auctionId: number;
    initialIsWatched: boolean;
}

export function WatchlistButton({ auctionId, initialIsWatched }: WatchlistButtonProps) {
    const [isWatched, setIsWatched] = useState(initialIsWatched);
    const [isPending, startTransition] = useTransition();
    const pathname = usePathname();

    const handleToggle = () => {
        startTransition(async () => {
            if (isWatched) {
                const res = await removeFromWatchlistAction(auctionId, pathname);
                if (res.success) setIsWatched(false);
            } else {
                const res = await addToWatchlistAction(auctionId, pathname);
                if (res.success) setIsWatched(true);
            }
        });
    };

    return (
        <Button
            variant={isWatched ? "destructive" : "secondary"}
            onClick={handleToggle}
            disabled={isPending}
            className="w-full sm:w-auto"
        >
            {isPending ? "Lädt..." : isWatched ? "❌ Von Merkliste entfernen" : "⭐ Auf die Merkliste"}
        </Button>
    );
}