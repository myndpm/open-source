import { Injectable } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { DynBaseConfig } from './config.types';
import { DynInstanceType } from './control.types';
import { DynFormHandlers } from './form-handlers.service';
import { DynFormRegistry } from './form-registry.service';
import { DynFormTreeNode } from './form-tree-node.service';

@Injectable()
// injected in the DynControls to build their AbstractControls
export class DynFormFactory {
  constructor(
    private handlers: DynFormHandlers,
    private registry: DynFormRegistry,
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
    parent: DynFormTreeNode<any, AbstractControl>,
    recursively = false
  ): T {
    // fail-safe validation
    if (!parent.control) {
      throw new Error(`The parent ControlContainer doesn't have a control`);
    }

    // return any existing control with this name
    if (config.name) {
      let control : AbstractControl|null;

      if (parent.instance === DynInstanceType.Array) {
        // check if we have a parent FormArray with node.instance
        control = (parent.control as FormArray).at(parseInt(config.name));
      } else {
        // assumes a parent FormGroup
        control = parent.control.get(config.name);
      }
      if (control) {
        return control as T;
      }
    }

    // build the control with the given config
    const { name, control } = this.build(instance as any, config, recursively);

    if (!control) {
      throw new Error(`Could not build a control for ${instance}`);
    }

    if (name) {
      this.append(parent, name, control);
    }

    return control as unknown as T;
  }

  /**
   * Build the corresponding form control instance for a given config.
   */
  build(
    instance: DynInstanceType.Container | DynInstanceType.Group,
    config: DynBaseConfig,
    recursively?: boolean
  ): { name?: string, control: FormGroup };
  build(
    instance: DynInstanceType.Array,
    config: DynBaseConfig,
    recursively?: boolean
  ): { name?: string, control: FormArray };
  build(
    instance: DynInstanceType.Control,
    config: DynBaseConfig,
    recursively?: boolean
  ): { name?: string, control: FormControl };
  build<T extends AbstractControl>(
    instance: DynInstanceType,
    config: DynBaseConfig,
    recursively = false
  ): { name?: string, control: T } {

    // creates the specific control
    let name = config.name;
    let control: AbstractControl;

    switch (instance) {
      case DynInstanceType.Container:
      case DynInstanceType.Group: {
        const group = new FormGroup({}, this.handlers.getControlOptions(config.options));
        if (recursively) {
          this.buildControls(group, config);
        }
        control = group;
        break;
      }
      case DynInstanceType.Array: {
        control = new FormArray([], this.handlers.getControlOptions(config.options));
        break;
      }
      case DynInstanceType.Control: {
        control = new FormControl(
          config.options?.default ?? null,
          this.handlers.getControlOptions(config.options)
        );
        break;
      }
    }

    // builds a hierarchy if the name has deep
    if (config.name && config.name.split('.').length > 1) {
      const names = config.name.split('.').reverse();
      name = names.pop();
      names.forEach(parentName => {
        control = new FormGroup({
          [parentName]: control,
        });
      })
    }

    return { name, control: control as T };
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
        const { name, control } = this.build(this.registry.getInstanceFor(item.control) as any, item, true)
        parent.addControl(name!, control);
      } else {
        this.buildControls(parent, item);
      }
    });
  }

  /**
   * Append a control to a given parent in the specified name.
   */
  append(parent: DynFormTreeNode<any, AbstractControl>, name: string, control: AbstractControl): void {
    // only FormGroup can be extended
    if (parent.control instanceof FormGroup) {
      parent.control.addControl(name, control);
    } else if (parent.control instanceof FormArray) {
      parent.control.push(control);
    }
  }
}
