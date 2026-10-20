import { Component, ElementRef, ViewChild, AfterViewInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

import { AuthService } from '../../services/auth/auth.service';
import { ProfileService } from '../../services/users/profile/profile.service';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class navigationComponent implements AfterViewInit {
  @ViewChild('mainContent') mainContentRef!: ElementRef<HTMLElement>;

  userFullName = signal<string>('Loading...');

  private authService = inject(AuthService);
  private profileService = inject(ProfileService);
  private router = inject(Router);

  constructor() {
    this.loadUserFullName();
  }

  ngAfterViewInit(): void {
    this.scrollToTop();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  private scrollToTop(): void {
    const mainContent = this.mainContentRef?.nativeElement;
    if (mainContent) {
      mainContent.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  private async loadUserFullName(): Promise<void> {
    try {
      const profile = await this.profileService.getProfile();
      this.userFullName.set(profile.full_name || 'User');
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      this.userFullName.set('Unknown User');
    }
  }
}
