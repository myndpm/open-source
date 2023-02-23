import { Inject, Injectable, isDevMode } from '@angular/core';
import { DYN_LOG_LEVEL } from './log-level.token';
import { DynLogLevel, dynLogLevels } from './log-levels.constant';
import { DynLog } from './log.interface';

/**
 * Service to be overriden, defaults to console driver.
 */
@Injectable()
export class DynLogDriver {
  startedAt = Date.now();

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

  log(event: DynLog, force = false): any {
    // do not log anything on production
    // or below the configured limit
    if (!isDevMode() || (!force && !(event.level & this.level))) {
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
  ): string[] {
    const result = [''];
    if (this.level & DynLogLevel.Testing) {
      result[0] += `%c${(Date.now() - this.startedAt).toString().padStart(5, '0')} `;
      result.push('color: #adb5bd');
    }
    result[0] += `${''.padStart(2 * (indent || 0), ' ')}%c[${dynLogLevels.get(level)}]`;

    switch (level) {
      case DynLogLevel.Fatal:
        result.push('color: #dc3545');
        break;
      case DynLogLevel.Error:
        result.push('color: #dc3545');
        break;
      case DynLogLevel.Warning:
        result.push('color: #fd7e14');
        break;
      case DynLogLevel.Hierarchy:
        result.push('color: #0d6efd');
        break;
      case DynLogLevel.Lifecycle:
        result.push('color: #6f42c1');
        break;
      case DynLogLevel.Load:
        result.push('color: #9f72f1');
        break;
      case DynLogLevel.Ready:
        result.push('color: #20c997');
        break;
      case DynLogLevel.Runtime:
        result.push('color: #adb5bd');
        break;
      default:
        result.push('color: #0d6efd'); // info
    }

    return result;
  }
}
