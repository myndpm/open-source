import {
  DynBaseConfig,
  DynConfig,
  DynContextControls,
  DynContextParams,
} from '@myndpm/dyn-forms/core';

export interface DynFormConfig {
  contextParams?: DynContextParams; // default params per context
  contexts?: DynContextControls; // default config per context+control
  controls: Array<DynBaseConfig | DynConfig>;
}
