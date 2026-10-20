import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../../services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  canActivate(): boolean {
    // Only protect the route on the browser (skip during prerender)
    if (isPlatformBrowser(this.platformId)) {
      const isAuthenticated = this.authService.isAuthenticated();

      if (!isAuthenticated) {
        this.router.navigate(['/login']);
        return false;
      }
    }

    return true; 
  }
}