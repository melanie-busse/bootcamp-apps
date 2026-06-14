import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuctionService } from '../../services/auction.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auction-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './auction-detail.component.html',
  styleUrl: './auction-detail.component.css',
})
export class AuctionDetailComponent implements OnInit {
  auctionId!: number;
  auction: any = null;
  offers: any[] = [];
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private auctionService: AuctionService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    // ID aus der Route fischen (z.B. /auctions/4)
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.auctionId = Number(idParam);
      this.loadAuctionDetails();
    }
  }

  loadAuctionDetails(): void {
    // 1. Details der Auktion laden
    this.auctionService.getAuctionById(this.auctionId).subscribe({
      next: (data) => {
        this.auction = data;
        // 2. Direkt danach den Gebotsverlauf laden
        this.loadOffers();
      },
      error: (err) => {
        this.errorMessage = 'Das Relikt konnte nicht aus den Tiefen des Ozeans geborgen werden.';
        console.error(err);
      },
    });
  }

  loadOffers(): void {
    this.auctionService.getOffersForAuction(this.auctionId).subscribe({
      next: (data: any) => {
        // Falls dein Backend ein Objekt mit einem Array liefert, passe es entsprechend an
        this.offers = Array.isArray(data) ? data : data.items || [];
        // Sortieren: Höchstes/neuestes Gebot zuerst
        this.offers.sort((a, b) => b.amount - a.amount);
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Fehler beim Laden der Gebote:', err),
    });
  }

  submitBid(inputElement: HTMLInputElement): void {
    const amount = Number(inputElement.value);
    this.errorMessage = null;

    if (!amount || amount <= 0) {
      this.errorMessage = 'Bitte gib ein gültiges Gold-Gebot ab!';
      return;
    }

    this.auctionService.postOffer(this.auctionId, amount).subscribe({
      next: () => {
        // Preis direkt visuell in der UI anpassen
        if (this.auction) this.auction.currentPrice = amount;
        inputElement.value = '';
        // Gebotsliste sofort aktualisieren
        this.loadOffers();
      },
      error: (err) => {
        this.errorMessage =
          err.error?.message || err.message || 'Dein Gebot wurde von der Crew abgelehnt.';
        this.cdr.detectChanges();
      },
    });
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
