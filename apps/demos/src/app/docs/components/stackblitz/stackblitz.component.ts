import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-docs-stackblitz',
  templateUrl: './stackblitz.component.html',
  styleUrls: ['./stackblitz.component.styl'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StackblitzComponent {}
