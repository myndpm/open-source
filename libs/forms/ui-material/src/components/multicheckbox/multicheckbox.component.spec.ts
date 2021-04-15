import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DynLogger } from '@myndpm/dyn-forms/logger';
import { DynFormsModule } from '@myndpm/dyn-forms';
import { DynFormTreeNode, DYN_CONTROLS_TOKEN } from '@myndpm/dyn-forms/core';
import { MockProvider } from 'ng-mocks';
import { DynMatMulticheckboxComponent } from './multicheckbox.component';

describe('DynMatMulticheckboxComponent', () => {
  let component: DynMatMulticheckboxComponent;
  let fixture: ComponentFixture<DynMatMulticheckboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DynFormsModule.forFeature(),
        MatCheckboxModule,
      ],
      declarations: [DynMatMulticheckboxComponent],
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
    fixture = TestBed.createComponent(DynMatMulticheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
