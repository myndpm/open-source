import { DynBaseConfig, DynConfig, DynControlContexts } from '@myndpm/dyn-forms/core';

export interface DynFormConfig {
  // provide incoming contexts as default values
  contexts?: DynControlContexts;
  controls: Array<DynBaseConfig | DynConfig>;
}
