import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterModule, Router } from '@angular/router';
import { ToastComponent } from "./components/shared/toast/toast.component";
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, ToastComponent, CommonModule, RouterModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit {
  protected title = 'GaragesApp';
  isDarkMode = false;
  themeColor: 'cyanGreen' | 'pink' | 'blue' | 'purple' = 'cyanGreen';
  showColorMenu = false;
  isLoggedIn = false;
  isAdmin = false;
  username: string = '';
  avatarUrl: string = '';

  constructor(private authService: AuthService, private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    this.isDarkMode = localStorage.getItem('darkMode') === 'true';
    
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.username = user.username;
        this.avatarUrl = user.avatarUrl || 'fa-solid fa-user-circle fa-5x';
        this.isAdmin = user.role === 'admin';
      } else {
        this.username = '';
        this.avatarUrl = 'fa-solid fa-user-circle fa-5x';
        this.isAdmin = false;
      }
    });

    if (this.isDarkMode) {
      document.body.classList.add('dark-mode');
    }

    this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
    });

    const token = localStorage.getItem('token');
    if (token) {
      this.authService.setLoggedIn(true);
    }

  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('dark-mode', this.isDarkMode);
    localStorage.setItem('darkMode', this.isDarkMode.toString());
  }

  setThemeColor(color: 'pink' | 'blue' | 'purple' | 'cyanGreen') {
    this.themeColor = color;
    localStorage.setItem('themeColor', color);
  }
}
