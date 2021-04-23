import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.styl'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotFoundComponent {}
