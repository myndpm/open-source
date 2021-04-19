import {
  AfterViewInit,
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
  SimpleChanges,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  DynControlMode,
  DynFormMode,
  DynFormTreeNode,
  DYN_MODE,
  DYN_MODE_CONTROL_DEFAULTS,
  DYN_MODE_DEFAULTS,
} from '@myndpm/dyn-forms/core';
import { DynLogger } from '@myndpm/dyn-forms/logger';
import { BehaviorSubject, Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { DynFormConfig } from './form.config';

@Component({
  selector: 'dyn-form',
  templateUrl: './form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DynFormTreeNode],
})
export class DynFormComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  @Input() isolated = false;
  @Input() form!: FormGroup;
  @Input() config?: DynFormConfig;
  @Input() mode?: DynControlMode;

  // internal injector with config values
  configLayer?: Injector;

  // stream mode changes via DYN_MODE
  protected mode$ = new BehaviorSubject<DynControlMode | undefined>(undefined);

  // easier <dyn-form #dyn> and dyn.control.*
  get control() {
    return this.node.control;
  }

  // works in AfterViewInit
  valueChanges = (time: number = 100): Observable<any> => {
    // this omit the consecutive changes while patching a Form Array
    // the more complex the form is, the more debounce would be needed
    return this.form.valueChanges.pipe(debounceTime(time));
  }

  constructor(
    @Inject(INJECTOR) private readonly injector: Injector,
    private readonly ref: ChangeDetectorRef,
    private readonly node: DynFormTreeNode,
    private readonly logger: DynLogger,
  ) {}

  ngOnInit() {
    // figure out the control to use
    if (!this.isolated && !this.form && this.node.parent) {
      // use the parent DynFormTreeNode control
      this.form = this.node.parent.control;
    } else {
      // incoming form is mandatory
      if (!(this.form instanceof FormGroup)) {
        throw this.logger.rootForm();
      }
    }

    // manually register the node
    this.node.setControl(this.form)
    this.node.load({ isolated: Boolean(this.isolated) });
    this.logger.nodeLoaded('dyn-form', this.node.path);

    this.configLayer = Injector.create({
      parent: this.injector,
      providers: [
        {
          provide: DYN_MODE,
          useValue: this.mode$,
        },
        // TODO merge with parent values
        {
          provide: DYN_MODE_DEFAULTS,
          useValue: this.config?.modeParams,
        },
        {
          provide: DYN_MODE_CONTROL_DEFAULTS,
          useValue: this.config?.modes,
        },
        {
          provide: DynFormMode,
          useClass: DynFormMode,
          deps: [ // FIXME added for Stackblitz
            DYN_MODE,
            DYN_MODE_DEFAULTS,
            DYN_MODE_CONTROL_DEFAULTS,
          ],
        }
      ],
    });

    // prevent ExpressionChangedAfterItHasBeenCheckedError
    this.ref.detectChanges();
  }

  ngAfterViewInit(): void {
    // trigger processes once the form is built
    this.node.afterViewInit()
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
  callHook(hook: string, payload: any, plain = false): void {
    this.node.children.forEach(node => {
      const fieldName = node.name;
      node.callHook({
        hook,
        payload: !plain && fieldName && Object.prototype.hasOwnProperty.call(payload, fieldName)
          ? payload[fieldName]
          : payload,
        plain,
      });
    });
  }
}
