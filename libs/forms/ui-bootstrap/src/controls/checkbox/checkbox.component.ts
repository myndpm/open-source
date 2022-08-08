import { Component, ChangeDetectionStrategy } from '@angular/core';
import {
  DynBaseConfig,
  DynMode,
  DynFormControl,
  DynPartialControlConfig,
} from '@myndpm/dyn-forms/core';
import { DynBsCheckboxParams } from './checkbox.component.params';

@Component({
  selector: 'dyn-bs-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynBsCheckboxComponent
extends DynFormControl<DynMode, DynBsCheckboxParams> {

  static dynControl: 'CHECKBOX' = 'CHECKBOX';

  static createConfig<M extends DynMode>(
    partial: DynPartialControlConfig<M, DynBsCheckboxParams>,
  ): DynBaseConfig<M> {
    return {
      ...partial,
      control: DynBsCheckboxComponent.dynControl,
    };
  }

  completeParams(params: Partial<DynBsCheckboxParams>): DynBsCheckboxParams {
    return {
      ...params,
      label: params.label || '',
    };
  }
}
