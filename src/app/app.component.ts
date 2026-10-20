import { Component, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationComponent } from './layout/navigation/navigation.component';
import { FooterComponent } from './layout/footer/footer.component';
import { CommonModule } from '@angular/common';
import { ScrollService } from './services/scroll/scroll.service';
import { AuthService } from './services/auth/auth.service';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [
    CommonModule,
    NavigationComponent,
    RouterOutlet,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    private scrollService: ScrollService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.scrollService.scrollTop();

    if (this.authService.isAuthenticated()) {
      const stillValid = this.authService.checkInactivity();
      if (stillValid) {
        this.authService.startInactivityTimer();
      }
    }
  }

  // Track user activity
  @HostListener('window:mousemove')
  @HostListener('window:keydown')
  @HostListener('window:click')
  @HostListener('window:touchstart')
  handleUserActivity() {
    if (this.authService.isAuthenticated()) {
      this.authService.resetInactivityTimer();
    }
  }

  // Cursor + zoom effect
  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    const cursor = document.getElementById('cursor');
    const zoomView = document.querySelector('#cursor .zoom-view') as HTMLElement;

    if (cursor && zoomView) {
      // Move cursor
      cursor.style.left = e.pageX + 'px';
      cursor.style.top = e.pageY + 'px';

      // Move zoomed viewport to simulate magnifying
      zoomView.style.left = -e.pageX + 'px';
      zoomView.style.top = -e.pageY + 'px';
    }
  }
}
