import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatchingAlgorithmService, Opportunity } from '../../services/matching-algorithm/matching-algorithm.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-card-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-details.component.html',
  styleUrls: ['./card-details.component.scss']
})
export class CardDetailsComponent implements OnInit {
  opportunity!: Opportunity | null;
  loading = true;
  error: string | null = null;

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private matchingService: MatchingAlgorithmService
  ) {}

  ngOnInit() {
    // Try to get opportunity data from router state
    const nav = this.location.getState() as { [key: string]: any };
    if (nav && nav['id']) {
      this.opportunity = nav as Opportunity;
      this.loading = false;
    } else {
      // No state passed, fallback to fetching by id from route param
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.matchingService.getOpportunityById(id).subscribe({
          next: (opp) => {
            this.opportunity = opp;
            this.loading = false;
          },
          error: (err) => {
            this.error = 'Failed to load opportunity details.';
            this.loading = false;
          }
        });
      } else {
        this.error = 'No opportunity specified.';
        this.loading = false;
      }
    }
  }
}
