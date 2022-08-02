import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DynFormsModule } from '@myndpm/dyn-forms';
import { DYN_CONTROLS_TOKEN, DynFormTreeNode } from '@myndpm/dyn-forms/core';
import { DynLogger } from '@myndpm/dyn-forms/logger';
import { of } from 'rxjs';

import { DynMatContainerComponent } from './container.component';

describe('DynMatContainerComponent', () => {
  let component: DynMatContainerComponent;
  let fixture: ComponentFixture<DynMatContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        DynFormsModule.forFeature(),
      ],
      declarations: [
        DynMatContainerComponent
      ],
      providers: [
        DynLogger,
        {
          provide: DYN_CONTROLS_TOKEN,
          useValue: {},
          multi: true,
        },
        {
          provide: DynFormTreeNode,
          useValue: {
            _name: 'test',
            _control: 'CONTROL',
            hook$: of(),
            path: [],
            parent: {
              control: new FormGroup({ test: new FormControl() }),
            },
            onInit: () => {},
          },
        },
      ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DynMatContainerComponent);
    component = fixture.componentInstance;
    component.config = {
      control: DynMatContainerComponent.dynControl,
      name: 'test',
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
