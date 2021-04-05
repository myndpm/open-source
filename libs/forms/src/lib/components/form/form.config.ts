import { DynBaseConfig, DynConfig, DynConfigContexts } from '@myndpm/dyn-forms/core';

export interface DynFormConfig {
  contexts?: DynConfigContexts; // default values per context/control
  controls: Array<DynBaseConfig | DynConfig>;
}
