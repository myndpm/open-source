import {
  DynBaseConfig,
  DynControlMode,
  DynControlType,
  DynPartialControlConfig,
} from '@myndpm/dyn-forms/core';
import { DynBsInputComponent } from './components/input/input.component';
import { DynBsInputParams } from './components/input/input.component.params';

// type overloads
export function createDynBsConfig<M extends DynControlMode>(
  type: typeof DynBsInputComponent.dynControl,
  partial: DynPartialControlConfig<M, Partial<DynBsInputParams>>
): DynBaseConfig<M>;

// factory
export function createDynBsConfig<M extends DynControlMode>(
  type: DynControlType,
  partial: any,
): DynBaseConfig<M> {
  switch (type) {
    // controls
    case DynBsInputComponent.dynControl:
    default:
      return DynBsInputComponent.createConfig(partial);
  }
}
