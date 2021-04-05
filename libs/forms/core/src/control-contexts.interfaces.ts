import { DynControlConfig } from './control-config.interface';

// edit|display|table|filter
export type DynControlContext = string; // Context IDs

// control overrides per context handled by DynFormContext
export type DynControlContexts<T extends string = DynControlContext> = {
  [K in T]: Partial<DynControlConfig>;
}

// general config overrides per context/control handled by DynFormContext
export type DynConfigContexts<T extends string = DynControlContext> = {
  [K in T]: DynControlConfig[];
}

// general config options organized in a Map
export type DynMappedContexts = Map<DynControlContext, DynControlConfig[]>;
