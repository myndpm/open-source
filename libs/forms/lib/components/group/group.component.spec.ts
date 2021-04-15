import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DynFormTreeNode } from '@myndpm/dyn-forms/core';
import { DynLogger } from '@myndpm/dyn-forms/logger';
import { MockProvider } from 'ng-mocks';
import { DynGroupComponent } from './group.component';

describe('DynGroupComponent', () => {
  let component: DynGroupComponent;
  let fixture: ComponentFixture<DynGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DynGroupComponent],
      providers: [
        MockProvider(DynLogger),
        MockProvider(DynFormTreeNode),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DynGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
