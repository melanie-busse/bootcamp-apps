import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router'; // RouterModule für den Link zum Login

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  username = '';
  password = '';
  successMessage: string | null = null;
  errorMessage: string | null = null;
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  onRegister(): void {
    if (!this.username || !this.password) {
      this.errorMessage = 'Ein echter Pirat braucht einen Namen und ein geheimes Passwort!';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    this.authService.register(this.username, this.password).subscribe({
      next: (res) => {
        console.log('Erfolgreich im Logbuch eingetragen!', res);
        this.isLoading = false;
        this.successMessage = 'Erfolgreich registriert! Segel werden gesetzt...';

        // Nach 2 Sekunden schicken wir den Piraten zum Login, damit er sich anmelden kann
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        console.error('Registrierungs-Fehler:', err);
        this.isLoading = false;
        this.errorMessage =
          err.error?.message || 'Der Name ist schon vergeben oder der Server streikt!';
      },
    });
  }
}
