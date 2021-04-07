import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  INJECTOR,
  Injector,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  QueryList,
  SimpleChanges,
  ViewChildren,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  DynControlMode,
  DynFormMode,
  DYN_MODE,
  DYN_MODE_CONTROL_DEFAULTS,
  DYN_MODE_DEFAULTS,
} from '@myndpm/dyn-forms/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { DynFactoryComponent } from '../factory/factory.component';
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

  @ViewChildren(DynFactoryComponent)
  factories!: QueryList<DynFactoryComponent>;

  injector?: Injector;

  // works fine AfterViewInit
  valueChanges(time: number = 100): Observable<any> {
    // this omit the consecutive changes while patching a Form Array
    // the more complex the form is, the more debounce would be needed
    return this.form.valueChanges.pipe(debounceTime(time));
  }

  // stream mode changes via DYN_MODE
  protected mode$ = new BehaviorSubject<DynControlMode | undefined>(undefined);

  constructor(
    @Inject(INJECTOR) private parent: Injector,
    private _ref: ChangeDetectorRef,
  ) {}

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
          deps: [
            DYN_MODE,
            DYN_MODE_DEFAULTS,
            DYN_MODE_CONTROL_DEFAULTS,
          ],
        }
      ],
    });

    // prevent ExpressionChangedAfterItHasBeenCheckedError
    this._ref.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.mode) {
      this.mode$.next(this.mode);
    }
  }

  ngOnDestroy(): void {
    this.mode$.complete();
  }

  // notify the dynControls about the incoming data
  patchValue(value: any): void {
    this.callHook('PrePatch', value);
    this.form.patchValue(value);
    this.callHook('PostPatch', value);
  }

  // call a hook in the dynControls using plain/hierarchical data
  callHook(hook: string, payload: any, plainPayload = false): void {
    this.factories.forEach(factory => {
      const fieldName = factory.config.name;
      factory.callHook(
        hook,
        !plainPayload && fieldName && payload?.hasOwnProperty(fieldName)
          ? payload[fieldName]
          : payload,
        plainPayload,
      );
    });
  }
}
