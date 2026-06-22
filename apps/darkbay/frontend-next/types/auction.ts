export interface Auction {
    id: number;
    title: string;
    description: string;
    startPrice: number;
    currentPrice: number;
    endDate: string;
}

export interface Offer {
    id: number;
    auctionId: number;
    amount: number;
    bidder: string;
    createdAt: string;
}