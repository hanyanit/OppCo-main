import { Component, OnInit } from '@angular/core';
import { CardComponent } from '../../shared/card/card.component';
import { CommonModule } from '@angular/common';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { BookmarksService } from '../../services/bookmarks/bookmarks.service';
import { MatchingAlgorithmService, Opportunity } from '../../services/matching-algorithm/matching-algorithm.service';
import { environment } from '../../environments/environment';
import { RouterModule } from "@angular/router";

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [CommonModule, CardComponent, RouterModule],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.scss'
})
export class FeedComponent implements OnInit {
  opportunities: Opportunity[] = [];
  bookmarkedIds: string[] = [];
  loading = true;
  userId: string = '';

  private supabase: SupabaseClient;

  constructor(
    private matchingService: MatchingAlgorithmService,
    private bookmarksService: BookmarksService
  ) {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseAnonKey);
  }

  async ngOnInit(): Promise<void> {
    try {
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

      // 1. Get bookmarked bursary IDs
      this.bookmarkedIds = await this.bookmarksService.getBookmarks(this.userId);

      // 2. Fetch eligible bursaries
      this.matchingService.getEligibleBursaries(this.userId).subscribe({
        next: data => {
          this.opportunities = data;
          this.loading = false;
        },
        error: err => {
          console.error('Failed to fetch bursaries:', err);
          this.loading = false;
        }
      });
    } catch (err) {
      console.error('Unexpected error in feed init:', err);
      this.loading = false;
    }
  }

  // Triggered when bookmark toggled inside app-card
  async onBookmarkToggle(bursaryId: string, isBookmarked: boolean) {
    if (isBookmarked) {
      if (!this.bookmarkedIds.includes(bursaryId)) {
        try {
          await this.bookmarksService.bookmarkBursary(this.userId, bursaryId);
          this.bookmarkedIds.push(bursaryId);
        } catch (error) {
          console.error('Failed to add bookmark:', error);
        }
      }
    } else {
      if (this.bookmarkedIds.includes(bursaryId)) {
        try {
          await this.bookmarksService.removeBookmark(this.userId, bursaryId);
          this.bookmarkedIds = this.bookmarkedIds.filter(id => id !== bursaryId);
        } catch (error) {
          console.error('Failed to remove bookmark:', error);
        }
      }
    }
  }
}
