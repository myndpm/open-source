import { ChangeDetectionStrategy, Component, Inject, Optional } from '@angular/core';
import { RESPONSE } from '@nguniversal/express-engine/tokens';
import { Response } from 'express';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.styl'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotFoundComponent {
  constructor(
    @Optional() @Inject(RESPONSE) private response: Response,
  ) {}

  ngOnInit() {
    if (this.response) {
      this.response.statusCode = 404;
      this.response.statusMessage = 'Page Not Found';
    }
  }
}
