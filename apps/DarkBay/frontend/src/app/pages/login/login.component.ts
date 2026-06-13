import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage: string | null = null;
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  onSubmit(): void {
    if (!this.username || !this.password) {
      this.errorMessage = 'Trage gefälligst deinen Piratennamen und das Passwort ein!';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    this.authService.login(this.username, this.password).subscribe({
      next: (res) => {
        console.log('Erfolgreich eingeloggt! Token an Bord.', res);
        this.isLoading = false;
        // Nach dem Login direkt zur Piratenbucht (Auktionsliste) segeln!
        this.router.navigate(['/auctions']);
      },
      error: (err) => {
        console.error('Login-Fehler:', err);
        this.isLoading = false;
        // Fehlermeldung vom NestJS-Backend abfangen
        this.errorMessage =
          err.error?.message || 'Der Hafenmeister verweigert den Zutritt (Falsche Daten).';
      },
    });
  }
}
