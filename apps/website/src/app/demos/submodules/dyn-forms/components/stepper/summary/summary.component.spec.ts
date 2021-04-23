import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepperSummaryComponent } from './summary.component';

describe('StepperSummaryComponent', () => {
  let component: StepperSummaryComponent;
  let fixture: ComponentFixture<StepperSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StepperSummaryComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StepperSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
