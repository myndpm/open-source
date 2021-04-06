import { Component, ChangeDetectionStrategy, HostBinding } from '@angular/core';
import { DynConfig, DynControlContext, DynFormContainer, DynPartialControlConfig } from '@myndpm/dyn-forms/core';
import { DynDividerParams } from './divider.component.params';

@Component({
  selector: 'dyn-mat-divider',
  templateUrl: './divider.component.html',
  styleUrls: ['./divider.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynDividerComponent
  extends DynFormContainer<DynControlContext, DynDividerParams> {
  static dynControl: 'DIVIDER' = 'DIVIDER';

  static createConfig<C extends DynControlContext>(
    partial: DynPartialControlConfig<C, DynDividerParams>
  ): DynConfig<C> {
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
