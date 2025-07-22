// import { Injectable } from '@angular/core';
// import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
// import { Observable } from 'rxjs';
// import { map, take } from 'rxjs/operators';
// import { AuthService } from '../services/auth.service'; // Ajuste o caminho

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthGuard implements CanActivate {

//   constructor(private authService: AuthService, private router: Router) {}

//   canActivate(
//     route: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot): Observable<boolean | UrlTree> {

//     // Verifique se a rota requer a role 'admin'
//     const requiresAdmin = route.data && route.data['roles'] && route.data['roles'].includes('admin');

//     return this.authService.currentUser$.pipe(
//       take(1), // Pegue apenas o valor atual e complete o observable
//       map(user => {
//         const isLoggedIn = !!user; // Verdadeiro se houver alguma role (usuário logado)

//         if (!isLoggedIn) {
//           // Se não estiver logado, redireciona para a página de login
//           this.router.navigate(['/login']);
//           return false;
//         }

//         if (requiresAdmin && user?.role !== 'admin') {
//           // Se a rota exige admin E o usuário NÃO é admin, redireciona para /profile
//           this.router.navigate(['/profile']); // Ou para uma página de "acesso negado"
//           return false;
//         }

//         // Se logado e tem a role necessária (ou a rota não exige role específica)
//         return true;
//       })
//     );
//   }
// }


import { Injectable, inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn ,Router, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "../services/auth.service";

export const AuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.getCurrentUser();

  if (user && user.role === 'admin') {
    return true;
  }

  router.navigate(['/profile']);
  return false;
}