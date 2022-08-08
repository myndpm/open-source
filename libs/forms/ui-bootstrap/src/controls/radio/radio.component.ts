import { Component, ChangeDetectionStrategy } from '@angular/core';
import {
  DynBaseConfig,
  DynFormControl,
  DynMode,
  DynPartialControlConfig,
} from '@myndpm/dyn-forms/core';
import { DynBsRadioParams } from './radio.component.params';

@Component({
  selector: 'dyn-bs-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynBsRadioComponent
extends DynFormControl<DynMode, DynBsRadioParams> {

  static dynControl: 'RADIO' = 'RADIO';

  static createConfig<M extends DynMode>(
    partial: DynPartialControlConfig<M, DynBsRadioParams>,
  ): DynBaseConfig<M> {
    return {
      ...partial,
      control: DynBsRadioComponent.dynControl,
    };
  }

  completeParams(params: Partial<DynBsRadioParams>): DynBsRadioParams {
    return {
      ...params,
      options: params.options || [],
    };
  }
}
