import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, ElementRef, Inject, OnInit, Optional, QueryList, ViewChildren } from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import { ActivatedRoute, Router } from '@angular/router';
import { DynTree } from '@myndpm/dyn-forms/core';
import { RESPONSE } from '@nguniversal/express-engine/tokens';
import { Response } from 'express';
import { BehaviorSubject } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';
import { DocsIndex, DocsMetadata, NavigationData, NavItem } from '../../interfaces';
import { I18nService } from '../../services';

@Component({
  selector: 'app-docs-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.styl'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutComponent implements OnInit {
  metadata: DocsMetadata;
  currentUrl = '';

  nav = new BehaviorSubject<NavigationData[]>([]);

  @ViewChildren(MatExpansionPanel, { read: ElementRef }) elements: QueryList<ElementRef>;
  @ViewChildren(MatExpansionPanel) panels: QueryList<MatExpansionPanel>;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private i18n: I18nService,
    @Optional() @Inject(RESPONSE) private response: Response,
  ) {}

  ngOnInit(): void {
    this.loadIndex();
  }

  private loadIndex(): void {
    this.http.get('/static/docs.json').subscribe((routes: DocsIndex) => {
      this.initNav(routes);

      // open the panel corresponding to the currentUrl
      this.panels.changes.subscribe((panels: QueryList<MatExpansionPanel>) => {
        panels.map((panel, i) => {
          const el = this.elements.get(i);
          const attr = el.nativeElement.getAttribute('route');
          if (`/${this.currentUrl}`.includes(attr)) {
            panel.open();
          }
        });
      });

      // wait until the nav is loaded to load the page
      this.nav.pipe(
        filter(nav => Boolean(nav.length)),
        switchMap(() => this.route.url),
      ).subscribe((segments) => {
        // search the requested URL in the index
        this.currentUrl = segments.map(({ path }) => path).join('/');

        this.metadata = routes[`/${this.currentUrl}`];

        if (!this.metadata) {
          if (this.response) {
            this.response.statusCode = 404;
            this.response.statusMessage = 'Page Not Found';
          }
          this.router.navigateByUrl('/404');
        } else if (this.metadata?.redirectTo) {
          this.router.navigateByUrl(this.metadata.redirectTo);
        }
      });
    });
  }

  private initNav(routes: DocsIndex): void {
    // converts DocsIndex into NavigationData[]
    const index = new Map<string, DynTree<NavItem>>();

    Object.keys(routes).forEach((route) => {
      // build the nav item
      const child: DynTree<NavItem> = {
        link: route,
        text: routes[route].title[this.i18n.lang],
        children: [],
      };
      index.set(route, child);
      // search for a parent
      const parentRoute = route.split('/').slice(0, -1).join('/');
      if (index.has(parentRoute)) {
        index.get(parentRoute).children.push(child);
      }
    });

    const nav: NavigationData[] = [];
    index.forEach((item, route) => {
      // only "/docs/*" routes
      if (route.split('/').length === 4) {
        nav.push(item);
      }
    });

    this.nav.next(nav);
  }
}
