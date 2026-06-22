import { notFound } from "next/navigation";

import { getAuctionById, getOffersForAuction } from "@/lib/auctionsService";
import { isAuthenticated } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import BidForm from "@/components/BidForm";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function AuctionDetailPage({ params }: PageProps) {
    const { id } = await params;

    let auction;
    let offers = [];
    const loggedIn = await isAuthenticated();

    try {
        // Paralleles Laden der Auktions- und Gebotsdaten
        const [auctionData, offersData] = await Promise.all([
            getAuctionById(id),
            getOffersForAuction(id)
        ]);

        auction = auctionData;
        offers = Array.isArray(offersData) ? offersData : [];
    } catch (error) {
        // Wenn die Auktion nicht existiert, Next.js 404 auslösen
        notFound();
    }

    return (
        <div className="container mx-auto p-6 max-w-4xl space-y-6">
            <Card className="border-border bg-card">
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-3xl font-bold">{auction.title}</CardTitle>
                            <CardDescription className="mt-2 text-sm">
                                Endet am: {new Date(auction.endDate).toLocaleString("de-DE")}
                            </CardDescription>
                        </div>
                        <div className="text-right">
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