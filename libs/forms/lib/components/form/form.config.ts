import {
  DynBaseConfig,
  DynConfig,
  DynFormConfigErrors,
  DynMode,
  DynModes,
} from '@myndpm/dyn-forms/core';

// typed config with any set of supported modes
export interface DynFormConfig<
  M extends DynMode = DynMode,
> extends DynFormConfigErrors {
  controls: Array<DynBaseConfig<M> | DynConfig<M>>;
  modes?: DynModes<M>; // default partial configs per mode
  debug?: number;
}
