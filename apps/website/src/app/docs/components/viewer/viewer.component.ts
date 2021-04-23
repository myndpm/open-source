import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, Inject, Optional } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RESPONSE } from '@nguniversal/express-engine/tokens';
import { Response } from 'express';
import { DocsMetadata } from '../../interfaces';

@Component({
  selector: 'app-docs-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.styl'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewerComponent {
  metadata: DocsMetadata;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    @Optional() @Inject(RESPONSE) private response: Response,
  ) {}

  ngOnInit(): void {
    this.http.get('/static/index.json').subscribe((routes) => {
      // search the requested URL in the index
      const url = this.route.snapshot.url.map(({ path }) => path).join('/');

      this.metadata = routes[url];

      // defaults to the docs/home
      if (!this.metadata) {
        if (this.response) {
          this.response.statusCode = 404;
          this.response.statusMessage = 'Page Not Found';
        }
        this.router.navigateByUrl('/404');
      }
    })
  }
}
