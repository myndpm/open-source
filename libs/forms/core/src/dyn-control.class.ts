import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Directive,
  HostBinding,
  Injector,
  OnChanges,
  OnInit,
  SimpleChange,
  SimpleChanges,
  Type,
} from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { DynLogger } from '@myndpm/dyn-forms/logger';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, scan, startWith, takeUntil } from 'rxjs/operators';
import { DynBaseConfig } from './types/config.types';
import { DynControlId } from './types/control.types';
import { DynHookUpdateValidity } from './types/events.types';
import { DynInstanceType } from './types/forms.types';
import { DynMode } from './types/mode.types';
import { DynParams } from './types/params.types';
import { DynBaseProvider } from './types/provider.types';
import { getWrapperId } from './utils/config.utils';
import { DynControlBase } from './dyn-control-base.class';
import { DynFormFactory } from './form-factory.service';
import { DynFormHandlers } from './form-handlers.service';
import { DYN_MODE } from './form.tokens';

export type AbstractDynControl = DynControl<DynMode, any, DynBaseConfig, AbstractControl>;

export interface DynControlProvider extends DynBaseProvider {
  control: DynControlId;
  instance: DynInstanceType;
  component: Type<AbstractDynControl>;
}

@Directive()
export abstract class DynControl<
  TMode extends DynMode = DynMode,
  TParams extends DynParams = DynParams,
  TConfig extends DynBaseConfig<TMode, TParams> = DynBaseConfig<TMode, TParams>,
  TControl extends AbstractControl = FormGroup // friendlier and most-common default
>
extends DynControlBase<TParams, TControl>
implements OnInit, AfterViewInit, AfterViewChecked, OnChanges {

  // central place to define the provided Id
  static dynControl: DynControlId = '';
  // central place to define the provided Instance
  static dynInstance: DynInstanceType = DynInstanceType.Group;

  // optional method for modules providing a typed factory method
  // abstract static createConfig(partial: DynPartialControlConfig<TParams>): TConfig;

  // core properties
  config!: TConfig; // passed down in the hierarchy
  get params(): TParams { // values available for the concrete Component instance
    return this.node.params;
  }
  get control(): TControl { // built from the config in the DynControlNode
    return this.node.control;
  }
  get parentControl(): FormGroup { // can be used with [formGroup]="parentControl"
    return this.node.parent.control;
  }

  // utility properties
  get mode$(): Observable<DynMode> {
    return this.node.mode$;
  }
  get params$(): Observable<TParams> {
    return this.node.params$;
  }
  get id(): string {
    if (this._id) {
      return this._id;
    }
    const array = new Uint32Array(8);
    window?.crypto?.getRandomValues(array);
    for (let i = 0; i < array.length; i++) {
      this._id += (i < 2 || i > 5 ? '' : '-') + array[i].toString(16).slice(-4);
    }
    return this._id;
  }
  private _id = '';

  @HostBinding('class')
  get cssClass(): string {
    // add classes only once to the top level component
    if (this.config.wrappers?.length && this.node.dynId !== getWrapperId(this.config.wrappers[0])) {
      return '';
    }
    return [
      this.config.cssClass,
      // add the visibility class
      this.node.visibility && this.node.visibility !== 'VISIBLE' ? `dyn-${this.node.visibility.toLowerCase()}` : null,
      // add a generic class
      'dyn-control',
      // add a default class based on the name
      this.config.name ? `dyn-control-${this.config.name}` : null,
      this.config.name && this.node.instance === DynInstanceType.Control ? `dyn-control-${this.config.name}` : null,
    ].filter(Boolean).join(' ');
  }

  protected readonly _mode: BehaviorSubject<DynMode>;
  protected readonly _ref: ChangeDetectorRef;
  protected readonly _logger: DynLogger;
  protected readonly _factory: DynFormFactory;
  protected readonly _handlers: DynFormHandlers;

  constructor(injector: Injector) {
    super(injector);

    this._mode = injector.get(DYN_MODE);
    this._ref = injector.get(ChangeDetectorRef);
    this._logger = injector.get(DynLogger);
    this._factory = injector.get(DynFormFactory);
    this._handlers = injector.get(DynFormHandlers);
  }

  ngOnInit(): void {
    super.ngOnInit();

    // wire additional change detection when there are ng-templates
    this.node.control.valueChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => setTimeout(() => this._ref.detectChanges(), 1));

    // listen node.visibility$
    this.node.visibility$
      .pipe(
        startWith(this.config.visibility || 'VISIBLE'),
        takeUntil(this.onDestroy$),
        distinctUntilChanged(),
      )
      .subscribe(() => this._ref.markForCheck());

    this.params$.pipe(
      scan(
        (previous, params) => {
          // emulates ngOnChanges
          const change = new SimpleChange(previous ?? {}, params, !previous);
          this._logger.nodeParamsUpdated(this.node, this.constructor.name, change.currentValue);

          setTimeout(() => {
            // emulates ngOnChanges and async pipe
            this.ngOnChanges({ params: change });
            this.node.markParamsAsLoaded();
            this._ref.markForCheck();
          }, 1);

          return change.currentValue;
        },
        undefined,
      ),
    ).subscribe();
  }

  ngAfterViewInit(): void {
    this.node.markAsLoaded();
  }

  ngAfterViewChecked(): void {
    this.node.markAsLoaded();
  }

  /* eslint-disable @typescript-eslint/no-unused-vars, @angular-eslint/no-empty-lifecycle-method */
  ngOnChanges(changes?: SimpleChanges): void {
    // emulated while assigning the params as DynControls has no Inputs
  }

  // complete a partial specification of the required parameters
  // ensuring that all will be present in the template to avoid exceptions
  completeParams(params: Partial<TParams>): TParams {
    return params as TParams;
  }

  /**
   * Hooks
   */

  // start tracking
  hookTrack(mode?: DynMode): void {
    this.node.track(mode);
  }

  // untrack signal
  hookUntrack(mode?: DynMode): void {
    this.node.untrack(mode);
  }

  // post patch hook needs refreshing
  hookPostPatch(): void {
    if (this.node.instance !== DynInstanceType.Container) { // ngAfterViewChecked not called
      this.node.markAsPending();
      this._ref.markForCheck();
    }
  }

  // hook to refresh the form status
  hookUpdateValidity(opts: DynHookUpdateValidity = { onlySelf: true }): void {
    this.control.updateValueAndValidity(opts);
    this._ref.markForCheck();
  }

  // hook to detect changes on this control
  hookDetectChanges(): void {
    this._ref.markForCheck();
  }
}
