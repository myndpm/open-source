import {
  ChangeDetectorRef,
  Directive,
  Injector,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChange,
  SimpleChanges,
} from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { DynLogger } from '@myndpm/dyn-forms/logger';
import merge from 'merge';
import { BehaviorSubject, combineLatest, isObservable, Observable, of } from 'rxjs';
import { filter, scan, startWith } from 'rxjs/operators';
import { DynBaseConfig } from './config.types';
import { DynConfigMap, DynConfigProvider } from './control-config.types';
import { DynControlVisibility } from './control-events.types';
import { DynControlMode } from './control-mode.types';
import { DynControlFunctionFn, DynControlParams } from './control-params.types';
import { DynControlType, DynInstanceType } from './control.types';
import { DynControlNode } from './dyn-control-node.class';
import { DynFormFactory } from './form-factory.service';
import { DynFormHandlers } from './form-handlers.service';
import { DYN_MODE } from './form.tokens';

@Directive()
export abstract class DynControl<
  TMode extends DynControlMode = DynControlMode,
  TParams extends DynControlParams = DynControlParams,
  TConfig extends DynBaseConfig<TMode, TParams> = DynBaseConfig<TMode, TParams>,
  TControl extends AbstractControl = FormGroup // friendlier and most-common default
>
extends DynControlNode<TParams, TControl>
implements OnInit, OnChanges, OnDestroy {

  // central place to define the provided Type
  static dynControl: DynControlType = '';
  // central place to define the provided Instance
  static dynInstance: DynInstanceType = DynInstanceType.Group;

  // optional method for modules providing a typed factory method
  // abstract static createConfig(partial: DynPartialControlConfig<TParams>): TConfig;

  // core properties
  config!: TConfig; // passed down in the hierarchy
  get params(): TParams { // values available for the concrete Component instance
    return this.params$.getValue();
  }
  get control(): TControl { // built from the config in the DynFormTreeNode
    return this.node.control;
  }

  // utility properties
  get parentControl(): FormGroup { // can be used with [formGroup]="parentControl"
    return this.node.parent.control;
  }
  get visibility$(): Observable<DynControlVisibility> {
    return this.node.visibility$.asObservable();
  }

  readonly params$ = new BehaviorSubject<TParams>({} as TParams);

  protected readonly _mode: BehaviorSubject<DynControlMode>;
  protected readonly _ref: ChangeDetectorRef;
  protected readonly _logger: DynLogger;
  protected readonly _factory: DynFormFactory;
  private readonly _handlers: DynFormHandlers;

  constructor(injector: Injector) {
    super(injector);

    this._mode = injector.get(DYN_MODE);
    this._ref = injector.get(ChangeDetectorRef);
    this._logger = injector.get(DynLogger);
    this._factory = injector.get(DynFormFactory);
    this._handlers = injector.get(DynFormHandlers);
  }

  // complete a partial specification of the required parameters
  // ensuring that all will be present in the template
  abstract completeParams(params: Partial<TParams>): TParams;

  ngOnInit(): void {
    super.ngOnInit();

    // merge any configured paramFns
    if (this.config.paramFns) {
      this.updateParams(undefined, this.config.paramFns);
    }

    // listen parameters changes after the control is ready
    combineLatest([
      isObservable(this.config.params) ? this.config.params : of(this.config.params),
      this.node.paramsUpdates$.pipe(startWith({})),
    ]).pipe(
      scan<any>((params, [config, updates]) => merge(true, params, config, updates)),
      filter(params => !Array.isArray(params)), // filters the first scan
    ).subscribe((params) => {
      // emulates ngOnChanges
      const change = new SimpleChange(this.params, this.completeParams(params), !this.params);
      this.params$.next(change.currentValue);
      this._logger.nodeParamsUpdated(this.constructor.name, this.params);

      setTimeout(() => {
        // emulates ngOnChanges and async pipe
        this.ngOnChanges({ params: change });
        this._ref.markForCheck();
      }, 1);
    });
  }

  /* eslint-disable @typescript-eslint/no-unused-vars, @angular-eslint/no-empty-lifecycle-method */
  ngOnChanges(changes?: SimpleChanges): void {
    // emulated while assigning the params as DynControls has no Inputs
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.params$.complete();
  }

  updateParams(
    newParams?: Partial<TParams>,
    newParamFns?: DynConfigMap<DynConfigProvider<DynControlFunctionFn>>
  ): void {
    this.node.paramsUpdates$.next(
      merge(true, newParams, this._handlers.getFunctions(newParamFns))
    );
  }

  // hook to refresh the form status
  hookPreSubmit(): void {
    this._ref.markForCheck();
  }
}
