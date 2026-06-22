import { notFound } from "next/navigation";

import { getAuctionById, getOffersForAuction } from "@/lib/auctionsService";
import { isAuthenticated } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import BidForm from "@/components/BidForm";
import { getWatchlist } from "@/lib/watchlistActions";
import { WatchlistButton } from "@/components/WatchlistButton"; // <-- Import hinzufügen!

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function AuctionDetailPage({ params }: PageProps) {
    const { id } = await params;
    const auctionIdNumeric = Number(id); // <-- Zu Number konvertieren für den DTO-Vergleich

    let auction;
    let offers = [];
    let isWatched = false; // <-- Hier oben definieren
    const loggedIn = await isAuthenticated();

    try {
        // Paralleles Laden aller Serverdaten
        const [auctionData, offersData, watchlist] = await Promise.all([
            getAuctionById(id),
            getOffersForAuction(id),
            getWatchlist() // <-- Läuft jetzt auch parallel mit!
        ]);

        auction = auctionData;
        offers = Array.isArray(offersData) ? offersData : [];

        // Jetzt greift der Vergleich sauber mit Zahlen
        isWatched = watchlist.some((item: any) => item.id === auctionIdNumeric);
    } catch (error) {
        notFound();
    }

    return (
        <div className="container mx-auto p-6 max-w-4xl space-y-6">
            <Card className="border-border bg-card">
                <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                        <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-3">
                                <CardTitle className="text-3xl font-bold">{auction.title}</CardTitle>
                                {/* Wenn der User eingeloggt ist, zeigen wir den Merklisten-Button */}
                                {loggedIn && (
                                    <WatchlistButton
                                        auctionId={auctionIdNumeric}
                                        initialIsWatched={isWatched}
                                    />
                                )}
                            </div>
                            <CardDescription className="text-sm">
                                Endet am: {new Date(auction.endDate).toLocaleString("de-DE")}
                            </CardDescription>
                        </div>
                        <div className="text-left sm:text-right">
                            <p className="text-sm text-muted-foreground">Aktuelles Gebot</p>
                            <p className="text-3xl font-extrabold text-primary">{auction.currentPrice} €</p>
                            <p className="text-xs text-muted-foreground mt-1">Startpreis: {auction.startPrice} €</p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                        {auction.description}
                    </p>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-border bg-card h-fit">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold">Gebot abgeben</CardTitle>
                        <CardDescription>
                            Biete mehr als das aktuelle Gebot von {auction.currentPrice} €.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loggedIn ? (
                            <BidForm auctionId={auction.id} currentPrice={auction.currentPrice} />
                        ) : (
                            <p className="text-sm text-muted-foreground italic">
                                Du musst eingeloggt sein, um auf diese Auktion bieten zu können.
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* Liste der bisherigen Gebote */}
                <Card className="border-border bg-card">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold">Gebotshistorie</CardTitle>
                        <CardDescription>Bisherige Gebote für diesen Artikel</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {offers.length === 0 ? (
                            <p className="text-sm text-muted-foreground italic">Noch keine Gebote abgegeben.</p>
                        ) : (
                            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                                {offers.map((offer: any) => (
                                    <div key={offer.id} className="flex justify-between items-center p-3 rounded-md bg-muted/50 border border-border text-sm">
                                        <div>
                                            <span className="font-semibold block">Bieter #{offer.bidder || "Anonym"}</span>
                                            <span className="text-xs text-muted-foreground">
                                                {new Date(offer.createdAt).toLocaleString("de-DE")}
                                            </span>
                                        </div>
                                        <span className="font-bold text-foreground text-base">{offer.amount} €</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}