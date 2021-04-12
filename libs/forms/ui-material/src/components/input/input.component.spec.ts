import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DynFormsModule } from '@myndpm/dyn-forms';
import { DynFormNode, DYN_CONTROLS_TOKEN } from '@myndpm/dyn-forms/core';
import { DynLogger } from '@myndpm/dyn-forms/logger';
import { MockProvider } from 'ng-mocks';
import { DynMatInputComponent } from './input.component';

describe('DynMatInputComponent', () => {
  let component: DynMatInputComponent;
  let fixture: ComponentFixture<DynMatInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DynFormsModule.forFeature(),
        MatFormFieldModule,
      ],
      declarations: [DynMatInputComponent],
      providers: [
        MockProvider(DynLogger),
        MockProvider(DynFormNode),
        {
          provide: DYN_CONTROLS_TOKEN,
          useValue: {},
          multi: true,
        },
      ],
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
