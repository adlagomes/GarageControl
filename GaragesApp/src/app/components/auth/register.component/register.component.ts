import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register.component',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;
  successMessage = '';
  errorMessage  = '';

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      email: ['']
    });
  }

  onSubmit(): void {
    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        this.successMessage = 'Registro concluído com sucesso!';
        this.errorMessage = '';
        this.registerForm.reset();
      },
      error: (err) => {
        this.errorMessage = err.error || 'Erro ao registrar.'
        this.successMessage = '';
      }
    });
  }
}
