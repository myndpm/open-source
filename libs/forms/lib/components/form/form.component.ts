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
  Optional,
  SimpleChanges,
  SkipSelf,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  DYN_MODE,
  DYN_MODE_DEFAULTS,
  DYN_MODE_LOCAL,
  DynControlMode,
  DynControlModes,
  DynFormConfigResolver,
  DynFormTreeNode,
  DynHookUpdateValidity,
  recursive,
} from '@myndpm/dyn-forms/core';
import { DynLogDriver, DynLogger } from '@myndpm/dyn-forms/logger';
import { BehaviorSubject, Observable } from 'rxjs';
import { debounceTime, delay, filter, switchMap, tap } from 'rxjs/operators';
import { DynFormConfig } from './form.config';

@Component({
  selector: 'dyn-form',
  templateUrl: './form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    DynLogDriver,
    DynLogger,
    DynFormTreeNode,
  ],
})
export class DynFormComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  @Input() isolated = false;
  @Input() form!: FormGroup;
  @Input() config?: DynFormConfig;
  @Input() mode?: DynControlMode;

  @Input()
  modeConfigs = (parent?: DynControlModes, local?: DynControlModes): DynControlModes => {
    return parent && local ? recursive(true, parent, local) : local ?? parent;
  }

  // internal injector with config values
  configLayer?: Injector;

  // stream mode changes via DYN_MODE
  protected mode$ = new BehaviorSubject<DynControlMode | undefined>(undefined);

  // registered hook listeners
  protected listeners = new Map<string, Function[]>();

  // easier access <dyn-form #dyn> to dyn.control.*
  get control() {
    return this.node.control;
  }

  get controls() {
    return this.config?.controls.filter(Boolean);
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
  ) {}

  ngOnInit() {
    if (this.config?.debug) {
      this.logger.setLevel(this.config.debug);
    }

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
      controls: this.controls,
      errorMsgs: this.config?.errorMsgs,
    });
    this.node.markParamsAsLoaded();
    this.logger.nodeLoaded('dyn-form', this.node);

    this.configLayer = Injector.create({
      parent: this.injector,
      providers: [
        {
          provide: DYN_MODE,
          useValue: this.mode$,
        },
        {
          provide: DYN_MODE_LOCAL,
          useValue: this.config?.modes,
        },
        {
          provide: DYN_MODE_DEFAULTS,
          useFactory: this.modeConfigs,
          deps: [
            [new SkipSelf(), new Optional(), DYN_MODE_DEFAULTS],
            DYN_MODE_LOCAL,
          ],
        },
        {
          provide: DynFormConfigResolver,
          useClass: DynFormConfigResolver,
          deps: [ // FIXME added for Stackblitz
            DynLogger,
            DYN_MODE_DEFAULTS,
          ],
        },
      ],
    });

    // prevent ExpressionChangedAfterItHasBeenCheckedError
    this.ref.detectChanges();
  }

  ngAfterViewInit(): void {
    this.node.markAsLoaded();

    this.node.loaded$
      .pipe(filter(Boolean))
      .subscribe(() => {
        this.logger.formCycle('loaded');
        // trigger processes once the form hierarchy is built
        this.node.setupListeners();
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.mode) {
      this.logger.modeForm(this.node, this.mode);
      this.mode$.next(this.mode);
    }
  }

  ngOnDestroy(): void {
    this.mode$.complete();
  }

  /**
   * API
   */

  whenReady(): Observable<boolean> {
    return this.node.whenReady();
  }

  track(mode?: DynControlMode): void {
    this.callHook('Track', mode, false, true);
  }

  untrack(mode?: DynControlMode): void {
    this.callHook('Untrack', mode, true);
  }

  // notify the dynControls about the incoming data
  patchValue(value: any, callback?: (node: DynFormTreeNode) => void): void {
    this.whenReady().pipe(
      tap(() => {
        this.node.markAsPending();
        this.logger.formCycle('PrePatch');
        this.callHook('PrePatch', value, false);
      }),
      delay(20), // waits any PrePatch loading change
      switchMap(() => {
        this.node.markAsLoaded();
        return this.whenReady();
      }),
      tap(() => {
        this.logger.formCycle('PostPatch', this.form.value);
        this.form.patchValue(value);
        this.callHook('PostPatch', value, false);
      }),
    ).subscribe(() => {
      if (callback) {
        callback(this.node);
      }
    });
  }

  // update the validators programatically
  validate(opts?: DynHookUpdateValidity): void {
    this.callHook('UpdateValidity', opts);
  }

  // trigger change detection programatically
  detectChanges(): void {
    this.callHook('DetectChanges');
  }

  // call a hook in the dynControls using plain/hierarchical data
  callHook(hook: string, payload?: any, plain = true, force = false): void {
    this.whenReady().subscribe(() => {
      this.node.children.forEach(node => {
        const fieldName = node.name;
        // validate the expected payload
        if (!force && !plain && (!payload || fieldName && !Object.prototype.hasOwnProperty.call(payload, fieldName))) {
          return;
        }
        node.callHook({
          hook,
          payload: !force && !plain && fieldName ? payload[fieldName!] : payload,
          plain,
        });
      });
      // invoke listeners after the field hooks
      if (this.listeners.has(hook)) {
        this.listeners.get(hook)?.map(listener => listener(payload));
      }
    });
  }

  // register hook listener
  addHookListener(hook: string, listener: Function): void {
    if (!this.listeners.has(hook)) {
      this.listeners.set(hook, []);
    }
    this.listeners.get(hook)!.push(listener);
  }
}
