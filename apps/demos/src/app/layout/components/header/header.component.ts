import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-layout-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.styl'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  menu = [
    {
      title: 'Dynamic Forms',
      link: '/demos/dyn-forms',
    },
  ];
}
