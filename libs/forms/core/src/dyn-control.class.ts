import {
  ChangeDetectorRef,
  Directive,
  Injector,
  OnChanges,
  OnInit,
  SimpleChange,
  SimpleChanges,
} from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { DynLogger } from '@myndpm/dyn-forms/logger';
import merge from 'merge';
import { BehaviorSubject, isObservable, merge as mergeStreams, Observable, of } from 'rxjs';
import { scan } from 'rxjs/operators';
import { DynBaseConfig } from './config.types';
import { DynConfigMap, DynConfigProvider } from './control-config.types';
import { DynControlVisibility } from './control-events.types';
import { DynControlMode } from './control-mode.types';
import { DynControlParams } from './control-params.types';
import { DynControlType, DynInstanceType } from './control.types';
import { DynControlNode } from './dyn-control-node.class';
import { DynFormFactory } from './form-factory.service';
import { DynFormHandlers } from './form-handlers.service';

@Directive()
export abstract class DynControl<
  TMode extends DynControlMode = DynControlMode,
  TParams extends DynControlParams = DynControlParams,
  TConfig extends DynBaseConfig<TMode, TParams> = DynBaseConfig<TMode, TParams>,
  TControl extends AbstractControl = FormGroup // friendlier and most-common default
>
extends DynControlNode<TParams, TControl>
implements OnInit, OnChanges {

  // central place to define the provided Type
  static dynControl: DynControlType = '';
  // central place to define the provided Instance
  static dynInstance: DynInstanceType = DynInstanceType.Group;

  // optional method for modules providing a typed factory method
  // abstract static createConfig(partial?: DynPartialControlConfig<TParams>): TConfig;

  config!: TConfig; // passed down in the hierarchy
  get params(): TParams { // values available for the concrete Component instance
    return this.params$.getValue();
  }
  get control(): TControl { // built from the config in the DynFormTreeNode
    return this.node.control;
  }
  get parentControl(): AbstractControl { // utility getter for the form directives
    return this.node.parent.control;
  }
  get visibility$(): Observable<DynControlVisibility> {
    return this.node.visibility$.asObservable();
  }

  readonly params$ = new BehaviorSubject<TParams>({} as TParams);

  protected readonly _ref: ChangeDetectorRef;
  protected readonly _logger: DynLogger;
  protected readonly _formFactory: DynFormFactory;
  private readonly _formHandlers: DynFormHandlers;

  constructor(injector: Injector) {
    super(injector);

    this._ref = injector.get(ChangeDetectorRef);
    this._logger = injector.get(DynLogger);
    this._formFactory = injector.get(DynFormFactory);
    this._formHandlers = injector.get(DynFormHandlers);
  }

  // complete a partial specification of the required parameters
  // ensuring that all will be present in the template
  abstract completeParams(params: Partial<TParams>): TParams;

  ngOnInit(): void {
    super.ngOnInit();

    // listen parameters changes after the control is ready
    mergeStreams(
      isObservable(this.config.params) ? this.config.params : of(this.config.params),
      this.node.paramsUpdates$,
    )
    .pipe(
      scan((params, updates) => merge(true, params, updates), {})
    )
    .subscribe((params) => {
      // emulates ngOnChanges
      const change = new SimpleChange(this.params, this.completeParams(params), !this.params);
      this.params$.next(change.currentValue);
      this.ngOnChanges({ params: change });

      this._logger.nodeParamsUpdated(this.constructor.name, this.params);

      // emulates the async pipe
      this._ref.markForCheck();
    });

    if (this.config.paramFns) {
      this.updateParams(undefined, this.config.paramFns);
    }
  }

  /* eslint-disable @typescript-eslint/no-unused-vars, @angular-eslint/no-empty-lifecycle-method */
  ngOnChanges(changes?: SimpleChanges): void {
    // emulated while assigning the params as DynControls has no Inputs
  }

  updateParams(
    newParams?: Partial<TParams>,
    newParamFns?: DynConfigMap<DynConfigProvider>
  ): void {
    this.node.paramsUpdates$.next(
      merge(true, newParams, this._formHandlers.getFunctions(newParamFns))
    );
  }
}
