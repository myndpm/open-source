import { Injectable } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { DynBaseConfig } from './types/config.types';
import { DynControlId } from './types/control.types';
import { DynInstanceType } from './types/forms.types';
import { DynTreeNode } from './types/node.types';
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
    node: DynFormTreeNode,
    config: DynBaseConfig,
    recursively?: boolean
  ): FormGroup;
  register<FormArray>(
    instance: DynInstanceType.Array,
    node: DynFormTreeNode,
    config: DynBaseConfig,
    recursively?: boolean
  ): FormArray;
  register<FormControl>(
    instance: DynInstanceType.Control,
    node: DynFormTreeNode,
    config: DynBaseConfig,
    recursively?: boolean
  ): FormControl;
  register<T extends AbstractControl>(
    instance: DynInstanceType,
    node: DynFormTreeNode<any, AbstractControl>,
    config: DynBaseConfig,
    recursively = false
  ): T {
    // fail-safe validation
    if (!node.parent.control) {
      throw new Error(`The parent ControlContainer doesn't have a control`);
    }

    // return any existing control with this name
    if (config.name) {
      let control : AbstractControl|null;

      if (node.parent.instance === DynInstanceType.Array) {
        // check if we have a parent FormArray with node.instance
        control = (node.parent.control as unknown as FormArray).at(parseInt(config.name));
      } else {
        // assumes a parent FormGroup
        control = node.parent.control.get(config.name);
      }
      if (control) {
        return control as T;
      }
    }

    // looks for an existing deep parent
    let controlParent = node.parent.control as AbstractControl;
    let controlName = config.name;

    if (this.isDeepName(controlName)) {
      const parentNames = controlName.split('.');
      parentNames.some(parentName => {
        const control = controlParent.get(parentName);
        if (!control) {
          return true;
        }
        controlParent = control;
        parentNames.shift();
        return false;
      });
      controlName = parentNames.join('.');
    }

    // build the control with the given config
    const { name, parentControl, control } = this.build(instance as any, node, config, recursively, controlName);

    if (!control) {
      throw new Error(`Could not build a control for ${instance}`);
    }

    if (name) {
      this.append(controlParent, name, parentControl);
    }

    return control as unknown as T;
  }

  /**
   * Build the corresponding form control instance for a given config.
   */
  build(
    instance: DynInstanceType.Container | DynInstanceType.Group,
    node: DynTreeNode,
    config: DynBaseConfig,
    recursively?: boolean,
    controlName?: string,
  ): { name?: string, parentControl: AbstractControl, control: FormGroup };
  build(
    instance: DynInstanceType.Array,
    node: DynTreeNode,
    config: DynBaseConfig,
    recursively?: boolean,
    controlName?: string,
  ): { name?: string, parentControl: AbstractControl, control: FormArray };
  build(
    instance: DynInstanceType.Control,
    node: DynTreeNode,
    config: DynBaseConfig,
    recursively?: boolean,
    controlName?: string,
  ): { name?: string, parentControl: AbstractControl, control: FormControl };
  build<T extends AbstractControl>(
    instance: DynInstanceType,
    node: DynTreeNode,
    config: DynBaseConfig,
    recursively = false,
    controlName = config.name,
  ): { name?: string, parentControl: AbstractControl, control: T } {

    // creates the specific control
    let name = controlName;
    let control: AbstractControl;

    switch (instance) {
      case DynInstanceType.Container:
      case DynInstanceType.Group: {
        const group = new FormGroup({}, this.handlers.getControlOptions(node, config));
        if (recursively) {
          this.buildControls(group, node, config);
        }
        control = group;
        break;
      }
      case DynInstanceType.Array: {
        control = new FormArray([], this.handlers.getControlOptions(node, config));
        break;
      }
      case DynInstanceType.Control: {
        control = new FormControl(
          config?.default ?? null,
          this.handlers.getControlOptions(node, config)
        );
        break;
      }
    }

    // builds a hierarchy if the name is deep
    let parentControl = control;
    if (this.isDeepName(controlName)) {
      const names = controlName.split('.').reverse();
      name = names.pop();
      names.forEach(parentName => {
        parentControl = new FormGroup({
          [parentName]: parentControl,
        });
      })
    }

    return { name, parentControl, control: control as T };
  }

  /**
   * Recursively build the child controls and attach them to a given parent.
   */
  buildControls(
    parent: FormGroup,
    node: DynTreeNode,
    config: DynBaseConfig,
  ): void {
    config.controls?.forEach((item) => {
      if (item.name) {
        const { name, parentControl, control } = this.build(this.getInstanceFor(item.control) as any, node, item, true);
        parent.addControl(name!, parentControl !== parent ? parentControl : control);
      } else {
        this.buildControls(parent, node, item);
      }
    });
  }

  /**
   * Append a control to a given parent in the specified name.
   */
  append(parent: AbstractControl, name: string, control: AbstractControl): void {
    // only FormGroup can be extended
    if (parent instanceof FormGroup) {
      parent.addControl(name, control);
    } else if (parent instanceof FormArray) {
      parent.push(control);
    }
  }

  /**
   * getInstanceFor facade for DynControl
   */
  getInstanceFor(control: DynControlId): DynInstanceType {
    return this.registry.getInstanceFor(control);
  }

  private isDeepName(name?: string): name is string {
    return Boolean(name && name.split('.').length > 1);
  }
}
