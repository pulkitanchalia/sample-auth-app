import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User, UserStats } from '../../models/user.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Navigation Header -->
      <nav class="bg-slate-800 shadow-lg">
        <div class="max-w-7xl mx-auto px-4">
          <div class="flex justify-between items-center h-16">
            <div class="flex items-center">
              <h3 class="text-xl font-bold text-white">Admin Dashboard</h3>
            </div>
            <div class="flex items-center space-x-4">
              <span *ngIf="currentUser" class="text-gray-300">Welcome, {{ currentUser.username }}! (Admin)</span>
              <button class="btn btn-primary" (click)="goToDashboard()">
                User Dashboard
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
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8" *ngIf="userStats">
          <div class="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-blue-100 text-sm font-medium">Total Users</p>
                <p class="text-3xl font-bold">{{ userStats.total_users }}</p>
              </div>
              <div class="bg-blue-400 bg-opacity-30 rounded-full p-3">
                <svg class="w-8 h-8 text-blue-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                </svg>
              </div>
            </div>
          </div>
          
          <div class="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-green-100 text-sm font-medium">Active Users</p>
                <p class="text-3xl font-bold">{{ userStats.active_users }}</p>
              </div>
              <div class="bg-green-400 bg-opacity-30 rounded-full p-3">
                <svg class="w-8 h-8 text-green-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
          </div>
          
          <div class="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-6 text-white">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-red-100 text-sm font-medium">Inactive Users</p>
                <p class="text-3xl font-bold">{{ userStats.inactive_users }}</p>
              </div>
              <div class="bg-red-400 bg-opacity-30 rounded-full p-3">
                <svg class="w-8 h-8 text-red-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- User Management Table -->
        <div class="card">
          <div class="flex justify-between items-center p-6 border-b border-gray-200">
            <h2 class="text-2xl font-bold text-gray-900">User Management</h2>
            <button class="btn btn-primary" (click)="refreshUsers()">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Refresh
            </button>
          </div>
          
          <div *ngIf="loading" class="flex items-center justify-center py-12">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span class="ml-3 text-gray-600">Loading users...</span>
          </div>
          
          <div *ngIf="!loading && users.length === 0" class="text-center py-12">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
            </svg>
            <p class="mt-2 text-gray-600">No users found.</p>
          </div>
          
          <div *ngIf="!loading && users.length > 0" class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr *ngFor="let user of users" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ user.id }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ user.username }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ user.email }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="badge" [ngClass]="user.is_active ? 'badge-green' : 'badge-red'">
                      {{ user.is_active ? 'Active' : 'Inactive' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ formatDate(user.created_at) }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ formatDate(user.last_login) || 'Never' }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button 
                      class="btn text-xs"
                      [ngClass]="user.is_active ? 'btn-danger' : 'btn-success'"
                      (click)="toggleUserStatus(user)"
                      [disabled]="user.id === currentUser?.id">
                      {{ user.is_active ? 'Deactivate' : 'Activate' }}
                    </button>
                    <button 
                      class="btn btn-danger text-xs" 
                      (click)="deleteUser(user)"
                      [disabled]="user.id === currentUser?.id">
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Error Message -->
        <div *ngIf="errorMessage" class="alert alert-error mt-6">
          {{ errorMessage }}
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class AdminDashboardComponent implements OnInit {
  currentUser: User | null = null;
  users: User[] = [];
  userStats: UserStats | null = null;
  loading = false;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (!user && !this.authService.isLoggedIn()) {
        this.router.navigate(['/login']);
        return;
      }
      
      // Check if user is admin
      if (!this.authService.isAdmin()) {
        this.router.navigate(['/dashboard']);
        return;
      }
      
      this.loadData();
    });
  }

  loadData() {
    this.loadUsers();
    this.loadStats();
  }

  loadUsers() {
    this.loading = true;
    this.errorMessage = '';
    
    this.authService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load users: ' + (error.error?.detail || error.message);
        this.loading = false;
      }
    });
  }

  loadStats() {
    this.authService.getUserStats().subscribe({
      next: (stats) => {
        this.userStats = stats;
      },
      error: (error) => {
        console.error('Failed to load stats:', error);
      }
    });
  }

  refreshUsers() {
    this.loadData();
  }

  toggleUserStatus(user: User) {
    if (user.id === this.currentUser?.id) {
      return;
    }

    const newStatus = !user.is_active;
    this.authService.updateUserStatus(user.id, { is_active: newStatus }).subscribe({
      next: (updatedUser) => {
        // Update the user in the list
        const index = this.users.findIndex(u => u.id === user.id);
        if (index !== -1) {
          this.users[index] = updatedUser;
        }
        this.loadStats(); // Refresh stats
      },
      error: (error) => {
        this.errorMessage = 'Failed to update user status: ' + (error.error?.detail || error.message);
      }
    });
  }

  deleteUser(user: User) {
    if (user.id === this.currentUser?.id) {
      return;
    }

    if (confirm(`Are you sure you want to delete user "${user.username}"?`)) {
      this.authService.deleteUser(user.id).subscribe({
        next: () => {
          // Remove user from the list
          this.users = this.users.filter(u => u.id !== user.id);
          this.loadStats(); // Refresh stats
        },
        error: (error) => {
          this.errorMessage = 'Failed to delete user: ' + (error.error?.detail || error.message);
        }
      });
    }
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString() + ' ' + new Date(dateString).toLocaleTimeString();
    } catch {
      return dateString;
    }
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
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
