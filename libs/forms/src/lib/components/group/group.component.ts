import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynBaseConfig } from '@myndpm/dyn-forms/core';

@Component({
  selector: 'dyn-group',
  templateUrl: './group.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
/**
 * This component just wraps the incoming controls in a FormGroup.
 */
export class GroupComponent {
  @Input() group!: FormGroup;
  @Input() controls?: DynBaseConfig[];
}
