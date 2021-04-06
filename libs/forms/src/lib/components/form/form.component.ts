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
  DynControlContext,
  DynFormContext,
  DYN_CONTEXT,
  DYN_CONTEXT_CONTROL_DEFAULTS,
  DYN_CONTEXT_DEFAULTS,
} from '@myndpm/dyn-forms/core';
import { BehaviorSubject } from 'rxjs';
import { DynFormConfig } from './form.config';

@Component({
  selector: 'dyn-form',
  templateUrl: './form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormComponent implements OnInit, OnChanges, OnDestroy {
  @Input() form = new FormGroup({});
  @Input() config!: DynFormConfig;
  @Input() context?: DynControlContext;

  injector?: Injector;

  // stream context events via DYN_CONTEXT
  protected context$ = new BehaviorSubject<DynControlContext | undefined>(undefined);

  constructor(@Inject(INJECTOR) private parent: Injector) {}

  ngOnInit() {
    this.injector = Injector.create({
      parent: this.parent,
      providers: [
        {
          provide: DYN_CONTEXT,
          useValue: this.context$,
        },
        {
          provide: DYN_CONTEXT_DEFAULTS,
          useValue: this.config.contextParams,
        },
        {
          provide: DYN_CONTEXT_CONTROL_DEFAULTS,
          useValue: this.config.contexts,
        },
        {
          provide: DynFormContext,
          useClass: DynFormContext,
        }
      ],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.context) {
      this.context$.next(this.context);
    }
  }

  ngOnDestroy(): void {
    this.context$.complete();
  }
}
