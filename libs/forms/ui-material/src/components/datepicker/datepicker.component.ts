import { ChangeDetectionStrategy, Component, HostBinding, OnInit } from '@angular/core';
import {
  DynConfig,
  DynControlMode,
  DynFormControl,
  DynPartialControlConfig,
} from '@myndpm/dyn-forms/core';
import { DynMatDatepickerParams } from './datepicker.component.params';

@Component({
  selector: 'dyn-mat-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynMatDatepickerComponent
extends DynFormControl<DynControlMode, DynMatDatepickerParams>
implements OnInit {

  static dynControl: 'DATEPICKER' = 'DATEPICKER';

  static createConfig<M extends DynControlMode>(
    partial: DynPartialControlConfig<M, DynMatDatepickerParams>
  ): DynConfig<M> {
    return {
      ...partial,
      control: DynMatDatepickerComponent.dynControl,
    };
  }

  @HostBinding('class.readonly')
  get isReadonly(): boolean {
    return Boolean(this.params.readonly);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  completeParams(params: Partial<DynMatDatepickerParams>): DynMatDatepickerParams {
    return {
      ...params,
      floatLabel: params.floatLabel || 'auto',
      placeholder: params.placeholder || '',
    };
  }
}
