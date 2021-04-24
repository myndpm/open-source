import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DocsMetadata } from '../../interfaces';
import { I18nService } from '../../services';

@Component({
  selector: 'app-docs-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.styl'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewerComponent {
  @Input() metadata: DocsMetadata;

  get lang(): string {
    return this.i18n.lang;
  }

  constructor(
    private i18n: I18nService,
  ) {}
}
