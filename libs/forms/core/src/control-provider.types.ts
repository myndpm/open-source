import { Type } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { DynBaseConfig } from './config.types';
import { DynControlMode } from './control-mode.types';
import { DynControlId, DynInstanceType } from './control.types';
import { DynControl } from './dyn-control.class';
import { DynBaseProvider } from './dyn-providers';

export type AbstractDynControl = DynControl<DynControlMode, any, DynBaseConfig, AbstractControl>;

export interface DynControlProvider extends DynBaseProvider {
  control: DynControlId;
  instance: DynInstanceType;
  component: Type<AbstractDynControl>;
}
