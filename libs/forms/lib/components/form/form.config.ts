import {
  DynBaseConfig,
  DynConfig,
  DynConfigErrors,
  DynControlMode,
  DynControlModes,
  DynErrorMessages,
} from '@myndpm/dyn-forms/core';

// typed config with any set of supported modes
export interface DynFormConfig<M extends DynControlMode = DynControlMode> {
  controls: Array<DynBaseConfig<M> | DynConfig<M>>;
  errorMsgs?: DynConfigErrors<DynErrorMessages>;
  modes?: DynControlModes<M>; // default partial configs per mode
}
