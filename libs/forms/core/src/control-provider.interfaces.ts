import { Type } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { DynBaseConfig } from './config.interfaces';
import { DynControlMode } from './control-mode.types';
import { DynControlParams } from './control-params.interfaces';
import { DynControlType, DynInstanceType } from './control.types';
import { DynControl } from './dyn-control.class';

export type AbstractDynControl = DynControl<
  DynControlMode,
  DynControlParams,
  DynBaseConfig,
  AbstractControl
>;

export interface LazyControl {
  control: DynControlType;
  instance: DynInstanceType;
  useFactory: Function;
  // resolved in control-resolver.service
  component?: Type<AbstractDynControl>;
}

export interface InjectedControl {
  control: DynControlType;
  instance: DynInstanceType;
  component: Type<AbstractDynControl>;
}

export type ControlProvider = LazyControl | InjectedControl;

// type guard
export function isLazyControl(
  provider: ControlProvider
): provider is LazyControl {
  return provider.hasOwnProperty('useFactory');
}
