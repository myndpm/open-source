import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepperStep2Component } from './step2.component';

describe('StepperStep2Component', () => {
  let component: StepperStep2Component;
  let fixture: ComponentFixture<StepperStep2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StepperStep2Component],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StepperStep2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
