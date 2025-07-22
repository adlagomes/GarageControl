// src/app/guards/redirect.guard.ts

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class RedirectGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const user = this.authService.getCurrentUser();

    if (user?.['role'] === 'admin') {
      this.router.navigate(['/admin']);
    } else if (user) {
      this.router.navigate(['/profile']);
    } else {
      this.router.navigate(['/login']);
    }

    return false; // Impede a ativação da rota atual
  }
}
