import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
loginForm: FormGroup;
  showPassword = false;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      rememberMe: [false]
    });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

onSubmit(): void {
  if (this.loginForm.invalid) {
    this.loginForm.markAllAsTouched();
    return;
  }

  this.isLoading = true;
  this.errorMessage = '';

  const { email, password } = this.loginForm.value;

  this.authService.login({ email, password }).subscribe({
    next: (response) => {
      this.isLoading = false;
      this.authService.setToken(response.token);
      this.authService.setUser(response.user);
      this.authService.setRoleId(response.user?.roleId ?? null);
      this.router.navigate(['/dashboard/company']);
    },
    error: (err) => {
      this.isLoading = false;
      this.errorMessage = typeof err?.error === 'string' ? err.error : 'Invalid credentials';
    }
  });
}
}
