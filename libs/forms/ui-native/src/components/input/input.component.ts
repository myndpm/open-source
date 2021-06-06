import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  DynConfig,
  DynControlMode,
  DynFormControl,
  DynPartialControlConfig,
} from '@myndpm/dyn-forms/core';
import { DynNatInputParams } from './input.component.params';

@Component({
  selector: 'dyn-nat-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynNatInputComponent
extends DynFormControl<DynControlMode, DynNatInputParams> {

  static dynControl: 'INPUT' = 'INPUT';

  static createConfig<M extends DynControlMode>(
    partial: DynPartialControlConfig<M, DynNatInputParams>
  ): DynConfig<M> {
    return {
      ...partial,
      control: DynNatInputComponent.dynControl,
    };
  }

  completeParams(params: Partial<DynNatInputParams>): DynNatInputParams {
    return {
      ...params,
      type: params.type || 'text',
    };
  }
}
