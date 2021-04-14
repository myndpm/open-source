import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-layout-wrapper',
  templateUrl: './wrapper.component.html',
  styleUrls: ['./wrapper.component.styl'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutWrapperComponent {}
