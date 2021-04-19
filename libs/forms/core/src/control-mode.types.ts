import { DynControlConfig } from './control-config.types';
import { DynControlParams } from './control-params.types';

// edit|display|table|filter
export type DynControlMode = string; // Mode ID

// config overrides per mode, handled by DynFormMode
export type DynControlModes<M extends string = DynControlMode> = {
  [K in M]?: Partial<DynControlConfig>;
}

// general params overrides per mode, handled by DynFormMode
export type DynModeParams<M extends string = DynControlMode> = {
  [K in M]?: Partial<DynControlParams>;
}

// general config overrides per mode+control, handled by DynFormMode
export type DynModeControls<M extends string = DynControlMode> = {
  [K in M]?: DynControlConfig[];
}
