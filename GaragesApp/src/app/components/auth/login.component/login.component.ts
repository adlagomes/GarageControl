import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

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
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required ]
    });
  }

  onSubmit(): void {
    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        this.successMessage = 'Login bem-sucedido!';
        this.errorMessage = '';
        localStorage.setItem('authToken', response.token);
        this.authService.setLoggedIn(true);
        this.router.navigate(['/profile']);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || err.error || 'Falha no login.';
        this.successMessage = '';
      }
    });
  }


}
