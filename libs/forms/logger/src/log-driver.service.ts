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
    return new Error(event.message);
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

  constructor(
    @Inject(DYN_LOG_LEVEL) private level: DynLogLevel,
  ) {}

  log(event: DynLog): any {
    // do not log anything on production
    // or below the configured limit
    if (!isDevMode() || !(event.level & this.level)) {
      return;
    }

    return this.getLogger(event.level)(event);
  }

  setLevel(level: number): void {
    this.level = level;
  }

  private getLogger(level: DynLogLevel) {
    switch (level) {
      case DynLogLevel.Fatal:
        return this.logFatal;
      case DynLogLevel.Error:
        return this.logError;
      case DynLogLevel.Warning:
        return this.logWarning;
      default:
        return this.logInfo;
    }
  }

  private format(event: DynLog): any[] {
    const result = [
      ...this.colorify(event.deep || 0, event.level),
      event.message,
    ];
    return event.payload ? [...result, event.payload] : result;
  }

  private colorify(
    indent: number,
    level: DynLogLevel,
    text = `${''.padStart(2 * (indent || 0), ' ')}%c[${dynLogLevels.get(level)}]`
  ): string[] {
    switch (level) {
      case DynLogLevel.Fatal:
        return [text, `color: #dc3545`];
      case DynLogLevel.Error:
        return [text, `color: #dc3545`];
      case DynLogLevel.Warning:
        return [text, `color: #fd7e14`];
      case DynLogLevel.Hierarchy:
        return [text, `color: #0d6efd`];
      case DynLogLevel.Lifecycle:
        return [text, `color: #6f42c1`];
      case DynLogLevel.Load:
        return [text, `color: #20c997`];
      case DynLogLevel.Hooks:
        return [text, `color: #adb5bd`];
      default:
        return [text, `color: #0d6efd`]; // info
    }
  }
}
