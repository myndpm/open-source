import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { DynFormsModule } from '@myndpm/dyn-forms';
import { DynControlProvider, DynFormTreeNode } from '@myndpm/dyn-forms/core';
import { DynLogger } from '@myndpm/dyn-forms/logger';
import { MockProvider } from 'ng-mocks';
import { DynNatInputComponent } from './input.component';

describe('DynNatInputComponent', () => {
  let component: DynNatInputComponent;
  let fixture: ComponentFixture<DynNatInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        DynFormsModule.forFeature({
          controls: [{} as DynControlProvider],
        }),
      ],
      declarations: [DynNatInputComponent],
      providers: [
        MockProvider(DynLogger),
        MockProvider(DynFormTreeNode),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DynNatInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
