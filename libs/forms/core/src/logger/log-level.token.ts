import { InjectionToken } from '@angular/core';
import { DynLogLevel } from './log-levels.constant';

export const DYN_LOG_LEVEL = new InjectionToken<DynLogLevel>(
  '@myndpm/dyn-forms/logger'
);
