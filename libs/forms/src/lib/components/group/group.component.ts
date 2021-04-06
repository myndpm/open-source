import {
  ChangeDetectionStrategy,
  Component,
  Input,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynBaseConfig } from '@myndpm/dyn-forms/core';
import { DynFactoryComponent } from '../factory/factory.component';

@Component({
  selector: 'dyn-group',
  templateUrl: './group.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
/**
 * This component just wraps the incoming controls in a FormGroup.
 */
export class DynGroupComponent {
  @Input() group!: FormGroup;
  @Input() controls?: DynBaseConfig[];

  @ViewChildren(DynFactoryComponent) factories!: QueryList<DynFactoryComponent>;

  callHook(hook: string, payload: any, plainPayload = false): void {
    this.factories.forEach(factory => {
      const fieldName = factory.config.name;
      factory.callHook(
        hook,
        !plainPayload && fieldName && payload.hasOwnProperty(fieldName)
          ? payload[fieldName]
          : payload,
        plainPayload,
      );
    });
  }
}
