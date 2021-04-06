import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  INJECTOR,
  Injector,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  DynControlMode,
  DynFormMode,
  DYN_MODE,
  DYN_MODE_CONTROL_DEFAULTS,
  DYN_MODE_DEFAULTS,
} from '@myndpm/dyn-forms/core';
import { BehaviorSubject } from 'rxjs';
import { DynFormConfig } from './form.config';

@Component({
  selector: 'dyn-form',
  templateUrl: './form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynFormComponent implements OnInit, OnChanges, OnDestroy {
  @Input() form = new FormGroup({});
  @Input() config!: DynFormConfig;
  @Input() mode?: DynControlMode;

  injector?: Injector;

  // stream mode changes via DYN_MODE
  protected mode$ = new BehaviorSubject<DynControlMode | undefined>(undefined);

  constructor(@Inject(INJECTOR) private parent: Injector) {}

  ngOnInit() {
    this.injector = Injector.create({
      parent: this.parent,
      providers: [
        {
          provide: DYN_MODE,
          useValue: this.mode$,
        },
        {
          provide: DYN_MODE_DEFAULTS,
          useValue: this.config.modeParams,
        },
        {
          provide: DYN_MODE_CONTROL_DEFAULTS,
          useValue: this.config.modes,
        },
        {
          provide: DynFormMode,
          useClass: DynFormMode,
        }
      ],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.mode) {
      this.mode$.next(this.mode);
    }
  }

  ngOnDestroy(): void {
    this.mode$.complete();
  }
}
