import { fetchAPI } from "./api"

export async function getAuctions() {
  return fetchAPI("/auctions")
}

export async function getAuctionById(id: string | number) {
  return fetchAPI(`/auctions/${id}`)
}

export async function getOffersForAuction(auctionId: string | number) {
  return fetchAPI(`/offers/auction/${auctionId}`)
}
