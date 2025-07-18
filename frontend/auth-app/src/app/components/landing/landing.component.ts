import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <!-- Navigation Header -->
      <nav class="bg-white shadow-sm border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4">
          <div class="flex justify-between items-center h-16">
            <div class="flex items-center">
              <h3 class="text-2xl font-bold text-gray-900">Auth App</h3>
            </div>
            <div class="flex items-center space-x-4">
              <a routerLink="/login" class="btn btn-outline">Sign In</a>
              <a routerLink="/signup" class="btn btn-primary">Get Started</a>
            </div>
          </div>
        </div>
      </nav>
      
      <!-- Hero Section -->
      <div class="max-w-7xl mx-auto px-4 py-16">
        <div class="text-center">
          <h1 class="text-5xl font-bold text-gray-900 mb-6">
            Welcome to <span class="text-blue-600">Auth App</span>
          </h1>
          <p class="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            A modern authentication system built with Angular and FastAPI. 
            Secure, scalable, and designed for the future.
          </p>
          
          <div class="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <a routerLink="/signup" class="btn btn-primary text-lg px-8 py-4">
              Create Your Account
              <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
              </svg>
            </a>
            <a routerLink="/login" class="btn btn-outline text-lg px-8 py-4">
              Sign In
            </a>
          </div>
        </div>
        
        <!-- Features Section -->
        <div class="mb-16">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-bold text-gray-900 mb-4">Why Choose Auth App?</h2>
            <p class="text-gray-600">Built with cutting-edge technology and security best practices</p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div class="card text-center group hover:shadow-xl transition-shadow duration-300">
              <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-3">🔐 Secure Authentication</h3>
              <p class="text-gray-600">JWT-based authentication with Google SSO integration for maximum security</p>
            </div>
            
            <div class="card text-center group hover:shadow-xl transition-shadow duration-300">
              <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-3">👤 User Management</h3>
              <p class="text-gray-600">Complete user lifecycle management with admin dashboard and role-based access</p>
            </div>
            
            <div class="card text-center group hover:shadow-xl transition-shadow duration-300">
              <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17v4a2 2 0 002 2h4M13 13h4a2 2 0 012 2v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4a2 2 0 012-2z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-3">🎨 Modern UI</h3>
              <p class="text-gray-600">Beautiful, responsive design built with Angular and Tailwind CSS</p>
            </div>
          </div>
        </div>
        
        <!-- CTA Section -->
        <div class="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-center text-white">
          <h2 class="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p class="text-blue-100 mb-6 text-lg">Join thousands of users who trust our platform for their authentication needs</p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a routerLink="/signup" class="btn bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4">
              Create Free Account
            </a>
            <div class="text-blue-100 text-sm mt-2 sm:mt-auto">
              Already have an account? 
              <a routerLink="/login" class="text-white font-medium hover:underline">Sign in here</a>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Footer -->
      <footer class="bg-gray-900 text-gray-300 py-8">
        <div class="max-w-7xl mx-auto px-4 text-center">
          <div class="flex items-center justify-center mb-4">
            <h3 class="text-xl font-bold text-white">Auth App</h3>
          </div>
          <p class="text-gray-400">&copy; 2025 Auth App. Built with Angular & FastAPI.</p>
          <p class="text-gray-500 text-sm mt-2">Secure • Modern • Reliable</p>
        </div>
      </footer>
    </div>
  `,
  styles: []
})
export class LandingComponent {}
