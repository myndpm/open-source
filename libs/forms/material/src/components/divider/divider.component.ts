import { Component, ChangeDetectionStrategy, HostBinding } from '@angular/core';
import { DynConfig, DynControlContext, DynFormContainer, DynPartialControlConfig } from '@myndpm/dyn-forms/core';
import { DynMatDividerParams } from './divider.component.params';

@Component({
  selector: 'dyn-mat-divider',
  templateUrl: './divider.component.html',
  styleUrls: ['./divider.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynMatDividerComponent
  extends DynFormContainer<DynControlContext, DynMatDividerParams> {
  static dynControl: 'DIVIDER' = 'DIVIDER';

  static createConfig<C extends DynControlContext>(
    partial: DynPartialControlConfig<C, DynMatDividerParams>
  ): DynConfig<C> {
    return {
      ...partial,
      control: DynMatDividerComponent.dynControl,
    };
  }

  @HostBinding('class.is-invisible')
  get isInvisible(): boolean {
    return Boolean(this.params.invisible);
  }

  completeParams(params: Partial<DynMatDividerParams>): DynMatDividerParams {
    return params;
  }
}
