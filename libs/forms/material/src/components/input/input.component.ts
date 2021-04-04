import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  DynConfig,
  DynFormControl,
  DynPartialControlConfig,
} from '@myndpm/dyn-forms/core';
import { DynInputParams } from './input.component.params';

@Component({
  selector: 'dyn-mat-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynInputComponent
  extends DynFormControl<DynInputParams>
  implements OnInit {
  static dynControl: 'INPUT' = 'INPUT';

  static createConfig(
    partial: DynPartialControlConfig<DynInputParams>
  ): DynConfig {
    return {
      ...partial,
      control: DynInputComponent.dynControl,
    };
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  completeParams(params: Partial<DynInputParams>): DynInputParams {
    return {
      ...params,
      type: params.type || 'text',
      placeholder: params.placeholder || '',
    };
  }
}
