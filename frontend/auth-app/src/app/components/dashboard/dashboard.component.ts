import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="navbar">
      <div class="container">
        <h3>Auth App</h3>
        <div>
          <span *ngIf="currentUser">Welcome, {{ currentUser.username }}!</span>
          <button class="btn btn-secondary" (click)="logout()" style="margin-left: 1rem;">
            Logout
          </button>
        </div>
      </div>
    </div>
    
    <div class="container">
      <div class="card">
        <h1>Dashboard</h1>
        <p>Welcome to your dashboard! You are successfully logged in.</p>
        
        <div *ngIf="currentUser" style="margin-top: 2rem;">
          <h3>Your Profile Information:</h3>
          <div style="margin-top: 1rem;">
            <p><strong>ID:</strong> {{ currentUser.id }}</p>
            <p><strong>Username:</strong> {{ currentUser.username }}</p>
            <p><strong>Email:</strong> {{ currentUser.email }}</p>
            <p><strong>Status:</strong> {{ currentUser.is_active ? 'Active' : 'Inactive' }}</p>
          </div>
        </div>
        
        <div style="margin-top: 2rem;">
          <h3>What you can do:</h3>
          <ul style="margin-top: 1rem; padding-left: 2rem;">
            <li>View your profile information</li>
            <li>Access protected content</li>
            <li>Logout securely</li>
          </ul>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (!user && !this.authService.isLoggedIn()) {
        this.router.navigate(['/login']);
      }
    });
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: () => {
        // Even if logout fails on server, remove token locally
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
      }
    });
  }
}
