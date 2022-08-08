import {
  DynConfig,
  DynControlId,
  DynMode,
  DynPartialControlConfig,
} from '@myndpm/dyn-forms/core';
import {
  DynNatInputComponent,
  DynNatInputParams,
} from './controls';

// control overloads
export function createMatConfig<M extends DynMode>(
  control: typeof DynNatInputComponent.dynControl,
  partial: DynPartialControlConfig<M, Partial<DynNatInputParams>>
): DynConfig<M>;

// factory
export function createMatConfig<M extends DynMode>(
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
