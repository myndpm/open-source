import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
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
extends DynFormControl<DynControlMode, DynNatInputParams>
implements OnInit {

  static dynControl: 'INPUT' = 'INPUT';

  static createConfig<M extends DynControlMode>(
    partial: DynPartialControlConfig<M, DynNatInputParams>
  ): DynConfig<M> {
    return {
      ...partial,
      control: DynNatInputComponent.dynControl,
    };
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  completeParams(params: Partial<DynNatInputParams>): DynNatInputParams {
    return {
      ...params,
      type: params.type || 'text',
    };
  }
}
