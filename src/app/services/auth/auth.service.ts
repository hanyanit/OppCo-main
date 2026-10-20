import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { createClient } from '@supabase/supabase-js';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase = createClient(environment.supabaseUrl, environment.supabaseAnonKey);
  private inactivityTimer: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  // 🔐 Supabase Signup
  async register(userData: { email: string; password: string }) {
    const { data, error } = await this.supabase.auth.signUp(userData);
    if (error) throw error;
    return data;
  }

  // 🔐 Supabase Login
  async login(credentials: { email: string; password: string }) {
    const { data, error } = await this.supabase.auth.signInWithPassword(credentials);
    if (error) throw error;

    const accessToken = data.session?.access_token;
    if (accessToken) {
      this.storeToken(accessToken);
      this.router.navigate(['/my-profile']); // Redirect after login
    }

    return data;
  }

  // 🧠 Store token locally
  storeToken(token: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('access_token', token);
      localStorage.setItem('last_active', Date.now().toString());
    }
  }

  // ✅ Check if user is logged in
  isAuthenticated(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('access_token');
    }
    return false;
  }

  // 🧾 Prepare auth headers
  getAuthHeaders(): HttpHeaders {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('access_token');
      return new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });
    }
    return new HttpHeaders();
  }

  // 📤 Example API call
  getProfile() {
    const headers = this.getAuthHeaders();
    return this.http.get('${environment.apiUrl}', { headers });
  }

  // 🚪 Logout
  async logout() {
    await this.supabase.auth.signOut();
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('last_active');
    }
    this.clearInactivityTimer();
    this.router.navigate(['/login']);
  }

  async getSession() {
    const { data } = await this.supabase.auth.getSession();
    return data.session;
  }

  // ⏳ Inactivity timer handling
  startInactivityTimer(logoutAfterMs: number = 10 * 60 * 1000) {
    this.clearInactivityTimer();
    this.inactivityTimer = setTimeout(() => {
      console.log('User inactive for 10 minutes. Logging out...');
      this.logout();
    }, logoutAfterMs);
  }

  resetInactivityTimer() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('last_active', Date.now().toString());
    }
    this.startInactivityTimer();
  }

  clearInactivityTimer() {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
    }
  }

  // 🔍 Check last active timestamp and auto-logout if exceeded
  checkInactivity(logoutAfterMs: number = 10 * 60 * 1000) {
    if (isPlatformBrowser(this.platformId)) {
      const lastActive = localStorage.getItem('last_active');
      if (lastActive) {
        const inactiveTime = Date.now() - parseInt(lastActive, 10);
        if (inactiveTime > logoutAfterMs) {
          console.log('Inactive too long on reload. Logging out...');
          this.logout();
          return false;
        }
      }
    }
    return true;
  }
}
