import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSelectModule } from '@angular/material/select';
import { DynFormsModule } from '@myndpm/dyn-forms';
import { DynControlNode, DynControlProvider } from '@myndpm/dyn-forms/core';
import { DynLogger } from '@myndpm/dyn-forms/logger';
import { MockProvider } from 'ng-mocks';
import { DynMatSelectComponent } from './select.component';

describe('DynMatSelectComponent', () => {
  let component: DynMatSelectComponent;
  let fixture: ComponentFixture<DynMatSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DynFormsModule.forFeature({
          controls: [{} as DynControlProvider],
        }),
        MatSelectModule,
      ],
      declarations: [DynMatSelectComponent],
      providers: [
        MockProvider(DynLogger),
        MockProvider(DynControlNode),
      ],
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
