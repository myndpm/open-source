import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynMatCardComponent } from './card.component';

describe('DynMatCardComponent', () => {
  let component: DynMatCardComponent;
  let fixture: ComponentFixture<DynMatCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DynMatCardComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DynMatCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
