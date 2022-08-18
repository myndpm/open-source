import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { DynLogger } from '@myndpm/dyn-forms/logger';
import { DynFormsModule } from '@myndpm/dyn-forms';
import { DynControlNode, DynControlProvider } from '@myndpm/dyn-forms/core';
import { MockProvider } from 'ng-mocks';
import { DynMatArrayComponent } from './array.component';

describe('DynMatArrayComponent', () => {
  let component: DynMatArrayComponent;
  let fixture: ComponentFixture<DynMatArrayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DynFormsModule.forFeature({
          controls: [{} as DynControlProvider],
        }),
        MatCardModule,
      ],
      declarations: [DynMatArrayComponent],
      providers: [
        MockProvider(DynLogger),
        MockProvider(DynControlNode),
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
