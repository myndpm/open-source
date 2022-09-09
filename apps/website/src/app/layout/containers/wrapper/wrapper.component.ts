import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-layout-wrapper',
  templateUrl: './wrapper.component.html',
  styleUrls: ['./wrapper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutWrapperComponent {}
