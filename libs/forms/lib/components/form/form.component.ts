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
import { FormGroup, FormGroupDirective } from '@angular/forms';
import {
  DynControlMode,
  DynFormMode,
  DynFormTreeNode,
  DYN_MODE,
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

  // registered hook listeners
  protected listeners = new Map<string, Function[]>();

  // easier <dyn-form #dyn> and dyn.control.*
  get control() {
    return this.node.control;
  }

  // works in AfterViewInit
  valueChanges = (time: number = 50): Observable<any> => {
    // this omit the consecutive changes while patching a Form Array
    // the more complex the form is, the more debounce would be needed
    return this.form.valueChanges.pipe(debounceTime(time));
  }

  constructor(
    @Inject(INJECTOR) private readonly injector: Injector,
    private readonly ref: ChangeDetectorRef,
    private readonly node: DynFormTreeNode,
    private readonly logger: DynLogger,
    private readonly parent?: FormGroupDirective,
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
    this.node.load({
      isolated: Boolean(this.isolated),
      errorMsgs: this.config?.errorMsgs,
    });
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
          useValue: this.config?.modes,
        },
        {
          provide: DynFormMode,
          useClass: DynFormMode,
          deps: [ // FIXME added for Stackblitz
            DYN_MODE,
            DYN_MODE_DEFAULTS,
          ],
        }
      ],
    });

    // call hooks when the form is submitted
    this.parent?.ngSubmit.subscribe((event: Event) => {
      this.callHook('PreSubmit', event, true);
      if (!event.defaultPrevented) {
        this.callHook('Submit', this.form.value);
      }
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
      // validate the expected payload
      if (!plain && (!payload || !fieldName || !Object.prototype.hasOwnProperty.call(payload, fieldName))) {
        return;
      }
      node.callHook({
        hook,
        payload: !plain ? payload[fieldName!] : payload,
        plain,
      });
    });
    // invoke listeners after the field hooks
    if (this.listeners.has(hook)) {
      this.listeners.get(hook)?.map(listener => listener(payload));
    }
  }

  // register hook listener
  addHookListener(hook: string, listener: Function): void {
    if (!this.listeners.has(hook)) {
      this.listeners.set(hook, []);
    }
    this.listeners.get(hook)!.push(listener);
  }

  // submit via FormDirective
  submit() {
    const event = new Event('submit', { cancelable: true });
    this.parent?.ngSubmit.emit(event);
  }
}
