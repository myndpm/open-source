import { Type } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { DynControl } from '../dyn-control.class';
import { DynBaseConfig } from './config.types';
import { DynControlId } from './control.types';
import { DynConfigArgs, DynInstanceType } from './forms.types';
import { DynControlMode } from './mode.types';

// a given id to a validator/async-validator/error-handler/function
export type DynConfigId = string;

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

// handlers provided can be referenced by id or [id with args]
export type DynConfigProvider<F extends Function> = F | DynConfigId | [DynConfigId, DynConfigArgs];

// object map of handlers
export interface DynConfigMap<T> {
  [field: string]: T;
}

// collection of handlers to be used
export type DynConfigCollection<F extends Function> = { [id: string]: DynConfigArgs } | Array<DynConfigProvider<F>>;
