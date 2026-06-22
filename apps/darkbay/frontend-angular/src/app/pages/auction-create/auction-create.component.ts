import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuctionService } from '../../services/auction.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auction-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './auction-create.component.html',
  styleUrl: './auction-create.component.css',
})
export class AuctionCreateComponent {
  // Das Modell für unsere neue Beute
  auctionData = {
    title: '',
    description: '',
    startPrice: 0,
    endDate: '',
  };

  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private auctionService: AuctionService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  onSubmit(): void {
    this.errorMessage = null;
    this.successMessage = null;

    // Kleiner Sicherheitscheck auf hoher See
    if (
      !this.auctionData.title ||
      !this.auctionData.description ||
      this.auctionData.startPrice <= 0 ||
      !this.auctionData.endDate
    ) {
      this.errorMessage = 'Trage alle Daten ein, sonst kentert die Auktion!';
      return;
    }

    // Abfeuern an das NestJS-Backend via POST /auctions
    // Abfeuern an das NestJS-Backend via POST /auctions
    this.auctionService.createAuction(this.auctionData).subscribe({
      next: (res: any) => { // <-- Hier explizit : any ergänzen
        this.successMessage = '🏴‍☠️ Die Auktion wurde erfolgreich in der Bucht ausgesetzt!';
        this.cdr.detectChanges();

        // Nach 2 Sekunden segeln wir automatisch zurück zur Übersicht
        setTimeout(() => {
          this.router.navigate(['/auctions']);
        }, 2000);
      },
      error: (err: any) => { // <-- Hier ebenfalls : any ergänzen
        this.errorMessage = err.error?.message || err.message || 'Fehler beim Erstellen der Auktion.';
        this.cdr.detectChanges();
      }
    });
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
