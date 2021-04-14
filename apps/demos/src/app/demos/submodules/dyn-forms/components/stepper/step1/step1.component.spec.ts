import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepperStep1Component } from './step1.component';

describe('StepperStep1Component', () => {
  let component: StepperStep1Component;
  let fixture: ComponentFixture<StepperStep1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StepperStep1Component],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StepperStep1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
