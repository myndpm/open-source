import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynMatSelectComponent } from './select.component';

describe('DynMatSelectComponent', () => {
  let component: DynMatSelectComponent;
  let fixture: ComponentFixture<DynMatSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DynMatSelectComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DynMatSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
