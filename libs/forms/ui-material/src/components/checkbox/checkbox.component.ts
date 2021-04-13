import { ChangeDetectionStrategy, Component, HostBinding, OnInit } from '@angular/core';
import {
  DynConfig,
  DynControlMode,
  DynFormControl,
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
extends DynFormControl<DynControlMode, DynMatCheckboxParams>
implements OnInit {

  static dynControl: 'CHECKBOX' = 'CHECKBOX';

  static createConfig<M extends DynControlMode>(
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

  ngOnInit(): void {
    super.ngOnInit();
  }

  completeParams(params: Partial<DynMatCheckboxParams>): DynMatCheckboxParams {
    return {
      ...params,
      label: params.label || '-missing label-',
      labelPosition: params.labelPosition || 'after',
    };
  }
}
