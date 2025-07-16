import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserCreate } from '../../models/user.model';

@Component({
  selector: 'app-signup',
  template: `
    <div class="container">
      <div class="card" style="max-width: 400px; margin: 2rem auto;">
        <h2>Sign Up</h2>
        <form (ngSubmit)="onSubmit()" #signupForm="ngForm">
          <div class="form-group">
            <label for="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              [(ngModel)]="user.username"
              required
              #username="ngModel"
            />
            <div *ngIf="username.invalid && username.touched" class="alert alert-error">
              Username is required
            </div>
          </div>
          
          <div class="form-group">
            <label for="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              [(ngModel)]="user.email"
              required
              email
              #email="ngModel"
            />
            <div *ngIf="email.invalid && email.touched" class="alert alert-error">
              <div *ngIf="email.errors?.['required']">Email is required</div>
              <div *ngIf="email.errors?.['email']">Please enter a valid email</div>
            </div>
          </div>
          
          <div class="form-group">
            <label for="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              [(ngModel)]="user.password"
              required
              minlength="6"
              #password="ngModel"
            />
            <div *ngIf="password.invalid && password.touched" class="alert alert-error">
              <div *ngIf="password.errors?.['required']">Password is required</div>
              <div *ngIf="password.errors?.['minlength']">Password must be at least 6 characters</div>
            </div>
          </div>
          
          <div *ngIf="errorMessage" class="alert alert-error">
            {{ errorMessage }}
          </div>
          
          <div *ngIf="successMessage" class="alert alert-success">
            {{ successMessage }}
          </div>
          
          <button type="submit" class="btn btn-primary" [disabled]="signupForm.invalid || loading">
            {{ loading ? 'Creating account...' : 'Sign Up' }}
          </button>
        </form>
        
        <p style="margin-top: 1rem; text-align: center;">
          Already have an account? <a routerLink="/login">Login</a>
        </p>
      </div>
    </div>
  `
})
export class SignupComponent {
  user: UserCreate = {
    username: '',
    email: '',
    password: ''
  };
  
  errorMessage = '';
  successMessage = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (this.loading) return;
    
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    this.authService.signup(this.user).subscribe({
      next: () => {
        this.successMessage = 'Account created successfully! Please login.';
        this.loading = false;
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error) => {
        this.errorMessage = error.error?.detail || 'Signup failed';
        this.loading = false;
      }
    });
  }
}
