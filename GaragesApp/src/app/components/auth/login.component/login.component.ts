import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required ]
    });
  }

  onSubmit(): void {
    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        localStorage.setItem('authToken', response.token);

        this.http.get<any>(`${environment.apiUrl}/profile`).subscribe({
          next: (user) => {
            this.authService.setCurrentUser(user);

            if (user.role === 'admin') {
              this.router.navigate(['/admin']);
            } else {
              this.router.navigate(['/profile']);
            }
          },
          error: () => {
            this.errorMessage  = 'Não foi possível obter os dados do usuário.';
            this.successMessage = '';
          }
        });
      },
      error: (err) => {
        this.errorMessage = err.error?.message || err.error || 'Falha no login.';
        this.successMessage = '';
      }
    });
  }
}
    
