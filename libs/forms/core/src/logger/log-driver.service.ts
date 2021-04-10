import { Inject, Injectable, isDevMode } from '@angular/core';
import { DYN_LOG_LEVEL } from './log-level.token';
import { DynLogLevel, dynLogLevels } from './log-levels.constant';
import { DynLog } from './log.interface';

/**
 * Service to be overriden, defaults to console driver.
 */
@Injectable()
export class DynLogDriver {
  logFatal = (event: DynLog) => {
    console.error(...this.format(event));
  }

  logError = (event: DynLog) => {
    console.error(...this.format(event));
  }

  logWarning = (event: DynLog) => {
    console.warn(...this.format(event));
  }

  logInfo = (event: DynLog) => {
    console.log(...this.format(event));
  }

  logDebug = (event: DynLog) => {
    console.log(...this.format(event));
  }

  logTrace = (event: DynLog) => {
    console.log(...this.format(event));
  }

  logVerbose = (event: DynLog) => {
    console.log(...this.format(event));
  }

  loggers = {
    [DynLogLevel.Fatal]: this.logFatal,
    [DynLogLevel.Error]: this.logError,
    [DynLogLevel.Warning]: this.logWarning,
    [DynLogLevel.Info]: this.logInfo,
    [DynLogLevel.Debug]: this.logDebug,
    [DynLogLevel.Trace]: this.logTrace,
    [DynLogLevel.Verbose]: this.logVerbose,
  }

  constructor(
    @Inject(DYN_LOG_LEVEL) private level: DynLogLevel,
  ) {}

  log(event: DynLog): void {
    // do not log anything on production
    // or below the configured limit
    if (!isDevMode() || event.level < this.level) {
      return;
    }

    this.loggers[event.level](event);
  }

  private format(event: DynLog): any[] {
    const result = [...this.colorify(event.level), event.message];
    return event.payload ? [...result, event.payload] : result;
  }

  private colorify(
    level: DynLogLevel,
    text = `%c[${dynLogLevels.get(level)}]`
  ): string[] {
    switch (level) {
      case DynLogLevel.Fatal:
        return [text, `color: #dc3545`];
      case DynLogLevel.Error:
        return [text, `color: #dc3545`];
      case DynLogLevel.Warning:
        return [text, `color: #fd7e14`];
      case DynLogLevel.Info:
        return [text, `color: #0d6efd`];
      case DynLogLevel.Debug:
        return [text, `color: #6f42c1`];
      case DynLogLevel.Trace:
        return [text, `color: #20c997`];
      case DynLogLevel.Verbose:
        return [text, `color: #adb5bd`];
    }
  }
}
