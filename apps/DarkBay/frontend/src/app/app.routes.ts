import { Routes } from '@angular/router';
import { AuctionListComponent } from './pages/auction-list/auction-list.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { authGuard } from './core/guards/auth-guard';


export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'auctions', component: AuctionListComponent, canActivate: [authGuard] },
  {
    path: 'auctions/create',
    loadComponent: () =>
      import('./pages/auction-create/auction-create.component').then(
        (m) => m.AuctionCreateComponent,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'auctions/:id',
    loadComponent: () =>
      import('./pages/auction-detail/auction-detail.component').then(
        (m) => m.AuctionDetailComponent,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'watchlist',
    loadComponent: () =>
      import('./pages/watchlist/watchlist.component').then((m) => m.WatchlistComponent),
    canActivate: [authGuard],
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];
