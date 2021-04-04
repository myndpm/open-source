import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  DynConfig,
  DynFormControl,
  DynPartialControlConfig,
} from '@myndpm/dyn-forms/core';
import { DynRadioParams } from './radio.component.params';

@Component({
  selector: 'dyn-mat-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynRadioComponent
  extends DynFormControl<DynRadioParams>
  implements OnInit {
  static dynControl: 'RADIO' = 'RADIO';

  static createConfig(
    partial: DynPartialControlConfig<DynRadioParams>
  ): DynConfig {
    return {
      ...partial,
      control: DynRadioComponent.dynControl,
    };
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  completeParams(params: Partial<DynRadioParams>): DynRadioParams {
    return {
      ...params,
      options: params.options || [],
    };
  }
}
