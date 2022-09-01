import {
  INJECTOR,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
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
  DynControlNode,
  DynFormResolver,
  DynHookUpdateValidity,
  DynInstanceType,
  DynMode,
  DynModes,
  callHooks,
  onComplete,
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
    DynControlNode,
    DynLogDriver,
    DynLogger,
  ],
})
export class DynFormComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  @Input() isolated = false;
  @Input() form!: FormGroup;
  @Input() config?: DynFormConfig;
  @Input() mode?: DynMode;

  @Input()
  modeConfigs = (parent?: DynModes, local?: DynModes): DynModes => {
    return parent && local ? recursive(true, parent, local) : local ?? parent;
  }

  // internal injector with config values
  configLayer?: Injector;

  // stream mode changes via DYN_MODE
  protected mode$ = new BehaviorSubject<DynMode>('');

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
    private readonly node: DynControlNode,
    private readonly logger: DynLogger,
  ) {}

  ngOnInit() {
    if (this.config?.debug) {
      this.logger.setLevel(this.config.debug);
    }

    // figure out the control to use
    if (!this.isolated && !this.form && this.node.parent) {
      // use the parent DynControlNode control
      this.form = this.node.parent.control;
    } else {
      // incoming form is mandatory
      if (!(this.form instanceof FormGroup)) {
        throw this.logger.rootForm();
      }
    }

    // manually register the node
    this.node.init({
      isolated: Boolean(this.isolated),
      instance: DynInstanceType.Group,
      control: 'DYN-FORM',
      formControl: this.form,
      controls: this.controls,
      errorMsgs: this.config?.errorMsgs,
      component: this,
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
          provide: DynFormResolver,
          useClass: DynFormResolver,
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
        this.node.setup();
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.mode && typeof this.mode === 'string') {
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

  track(mode?: DynMode): Observable<void> {
    return this.callHook('Track', mode, false, true);
  }

  untrack(mode?: DynMode): Observable<void> {
    return this.callHook('Untrack', mode, true);
  }

  // notify the dyn hierarchy about the incoming data
  patchValue(value: any, callback?: (node: DynControlNode) => void): Observable<void> {
    return onComplete(
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
          this.form.patchValue(value);
          this.logger.formCycle('PostPatch', this.form.value);
          this.callHook('PostPatch', value, false);
          this.callHook('DetectChanges', undefined, true);
        }),
      ),
      () => callback?.(this.node),
    );
  }

  // update the validators programatically
  validate(opts?: DynHookUpdateValidity): Observable<void> {
    return this.callHook('UpdateValidity', opts);
  }

  // trigger change detection programatically
  detectChanges(): Observable<void> {
    return this.callHook('DetectChanges');
  }

  // call a hook in the dyn hierarchy using plain/hierarchical data
  callHook(hook: string, payload?: any, plain = true, force = false): Observable<void> {
    return onComplete(
      this.whenReady(),
      () => {
        callHooks(this.node.children, { hook, payload, plain }, force);
        // invoke listeners after the field hooks
        if (this.listeners.has(hook)) {
          this.listeners.get(hook)?.map(listener => listener(payload));
        }
      },
    );
  }

  // register hook listener
  addHookListener(hook: string, listener: Function): void {
    if (!this.listeners.has(hook)) {
      this.listeners.set(hook, []);
    }
    this.listeners.get(hook)!.push(listener);
  }
}
