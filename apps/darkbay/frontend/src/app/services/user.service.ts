import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = `${environment.apiUrl}`; // Direkt auf /users gemappt

  constructor(private http: HttpClient) {}

  // 1. Eigene Merkliste abrufen (GET /users/watchlist)
  getWatchlist(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/watchlist`);
  }

  // 2. Eine Auktion zur Merkliste hinzufügen (POST /users/watchlist/{auctionId})
  addToWatchlist(auctionId: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/watchlist/${auctionId}`, {});
  }

  // 3. Eine Auktion von der Merkliste entfernen (DELETE /users/watchlist/{auctionId})
  removeFromWatchlist(auctionId: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/watchlist/${auctionId}`);
  }
}
