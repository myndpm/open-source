import { DynControlConfig } from './control-config.interface';

// edit|display|table|filter
export type DynControlContext = string; // Context IDs to be customized per form

export type DynControlContexts<T extends string = DynControlContext> = {
  [K in T]: DynControlConfig;
}
