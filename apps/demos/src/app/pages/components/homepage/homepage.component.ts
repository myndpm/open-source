import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.styl'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomepageComponent {}
