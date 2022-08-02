import {
  DynConfig,
  DynControlId,
  DynControlMode,
  DynPartialControlConfig,
} from '@myndpm/dyn-forms/core';
import {
  DynNatInputComponent,
  DynNatInputParams,
} from './components';

// control overloads
export function createMatConfig<M extends DynControlMode>(
  control: typeof DynNatInputComponent.dynControl,
  partial: DynPartialControlConfig<M, Partial<DynNatInputParams>>
): DynConfig<M>;

// factory
export function createMatConfig<M extends DynControlMode>(
  control: DynControlId,
  partial: any,
): DynConfig<M> {
  switch (control) {
    // controls
    case DynNatInputComponent.dynControl:
    default:
      return DynNatInputComponent.createConfig(partial);
  }
}
