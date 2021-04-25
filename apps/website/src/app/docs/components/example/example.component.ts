import { Clipboard } from '@angular/cdk/clipboard';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { DocsExample } from '../../interfaces';
import { ContentService, I18nService } from '../../services';

export type Views = 'full' | 'demo';

@Component({
  selector: 'app-docs-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.styl'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExampleComponent implements OnInit {
  @Input() example!: DocsExample;

  view: Views = 'full';

  tabNames: string[] = [];
  exampleTabs: { [tabName: string]: string } = {};

  get lang(): string {
    return this.route.snapshot.queryParams.lang || this.i18n.lang;
  }

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly snackbar: MatSnackBar,
    private readonly clipboard: Clipboard,
    private readonly route: ActivatedRoute,
    private readonly content: ContentService,
    private readonly i18n: I18nService,
  ) {}

  ngOnInit(): void {
    forkJoin(
      this.example.files.reduce(
        (result, filePath) => {
          const fileName = filePath.split('/').pop();
          this.tabNames.push(fileName);

          result[fileName] = this.content.getFile(`/static/${filePath}`).pipe(
            map(content => this.content.handleExtension(fileName, content))
          );
          return result;
        },
        {},
      )
    ).subscribe(result => {
      this.exampleTabs = result;
      this.cdr.markForCheck();
    })
  }

  toggleSourceView(): void {
    this.view === 'full' ? this.view = 'demo' : this.view = 'full';
  }

  copyLink(): void {
    // Reconstruct the URL using `origin + pathname` so we drop any pre-existing hash.
    const fullUrl = location.origin + location.pathname; // TODO + '#' + this.example.id;

    if (this.clipboard.copy(fullUrl)) {
      this.snackbar.open('Link copied', '', {duration: 2500});
    } else {
      this.snackbar.open('Link copy failed. Please try again!', '', {duration: 2500});
    }
  }

  copySource(source: string): void {
    if (this.clipboard.copy(source)) {
      this.snackbar.open('Code copied', '', {duration: 2500});
    } else {
      this.snackbar.open('Copy failed. Please try again!', '', {duration: 2500});
    }
  }
}
