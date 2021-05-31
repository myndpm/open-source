import {
  DynBaseConfig,
  DynControlMode,
  DynControlType,
  DynPartialControlConfig,
} from '@myndpm/dyn-forms/core';
import {
  DynBsCheckboxComponent,
  DynBsCheckboxParams,
  DynBsInputComponent,
  DynBsInputParams,
  DynBsRadioComponent,
  DynBsRadioParams,
  DynBsSelectComponent,
  DynBsSelectParams,
} from './components';

// type overloads
export function createBsConfig<M extends DynControlMode>(
  type: typeof DynBsCheckboxComponent.dynControl,
  partial: DynPartialControlConfig<M, Partial<DynBsCheckboxParams>>
): DynBaseConfig<M>;
export function createBsConfig<M extends DynControlMode>(
  type: typeof DynBsInputComponent.dynControl,
  partial: DynPartialControlConfig<M, Partial<DynBsInputParams>>
): DynBaseConfig<M>;
export function createBsConfig<M extends DynControlMode>(
  type: typeof DynBsRadioComponent.dynControl,
  partial: DynPartialControlConfig<M, Partial<DynBsRadioParams>>
): DynBaseConfig<M>;
export function createBsConfig<M extends DynControlMode>(
  type: typeof DynBsSelectComponent.dynControl,
  partial: DynPartialControlConfig<M, Partial<DynBsSelectParams>>
): DynBaseConfig<M>;

// factory
export function createBsConfig<M extends DynControlMode>(
  type: DynControlType,
  partial: any,
): DynBaseConfig<M> {
  switch (type) {
    // controls
    case DynBsCheckboxComponent.dynControl:
      return DynBsCheckboxComponent.createConfig(partial);

    case DynBsRadioComponent.dynControl:
      return DynBsRadioComponent.createConfig(partial);

    case DynBsSelectComponent.dynControl:
      return DynBsSelectComponent.createConfig(partial);

    case DynBsInputComponent.dynControl:
    default:
      return DynBsInputComponent.createConfig(partial);
  }
}
