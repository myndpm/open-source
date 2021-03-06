import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  DynConfig,
  DynControlMode,
  DynFormControl,
  DynPartialControlConfig,
} from '@myndpm/dyn-forms/core';
import { DynMatRadioParams } from './radio.component.params';

@Component({
  selector: 'dyn-mat-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynMatRadioComponent
extends DynFormControl<DynControlMode, DynMatRadioParams> {

  static dynControl: 'RADIO' = 'RADIO';

  static createConfig<M extends DynControlMode>(
    partial: DynPartialControlConfig<M, DynMatRadioParams>
  ): DynConfig<M> {
    return {
      ...partial,
      control: DynMatRadioComponent.dynControl,
    };
  }

  completeParams(params: Partial<DynMatRadioParams>): DynMatRadioParams {
    return {
      ...params,
      options: params.options || [],
    };
  }
}
