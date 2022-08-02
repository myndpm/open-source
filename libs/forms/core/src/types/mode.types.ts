import { DynControlConfig } from './control.types';

// display, edit, filter, etc
export type DynControlMode = string; // Mode ID

// config overrides per mode, handled by DynFormConfigResolver
export type DynControlModes<TMode extends string = DynControlMode> = {
  [K in TMode]?: Partial<DynControlConfig>;
}
