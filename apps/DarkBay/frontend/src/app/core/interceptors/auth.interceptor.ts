import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Holzhammer-Log: Das MUSS jetzt bei jedem Klick im Terminal/Konsole auftauchen!
  console.log('⚓ [Interceptor-Kontrollzentrum] Anfrage registriert nach:', req.url);

  const token = localStorage.getItem('token');

  if (token) {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json', // Sicherstellen, dass der Content-Type mitsortiert wird
      },
    });
    console.log(`-> 🔑 Token erfolgreich an ${req.url} angehängt.`);
    return next(clonedReq);
  }

  console.warn(`-> ⚠️ Kein Token im LocalStorage gefunden für ${req.url}`);
  return next(req);
};
