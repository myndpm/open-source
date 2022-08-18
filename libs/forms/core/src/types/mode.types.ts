import { DynControlConfig } from './control.types';

// display, edit, filter, etc
export type DynMode = string; // Mode ID

// config overrides per mode, handled by DynFormResolver
export type DynModes<TMode extends string = DynMode> = {
  [K in TMode]?: Partial<DynControlConfig>;
}

/**
 * @deprecated use DynMode
 */
export type DynControlMode = DynMode;

/**
 * @deprecated use DynModes
 */
export type DynControlModes = DynModes;
