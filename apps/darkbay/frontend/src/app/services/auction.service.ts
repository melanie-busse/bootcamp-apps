import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuctionService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getAuctions(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/auctions`);
  }

  postOffer(auctionId: number, amount: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/offers`, { auctionId, amount });
  }

  createAuction(auctionData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/auctions`, auctionData);
  }

  // Holt eine einzelne Auktion anhand der ID
  getAuctionById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/auctions/${id}`);
  }

  // Holt den Gebotsverlauf aus dem offers-Bereich deines Backends
  getOffersForAuction(auctionId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/offers/auction/${auctionId}`);
  }
}
