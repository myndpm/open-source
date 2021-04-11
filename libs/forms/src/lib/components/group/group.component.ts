import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynBaseConfig, DynFormNode, DynLogger } from '@myndpm/dyn-forms/core';

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

  constructor(
    private logger: DynLogger,
    private node: DynFormNode,
  ) {}

  ngOnInit(): void {
    this.node.load({ name: this.name }, this.group);

    // log the successful initialization
    this.logger.nodeLoaded('dyn-group', this.node.path);
  }
}
