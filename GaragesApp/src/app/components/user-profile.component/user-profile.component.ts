import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-user-profile.component',
  imports: [CommonModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit {
  user = {
    username: '',
    email: '',
    avatarUrl: ''
  };

  constructor(private authService: AuthService, private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any>('https://localhost:7160/api/auth/profile').subscribe({
      next: (response) => {
        this.user.username = response.username;
        this.user.email = response.email;
        this.user.avatarUrl = '';
        // this.authService.setCurrentUser(response);
      },
      error: (err) => {
        console.log('Erro ao carregar perfil:', err);
      }
    })
  }
}
