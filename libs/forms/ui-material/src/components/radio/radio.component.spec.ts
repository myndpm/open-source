import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynMatRadioComponent } from './radio.component';

describe('DynMatRadioComponent', () => {
  let component: DynMatRadioComponent;
  let fixture: ComponentFixture<DynMatRadioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DynMatRadioComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DynMatRadioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
