import { Injectable } from '@angular/core';
import { DynNode } from './interfaces/node.interface';
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

  nodeInstanceMismatch(control: string, superclass: string, configured: string): Error {
    return this.driver.log({
      level: DynLogLevel.Fatal,
      message:
        `Control '${control}' extends  from '${superclass}' but is provided as '${configured}'.`,
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
      level: DynLogLevel.Lifecycle,
      message: `[DynFormTreeNode] control manually set`,
    });
  }

  nodeLoaded(origin: string, { deep, dynControl, parent, path }: DynNode, payload?: any): void {
    this.driver.log({
      deep,
      level: DynLogLevel.Hierarchy,
      message: dynControl === undefined && !path.join('.')
        ? `[${origin}] root node initialized`
        : `[${origin}] initialized '${path.join('.')}'${parent?.instance ? ` under ${parent?.instance}` : ''}${dynControl ? ` (${dynControl})` : ''}`,
      payload,
    });
  }

  nodeParamsUpdated(origin: string, payload: any): void {
    this.driver.log({
      level: DynLogLevel.Lifecycle,
      message: `[${origin}] updating params`,
      payload,
    });
  }

  controlInitializing(payload: any): void {
    this.driver.log({
      level: DynLogLevel.Debug,
      message: `[dyn-factory] instantiating dynamic component`,
      payload,
    });
  }

  controlInstantiated({ deep, dynControl }: DynNode, payload: any): void {
    this.driver.log({
      deep,
      level: DynLogLevel.Hierarchy,
      message: `[dyn-factory] instantiated dynamic control${dynControl ? ` (${dynControl})` : ''}`,
      payload,
    });
  }

  hookCalled(hook: string, path: string[], payload?: any): void {
    this.driver.log({
      level: DynLogLevel.Hooks,
      message: `'${hook}' called on '${path.join('.')}' with`,
      payload,
    });
  }
}
