import { Component, ChangeDetectionStrategy, HostBinding } from '@angular/core';
import { DynConfig, DynFormContainer, DynPartialControlConfig } from '@myndpm/dyn-forms/core';
import { DynDividerParams } from './divider.component.params';

@Component({
  selector: 'dyn-mat-divider',
  templateUrl: './divider.component.html',
  styleUrls: ['./divider.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynDividerComponent extends DynFormContainer<DynDividerParams> {
  static dynControl: 'DIVIDER' = 'DIVIDER';

  static createConfig(
    partial: DynPartialControlConfig<DynDividerParams>
  ): DynConfig {
    return {
      ...partial,
      control: DynDividerComponent.dynControl,
    };
  }

  @HostBinding('class.is-invisible')
  get isInvisible(): boolean {
    return Boolean(this.params.invisible);
  }

  completeParams(params: Partial<DynDividerParams>): DynDividerParams {
    return params;
  }
}
