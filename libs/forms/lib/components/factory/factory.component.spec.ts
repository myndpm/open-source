import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynFactoryComponent } from './factory.component';

describe('DynFactoryComponent', () => {
  let component: DynFactoryComponent;
  let fixture: ComponentFixture<DynFactoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DynFactoryComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DynFactoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
