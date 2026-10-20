import { TestBed } from '@angular/core/testing';

import { AcademicInfoService } from './academic-info.service';

describe('AcademicInfoService', () => {
  let service: AcademicInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AcademicInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
