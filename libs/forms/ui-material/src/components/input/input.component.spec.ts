import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynMatInputComponent } from './input.component';

describe('DynMatInputComponent', () => {
  let component: DynMatInputComponent;
  let fixture: ComponentFixture<DynMatInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DynMatInputComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DynMatInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
