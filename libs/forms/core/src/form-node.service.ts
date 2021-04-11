import { Injectable, Optional, SkipSelf } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { DynBaseConfig } from './config.types';
import { DynControlHook } from './control-events.types';
import { DynLogger } from './logger';

@Injectable()
// initialized by dyn-form, dyn-factory, dyn-group
// and the abstract DynControl* classes
export class DynFormNode<TControl extends AbstractControl = FormGroup>{
  name?: string;
  control!: TControl;
  children: DynFormNode[] = [];

  hook$ = new Subject<DynControlHook>();

  get path(): string[] {
    return [
      ...(this.parent?.path ?? []),
      this.name ?? '',
    ].filter(Boolean);
  }

  constructor(
    private logger: DynLogger,
    // parent node should be set for all except the root
    @Optional() @SkipSelf() public parent: DynFormNode,
  ) {}

  load(config: Partial<DynBaseConfig>, control: TControl): void {
    // throw error if the name is already set and different to the incoming one
    if (this.name !== undefined && this.name !== (config.name ?? '')) {
      return this.logger.nodeFailed(config.control);
    }

    // register the name to build the form path
    this.name = config.name ?? '';

    // register the control created by the FormFactory
    this.control = control;

    // register the node with its parent
    this.parent?.addChild(this);
  }

  unload(): void {
    // TODO test unload with routed forms

    this.parent?.removeChild(this);

    this.hook$.complete();
  }

  /**
   * Hierarchy methods
   */
  addChild(node: DynFormNode<any>): void {
    this.children.push(node);

    // TODO setup validators
  }

  removeChild(node: DynFormNode<any>): void {
    this.children.some((child, i) => {
      return (child === node) ? this.children.splice(i, 1) : false;
    });

    // TODO update validators
  }

  /**
   * Feature methods
   */
  callHook(event: DynControlHook): void {
    this.logger.hookCalled(event.hook, this.path.join('.'), event.payload);

    this.hook$.next(event);
  }
}
