import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynMatArrayComponent } from './array.component';

describe('DynMatArrayComponent', () => {
  let component: DynMatArrayComponent;
  let fixture: ComponentFixture<DynMatArrayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DynMatArrayComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DynMatArrayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
