import { Component, OnInit } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { BookmarksService } from '../../services/bookmarks/bookmarks.service';
import { CardComponent } from '../../shared/card/card.component';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { MatchingAlgorithmService, Opportunity } from '../../services/matching-algorithm/matching-algorithm.service';

@Component({
  selector: 'app-bookmarks',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './bookmarks.component.html',
  styleUrl: './bookmarks.component.scss'
})
export class BookmarksComponent implements OnInit {
  opportunities: Opportunity[] = [];
  bookmarkedIds: string[] = [];
  userId: string = '';
  loading = true;

  private supabase = createClient(environment.supabaseUrl, environment.supabaseAnonKey);

  constructor(
    private bookmarksService: BookmarksService,
    private opportunityService: MatchingAlgorithmService
  ) {}

  async ngOnInit(): Promise<void> {
    const {
      data: { user },
      error
    } = await this.supabase.auth.getUser();

    if (error || !user) {
      console.error('User not logged in:', error);
      this.loading = false;
      return;
    }

    this.userId = user.id;

    try {
      this.bookmarkedIds = await this.bookmarksService.getBookmarks(this.userId);

      const allBursaries: Opportunity[] = await firstValueFrom(
        this.opportunityService.getEligibleBursaries(this.userId)
      );

      this.opportunities = allBursaries.filter(b => this.bookmarkedIds.includes(b.id));
    } catch (err) {
      console.error('Failed to load bookmarks:', err);
    } finally {
      this.loading = false;
    }
  }

  async onBookmarkToggle(bursaryId: string, isBookmarked: boolean) {
    try {
      if (!isBookmarked) {
        // Remove from Supabase
        await this.bookmarksService.removeBookmark(this.userId, bursaryId);

        // Remove locally
        this.bookmarkedIds = this.bookmarkedIds.filter(id => id !== bursaryId);
        this.opportunities = this.opportunities.filter(b => b.id !== bursaryId);
      } else {
        await this.bookmarksService.bookmarkBursary(this.userId, bursaryId);
        this.bookmarkedIds.push(bursaryId);
      }
    } catch (err) {
      console.error('Bookmark toggle failed:', err);
    }
  }
}
