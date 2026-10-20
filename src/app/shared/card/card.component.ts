import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Opportunity } from '../../services/matching-algorithm/matching-algorithm.service';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],  // Fixed here (plural)
})
export class CardComponent {
  @Input() opportunity!: Opportunity;
  @Input() bookmarkedOpportunityIds: string[] = [];
  @Output() bookmarkToggle = new EventEmitter<{ opportunityId: string; isBookmarked: boolean }>();

  constructor(private router: Router) {}

  get isBookmarked(): boolean { 
    return this.bookmarkedOpportunityIds.includes(this.opportunity.id);
  }

  goToDetails() {
    this.router.navigate(['/opportunity-details', this.opportunity.id]);
  }

  toggleBookmark() {
    this.bookmarkToggle.emit({ opportunityId: this.opportunity.id, isBookmarked: !this.isBookmarked });
  }
}
