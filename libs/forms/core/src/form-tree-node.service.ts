import { Injectable, Optional, SkipSelf } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { DynLogger } from '@myndpm/dyn-forms/logger';
import { Subject } from 'rxjs';
import { DynBaseConfig } from './config.types';
import { DynControlHook } from './control-events.types';
import { DynInstanceType } from './control.types';
import { DynFormFactory } from './form-factory.service';

@Injectable()
// initialized by dyn-form, dyn-factory, dyn-group
// and the abstract DynForm* classes
export class DynFormTreeNode<TControl extends AbstractControl = FormGroup>{
  // form hierarchy
  isolated = false;
  children: DynFormTreeNode[] = [];

  // reactive events
  hook$ = new Subject<DynControlHook>();

  // control config
  get name(): string|undefined {
    return this._name;
  }
  get instance(): DynInstanceType {
    return this._instance;
  }
  get control(): TControl {
    return this._control;
  }

  // control.path relative to the root
  get path(): string[] {
    return [
      ...(!this.isolated ? this.parent?.path ?? [] : []),
      this._name ?? '',
    ].filter(Boolean);
  }

  private _name?: string;
  private _instance!: DynInstanceType;
  private _control!: TControl;

  constructor(
    private readonly formFactory: DynFormFactory,
    private readonly logger: DynLogger,
    // parent node should be set for all except the root
    @Optional() @SkipSelf() public readonly parent: DynFormTreeNode,
  ) {}

  setControl(control: TControl, instance = DynInstanceType.Group): void {
    this.logger.nodeControl();

    // manual setup with no wiring nor config validation
    this._instance = instance;
    this._control = control;
  }

  register(instance: DynInstanceType, config: DynBaseConfig): void {
    // throw error if the name is already set and different to the incoming one
    if (this.name !== undefined && this.name !== (config.name ?? '')) {
      throw this.logger.nodeFailed(config.control);
    }

    // register the instance type for the childs to know
    this._instance = instance;

    if (config.name) {
      // register the control into the parent
      this._control = this.formFactory.register(
        instance as any,
        config,
        this.parent,
      );
    } else {
      // or takes the parent control
      // useful for nested UI groups in the same FormGroup
      this._control = this.parent.control as unknown as TControl;
    }

    this.load(config);
  }

  load(config: Partial<DynBaseConfig>): void {
    if (!this._control) {
      throw this.logger.nodeWithoutControl();
    }

    // disconnect this node from any parent DynControl
    this.isolated = Boolean(config.isolated);

    // register the name to build the form path
    this._name = config.name ?? '';

    if (!this.isolated) {
      // register the node with its parent
      this.parent?.addChild(this);
    }
  }

  unregister(): void {
    // TODO test unload with routed forms

    if (!this.isolated) {
      this.parent?.removeChild(this);
    }

    this.hook$.complete();
  }

  /**
   * Hierarchy methods
   */
  private addChild(node: DynFormTreeNode<any>): void {
    this.children.push(node);

    // TODO setup validators
  }

  private removeChild(node: DynFormTreeNode<any>): void {
    this.children.some((child, i) => {
      return (child === node) ? this.children.splice(i, 1) : false;
    });

    // TODO what happen to the data if we remove the control
    // TODO update validators if not isolated
  }

  /**
   * Feature methods
   */
  callHook(event: DynControlHook): void {
    this.logger.hookCalled(event.hook, this.path, event.payload);

    this.hook$.next(event);
  }
}
