import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  DynBaseConfig,
  DynFormContainer,
  DynMode,
  DynParams,
  DynPartialControlConfig,
} from '@myndpm/dyn-forms/core';

@Component({
  selector: 'app-form-single-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SingleSuccessComponent
extends DynFormContainer<DynMode, DynParams> {

  static dynControl: 'SUCCESS' = 'SUCCESS';

  static createConfig<M extends DynMode>(
    partial?: DynPartialControlConfig<M, DynParams>
  ): DynBaseConfig<M, DynParams> {
    return {
      ...partial,
      control: SingleSuccessComponent.dynControl,
      // reset unsupported options
      wrappers: [],
      controls: [],
    };
  }
}
