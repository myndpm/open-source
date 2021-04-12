import { Injectable } from '@angular/core';
import { DynLogDriver } from './log-driver.service';
import { DynLogLevel } from './log-levels.constant';

@Injectable()
// collector of all log messages of the library
export class DynLogger {
  constructor(
    private driver: DynLogDriver,
  ) {}

  rootForm(): Error {
    return this.driver.log({
      level: DynLogLevel.Fatal,
      message: `Please provide a [form] to <dyn-form>`,
    });
  }

  unnamedArray(control: string): Error {
    return this.driver.log({
      level: DynLogLevel.Fatal,
      message: `No config.name provided for ${control}`,
    });
  }

  nodeFailed(control?: string): void {
    this.driver.log({
      level: DynLogLevel.Error,
      message:
        `Control '${control}' need to provide its own DynFormNode. ` +
        `It is consuming the parent Node and that will cause unexpected effects.`,
    });
  }

  nodeLoaded(origin: string, path: string[], control?: string, payload?: any): void {
    this.driver.log({
      level: DynLogLevel.Verbose,
      message: control === undefined && !path.join('.')
        ? `[${origin}] Root node initialized`
        : `[${origin}] initialized for '${path.join('.')}' ${control ? `(${control})` : ''}`,
      payload,
    });
  }

  hookCalled(hook: string, path: string, payload?: any): void {
    this.driver.log({
      level: DynLogLevel.Debug,
      message: `[hook] '${hook}' called on '${path}' with`,
      payload,
    });
  }
}
