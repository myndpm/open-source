import { Component, ChangeDetectionStrategy } from '@angular/core';
import {
  DynBaseConfig,
  DynControlMode,
  DynFormControl,
  DynPartialControlConfig,
} from '@myndpm/dyn-forms/core';
import { DynBsInputParams } from './input.component.params';

@Component({
  selector: 'dyn-bs-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynBsInputComponent
extends DynFormControl<DynControlMode, DynBsInputParams> {

  static dynControl: 'INPUT' = 'INPUT';

  static createConfig<M extends DynControlMode>(
    partial: DynPartialControlConfig<M, DynBsInputParams>,
  ): DynBaseConfig<M> {
    return {
      ...partial,
      control: DynBsInputComponent.dynControl,
    };
  }

  completeParams(params: Partial<DynBsInputParams>): DynBsInputParams {
    return {
      ...params,
    };
  }
}
