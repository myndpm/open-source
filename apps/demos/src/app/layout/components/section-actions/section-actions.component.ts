import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { SectionAction } from './section-action.interface';

@Component({
  selector: 'section-actions',
  templateUrl: './section-actions.component.html',
  styleUrls: ['./section-actions.component.styl'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SectionActionsComponent {
  @Input() actions: SectionAction[] = [];
}
