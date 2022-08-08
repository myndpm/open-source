import {
  DynBaseConfig,
  DynConfig,
  DynControlId,
  DynMode,
  DynPartialControlConfig,
  DynPartialGroupConfig,
} from '@myndpm/dyn-forms/core';
import {
  DynMatArrayComponent,
  DynMatArrayParams,
  DynMatCardComponent,
  DynMatCardParams,
  DynMatCheckboxComponent,
  DynMatCheckboxParams,
  DynMatContainerComponent,
  DynMatContainerParams,
  DynMatDatepickerComponent,
  DynMatDatepickerParams,
  DynMatDividerComponent,
  DynMatDividerParams,
  DynMatInputComponent,
  DynMatInputParams,
  DynMatMulticheckboxComponent,
  DynMatMulticheckboxParams,
  DynMatRadioComponent,
  DynMatRadioParams,
  DynMatSelectComponent,
  DynMatSelectParams,
  DynMatTableComponent,
  DynMatTableParams,
} from './controls';

// control overloads
export function createMatConfig<M extends DynMode>(
  control: typeof DynMatArrayComponent.dynControl,
  partial: DynPartialControlConfig<M, Partial<DynMatArrayParams>>
): DynConfig<M>;
export function createMatConfig<M extends DynMode>(
  control: typeof DynMatCardComponent.dynControl,
  partial: DynPartialGroupConfig<M, Partial<DynMatCardParams>>
): DynBaseConfig<M>;
export function createMatConfig<M extends DynMode>(
  control: typeof DynMatCheckboxComponent.dynControl,
  partial: DynPartialControlConfig<M, Partial<DynMatCheckboxParams>>
): DynConfig<M>;
export function createMatConfig<M extends DynMode>(
  control: typeof DynMatContainerComponent.dynControl,
  partial: DynPartialGroupConfig<M, Partial<DynMatContainerParams>>
): DynBaseConfig<M>;
export function createMatConfig<M extends DynMode>(
  control: typeof DynMatDatepickerComponent.dynControl,
  partial: DynPartialControlConfig<M, Partial<DynMatDatepickerParams>>
): DynConfig<M>;
export function createMatConfig<M extends DynMode>(
  control: typeof DynMatDividerComponent.dynControl,
  partial: DynPartialGroupConfig<M, Partial<DynMatDividerParams>>
): DynBaseConfig<M>;
export function createMatConfig<M extends DynMode>(
  control: typeof DynMatInputComponent.dynControl,
  partial: DynPartialControlConfig<M, Partial<DynMatInputParams>>
): DynConfig<M>;
export function createMatConfig<M extends DynMode>(
  control: typeof DynMatMulticheckboxComponent.dynControl,
  partial: DynPartialControlConfig<M, Partial<DynMatMulticheckboxParams>>
): DynConfig<M>;
export function createMatConfig<M extends DynMode>(
  control: typeof DynMatRadioComponent.dynControl,
  partial: DynPartialControlConfig<M, Partial<DynMatRadioParams>>
): DynConfig<M>;
export function createMatConfig<M extends DynMode>(
  control: typeof DynMatSelectComponent.dynControl,
  partial: DynPartialControlConfig<M, Partial<DynMatSelectParams>>
): DynConfig<M>;
export function createMatConfig<M extends DynMode>(
  control: typeof DynMatTableComponent.dynControl,
  partial: DynPartialControlConfig<M, Partial<DynMatTableParams>>
): DynConfig<M>;

// factory
export function createMatConfig<M extends DynMode>(
  control: DynControlId,
  partial: any,
): DynBaseConfig<M> {
  switch (control) {
    // containers
    case DynMatArrayComponent.dynControl:
      return DynMatArrayComponent.createConfig(partial);

    case DynMatCardComponent.dynControl:
      return DynMatCardComponent.createConfig(partial);

    case DynMatContainerComponent.dynControl:
      return DynMatContainerComponent.createConfig(partial);

    case DynMatDividerComponent.dynControl:
      return DynMatDividerComponent.createConfig(partial);

    // controls
    case DynMatCheckboxComponent.dynControl:
      return DynMatCheckboxComponent.createConfig(partial);

    case DynMatDatepickerComponent.dynControl:
      return DynMatDatepickerComponent.createConfig(partial);

    case DynMatMulticheckboxComponent.dynControl:
      return DynMatMulticheckboxComponent.createConfig(partial);

    case DynMatRadioComponent.dynControl:
      return DynMatRadioComponent.createConfig(partial);

    case DynMatSelectComponent.dynControl:
      return DynMatSelectComponent.createConfig(partial);

    case DynMatTableComponent.dynControl:
      return DynMatTableComponent.createConfig(partial);

    case DynMatInputComponent.dynControl:
    default:
      return DynMatInputComponent.createConfig(partial);
  }
}
