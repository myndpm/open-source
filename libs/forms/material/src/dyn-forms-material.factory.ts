import {
  DynConfig,
  DynControlContext,
  DynControlType,
  DynPartialControlConfig,
  DynPartialGroupConfig,
} from '@myndpm/dyn-forms/core';
import {
  DynCardComponent,
  DynCardParams,
  DynInputComponent,
  DynInputParams,
} from './components';
import { DynArrayComponent } from './components/array/array.component';
import { DynArrayParams } from './components/array/array.component.params';
import { DynDividerComponent } from './components/divider/divider.component';
import { DynDividerParams } from './components/divider/divider.component.params';
import { DynRadioComponent } from './components/radio/radio.component';
import { DynRadioParams } from './components/radio/radio.component.params';
import { DynSelectComponent } from './components/select/select.component';
import { DynSelectParams } from './components/select/select.component.params';

// type overloads
export function createConfig<C extends DynControlContext>(
  type: typeof DynArrayComponent.dynControl,
  partial: DynPartialControlConfig<C, Partial<DynArrayParams>>
): DynConfig<C>;
export function createConfig<C extends DynControlContext>(
  type: typeof DynCardComponent.dynControl,
  partial: DynPartialGroupConfig<C, Partial<DynCardParams>>
): DynConfig<C>;
export function createConfig<C extends DynControlContext>(
  type: typeof DynDividerComponent.dynControl,
  partial: DynPartialGroupConfig<C, Partial<DynDividerParams>>
): DynConfig<C>;
export function createConfig<C extends DynControlContext>(
  type: typeof DynInputComponent.dynControl,
  partial: DynPartialControlConfig<C, Partial<DynInputParams>>
): DynConfig<C>;
export function createConfig<C extends DynControlContext>(
  type: typeof DynRadioComponent.dynControl,
  partial: DynPartialControlConfig<C, Partial<DynRadioParams>>
): DynConfig<C>;
export function createConfig<C extends DynControlContext>(
  type: typeof DynSelectComponent.dynControl,
  partial: DynPartialControlConfig<C, Partial<DynSelectParams>>
): DynConfig<C>;

// factory
export function createConfig<C extends DynControlContext>(
  type: DynControlType,
  partial: any,
): DynConfig<C> {
  switch (type) {
    // containers
    case DynArrayComponent.dynControl:
      return DynArrayComponent.createConfig(partial);

    case DynCardComponent.dynControl:
      return DynCardComponent.createConfig(partial);

    case DynDividerComponent.dynControl:
      return DynDividerComponent.createConfig(partial);

    // controls
    case DynSelectComponent.dynControl:
      return DynSelectComponent.createConfig(partial);

    case DynRadioComponent.dynControl:
      return DynRadioComponent.createConfig(partial);

    case DynInputComponent.dynControl:
    default:
      return DynInputComponent.createConfig(partial);
  }
}
