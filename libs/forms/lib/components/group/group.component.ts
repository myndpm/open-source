import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynBaseConfig, DynFormTreeNode } from '@myndpm/dyn-forms/core';
import { DynLogger } from '@myndpm/dyn-forms/logger';

@Component({
  selector: 'dyn-group',
  templateUrl: './group.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DynFormTreeNode],
})
/**
 * This component just wraps the incoming controls in a FormGroup.
 */
export class DynGroupComponent implements OnInit {
  @Input() isolated = false;
  @Input() group!: FormGroup;
  @Input() name?: string;
  @Input() controls?: DynBaseConfig[];

  constructor(
    private readonly logger: DynLogger,
    private readonly node: DynFormTreeNode,
  ) {}

  ngOnInit(): void {
    this.node.setControl(this.group);
    this.node.load({ name: this.name, isolated: Boolean(this.isolated) });

    // log the successful initialization
    this.logger.nodeLoaded('dyn-group', this.node.path);
  }
}
