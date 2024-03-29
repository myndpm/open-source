import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio';
import { DynFormsModule } from '@myndpm/dyn-forms';
import { DynControlNode } from '@myndpm/dyn-forms/core';
import { DynLogger } from '@myndpm/dyn-forms/logger';
import { MockProvider } from 'ng-mocks';
import { DynMatRadioComponent } from './radio.component';

describe('DynMatRadioComponent', () => {
  let component: DynMatRadioComponent;
  let fixture: ComponentFixture<DynMatRadioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DynFormsModule.forFeature({
          controls: [],
        }),
        MatRadioModule,
      ],
      declarations: [DynMatRadioComponent],
      providers: [
        MockProvider(DynLogger),
        MockProvider(DynControlNode),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DynMatRadioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
