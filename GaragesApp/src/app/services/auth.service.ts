import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, catchError, map, Observable, tap } from 'rxjs';
import { DecodedToken, LoginData, RegisterData } from '../components/auth/auth-model/auth.model';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private loggedIn = new BehaviorSubject<boolean>(false);
  private currentUserSubject = new BehaviorSubject<DecodedToken | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  public isLoggedIn$ = this.currentUser$.pipe(map(user => !!user));

  constructor(private http: HttpClient) {
    this.loadUserFromToken();
  }

  private mapDecodedToken(token: any) {
  return {
    id: token["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"],
    username: token["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
    email: token["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"],
    role: token["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
    exp: token.exp
  };
}


  loadUserFromToken(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this.currentUserSubject.next(null);
      return;
    }

    const rawDecoded = this.decodeToken(token);
    const decodedToken = this.mapDecodedToken(rawDecoded);

    if (!decodedToken || this.isTokenExpired(decodedToken.exp)) {
      this.logout();
    } else {
      this.currentUserSubject.next(decodedToken);
    }
  }

  register(data: RegisterData): Observable<any> { //tipar o Observable com um tipo mais específico que any.
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  login(data: LoginData): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data).pipe(
      tap((response: any) => {
        const token = response.token;
        if (!token) return;

        localStorage.setItem('token', token);

        const rawDecoded = this.decodeToken(token);
        const decodedToken = this.mapDecodedToken(rawDecoded);

        if (decodedToken) {
          this.currentUserSubject.next(decodedToken);
          this.setLoggedIn(true);

          // Armazena infos adicionais
          localStorage.setItem('role', decodedToken.role);
          localStorage.setItem('username', decodedToken.username);
          localStorage.setItem('email', decodedToken.email || '');
        }
      }),
      catchError(error => {
        this.currentUserSubject.next(null);
        throw error;
      })
    );
  }

  setCurrentUser(user: DecodedToken): void {
    this.currentUserSubject.next(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  getCurrentUser(): DecodedToken | null {
    return this.currentUserSubject.value;
  }

  isAdmin(): Observable<boolean> {
    return this.currentUser$.pipe(
      map(user => user?.['role'] === 'admin')
    );
  }

  isLoggedIn(): Observable<boolean> {
    return this.currentUser$.pipe(
      map(user => !!user)
    );
  }

  // não é sempre necessário se já usa currentUser
  setLoggedIn(value: boolean) {
    this.loggedIn.next(value);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('avatarUrl');
    localStorage.removeItem('email');
    this.currentUserSubject.next(null);
    this.loggedIn.next(false);
  }

  private decodeToken(token: string): DecodedToken | null {
    try {
      return jwtDecode<DecodedToken>(token);
    } catch (error) {
      return null;
    }
  }

  private isTokenExpired(exp: number): boolean {
    if(!exp) {
      return true; // Se não houver expiração, consideramos o token expirado
    }
    const currentTime = Date.now() / 1000;
    return exp < currentTime;
  }
}
