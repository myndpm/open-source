import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  DynConfig,
  DynControlContext,
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
  extends DynFormControl<DynControlContext, DynRadioParams>
  implements OnInit {
  static dynControl: 'RADIO' = 'RADIO';

  static createConfig<C extends DynControlContext>(
    partial: DynPartialControlConfig<C, DynRadioParams>
  ): DynConfig<C> {
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
