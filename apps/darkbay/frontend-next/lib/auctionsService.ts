import { fetchAPI } from "./api";

export async function getAuctions() {
    return fetchAPI("/auctions");
}

export async function getAuctionById(id: string | number) {
    return fetchAPI(`/auctions/${id}`);
}

export async function getOffersForAuction(auctionId: string | number) {
    return fetchAPI(`/offers/auction/${auctionId}`);
}

export async function getWatchlist() {
    return fetchAPI("/users/watchlist");
}

export async function addToWatchlist(auctionId: number) {
    return fetchAPI(`/users/watchlist/${auctionId}`, { method: "POST" });
}

export async function removeFromWatchlist(auctionId: number) {
    return fetchAPI(`/users/watchlist/${auctionId}`, { method: "DELETE" });
}