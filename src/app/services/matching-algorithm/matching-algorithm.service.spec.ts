import { TestBed } from '@angular/core/testing';

import { MatchingAlgorithmService } from './matching-algorithm.service';

describe('MatchingAlgorithmService', () => {
  let service: MatchingAlgorithmService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MatchingAlgorithmService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
