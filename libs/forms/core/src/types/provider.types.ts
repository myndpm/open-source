import { Type } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { DynBaseConfig } from './config.types';
import { DynControlMode } from './mode.types';
import { DynInstanceType } from './forms.types';
import { DynControl } from '../dyn-control.class';
import { DynConfigId, DynControlId } from './control.types';

/**
 * Base types
 */
 export interface DynBaseProvider {
  priority?: number;
}

export type DynHandlerFactory<F> = (...args: any[]) => F;

export interface DynBaseHandler<F> extends DynBaseProvider {
  id: DynConfigId;
  fn: DynHandlerFactory<F>;
}

export type AbstractDynControl = DynControl<DynControlMode, any, DynBaseConfig, AbstractControl>;

export interface DynControlProvider extends DynBaseProvider {
  control: DynControlId;
  instance: DynInstanceType;
  component: Type<AbstractDynControl>;
}
