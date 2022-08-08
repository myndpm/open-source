import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  DynConfig,
  DynFormControl,
  DynMode,
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
extends DynFormControl<DynMode, DynNatInputParams> {

  static dynControl: 'INPUT' = 'INPUT';

  static createConfig<M extends DynMode>(
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
