import { DynBaseConfig, DynConfig } from '@myndpm/dyn-forms/core';

export interface DynFormConfig {
  // TODO provide incoming contexts as default values
  // contexts: { [display|table|filter]: DynControlConfig }
  controls: Array<DynBaseConfig | DynConfig>;
}
