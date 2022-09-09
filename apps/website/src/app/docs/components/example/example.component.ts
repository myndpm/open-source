import { Clipboard } from '@angular/cdk/clipboard';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostBinding,
  Injector,
  Input,
  NgModuleFactory,
  Type,
  ɵNgModuleFactory,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { EXAMPLE_COMPONENTS, LiveExample } from '@myndpm/demos';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { ContentService, I18nService } from '../../services';

export type Views = 'full' | 'demo';
export type LiveExampleTabs = { [tabName: string]: string };

@Component({
  selector: 'app-docs-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExampleComponent {
  /** String key of the currently displayed example. */
  @HostBinding('attr.id')
  @Input()
  get example() {
    return this._example;
  }
  set example(exampleName: string | undefined) {
    if (exampleName && exampleName !== this._example && EXAMPLE_COMPONENTS[exampleName]) {
      this._example = exampleName;
      this.exampleData = EXAMPLE_COMPONENTS[exampleName];
      this.fetchSources();
      this.loadComponent().catch((error) => console.error(`Could not load example '${exampleName}': ${error}`));
    } else {
      console.error(`Could not find example: ${exampleName}`);
    }
  }
  private _example: string|undefined;

  /** Data for the currently selected example. */
  exampleData: LiveExample|null = null;

  /** The tab to jump to when expanding from snippet view. */
  selectedTab: number = 0;

  view: Views = 'demo';

  tabNames: string[] = [];
  exampleTabs: LiveExampleTabs = {};

  _exampleComponentType: Type<any>|null = null;

  /** Module factory that declares the example component. */
  _exampleModuleFactory: NgModuleFactory<any>|null = null;

  get lang(): string {
    return this.route.snapshot.queryParams.lang || this.i18n.lang;
  }

  constructor(
    public readonly injector: Injector,
    private readonly cdr: ChangeDetectorRef,
    private readonly snackbar: MatSnackBar,
    private readonly clipboard: Clipboard,
    private readonly route: ActivatedRoute,
    private readonly content: ContentService,
    private readonly i18n: I18nService,
  ) {}

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

  private fetchSources(): void {
    forkJoin(
      this.exampleData.files.reduce(
        (result, fileName) => {
          this.tabNames.push(fileName);

          // TODO fetch html files already compiled
          result[fileName] = this.content.getFile(`/static/${this.exampleData.filesPath}/${fileName}`).pipe(
            map(content => this.content.handleExtension(fileName, content))
          );
          return result;
        },
        {},
      )
    ).subscribe(result => {
      this.exampleTabs = result;
      this.cdr.markForCheck();
    });
  }

  private async loadComponent(): Promise<void> {
    const { componentName, module } = this.exampleData;
    const moduleExports: any = await import(
      /* webpackExclude: /\.map$/ */
    '@myndpm/demos/fesm2015/' + module.importSpecifier);

    this._exampleComponentType = moduleExports[componentName];
    this._exampleModuleFactory = new ɵNgModuleFactory(moduleExports[module.name]);
    this.cdr.markForCheck();
  }
}
