import { Component, ChangeDetectionStrategy } from '@angular/core';
import {
  DynBaseConfig,
  DynFormControl,
  DynMode,
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
extends DynFormControl<DynMode, DynBsSelectParams> {

  static dynControl: 'SELECT' = 'SELECT';

  static createConfig<M extends DynMode>(
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
      options: params.options || [],
    };
  }
}
