import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {
  }

  // Login-Methode abschicken
  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, {username, password}).pipe(
      tap((response) => {
        console.log('[AuthService] Empfange Daten vom Backend:', response);

        // Wir prüfen BEIDE Schreibweisen, um absolut sicherzugehen!
        const token = response?.accessToken || response?.access_token;

        if (token) {
          localStorage.setItem('token', token);
          console.log(
            '[AuthService] 💾 Token wurde ERFOLGREICH im LocalStorage unter "token" abgelegt!',
          );
        } else {
          console.error(
            '[AuthService] ❌ Verdammt! Kein Token im Response-Objekt gefunden!',
            response,
          );
        }
      }),
    );
  }

  register(username: string, password: string): Observable<any> {
    // Schickt die Daten an dein NestJS-Backend, um einen neuen User in der MariaDB anzulegen
    return this.http.post<any>(`${this.baseUrl}/register`, {username, password});
  }

  // Hilfsmethode: Ist der User eingeloggt?
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  // Logout-Methode für später
  logout(): void {
    localStorage.removeItem('token');
  }
}
