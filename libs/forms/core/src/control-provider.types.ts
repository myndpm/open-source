import { Type } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { DynBaseConfig } from './config.types';
import { DynControlMode } from './control-mode.types';
import { DynControlParams } from './control-params.types';
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
  useFactory: () => Type<AbstractDynControl>;
  // resolved in DynFormRegistry
  component?: Type<AbstractDynControl>;
}

export interface InjectedControl {
  control: DynControlType;
  instance: DynInstanceType;
  component: Type<AbstractDynControl>;
}

export type ControlProvider = LazyControl | InjectedControl;

/**
 * type guard
 */
export function isLazyControl(
  provider: ControlProvider
): provider is LazyControl {
  return Object.prototype.hasOwnProperty.call(provider, 'useFactory');
}
