import {
  DynBaseConfig,
  DynConfig,
  DynControlMode,
  DynControlModes,
  DynFormConfigErrors,
} from '@myndpm/dyn-forms/core';

// typed config with any set of supported modes
export interface DynFormConfig<
  M extends DynControlMode = DynControlMode,
> extends DynFormConfigErrors {
  controls: Array<DynBaseConfig<M> | DynConfig<M>>;
  modes?: DynControlModes<M>; // default partial configs per mode
  debug?: number;
}
