import { Inject, Injectable, isDevMode } from '@angular/core';
import { DYN_LOG_LEVEL } from './log-level.token';
import { DynLogLevel, dynLogLevels } from './log-levels.constant';
import { DynLog } from './log.interface';

/**
 * Service to be overriden, defaults to console driver.
 */
@Injectable()
export class DynLogDriver {
  constructor(
    @Inject(DYN_LOG_LEVEL) private level: DynLogLevel,
  ) {}

  log(event: DynLog): void {
    // do not log anything on production
    // or below the configured limit
    if (!isDevMode() || event.level < this.level) {
      return;
    }

    switch (event.level) {
      case DynLogLevel.Fatal:
        this.logFatal(event);
        break;

      case DynLogLevel.Error:
        this.logError(event);
        break;

      case DynLogLevel.Warning:
        this.logWarning(event);
        break;

      case DynLogLevel.Info:
        this.logInfo(event);
        break;

      case DynLogLevel.Debug:
        this.logDebug(event);
        break;

      case DynLogLevel.Trace:
        this.logTrace(event);
        break;

      case DynLogLevel.Verbose:
        this.logVerbose(event);
        break;
    }
  }

  logFatal(event: DynLog): void {
    console.error(...this.format(event));
  }

  logError(event: DynLog): void {
    console.error(...this.format(event));
  }

  logWarning(event: DynLog): void {
    console.warn(...this.format(event));
  }

  logInfo(event: DynLog): void {
    console.log(...this.format(event));
  }

  logDebug(event: DynLog): void {
    console.log(...this.format(event));
  }

  logTrace(event: DynLog): void {
    console.log(...this.format(event));
  }

  logVerbose(event: DynLog): void {
    console.log(...this.format(event));
  }

  private format(event: DynLog): any[] {
    const result = [dynLogLevels.get(event.level), event.message];
    return event.payload ? [...result, event.payload] : result;
  }
}
