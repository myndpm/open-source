import {
  DynBaseConfig,
  DynConfig,
  DynModeControls,
  DynModeParams,
  DynControlMode,
} from '@myndpm/dyn-forms/core';

export interface DynFormConfig<C extends DynControlMode = DynControlMode> {
  modeParams?: DynModeParams<C>; // default params per mode
  modes?: DynModeControls<C>; // default config per mode+control
  controls: Array<DynBaseConfig<C> | DynConfig<C>>;
}
