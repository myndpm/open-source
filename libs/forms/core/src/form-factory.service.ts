import { Injectable } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { DynBaseConfig } from './config.types';
import { DynInstanceType } from './control.types';
import { DynFormRegistry } from './form-registry.service';
import { DynFormTreeNode } from './form-tree-node.service';
import { DynFormValidators } from './form-validators.service';

@Injectable()
// injected in the DynControls to build their AbstractControls
export class DynFormFactory {
  constructor(
    private registry: DynFormRegistry,
    private validators: DynFormValidators,
  ) {}

  /**
   * Adds a control (via config) to the given parent.
   */
  register<FormGroup>(
    instance: DynInstanceType.Container | DynInstanceType.Group,
    config: DynBaseConfig,
    parent: DynFormTreeNode,
    recursively?: boolean
  ): FormGroup;
  register<FormArray>(
    instance: DynInstanceType.Array,
    config: DynBaseConfig,
    parent: DynFormTreeNode,
    recursively?: boolean
  ): FormArray;
  register<FormControl>(
    instance: DynInstanceType.Control,
    config: DynBaseConfig,
    parent: DynFormTreeNode,
    recursively?: boolean
  ): FormControl;
  register<T extends AbstractControl>(
    instance: DynInstanceType,
    config: DynBaseConfig,
    parent: DynFormTreeNode<AbstractControl>,
    recursively = false
  ): T {
    // fail-safe validation
    if (!parent.control) {
      throw new Error(`The parent ControlContainer doesn't have a control`);
    }

    // return any existing control with this name
    // TODO check if we have a parent FormArray with node.instance
    // assumes a parent FormGroup
    let control = config.name ? parent.control.get(config.name) : null;
    if (control) {
      return control as T;
    }

    control = this.build(instance as any, config, recursively);
    if (!control) {
      throw new Error(`Could not build a control for ${instance}`);
    }

    if (config.name) {
      this.append(parent, config.name, control);
    }

    return control as T;
  }

  /**
   * Build the corresponding form control instance for a given config.
   */
  build(
    instance: DynInstanceType.Container | DynInstanceType.Group,
    config: DynBaseConfig,
    recursively?: boolean
  ): FormGroup;
  build(
    instance: DynInstanceType.Array,
    config: DynBaseConfig,
    recursively?: boolean
  ): FormArray;
  build(
    instance: DynInstanceType.Control,
    config: DynBaseConfig,
    recursively?: boolean
  ): FormControl;
  build<T extends AbstractControl>(
    instance: DynInstanceType,
    config: DynBaseConfig,
    recursively = false
  ): T {
    switch (instance) {
      case DynInstanceType.Container:
      case DynInstanceType.Group: {
        const control = new FormGroup({}, this.validators.dynOptions(config.options));
        if (recursively) {
          this.buildControls(control, config);
        }
        return (control as unknown) as T;
      }
      case DynInstanceType.Array: {
        return (new FormArray([], this.validators.dynOptions(config.options)) as unknown) as T;
      }
      case DynInstanceType.Control: {
        return (
          new FormControl(
            config.options?.defaults ?? null,
            this.validators.dynOptions(config.options)
          ) as unknown
        ) as T;
      }
    }
  }

  /**
   * Recursively build the child controls and attach them to a given parent.
   */
  buildControls(
    parent: FormGroup,
    config: DynBaseConfig,
  ): void {
    config.controls?.forEach((item) => {
      if (item.name) {
        parent.addControl(
          item.name,
          this.build(this.registry.getInstanceFor(item.control) as any, item, true)
        );
      } else {
        this.buildControls(parent, item);
      }
    });
  }

  /**
   * Append a control to a given parent in the specified name.
   */
  append(parent: DynFormTreeNode<AbstractControl>, name: string, control: AbstractControl): void {
    // only FormGroup can be extended
    if (parent.control instanceof FormGroup) {
      parent.control.addControl(name, control);
    } else if (parent.control instanceof FormArray) {
      parent.control.push(control);
    }
  }
}
