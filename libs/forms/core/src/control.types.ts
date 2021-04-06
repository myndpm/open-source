import { AbstractControl, ControlContainer, FormGroup } from '@angular/forms';

export type DynControlType = string; // Control ID

// Form Control Type
export enum DynInstanceType {
  Group = 'GROUP',
  Array = 'ARRAY',
  Control = 'CONTROL',
  Container = 'CONTAINER',
}

// typed ControlContainer
export interface DynControlParent<T extends AbstractControl = FormGroup>
extends ControlContainer {
  control: T;
}
