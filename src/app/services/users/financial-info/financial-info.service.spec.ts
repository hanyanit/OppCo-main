import { TestBed } from '@angular/core/testing';

import { FinancialInfoService } from './financial-info.service';

describe('FinancialInfoService', () => {
  let service: FinancialInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FinancialInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
