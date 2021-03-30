import { Type } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { DynBaseConfig } from './control-config.interface';
import { DynControlParams } from './control-params.interface';
import { DynControlType } from './control.type';
import { DynControl } from './dyn-control.class';

export type AbstractDynControl = DynControl<
  DynControlParams,
  DynBaseConfig,
  AbstractControl
>;

export interface LazyControl {
  control: DynControlType;
  useFactory: Function;
  // resolved in the controls.factory
  component?: Type<AbstractDynControl>;
}

export interface InjectedControl {
  control: DynControlType;
  component: Type<AbstractDynControl>;
}

export type ControlProvider = LazyControl | InjectedControl;
