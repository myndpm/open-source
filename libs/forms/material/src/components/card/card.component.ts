import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import {
  DynConfig,
  DynControlMode,
  DynFormContainer,
  DynFormNode,
  DynPartialControlConfig,
} from '@myndpm/dyn-forms/core';
import { DynGroupComponent } from '@myndpm/dyn-forms';
import { DynMatCardParams } from './card.component.params';

@Component({
  selector: 'dyn-mat-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DynFormNode],
})
export class DynMatCardComponent
  extends DynFormContainer<DynControlMode, DynMatCardParams, DynConfig>
  implements OnInit {
  static dynControl: 'CARD' = 'CARD';

  static createConfig<M extends DynControlMode>(
    partial: DynPartialControlConfig<M, DynMatCardParams>
  ): DynConfig<M, DynMatCardParams> {
    return {
      ...partial,
      control: DynMatCardComponent.dynControl,
    };
  }

  @ViewChild(DynGroupComponent, { static: true })
  dynGroup!: DynGroupComponent;

  ngOnInit(): void {
    super.ngOnInit();
  }

  completeParams(params: Partial<DynMatCardParams>): DynMatCardParams {
    return params;
  }

  callHook(hook: string, payload: any, plainPayload = false): void {
    this.dynGroup.callHook(hook, payload, plainPayload);
  }
}
