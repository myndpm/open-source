import { DynBaseConfig, DynConfig } from '@myndpm/dyn-forms/core';

export interface DynFormConfig {
  // contexts: { [display|table|filter]: DynControlConfig }
  controls: Array<DynBaseConfig | DynConfig>;
}
