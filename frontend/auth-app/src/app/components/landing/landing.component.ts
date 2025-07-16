import { Component } from '@angular/core';

@Component({
  selector: 'app-landing',
  template: `
    <div class="navbar">
      <div class="container">
        <h3>Auth App</h3>
        <div>
          <a routerLink="/login" class="btn btn-secondary">Login</a>
          <a routerLink="/signup" class="btn btn-primary" style="margin-left: 1rem;">Sign Up</a>
        </div>
      </div>
    </div>
    
    <div class="container">
      <div class="card" style="text-align: center; margin-top: 3rem;">
        <h1>Welcome to Auth App</h1>
        <p style="font-size: 1.2rem; margin: 2rem 0; color: #666;">
          A modern authentication system built with Angular and FastAPI
        </p>
        
        <div style="margin: 3rem 0;">
          <h2>Features</h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; margin-top: 2rem;">
            <div class="card">
              <h3>🔐 Secure Authentication</h3>
              <p>JWT-based authentication system for secure user sessions</p>
            </div>
            <div class="card">
              <h3>👤 User Management</h3>
              <p>Complete signup, login, and logout functionality</p>
            </div>
            <div class="card">
              <h3>🎨 Modern UI</h3>
              <p>Clean and responsive design built with Angular</p>
            </div>
          </div>
        </div>
        
        <div style="margin-top: 3rem;">
          <h2>Get Started</h2>
          <p style="margin: 1rem 0;">Join thousands of users who trust our platform</p>
          <div style="margin-top: 2rem;">
            <a routerLink="/signup" class="btn btn-primary" style="font-size: 1.1rem; padding: 1rem 2rem;">
              Create Your Account
            </a>
            <p style="margin-top: 1rem;">
              Already have an account? <a routerLink="/login">Sign in here</a>
            </p>
          </div>
        </div>
      </div>
    </div>
    
    <footer style="background-color: #f8f9fa; padding: 2rem 0; margin-top: 4rem; text-align: center; color: #666;">
      <div class="container">
        <p>&copy; 2025 Auth App. Built with Angular & FastAPI.</p>
      </div>
    </footer>
  `
})
export class LandingComponent {}
