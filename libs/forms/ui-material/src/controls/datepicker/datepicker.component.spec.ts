import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DynFormsModule } from '@myndpm/dyn-forms';
import { DynFormTreeNode, DYN_CONTROLS_TOKEN } from '@myndpm/dyn-forms/core';
import { DynLogger } from '@myndpm/dyn-forms/logger';
import { MockProvider } from 'ng-mocks';
import { DynMatDatepickerComponent } from './datepicker.component';

describe('DynMatDatepickerComponent', () => {
  let component: DynMatDatepickerComponent;
  let fixture: ComponentFixture<DynMatDatepickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DynFormsModule.forFeature(),
        MatFormFieldModule,
        MatDatepickerModule,
        MatDialogModule,
        MatNativeDateModule,
      ],
      declarations: [DynMatDatepickerComponent],
      providers: [
        MockProvider(DynLogger),
        MockProvider(DynFormTreeNode),
        {
          provide: DYN_CONTROLS_TOKEN,
          useValue: {},
          multi: true,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DynMatDatepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
