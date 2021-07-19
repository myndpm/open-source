import { ChangeDetectionStrategy, Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynBaseConfig, DynControlNode, DynFormTreeNode } from '@myndpm/dyn-forms/core';
import { DynLogger } from '@myndpm/dyn-forms/logger';
import { filter, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'dyn-group',
  templateUrl: './group.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DynFormTreeNode],
})
/**
 * This component just wraps the incoming controls in a FormGroup.
 */
export class DynGroupComponent extends DynControlNode<any, FormGroup> implements OnInit {
  @Input() isolated = false;
  @Input() group!: FormGroup;
  @Input() name?: string;
  @Input() controls?: DynBaseConfig[];

  @Output() ready = new EventEmitter<void>();

  constructor(
    injector: Injector,
    private readonly logger: DynLogger,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.node.markAsDirty();
    this.node.setControl(this.group);
    this.node.load({ name: this.name, isolated: Boolean(this.isolated) });

    // log the successful initialization
    this.logger.nodeLoaded('dyn-group', this.node.path);

    this.node.ready$.pipe(
      takeUntil(this.onDestroy$),
      filter(Boolean),
    ).subscribe(() => this.ready.emit());
  }
}
