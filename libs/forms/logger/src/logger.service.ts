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

  setLevel(level: number): void {
    this.driver.setLevel(level);
  }

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
        `Control '${control}' need to provide its own DynControlNode. ` +
        `It is consuming the parent Node and that will cause unexpected effects.`,
    });
  }

  nodeMethodCalledTwice(name: string, { deep, route }: DynNode): void {
    return this.driver.log({
      deep,
      level: DynLogLevel.Warning,
      message:`[node] '${name}' method called twice (${route.join('/')})`,
    });
  }

  nodeWithoutControl(): Error {
    return this.driver.log({
      level: DynLogLevel.Fatal,
      message: `Could not resolve a control for the Node.`,
    });
  }

  nodeLoaded(origin: string, { deep, path, route }: DynNode, payload?: any): void {
    this.driver.log({
      deep,
      level: DynLogLevel.Hierarchy,
      message: !deep
        ? `[${origin}] root node initialized`
        : `[${origin}] '${path.join('.')}' initialized (${route.join('/')})`,
      payload,
    });
  }

  nodeMethod({ deep, path, route }: DynNode, method: string, payload?: any): void {
    this.driver.log({
      deep,
      level: DynLogLevel.Debug,
      message: `[node.${method}] '${path.join('.')}' (${route.join('/')})`,
      payload,
    });
  }

  nodeLoad({ deep, path, route }: DynNode, payload?: any): void {
    this.driver.log({
      deep,
      level: DynLogLevel.Load,
      message: `'${path.join('.')}' (${route.join('/')})`,
      payload,
    });
  }

  nodeSetup({ deep, path, route }: DynNode): void {
    this.driver.log({
      deep,
      level: DynLogLevel.Debug,
      message: `'${path.join('.')}' node setup (${route.join('/')})`,
    });
  }

  nodeReady({ deep, path, route }: DynNode, payload?: any): void {
    this.driver.log({
      deep,
      level: DynLogLevel.Ready,
      message: `'${path.join('.')}' (${route.join('/')})`,
      payload,
    });
  }

  nodeParamsUpdated({ deep, path }: DynNode, origin: string, payload: any): void {
    this.driver.log({
      deep,
      level: DynLogLevel.Lifecycle,
      message: `[${origin}] '${path.join('.')}' params update`,
      payload,
    });
  }

  controlModes({ deep }: DynNode, mode: string, payload: any): void {
    this.driver.log({
      deep,
      level: DynLogLevel.Debug,
      message: `[dyn-config] merging mode '${mode}'`,
      payload,
    });
  }

  controlInitializing({ deep }: DynNode, payload: any): void {
    this.driver.log({
      deep,
      level: DynLogLevel.Debug,
      message: `[dyn-factory] instantiating`,
      payload,
    });
  }

  componentCreated({ deep, dynId, path }: DynNode, payload: any): void {
    this.driver.log({
      deep,
      level: DynLogLevel.Hierarchy,
      message: `[dyn-factory] '${path.join('.')}' component created${dynId ? ` (${dynId})` : ''}`,
      payload,
    });
  }

  formCycle(name: string, payload?: any): void {
    this.driver.log({
      level: DynLogLevel.Lifecycle,
      message: `[DynForm] ${name}`,
      payload,
    });
  }

  hookCalled({ deep, path, route }: DynNode, { hook, payload }: any): void {
    this.driver.log({
      deep,
      level: DynLogLevel.Runtime,
      message: `'${path?.join('.')}' hook "${hook}" invoked (${route.join('/')})`,
      payload: payload && typeof payload === 'object' ? payload : JSON.stringify(payload),
    });
  }

  modeForm({ deep, path }: DynNode, mode: string | undefined): void {
    this.driver.log({
      deep,
      level: DynLogLevel.Runtime,
      message: `[DynForm] '${path?.join('.')}' new mode: '${mode}'`
    });
  }

  modeGroup({ deep, path, route }: DynNode, mode: string, name?: string): void {
    this.driver.log({
      deep,
      level: DynLogLevel.Runtime,
      message: `[DynGroup] '${path.join('.')}${name ? `.${name}` : ''}' new mode: '${mode}' (${route.join('/')})`
    });
  }
}
