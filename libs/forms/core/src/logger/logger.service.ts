import { Injectable } from '@angular/core';
import { DynLogDriver } from './log-driver.service';
import { DynLogLevel } from './log-levels.constant';

@Injectable()
// collector of all log messages of the library
export class DynLogger {
  constructor(
    private driver: DynLogDriver,
  ) {}

  nodeFailed(control?: string): void {
    this.driver.log({
      level: DynLogLevel.Fatal,
      message:
        `Control '${control}' need to provide its own DynFormNode. ` +
        `It is consuming the parent Node and that will cause unexpected effects.`
    });
  }

  nodeInit(path: string[], control?: string): void {
    this.driver.log({
      level: DynLogLevel.Verbose,
      message: !path.join('.')
        ? `Root node initialized`
        : `Node '${path.join('.')}' initialized ${control ? `(${control})` : ''}`,
    });
  }
}
