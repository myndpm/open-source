import {
  ChangeDetectionStrategy,
  Component,
  Input,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynBaseConfig, DynFormNode, DynLogger } from '@myndpm/dyn-forms/core';
import { DynFactoryComponent } from '../factory/factory.component';

@Component({
  selector: 'dyn-group',
  templateUrl: './group.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DynFormNode],
})
/**
 * This component just wraps the incoming controls in a FormGroup.
 */
export class DynGroupComponent {
  @Input() name?: string;
  @Input() group!: FormGroup;
  @Input() controls?: DynBaseConfig[];

  @ViewChildren(DynFactoryComponent) factories!: QueryList<DynFactoryComponent>;

  constructor(
    private logger: DynLogger,
    private node: DynFormNode,
  ) {}

  ngOnInit(): void {
    this.node.init({ name: this.name });

    // log the successful initialization
    this.logger.nodeInit('dyn-group', this.node.path);
  }

  callHook(hook: string, payload: any, plainPayload = false): void {
    this.factories.forEach(factory => {
      const fieldName = factory.config.name;
      factory.callHook(
        hook,
        !plainPayload && fieldName && payload?.hasOwnProperty(fieldName)
          ? payload[fieldName]
          : payload,
        plainPayload,
      );
    });
  }
}
