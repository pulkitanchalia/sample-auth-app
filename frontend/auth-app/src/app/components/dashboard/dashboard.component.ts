import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Navigation Header -->
      <nav class="bg-slate-800 shadow-lg">
        <div class="max-w-7xl mx-auto px-4">
          <div class="flex justify-between items-center h-16">
            <div class="flex items-center">
              <h3 class="text-xl font-bold text-white">Auth App</h3>
            </div>
            <div class="flex items-center space-x-4">
              <span *ngIf="currentUser" class="text-gray-300">Welcome, {{ currentUser.username }}!</span>
              <button 
                *ngIf="isAdmin()" 
                class="btn btn-primary"
                (click)="goToAdminDashboard()">
                Admin Dashboard
              </button>
              <button class="btn btn-secondary" (click)="logout()">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      <!-- Main Content -->
      <div class="max-w-7xl mx-auto px-4 py-8">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Welcome Card -->
          <div class="lg:col-span-2">
            <div class="card">
              <div class="mb-6">
                <h1 class="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
                <p class="text-gray-600">Welcome to your dashboard! You are successfully logged in.</p>
              </div>
              
              <!-- Features Section -->
              <div class="border-t pt-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Available Features:</h3>
                <ul class="space-y-2">
                  <li class="flex items-center text-gray-700">
                    <svg class="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    View your profile information
                  </li>
                  <li class="flex items-center text-gray-700">
                    <svg class="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Access protected content
                  </li>
                  <li *ngIf="isAdmin()" class="flex items-center text-gray-700">
                    <svg class="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Manage users (Admin Dashboard)
                  </li>
                  <li class="flex items-center text-gray-700">
                    <svg class="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Logout securely
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <!-- Profile Card -->
          <div class="lg:col-span-1">
            <div class="card" *ngIf="currentUser">
              <div class="text-center mb-6">
                <div *ngIf="currentUser.profile_picture" class="mb-4">
                  <img 
                    [src]="currentUser.profile_picture" 
                    alt="Profile Picture" 
                    class="w-20 h-20 rounded-full mx-auto border-4 border-blue-100 shadow-lg">
                </div>
                <h3 class="text-xl font-semibold text-gray-900">{{ currentUser.username }}</h3>
                <p class="text-gray-600">{{ currentUser.email }}</p>
              </div>
              
              <div class="space-y-4">
                <div class="flex justify-between items-center py-2 border-b border-gray-100">
                  <span class="font-medium text-gray-600">User ID:</span>
                  <span class="text-gray-900">{{ currentUser.id }}</span>
                </div>
                
                <div class="flex justify-between items-center py-2 border-b border-gray-100">
                  <span class="font-medium text-gray-600">Status:</span>
                  <span class="badge" [ngClass]="currentUser.is_active ? 'badge-green' : 'badge-red'">
                    {{ currentUser.is_active ? 'Active' : 'Inactive' }}
                  </span>
                </div>
                
                <div class="flex justify-between items-center py-2 border-b border-gray-100">
                  <span class="font-medium text-gray-600">Auth Provider:</span>
                  <span class="badge badge-blue">
                    {{ currentUser.auth_provider === 'google' ? 'Google' : 'Local' }}
                  </span>
                </div>
                
                <div *ngIf="currentUser.created_at" class="flex justify-between items-center py-2 border-b border-gray-100">
                  <span class="font-medium text-gray-600">Joined:</span>
                  <span class="text-gray-900 text-sm">{{ formatDate(currentUser.created_at) }}</span>
                </div>
                
                <div *ngIf="currentUser.last_login" class="flex justify-between items-center py-2">
                  <span class="font-medium text-gray-600">Last Login:</span>
                  <span class="text-gray-900 text-sm">{{ formatDate(currentUser.last_login) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
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

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  goToAdminDashboard() {
    this.router.navigate(['/admin']);
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString() + ' ' + new Date(dateString).toLocaleTimeString();
    } catch {
      return dateString;
    }
  }
}
