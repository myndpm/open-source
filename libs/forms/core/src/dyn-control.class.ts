import {
  ChangeDetectorRef,
  Directive,
  Injector,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { isObservable, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DynBaseConfig } from './config.types';
import { DynControlMode } from './control-mode.types';
import { DynControlParams } from './control-params.types';
import { DynControlType, DynInstanceType } from './control.types';
import { DynFormFactory } from './form-factory.service';
import { DynFormNode } from './form-node.service';
import { DynLogger } from './logger';

@Directive()
export abstract class DynControl<
  TMode extends DynControlMode = DynControlMode,
  TParams extends DynControlParams = DynControlParams,
  TConfig extends DynBaseConfig<TMode, TParams> = DynBaseConfig<TMode, TParams>,
  TControl extends AbstractControl = FormGroup // friendlier and most-common default
> implements OnInit, OnDestroy {
  // central place to define the provided Type
  static dynControl: DynControlType = '';
  // central place to define the provided Instance
  static dynInstance: DynInstanceType = DynInstanceType.Group;

  // optional method for modules providing a typed factory method
  // abstract static createConfig(partial?: DynPartialControlConfig<TParams>): TConfig;

  node: DynFormNode<TControl>; // corresponding node

  config!: TConfig; // passed down in the hierarchy
  control!: TControl; // built from the config by the abstract classes
  params!: TParams; // values available for the concrete Component instance

  protected _logger: DynLogger;
  protected _formFactory: DynFormFactory;
  protected _ref: ChangeDetectorRef;
  protected _paramsChanged = new Subject<void>();
  protected _unsubscribe = new Subject<void>();

  constructor(injector: Injector) {
    this._logger = injector.get(DynLogger);
    this._formFactory = injector.get(DynFormFactory);
    this._ref = injector.get(ChangeDetectorRef);

    this.node = injector.get(DynFormNode);
  }

  ngOnInit(): void {
    // assign incoming parameters
    this.setParams(this.config.params);
  }

  ngOnDestroy(): void {
    this._paramsChanged.next();
    this._paramsChanged.complete();
    this._unsubscribe.next();
    this._unsubscribe.complete();

    this.node.unload();
  }

  setParams(params?: Partial<TParams> | Observable<Partial<TParams>>): void {
    this._paramsChanged.next();

    if (!isObservable(params)) {
      this.params = this.completeParams(params || {});
      this._ref.markForCheck();
    } else {
      // emulates the async pipe
      params.pipe(takeUntil(this._paramsChanged)).subscribe({
        next: (values) => {
          this.params = this.completeParams(values);
          this._ref.markForCheck();
        },
      });
    }
  }

  // complete a partial specification of the required parameters
  // ensuring that all will be present in the template
  abstract completeParams(params: Partial<TParams>): TParams;

  // support and propagate hook calls to inner components
  // this should be implemented by containers/groups/arrays
  // concrete hooks will receive the parent data if they define no config.name
  // callHook(hook: string, payload: any[], plainPayload = false): void
}
