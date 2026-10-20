import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopiaComplianceComponent } from './popia-compliance.component';

describe('PopiaComplianceComponent', () => {
  let component: PopiaComplianceComponent;
  let fixture: ComponentFixture<PopiaComplianceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopiaComplianceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopiaComplianceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
