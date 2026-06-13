import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Wir nutzen die Methode aus deinem AuthService, um zu prüfen ob das Token da ist
  if (authService.isLoggedIn()) {
    console.log('🛡️ [Route Guard]: Schlüssel gültig. Zutritt zur Piratenbucht gewährt!');
    return true; // Pirat darf passieren
  }

  // Kein Token? Abbruch und ab zum Login!
  console.warn('🛡️ [Route Guard]: Halt! Kein Zutritt ohne Token. Zurück zum Login...');
  router.navigate(['/login']);
  return false; // Route wird blockiert
};
