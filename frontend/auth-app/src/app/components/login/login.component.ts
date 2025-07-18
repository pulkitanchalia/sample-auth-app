import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { GoogleSignInService } from '../../services/google-signin.service';
import { UserLogin } from '../../models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-8">
      <div class="card max-w-md w-full">
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold text-gray-900 mb-2">Welcome back</h2>
          <p class="text-gray-600">Please sign in to your account</p>
        </div>
        
        <!-- Google Sign-In Button -->
        <div class="mb-6">
          <div #googleSignInButton class="flex justify-center mb-4"></div>
          <div class="relative flex items-center justify-center mb-6">
            <div class="border-t border-gray-300 flex-grow"></div>
            <span class="bg-white px-3 text-sm text-gray-500">or</span>
            <div class="border-t border-gray-300 flex-grow"></div>
          </div>
        </div>
        
        <form (ngSubmit)="onSubmit()" #loginForm="ngForm" class="space-y-6">
          <div>
            <label for="username" class="form-label">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              [(ngModel)]="credentials.username"
              required
              #username="ngModel"
              class="form-input"
              placeholder="Enter your username"
            />
            <div *ngIf="username.invalid && username.touched" class="alert alert-error mt-2">
              Username is required
            </div>
          </div>
          
          <div>
            <label for="password" class="form-label">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              [(ngModel)]="credentials.password"
              required
              #password="ngModel"
              class="form-input"
              placeholder="Enter your password"
            />
            <div *ngIf="password.invalid && password.touched" class="alert alert-error mt-2">
              Password is required
            </div>
          </div>
          
          <div *ngIf="errorMessage" class="alert alert-error">
            {{ errorMessage }}
          </div>
          
          <button type="submit" class="btn btn-primary w-full" [disabled]="loginForm.invalid || loading">
            <span *ngIf="loading" class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
            {{ loading ? 'Logging in...' : 'Sign in' }}
          </button>
        </form>
        
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600">
            Don't have an account? 
            <a routerLink="/signup" class="font-medium text-blue-600 hover:text-blue-500 transition-colors">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class LoginComponent implements OnInit, AfterViewInit {
  @ViewChild('googleSignInButton', { static: false }) googleSignInButton!: ElementRef;
  
  credentials: UserLogin = {
    username: '',
    password: ''
  };
  
  errorMessage = '';
  loading = false;

  constructor(
    private authService: AuthService, 
    private router: Router,
    private googleSignInService: GoogleSignInService
  ) {}

  ngOnInit() {
    // Initialize Google Sign-In with error handling
    try {
      this.googleSignInService.initializeGoogleSignIn('277598308233-d09qs87vgpctd320uffsds64511c84tf.apps.googleusercontent.com')
        .catch(error => {
          console.warn('Google Sign-In initialization failed:', error);
        });
    } catch (error) {
      console.warn('Google Sign-In not available:', error);
    }
  }

  ngAfterViewInit() {
    // Render Google Sign-In button after view is initialized
    setTimeout(() => {
      if (this.googleSignInButton) {
        try {
          this.googleSignInService.renderSignInButton(
            this.googleSignInButton.nativeElement,
            (response: any) => this.handleGoogleSignIn(response)
          );
        } catch (error) {
          console.warn('Google Sign-In button rendering failed:', error);
          // Hide the Google sign-in container if it fails
          const container = document.querySelector('.google-signin-container');
          if (container) {
            (container as HTMLElement).style.display = 'none';
          }
        }
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
    
    this.authService.login(this.credentials).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.errorMessage = error.error?.detail || 'Login failed';
        this.loading = false;
      }
    });
  }
}
