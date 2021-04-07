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
export function createMatConfig<M extends DynControlMode>(
  type: typeof DynMatArrayComponent.dynControl,
  partial: DynPartialControlConfig<M, Partial<DynMatArrayParams>>
): DynConfig<M>;
export function createMatConfig<M extends DynControlMode>(
  type: typeof DynMatCardComponent.dynControl,
  partial: DynPartialGroupConfig<M, Partial<DynMatCardParams>>
): DynConfig<M>;
export function createMatConfig<M extends DynControlMode>(
  type: typeof DynMatDividerComponent.dynControl,
  partial: DynPartialGroupConfig<M, Partial<DynMatDividerParams>>
): DynConfig<M>;
export function createMatConfig<M extends DynControlMode>(
  type: typeof DynMatInputComponent.dynControl,
  partial: DynPartialControlConfig<M, Partial<DynMatInputParams>>
): DynConfig<M>;
export function createMatConfig<M extends DynControlMode>(
  type: typeof DynMatRadioComponent.dynControl,
  partial: DynPartialControlConfig<M, Partial<DynMatRadioParams>>
): DynConfig<M>;
export function createMatConfig<M extends DynControlMode>(
  type: typeof DynMatSelectComponent.dynControl,
  partial: DynPartialControlConfig<M, Partial<DynMatSelectParams>>
): DynConfig<M>;

// factory
export function createMatConfig<M extends DynControlMode>(
  type: DynControlType,
  partial: any,
): DynConfig<M> {
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
