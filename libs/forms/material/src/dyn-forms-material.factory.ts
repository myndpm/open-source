import {
  DynConfig,
  DynControlMode,
  DynControlType,
  DynPartialControlConfig,
  DynPartialGroupConfig,
} from '@myndpm/dyn-forms/core';
import {
  DynMatCardComponent,
  DynMatCardParams,
  DynMatInputComponent,
  DynMatInputParams,
} from './components';
import { DynMatArrayComponent } from './components/array/array.component';
import { DynMatArrayParams } from './components/array/array.component.params';
import { DynMatDividerComponent } from './components/divider/divider.component';
import { DynMatDividerParams } from './components/divider/divider.component.params';
import { DynMatRadioComponent } from './components/radio/radio.component';
import { DynMatRadioParams } from './components/radio/radio.component.params';
import { DynMatSelectComponent } from './components/select/select.component';
import { DynMatSelectParams } from './components/select/select.component.params';

// type overloads
export function createConfig<C extends DynControlMode>(
  type: typeof DynMatArrayComponent.dynControl,
  partial: DynPartialControlConfig<C, Partial<DynMatArrayParams>>
): DynConfig<C>;
export function createConfig<C extends DynControlMode>(
  type: typeof DynMatCardComponent.dynControl,
  partial: DynPartialGroupConfig<C, Partial<DynMatCardParams>>
): DynConfig<C>;
export function createConfig<C extends DynControlMode>(
  type: typeof DynMatDividerComponent.dynControl,
  partial: DynPartialGroupConfig<C, Partial<DynMatDividerParams>>
): DynConfig<C>;
export function createConfig<C extends DynControlMode>(
  type: typeof DynMatInputComponent.dynControl,
  partial: DynPartialControlConfig<C, Partial<DynMatInputParams>>
): DynConfig<C>;
export function createConfig<C extends DynControlMode>(
  type: typeof DynMatRadioComponent.dynControl,
  partial: DynPartialControlConfig<C, Partial<DynMatRadioParams>>
): DynConfig<C>;
export function createConfig<C extends DynControlMode>(
  type: typeof DynMatSelectComponent.dynControl,
  partial: DynPartialControlConfig<C, Partial<DynMatSelectParams>>
): DynConfig<C>;

// factory
export function createConfig<C extends DynControlMode>(
  type: DynControlType,
  partial: any,
): DynConfig<C> {
  switch (type) {
    // containers
    case DynMatArrayComponent.dynControl:
      return DynMatArrayComponent.createConfig(partial);

    case DynMatCardComponent.dynControl:
      return DynMatCardComponent.createConfig(partial);

    case DynMatDividerComponent.dynControl:
      return DynMatDividerComponent.createConfig(partial);

    // controls
    case DynMatSelectComponent.dynControl:
      return DynMatSelectComponent.createConfig(partial);

    case DynMatRadioComponent.dynControl:
      return DynMatRadioComponent.createConfig(partial);

    case DynMatInputComponent.dynControl:
    default:
      return DynMatInputComponent.createConfig(partial);
  }
}
