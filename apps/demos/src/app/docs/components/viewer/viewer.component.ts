import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  ) {}

  ngOnInit(): void {
    this.http.get('/docs/index.json').subscribe((routes) => {
      // search the requested URL in the index
      const paths = this.route.snapshot.url.map(({ path }) => path);

      let url = paths.join('/');
      do {
        this.metadata = routes[url];
        paths.pop();
        url = paths.join('/');
      } while (!this.metadata && paths.length)

      // defaults to the docs/home
      if (!this.metadata) {
        this.router.navigateByUrl('/docs/home');
      }
    })
  }
}
