import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { DynLogger } from '@myndpm/dyn-forms/logger';
import { DynFormsModule } from '@myndpm/dyn-forms';
import { DynFormTreeNode, DYN_CONTROLS_TOKEN } from '@myndpm/dyn-forms/core';
import { MockProvider } from 'ng-mocks';
import { DynMatArrayComponent } from './array.component';

describe('DynMatArrayComponent', () => {
  let component: DynMatArrayComponent;
  let fixture: ComponentFixture<DynMatArrayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DynFormsModule.forFeature(),
        MatCardModule,
      ],
      declarations: [DynMatArrayComponent],
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
    fixture = TestBed.createComponent(DynMatArrayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
