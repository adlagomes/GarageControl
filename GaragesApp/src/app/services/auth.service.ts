import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

interface RegisterData {
  username: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = `https://localhost:7160/api/auth`;
  private loggedIn = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.loggedIn.asObservable();

  constructor(private http: HttpClient) { }

  register(data: RegisterData): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, data);
  }

  login(data: LoginData): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, data).pipe(
      tap((response: any) => {
        localStorage.setItem('username', response.username);
        localStorage.setItem('email', response.email);
        localStorage.setItem('token', response.token);
        this.setLoggedIn(true);
      })
    );
  }

  getCurrentUser(): { username: string; email: string } {
    return {
      username: localStorage.getItem('username') || '',
      email: localStorage.getItem('email') || ''
    };
  }

  setLoggedIn(value: boolean) {
    this.loggedIn.next(value);
  }

  logout() {
    this.loggedIn.next(false);
    localStorage.removeItem('token');
  }
}
