import { Component, ChangeDetectionStrategy } from '@angular/core';
import {
  DynBaseConfig,
  DynControlMode,
  DynFormControl,
  DynPartialControlConfig,
} from '@myndpm/dyn-forms/core';
import { DynBsSelectParams } from './select.component.params';

@Component({
  selector: 'dyn-bs-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynBsSelectComponent
extends DynFormControl<DynControlMode, DynBsSelectParams> {

  static dynControl: 'SELECT' = 'SELECT';

  static createConfig<M extends DynControlMode>(
    partial: DynPartialControlConfig<M, DynBsSelectParams>,
  ): DynBaseConfig<M> {
    return {
      ...partial,
      control: DynBsSelectComponent.dynControl,
    };
  }

  completeParams(params: Partial<DynBsSelectParams>): DynBsSelectParams {
    return {
      ...params,
    };
  }
}
