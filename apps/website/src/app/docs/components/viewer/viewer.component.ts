import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnChanges,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContentService, I18nService } from '../../services';

@Component({
  selector: 'app-docs-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewerComponent implements OnChanges {
  @Input() source: string;

  @ViewChild('content', { read: ElementRef, static: true }) container: ElementRef;

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
    if (this.source) {
      // render the markdown content
      this.render(this.source);
    }
  }

  private render(markdown: string, decodeHtml = false): void {
    let compiled = this.content.compile(markdown, decodeHtml);
    this.container.nativeElement.innerHTML = compiled;
    this.content.highlight(this.container.nativeElement);
  }
}
