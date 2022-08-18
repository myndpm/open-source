import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DynFormsModule } from '@myndpm/dyn-forms';
import { DynControlNode, DynControlProvider } from '@myndpm/dyn-forms/core';
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
        DynFormsModule.forFeature({
          controls: [{} as DynControlProvider],
        }),
      ],
      declarations: [
        DynMatContainerComponent
      ],
      providers: [
        DynLogger,
        {
          provide: DynControlNode,
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
