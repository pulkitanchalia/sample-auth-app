import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User, UserLogin, UserCreate, UserStatusUpdate, UserStats, GoogleLoginRequest } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000';
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Check if user is already logged in
    const token = this.getToken();
    if (token) {
      this.getCurrentUser().subscribe();
    }
  }

  signup(user: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/signup`, user);
  }

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.access_token);
        this.getCurrentUser().subscribe();
      })
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}).pipe(
      tap(() => {
        localStorage.removeItem('token');
        this.currentUserSubject.next(null);
      })
    );
  }

  getCurrentUser(): Observable<any> {
    const token = this.getToken();
    if (!token) {
      this.currentUserSubject.next(null);
      throw new Error('No token found');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.apiUrl}/me`, { headers }).pipe(
      tap((user: any) => this.currentUserSubject.next(user))
    );
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // Admin methods
  private getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // Get all users (admin only)
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/admin/users`, { 
      headers: this.getAuthHeaders() 
    });
  }

  // Get user by ID (admin only)
  getUserById(userId: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/admin/users/${userId}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Update user status (admin only)
  updateUserStatus(userId: number, statusUpdate: UserStatusUpdate): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/admin/users/${userId}/status`, statusUpdate, {
      headers: this.getAuthHeaders()
    });
  }

  // Delete user (admin only)
  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/admin/users/${userId}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Get user statistics (admin only)
  getUserStats(): Observable<UserStats> {
    return this.http.get<UserStats>(`${this.apiUrl}/admin/stats`, {
      headers: this.getAuthHeaders()
    });
  }

  // Check if current user is admin
  isAdmin(): boolean {
    const currentUser = this.currentUserSubject.value;
    return currentUser && (currentUser.id === 1 || currentUser.username.toLowerCase() === 'admin');
  }

  // Google SSO methods
  googleAuth(googleToken: string): Observable<any> {
    const googleRequest: GoogleLoginRequest = { token: googleToken };
    return this.http.post<any>(`${this.apiUrl}/auth/google`, googleRequest).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.access_token);
        this.getCurrentUser().subscribe();
      })
    );
  }

  // Check if user signed up with Google
  isGoogleUser(): boolean {
    const currentUser = this.currentUserSubject.value;
    return currentUser && currentUser.auth_provider === 'google';
  }
}
