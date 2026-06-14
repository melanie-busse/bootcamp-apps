import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuctionService } from '../../services/auction.service';
import { Auction } from '../../models/auction.model';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-watchlist',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './watchlist.component.html',
  styleUrl: './watchlist.component.css',
})
export class WatchlistComponent implements OnInit {
  allAuctions: Auction[] = [];
  watchlistAuctions: Auction[] = [];
  watchlistIds = new Set<number>();
  errorMessage: string | null = null;

  constructor(
    private auctionService: AuctionService,
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    // 1. Erst Auktionen holen
    this.auctionService.getAuctions().subscribe({
      next: (data: any) => {
        if (data && data.items) {
          this.allAuctions = data.items;
          // 2. Direkt danach die Watchlist holen
          this.fetchWatchlist();
        }
      },
      error: (err) => console.error('Fehler beim Laden der Auktionen:', err),
    });
  }

  fetchWatchlist(): void {
    this.userService.getWatchlist().subscribe({
      next: (res: any) => {
        this.watchlistIds.clear();
        const items = res?.watchlist || (Array.isArray(res) ? res : []);

        if (Array.isArray(items)) {
          items.forEach((item: any) => {
            const id = item.auctionId || item.id || (typeof item === 'number' ? item : null);
            if (id) this.watchlistIds.add(id);
          });
        }

        // 3. Filtern, sodass wir nur die gemerkten Auktionen behalten
        this.filterWatchlist();
      },
      error: (err) => console.error('Fehler beim Laden der Watchlist:', err),
    });
  }

  filterWatchlist(): void {
    this.watchlistAuctions = this.allAuctions.filter((auction) =>
      this.watchlistIds.has(auction.id),
    );
    this.cdr.detectChanges();
  }

  toggleWatchlist(auctionId: number): void {
    // Da wir auf der Merklisten-Seite sind, werfen wir das Item bei Klick direkt runter
    this.userService.removeFromWatchlist(auctionId).subscribe({
      next: () => {
        console.log(`⚓ Auktion ${auctionId} entfernt.`);
        this.watchlistIds.delete(auctionId);
        // Liste sofort reaktiv aktualisieren
        this.filterWatchlist();
      },
      error: (err) => console.error('Fehler beim Entfernen:', err),
    });
  }

  submitBid(auctionId: number, inputElement: HTMLInputElement): void {
    const amount = Number(inputElement.value);
    this.errorMessage = null;

    if (!amount || amount <= 0) {
      this.errorMessage = 'Bitte gib ein gültiges Gold-Gebot ab!';
      this.cdr.detectChanges();
      return;
    }

    this.auctionService.postOffer(auctionId, amount).subscribe({
      next: (savedOffer) => {
        const auction = this.watchlistAuctions.find((a) => a.id === auctionId);
        if (auction) {
          auction.currentPrice = amount;
        }
        inputElement.value = '';
        this.errorMessage = null;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || err.message || 'Gebot abgelehnt.';
        this.cdr.detectChanges();
      },
    });
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
