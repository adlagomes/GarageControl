import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-page.component',
  imports: [CommonModule],
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent implements OnInit {
  isAdmin: boolean = false;
  username: string = '';

  constructor(public authService: AuthService, private http: HttpClient) {}

  ngOnInit(): void {
  const user = this.authService.getCurrentUser();

  if (user) {
    this.username = user.username;
    this.isAdmin = user.role === 'admin';
  } else {
    // Se o perfil ainda não foi carregado, buscar manualmente:
      this.http.get<any>('https://localhost:7160/api/auth/profile').subscribe({
        next: (response) => {
          this.authService.setCurrentUser(response);
          this.username = response.username;
          this.isAdmin = response.role === 'admin';
        },
        error: () => {
          this.username = '';
          this.isAdmin = false;
        }
      });
    }
  }
}
