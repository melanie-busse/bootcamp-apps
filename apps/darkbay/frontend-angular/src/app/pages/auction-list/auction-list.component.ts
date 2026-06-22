import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuctionService } from '../../services/auction.service';
import { Auction } from '../../models/auction.model';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service'; // Steht perfekt!

@Component({
  selector: 'app-auction-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './auction-list.component.html',
  styleUrl: './auction-list.component.css',
})
export class AuctionListComponent implements OnInit {
  auctions: Auction[] = [];
  watchlistIds = new Set<number>(); // Steht bereit!
  errorMessage: string | null = null;

  constructor(
    private auctionService: AuctionService,
    private userService: UserService, // Bereit zur Kaperfahrt
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    console.log('ngOnInit: Starte Laden der Auktionen und der Watchlist...');
    this.loadData();
  }

  loadData(): void {
    this.auctionService.getAuctions().subscribe({
      next: (data: any) => {
        if (data && data.items) {
          this.auctions = data.items;
          console.log('Auktionen zugewiesen:', this.auctions);

          // Sobald die Auktionen da sind, holen wir die Merkliste ab
          this.fetchWatchlist();
        }
      },
      error: (err) => {
        console.error('Fehler beim Laden der Auktionen:', err);
      },
    });
  }

  fetchWatchlist(): void {
    this.userService.getWatchlist().subscribe({
      next: (res: any) => {
        console.log('Komplette Backend-Antwort für Watchlist:', res);
        this.watchlistIds.clear();

        // Da das Log zeigt, dass die Liste in res.watchlist liegt:
        const items = res?.watchlist || (Array.isArray(res) ? res : []);

        if (Array.isArray(items)) {
          items.forEach((item: any) => {
            // Falls die Relation die Auktions-ID in 'auctionId' oder 'id' hält:
            const id = item.auctionId || item.id || (typeof item === 'number' ? item : null);
            if (id) this.watchlistIds.add(id);
          });
          console.log('Geladene Watchlist-IDs im Set:', this.watchlistIds);
        }

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Fehler beim Laden der Watchlist:', err);
      },
    });
  }

  // Die neue Methode zum Hinzufügen/Entfernen der Sterne
  toggleWatchlist(auctionId: number): void {
    if (this.watchlistIds.has(auctionId)) {
      // Wenn schon auf der Watchlist -> runter damit!
      this.userService.removeFromWatchlist(auctionId).subscribe({
        next: () => {
          console.log(`⚓ Auktion ${auctionId} von der Merkliste entfernt.`);
          this.watchlistIds.delete(auctionId);
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Fehler beim Entfernen:', err),
      });
    } else {
      // Wenn noch nicht auf der Watchlist -> ab auf die Liste!
      this.userService.addToWatchlist(auctionId).subscribe({
        next: () => {
          console.log(`⭐ Auktion ${auctionId} zur Merkliste hinzugefügt.`);
          this.watchlistIds.add(auctionId);
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Fehler beim Hinzufügen:', err),
      });
    }
  }

  submitBid(auctionId: number, inputElement: HTMLInputElement): void {
    const amount = Number(inputElement.value);
    this.errorMessage = null;
    this.cdr.detectChanges();

    if (!amount || amount <= 0) {
      this.errorMessage = 'Bitte gib ein gültiges Gold-Gebot ab!';
      this.cdr.detectChanges();
      return;
    }

    this.auctionService.postOffer(auctionId, amount).subscribe({
      next: (savedOffer) => {
        console.log('Gebot erfolgreich eingetragen:', savedOffer);
        const auction = this.auctions.find((a) => a.id === auctionId);
        if (auction) {
          auction.currentPrice = amount;
        }
        inputElement.value = '';
        this.errorMessage = null;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Biet-Fehler abgefangen:', err);
        this.errorMessage = err.error?.message || err.message || 'Gebot abgelehnt.';
        this.cdr.detectChanges();
      },
    });
  }

  onLogout(): void {
    console.log('⚓ Pirat verlässt die Taverne. Token wird über Bord geworfen...');
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
