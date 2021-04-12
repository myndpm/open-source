import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DynFormNode } from '@myndpm/dyn-forms/core';
import { DynLogger } from '@myndpm/dyn-forms/logger';
import { MockProvider } from 'ng-mocks';
import { DynFormComponent } from './form.component';

describe('DynFormComponent', () => {
  let component: DynFormComponent;
  let fixture: ComponentFixture<DynFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DynFormComponent],
      providers: [
        MockProvider(DynLogger),
        MockProvider(DynFormNode),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DynFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
