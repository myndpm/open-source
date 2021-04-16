import {
  DynConfig,
  DynControlMode,
  DynControlType,
  DynPartialControlConfig,
} from '@myndpm/dyn-forms/core';
import {
  DynNatInputComponent,
  DynNatInputParams,
} from './components';

// type overloads
export function createMatConfig<M extends DynControlMode>(
  type: typeof DynNatInputComponent.dynControl,
  partial: DynPartialControlConfig<M, Partial<DynNatInputParams>>
): DynConfig<M>;

// factory
export function createMatConfig<M extends DynControlMode>(
  type: DynControlType,
  partial: any,
): DynConfig<M> {
  switch (type) {
    // controls
    case DynNatInputComponent.dynControl:
    default:
      return DynNatInputComponent.createConfig(partial);
  }
}
