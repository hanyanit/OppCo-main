import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScrollService {
  constructor(private router: Router) {
    this.scrollTop(); // Call the scrollTop method when the service is instantiated
  }

  // Scrolls to the top on router navigation
  scrollTop() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        // Check if 'window' is defined
        if (typeof window !== 'undefined') {
          window.scrollTo(0, 0);
        }
      });
  }

  // Smoothly scrolls to a specific section
  scrollToNextSection(section: HTMLElement | null) {
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  }
}