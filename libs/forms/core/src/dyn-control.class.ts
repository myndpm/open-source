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
import { isObservable, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DynBaseConfig } from './config.types';
import { DynControlMode } from './control-mode.types';
import { DynControlParams } from './control-params.types';
import { DynControlType, DynInstanceType } from './control.types';
import { DynControlNode } from './dyn-control-node.class';
import { DynFormFactory } from './form-factory.service';

@Directive()
export abstract class DynControl<
  TMode extends DynControlMode = DynControlMode,
  TParams extends DynControlParams = DynControlParams,
  TConfig extends DynBaseConfig<TMode, TParams> = DynBaseConfig<TMode, TParams>,
  TControl extends AbstractControl = FormGroup // friendlier and most-common default
>
extends DynControlNode<TControl>
implements OnInit, OnChanges, OnDestroy {

  // central place to define the provided Type
  static dynControl: DynControlType = '';
  // central place to define the provided Instance
  static dynInstance: DynInstanceType = DynInstanceType.Group;

  // optional method for modules providing a typed factory method
  // abstract static createConfig(partial?: DynPartialControlConfig<TParams>): TConfig;

  config!: TConfig; // passed down in the hierarchy
  params!: TParams; // values available for the concrete Component instance
  get control(): TControl { // built from the config in the DynFormTreeNode
    return this.node.control;
  }

  protected _logger: DynLogger;
  protected _formFactory: DynFormFactory;
  protected _ref: ChangeDetectorRef;
  protected _paramsChanged = new Subject<void>();

  constructor(injector: Injector) {
    super(injector);

    this._logger = injector.get(DynLogger);
    this._formFactory = injector.get(DynFormFactory);
    this._ref = injector.get(ChangeDetectorRef);
  }

  // complete a partial specification of the required parameters
  // ensuring that all will be present in the template
  abstract completeParams(params: Partial<TParams>): TParams;

  ngOnInit(): void {
    super.ngOnInit();

    // assign incoming parameters after the control is ready
    this.setParams(this.config.params);
  }

  /* eslint-disable @typescript-eslint/no-unused-vars, @angular-eslint/no-empty-lifecycle-method */
  ngOnChanges(changes?: SimpleChanges): void {
    // emulated while assigning the params as DynControls has no Inputs
  }

  ngOnDestroy(): void {
    this._paramsChanged.next();
    this._paramsChanged.complete();

    super.ngOnDestroy();
  }

  setParams(params?: Partial<TParams> | Observable<Partial<TParams>>): void {
    const updateParams = (newParams: Partial<TParams>): void => {
      // emulates ngOnChanges
      const change = new SimpleChange(this.params, this.completeParams(newParams), !this.params);
      this.params = change.currentValue;
      this.ngOnChanges({ params: change });

      this._logger.nodeParamsUpdated(this.constructor.name, this.params);

      // emulates the async pipe
      this._ref.markForCheck();
    }

    this._paramsChanged.next();

    // update params
    if (!isObservable(params)) {
      updateParams(params || {});
    } else {
      params.pipe(takeUntil(this._paramsChanged)).subscribe({
        next: (values) => updateParams(values),
      });
    }
  }
}
