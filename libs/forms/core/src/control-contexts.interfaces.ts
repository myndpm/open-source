import { DynControlConfig } from './control-config.interface';
import { DynControlParams } from './control-params.interfaces';

// edit|display|table|filter
export type DynControlContext = string; // Context IDs

// control overrides per context handled by DynFormContext
export type DynControlContexts<T extends string = DynControlContext> = {
  [K in T]: Partial<DynControlConfig>;
}

// general params overrides per context handled by DynFormContext
export type DynContextParams<T extends string = DynControlContext> = {
  [K in T]: Partial<DynControlParams>;
}

// general config overrides per context/control handled by DynFormContext
export type DynContextControls<T extends string = DynControlContext> = {
  [K in T]: DynControlConfig[];
}
