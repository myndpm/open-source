import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { DynFormsModule } from '@myndpm/dyn-forms';
import { DynControlNode } from '@myndpm/dyn-forms/core';
import { DynLogger } from '@myndpm/dyn-forms/logger';
import { MockProvider } from 'ng-mocks';
import { DynMatCheckboxComponent } from './checkbox.component';

describe('DynMatCheckboxComponent', () => {
  let component: DynMatCheckboxComponent;
  let fixture: ComponentFixture<DynMatCheckboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DynFormsModule.forFeature({
          controls: [],
        }),
        MatFormFieldModule,
      ],
      declarations: [DynMatCheckboxComponent],
      providers: [
        MockProvider(DynLogger),
        MockProvider(DynControlNode),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DynMatCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
