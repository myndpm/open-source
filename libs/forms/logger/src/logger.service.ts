import { Injectable } from '@angular/core';
import { DynLogDriver } from './log-driver.service';
import { DynLogLevel } from './log-levels.constant';

@Injectable()
// collector of all log messages of the library
export class DynLogger {
  constructor(
    private readonly driver: DynLogDriver,
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

  providerNotFound(provider: string, config: any): Error {
    return this.driver.log({
      level: DynLogLevel.Fatal,
      message: `${provider} ${JSON.stringify(config)} not provided.`,
    });
  }

  nodeFailed(control?: string): Error {
    return this.driver.log({
      level: DynLogLevel.Fatal,
      message:
        `Control '${control}' need to provide its own DynFormTreeNode. ` +
        `It is consuming the parent Node and that will cause unexpected effects.`,
    });
  }

  nodeWithoutControl(): Error {
    return this.driver.log({
      level: DynLogLevel.Fatal,
      message: `Could not resolve a control for the Node .`,
    });
  }

  nodeControl(): void {
    this.driver.log({
      level: DynLogLevel.Info,
      message: `[DynFormTreeNode] control was manually set`,
    });
  }

  nodeLoaded(origin: string, path: string[], control?: string, payload?: any): void {
    this.driver.log({
      level: DynLogLevel.Info,
      message: control === undefined && !path.join('.')
        ? `[${origin}] node initialized`
        : `[${origin}] initialized for '${path.join('.')}' ${control ? `(${control})` : ''}`,
      payload,
    });
  }

  nodeParamsUpdated(origin: string, payload: any): void {
    this.driver.log({
      level: DynLogLevel.Verbose,
      message: `[${origin}] updating params`,
      payload,
    });
  }

  controlInstance(payload: any): void {
    this.driver.log({
      level: DynLogLevel.Verbose,
      message: `[dyn-factory] instantiating dynamic control`,
      payload,
    });
  }

  hookCalled(hook: string, path: string[], payload?: any): void {
    this.driver.log({
      level: DynLogLevel.Debug,
      message: `[hook] '${hook}' called on '${path.join('.')}' with`,
      payload,
    });
  }
}
