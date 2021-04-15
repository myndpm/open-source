import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSelectModule } from '@angular/material/select';
import { DynFormsModule } from '@myndpm/dyn-forms';
import { DynFormTreeNode, DYN_CONTROLS_TOKEN } from '@myndpm/dyn-forms/core';
import { DynLogger } from '@myndpm/dyn-forms/logger';
import { MockProvider } from 'ng-mocks';
import { DynMatSelectComponent } from './select.component';

describe('DynMatSelectComponent', () => {
  let component: DynMatSelectComponent;
  let fixture: ComponentFixture<DynMatSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DynFormsModule.forFeature(),
        MatSelectModule,
      ],
      declarations: [DynMatSelectComponent],
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
    fixture = TestBed.createComponent(DynMatSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
