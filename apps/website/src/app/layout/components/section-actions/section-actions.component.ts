import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SectionAction } from './section-action.interface';

@Component({
  selector: 'app-section-actions',
  templateUrl: './section-actions.component.html',
  styleUrls: ['./section-actions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SectionActionsComponent {
  @Input() actions: SectionAction[] = [];
}
