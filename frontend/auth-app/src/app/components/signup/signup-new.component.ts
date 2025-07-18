import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { GoogleSignInService } from '../../services/google-signin.service';
import { UserCreate } from '../../models/user.model';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container">
      <div class="card" style="max-width: 400px; margin: 2rem auto;">
        <h2>Sign Up</h2>
        
        <!-- Google Sign-In Button -->
        <div class="google-signin-container">
          <div #googleSignInButton class="google-signin-button"></div>
          <div class="divider">
            <span>or</span>
          </div>
        </div>
        
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
            {{ loading ? 'Creating Account...' : 'Sign Up' }}
          </button>
        </form>
        
        <p style="margin-top: 1rem; text-align: center;">
          Already have an account? <a routerLink="/login">Login</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem 1rem;
    }

    .card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .google-signin-container {
      margin-bottom: 1.5rem;
    }

    .google-signin-button {
      display: flex;
      justify-content: center;
      margin-bottom: 1rem;
    }

    .divider {
      text-align: center;
      margin: 1rem 0;
      position: relative;
    }

    .divider:before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: 1px;
      background: #ddd;
    }

    .divider span {
      background: white;
      padding: 0 1rem;
      color: #666;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }

    .form-group input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }

    .form-group input:focus {
      outline: none;
      border-color: #007bff;
    }

    .btn {
      width: 100%;
      padding: 0.75rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      text-decoration: none;
      display: inline-block;
      text-align: center;
    }

    .btn-primary {
      background-color: #007bff;
      color: white;
    }

    .btn:hover {
      opacity: 0.9;
    }

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .alert {
      padding: 0.75rem;
      border-radius: 4px;
      margin-bottom: 1rem;
    }

    .alert-error {
      background-color: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }

    .alert-success {
      background-color: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }

    a {
      color: #007bff;
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }
  `]
})
export class SignupComponent implements OnInit, AfterViewInit {
  @ViewChild('googleSignInButton', { static: false }) googleSignInButton!: ElementRef;

  user: UserCreate = {
    username: '',
    email: '',
    password: ''
  };
  
  errorMessage = '';
  successMessage = '';
  loading = false;

  constructor(
    private authService: AuthService, 
    private router: Router,
    private googleSignInService: GoogleSignInService
  ) {}

  ngOnInit() {
    // Initialize Google Sign-In
    this.googleSignInService.initializeGoogleSignIn('your-google-client-id.apps.googleusercontent.com');
  }

  ngAfterViewInit() {
    // Render Google Sign-In button after view is initialized
    setTimeout(() => {
      if (this.googleSignInButton) {
        this.googleSignInService.renderSignInButton(
          this.googleSignInButton.nativeElement,
          (response: any) => this.handleGoogleSignIn(response)
        );
      }
    }, 100);
  }

  handleGoogleSignIn(response: any) {
    this.loading = true;
    this.errorMessage = '';

    this.authService.googleAuth(response.credential).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.errorMessage = error.error?.detail || 'Google sign-in failed';
        this.loading = false;
      }
    });
  }

  onSubmit() {
    if (this.loading) return;
    
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    this.authService.signup(this.user).subscribe({
      next: () => {
        this.successMessage = 'Account created successfully! You can now login.';
        this.loading = false;
        // Redirect to login after 2 seconds
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
