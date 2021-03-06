import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SectionBadge } from './section-badge.interface';

@Component({
  selector: 'app-section-badges',
  templateUrl: './section-badges.component.html',
  styleUrls: ['./section-badges.component.styl'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SectionBadgesComponent {
  @Input() badges: SectionBadge[] = [];
}
