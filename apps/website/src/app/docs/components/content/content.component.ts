import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { DocsLocalized, DocsMetadata } from '../../interfaces';
import { ContentService, I18nService } from '../../services';

@Component({
  selector: 'app-docs-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.styl'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContentComponent {
  @Input() metadata: DocsMetadata;

  source = new Subject<string>();

  loadExamples = false;

  get lang(): string {
    return this.route.snapshot.queryParams.lang || this.i18n.lang;
  }

  constructor(
    private route: ActivatedRoute,
    private content: ContentService,
    private i18n: I18nService,
  ) {}

  ngOnChanges(): void {
    if (this.metadata?.content) {
      // render the markdown content
      const path = this.getLocalizedPath(this.metadata?.content);
      this.content.getFile(`/static/${path}`).subscribe(markdown => {
        this.source.next(markdown);
      });
    }
  }

  onTabChange({ tab }: MatTabChangeEvent): void {
    if (tab.textLabel === 'Examples') { // FIXME update i18n
      this.loadExamples = true;
    }
  }

  private getLocalizedPath(paths: DocsLocalized): string {
    if (this.lang !== 'en' && paths[this.lang]) {
      return paths[this.lang];
    }
    if (!paths['en']) {
      throw new Error('Default english path not found')
    }
    return paths['en'];
  }
}
