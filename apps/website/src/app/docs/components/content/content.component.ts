import { ChangeDetectionStrategy, Component, DoCheck, Input, OnChanges, ViewChild } from '@angular/core';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { DocsLocalized, DocsMetadata } from '../../interfaces';
import { ContentService, I18nService } from '../../services';

@Component({
  selector: 'app-docs-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.styl'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContentComponent implements DoCheck, OnChanges {
  @Input() metadata: DocsMetadata;

  @ViewChild(MatTabGroup) tabs: MatTabGroup;

  source = new Subject<string>();

  loadExamples = false;

  get lang(): string {
    return this.route.snapshot.queryParams.lang || this.i18n.lang;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private content: ContentService,
    private i18n: I18nService,
  ) {}

  ngDoCheck(): void {
    if (this.tabs) {
      const active = this.route.snapshot.queryParamMap.get('active');
      if (active) {
        const tab = this.tabs._allTabs.find(
          tab => tab.textLabel.toLowerCase() === active
        );
        if (tab.position) {
          this.tabs.selectedIndex = tab.position;
        }
      }
    }
  }

  ngOnChanges(): void {
    if (this.metadata?.content) {
      // render the markdown content
      const path = this.getLocalizedPath(this.metadata?.content);
      this.content.getFile(`/static/${path}`).subscribe(markdown => {
        this.source.next(markdown);
      });
    }
  }

  onTabChange({ index, tab }: MatTabChangeEvent): void {
    // update the URL
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: index !== 0
          ? { active: tab.textLabel.toLowerCase() } // FIXME update i18n
          : {},
      });

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
