import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import {
  DynConfig,
  DynFormControl,
  DynMode,
  DynPartialControlConfig,
} from '@myndpm/dyn-forms/core';
import { DynMatCheckboxParams } from './checkbox.component.params';

@Component({
  selector: 'dyn-mat-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynMatCheckboxComponent
extends DynFormControl<DynMode, DynMatCheckboxParams> {

  static dynControl: 'CHECKBOX' = 'CHECKBOX';

  static createConfig<M extends DynMode>(
    partial: DynPartialControlConfig<M, DynMatCheckboxParams>
  ): DynConfig<M> {
    return {
      ...partial,
      control: DynMatCheckboxComponent.dynControl,
    };
  }

  @HostBinding('class.readonly')
  get isReadonly(): boolean {
    return Boolean(this.params.readonly);
  }

  completeParams(params: Partial<DynMatCheckboxParams>): DynMatCheckboxParams {
    return {
      ...params,
      label: params.label || '-missing label-',
      labelPosition: params.labelPosition || 'after',
    };
  }
}
