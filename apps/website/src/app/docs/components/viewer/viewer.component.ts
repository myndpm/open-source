import { ChangeDetectionStrategy, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { DocsLocalized, DocsMetadata } from '../../interfaces';
import { ContentService, I18nService } from '../../services';

@Component({
  selector: 'app-docs-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.styl'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewerComponent {
  @Input() metadata: DocsMetadata;

  @ViewChild('content', { read: ElementRef }) container: ElementRef;

  get lang(): string {
    return this.i18n.lang;
  }

  constructor(
    private content: ContentService,
    private i18n: I18nService,
  ) {}

  ngOnChanges(): void {
    if (this.metadata?.content) {
      // render the markdown content
      const path = this.getLocalizedPath(this.metadata?.content);
      this.content.getFile(`/static/${path}`).subscribe(markdown => {
        this.render(markdown);
      });
    }
  }

  getLocalizedPath(paths: DocsLocalized): string {
    if (this.lang !== 'en' && paths[this.lang]) {
      return paths[this.lang];
    }
    if (!paths['en']) {
      throw new Error('Default english path not found')
    }
    return paths['en'];
  }

  render(markdown: string, decodeHtml = false): void {
    let compiled = this.content.compile(markdown, decodeHtml);
    this.container.nativeElement.innerHTML = compiled;
    this.content.highlight(this.container.nativeElement);
  }
}
