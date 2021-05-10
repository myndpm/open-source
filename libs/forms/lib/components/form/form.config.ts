import {
  DynBaseConfig,
  DynConfig,
  DynConfigErrors,
  DynControlMode,
  DynErrorMessages,
  DynModeControls,
  DynModeParams,
} from '@myndpm/dyn-forms/core';

// typed config with any set of supported modes
export interface DynFormConfig<M extends DynControlMode = DynControlMode> {
  controls: Array<DynBaseConfig<M> | DynConfig<M>>;
  errorMsgs?: DynConfigErrors<DynErrorMessages>;
  modeParams?: DynModeParams<M>; // default params per mode
  modes?: DynModeControls<M>; // default config per mode+control
}
