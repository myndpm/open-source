import {
  DynBaseConfig,
  DynConfig,
  DynContextControls,
  DynContextParams,
  DynControlContext,
} from '@myndpm/dyn-forms/core';

export interface DynFormConfig<C extends DynControlContext = DynControlContext> {
  contextParams?: DynContextParams<C>; // default params per context
  contexts?: DynContextControls<C>; // default config per context+control
  controls: Array<DynBaseConfig<C> | DynConfig<C>>;
}
