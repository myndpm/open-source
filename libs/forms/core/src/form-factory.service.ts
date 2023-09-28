import { Injectable } from '@angular/core';
import {
  AbstractControl,
  UntypedFormArray,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import { DynBaseConfig } from './types/config.types';
import { DynControlId } from './types/control.types';
import { DynInstanceType } from './types/forms.types';
import { DynNode } from './types/node.types';
import { DynControlNode } from './form-control-node.service';
import { DynFormHandlers } from './form-handlers.service';
import { DynFormRegistry } from './form-registry.service';

@Injectable()
// injected in the DynControls to build their AbstractControls
export class DynFormFactory {
  constructor(
    private handlers: DynFormHandlers,
    private registry: DynFormRegistry,
  ) {}

  /**
   * Fetch a control from
   */
  get(parent: AbstractControl, path: string): AbstractControl | null {
    if (parent instanceof UntypedFormArray) {
      // check if we have a parent FormArray with node.instance
      return parent.at(parseInt(path));
    } else {
      // assumes a parent FormGroup
      return parent.get(path);
    }
  }

  /**
   * Adds a control (via config) to the given parent.
   */
  register<FormGroup>(
    instance: DynInstanceType.Container | DynInstanceType.Group,
    node: DynControlNode,
    config: DynBaseConfig,
    recursively?: boolean
  ): FormGroup;
  register<FormArray>(
    instance: DynInstanceType.Array,
    node: DynControlNode,
    config: DynBaseConfig,
    recursively?: boolean
  ): FormArray;
  register<FormControl>(
    instance: DynInstanceType.Control,
    node: DynControlNode,
    config: DynBaseConfig,
    recursively?: boolean
  ): FormControl;
  register<T extends AbstractControl>(
    instance: DynInstanceType,
    node: DynControlNode<any, AbstractControl>,
    config: DynBaseConfig,
    recursively = false
  ): T {
    // fail-safe validation
    if (!node.parent.control) {
      throw new Error(`The parent ControlContainer doesn't have a control`);
    }

    // looks for an existing deep parent
    let controlParent = node.parent.control as AbstractControl;
    let controlName = config.name;

    if (this.isDeepName(controlName)) {
      const parentNames = controlName.split('.');
      parentNames.some(parentName => {
        const control = this.get(controlParent, parentName);
        if (!control) {
          return true;
        }
        controlParent = control;
        parentNames.shift();
        return false;
      });
      if (!parentNames.length) {
        return controlParent as T;
      }
      controlName = parentNames.join('.');
    }

    // return any existing control with this name
    if (controlName) {
      const control = this.get(controlParent, controlName);
      if (control) {
        return control as T;
      }
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
    node: DynNode,
    config: DynBaseConfig,
    recursively?: boolean,
    controlName?: string,
  ): { name?: string, parentControl: AbstractControl, control: UntypedFormGroup };
  build(
    instance: DynInstanceType.Array,
    node: DynNode,
    config: DynBaseConfig,
    recursively?: boolean,
    controlName?: string,
  ): { name?: string, parentControl: AbstractControl, control: UntypedFormArray };
  build(
    instance: DynInstanceType.Control,
    node: DynNode,
    config: DynBaseConfig,
    recursively?: boolean,
    controlName?: string,
  ): { name?: string, parentControl: AbstractControl, control: UntypedFormControl };
  build<T extends AbstractControl>(
    instance: DynInstanceType,
    node: DynNode,
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
        const group = new UntypedFormGroup({}, this.handlers.getControlOptions(node, config));
        if (recursively) {
          this.buildControls(group, node, config);
        }
        control = group;
        break;
      }
      case DynInstanceType.Array: {
        control = new UntypedFormArray([], this.handlers.getControlOptions(node, config));
        break;
      }
      case DynInstanceType.Control: {
        control = new UntypedFormControl(
          config?.default ?? null,
          this.handlers.getControlOptions(node, config)
        );
        break;
      }
      default: {
        throw new Error('DynFormFactory.build received an invalid instance.')
      }
    }

    // builds a hierarchy if the name is deep
    let parentControl = control;
    if (this.isDeepName(controlName)) {
      const names = controlName.split('.').reverse();
      name = names.pop();
      names.forEach(parentName => {
        parentControl = new UntypedFormGroup({
          [parentName]: parentControl,
        });
      })
    }

    return { name, parentControl, control: control as T };
  }

  /**
   * Recursively build the children controls and attach them to a given parent.
   */
  buildControls(
    parent: UntypedFormGroup,
    node: DynNode,
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
    if (parent instanceof UntypedFormGroup) {
      parent.addControl(name, control);
    } else if (parent instanceof UntypedFormArray) {
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
